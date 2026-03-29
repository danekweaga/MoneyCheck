import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getRecentMoneyChecks } from "@/lib/data/money-checks";
import { getProfileForUser } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
});

const DEFAULT_DAILY_CREDITS = 20;
const DEFAULT_MODEL = "gpt-4.1-mini";

function getDailyLimit(): number {
  const parsed = Number(process.env.DAILY_AI_CREDITS ?? DEFAULT_DAILY_CREDITS);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_DAILY_CREDITS;
}

function getUtcDayStartIso(): string {
  const now = new Date();
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return dayStart.toISOString();
}

export async function POST(request: Request) {
  const parsedBody = requestSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const dailyLimit = getDailyLimit();
  const { data: usageRows, error: usageError } = await supabase
    .from("ai_usage_events")
    .select("credits_used")
    .eq("user_id", user.id)
    .eq("feature", "chatbot")
    .gte("created_at", getUtcDayStartIso());

  if (usageError) {
    if ((usageError as { code?: string }).code === "42P01") {
      // If migration has not been applied yet, allow chat but skip credit enforcement.
    } else {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }
  }

  const usedToday = usageError
    ? 0
    : (usageRows ?? []).reduce((sum, row) => sum + (row.credits_used ?? 0), 0);
  if (usedToday >= dailyLimit) {
    return NextResponse.json(
      {
        error: "You have no AI credits left today. Try again tomorrow.",
        remainingCredits: 0,
        usedCredits: usedToday,
        dailyLimit,
      },
      { status: 402 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key is missing on the server." }, { status: 500 });
  }

  const [profile, checks] = await Promise.all([getProfileForUser(user.id), getRecentMoneyChecks(user.id, 5)]);

  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = [
    "You are MoneyCheck's financial coach for students and young adults.",
    "Give practical, short, non-judgmental advice.",
    "Do not provide legal, tax, or medical claims.",
    "Use plain language and explain trade-offs.",
  ].join(" ");

  const context = {
    profile: profile
      ? {
          monthly_income: profile.monthly_income,
          monthly_expenses: profile.monthly_expenses,
          monthly_savings_goal: profile.monthly_savings_goal,
          risk_tolerance: profile.risk_tolerance,
        }
      : null,
    recent_checks: checks.map((c) => ({
      title: c.title,
      amount: c.amount,
      budget_impact_percent: c.budget_impact_percent,
      risk_level: c.risk_level,
      recommendation: c.recommendation,
      created_at: c.created_at,
    })),
  };

  let answer = "I could not generate an answer right now.";
  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Context:\n${JSON.stringify(context)}\n\nUser question:\n${parsedBody.data.message}`,
            },
          ],
        },
      ],
    });

    answer = response.output_text?.trim() || answer;
  } catch {
    return NextResponse.json({ error: "The AI assistant is unavailable right now." }, { status: 503 });
  }

  const { error: insertError } = await supabase.from("ai_usage_events").insert({
    user_id: user.id,
    feature: "chatbot",
    credits_used: 1,
  });

  if (insertError && (insertError as { code?: string }).code !== "42P01") {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    answer,
    remainingCredits: Math.max(dailyLimit - usedToday - 1, 0),
    usedCredits: usedToday + 1,
    dailyLimit,
  });
}
