import { createClient } from "@/lib/supabase/server";

const DEFAULT_DAILY_CREDITS = 20;

function getDailyLimit(): number {
  const parsed = Number(process.env.DAILY_AI_CREDITS ?? DEFAULT_DAILY_CREDITS);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_DAILY_CREDITS;
}

function getUtcDayStartIso(): string {
  const now = new Date();
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return dayStart.toISOString();
}

export type AiCreditsStatus = {
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
};

export async function getAiCreditsStatus(userId: string): Promise<AiCreditsStatus> {
  const supabase = await createClient();
  const dailyLimit = getDailyLimit();

  const { data, error } = await supabase
    .from("ai_usage_events")
    .select("credits_used")
    .eq("user_id", userId)
    .eq("feature", "chatbot")
    .gte("created_at", getUtcDayStartIso());

  if (error) {
    if ((error as { code?: string }).code === "42P01") {
      return {
        dailyLimit,
        usedToday: 0,
        remainingToday: dailyLimit,
      };
    }
    throw new Error(error.message);
  }

  const usedToday = (data ?? []).reduce((sum, row) => sum + (row.credits_used ?? 0), 0);
  const remainingToday = Math.max(dailyLimit - usedToday, 0);

  return {
    dailyLimit,
    usedToday,
    remainingToday,
  };
}
