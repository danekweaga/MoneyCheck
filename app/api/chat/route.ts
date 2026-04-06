import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getRecentMoneyChecks } from "@/lib/data/money-checks";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { getEffectiveSpendableIncome } from "@/lib/effective-income";
import { createClient } from "@/lib/supabase/server";
import type { MoneyCheck } from "@/lib/types";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
});

const DEFAULT_DAILY_CREDITS = 20;
const DEFAULT_MODEL = "gpt-4.1-mini";

function getOpenAiApiKey(): string | undefined {
  const raw = process.env.OPENAI_API_KEY;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed.length > 0 ? trimmed : undefined;
}

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
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsedBody = requestSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: "Could not verify session." }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const profile = await getProfileForUser(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Complete onboarding before using AI chat." }, { status: 403 });
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
      : (usageRows ?? []).reduce((sum, row) => {
          const value = Number(row.credits_used);
          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);
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

    const openAiKey = getOpenAiApiKey();
    if (!openAiKey) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is missing on the server. Use the exact name OPENAI_API_KEY in .env.local (local) or in your host's environment variables (e.g. Vercel), then restart the dev server or redeploy.",
        },
        { status: 500 },
      );
    }

    let checks: MoneyCheck[] = [];
    try {
      checks = await getRecentMoneyChecks(user.id, 5);
    } catch (error) {
      console.error("Failed to fetch recent checks for AI chat.", error);
    }

    const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
    const client = new OpenAI({ apiKey: openAiKey });

    const systemPrompt = [
      "You are MoneyCheck's financial coach for students and young adults.",
      "Give practical, short, non-judgmental advice.",
      "Do not provide legal, tax, or medical claims.",
      "Use plain language and explain trade-offs.",
    ].join(" ");

    const context = {
      profile: {
        monthly_income: profile.monthly_income,
        extra_spendable: profile.extra_spendable,
        effective_spendable_income: getEffectiveSpendableIncome(profile),
        monthly_expenses: profile.monthly_expenses,
        monthly_savings_goal: profile.monthly_savings_goal,
        risk_tolerance: profile.risk_tolerance,
      },
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
  } catch (error) {
    console.error("Unhandled /api/chat error.", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
