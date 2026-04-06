import { hasCompletedProfile } from "@/lib/profile-completion";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toProfileRow(data: Record<string, unknown>): Profile {
  return {
    user_id: String(data.user_id ?? ""),
    full_name: String(data.full_name ?? ""),
    monthly_income: toFiniteNumber(data.monthly_income),
    extra_spendable: toFiniteNumber(data.extra_spendable),
    monthly_expenses: toFiniteNumber(data.monthly_expenses),
    monthly_savings_goal: toFiniteNumber(data.monthly_savings_goal),
    risk_tolerance:
      data.risk_tolerance === "low" || data.risk_tolerance === "medium" || data.risk_tolerance === "high"
        ? data.risk_tolerance
        : "medium",
  };
}

export async function getProfileForUser(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const query = supabase
    .from("profiles")
    .select(
      "user_id, full_name, monthly_income, extra_spendable, monthly_expenses, monthly_savings_goal, risk_tolerance",
    )
    .eq("user_id", userId);

  let { data, error } = await query.maybeSingle();
  if (error && (error as { code?: string }).code === "42703") {
    // Backward compatibility if migration has not been run yet.
    const fallback = await supabase
      .from("profiles")
      .select("user_id, full_name, monthly_income, monthly_expenses, monthly_savings_goal, risk_tolerance")
      .eq("user_id", userId)
      .maybeSingle();
    data = fallback.data ? { ...fallback.data, extra_spendable: 0 } : null;
    error = fallback.error;
  }

  if (error) {
    console.error("Failed to fetch profile.", error);
    return null;
  }
  if (!data) return null;

  return toProfileRow(data as Record<string, unknown>);
}

export function isProfileComplete(profile: Profile | null): profile is Profile {
  return hasCompletedProfile(profile);
}
