import type { SupabaseClient } from "@supabase/supabase-js";
import { hasCompletedProfile } from "@/lib/profile-completion";

export async function fetchProfileIsComplete(supabase: SupabaseClient, userId: string): Promise<boolean> {
  let profile: { full_name: string | null; monthly_income: number | null; risk_tolerance: "low" | "medium" | "high" | null } | null =
    null;

  const query = supabase
    .from("profiles")
    .select("full_name, monthly_income, extra_spendable, risk_tolerance")
    .eq("user_id", userId);

  let { data, error } = await query.maybeSingle();
  if (error && (error as { code?: string }).code === "42703") {
    const fallback = await supabase
      .from("profiles")
      .select("full_name, monthly_income, risk_tolerance")
      .eq("user_id", userId)
      .maybeSingle();
    data = fallback.data ? { ...fallback.data, extra_spendable: 0 } : null;
    error = fallback.error;
  }

  if (error) return false;
  if (data) {
    profile = {
      full_name: data.full_name ?? null,
      monthly_income: data.monthly_income ?? null,
      risk_tolerance: data.risk_tolerance ?? null,
    };
  }
  return hasCompletedProfile(profile);
}
