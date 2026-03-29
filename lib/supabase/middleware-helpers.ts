import type { SupabaseClient } from "@supabase/supabase-js";
import { hasCompletedProfile } from "@/lib/profile-completion";

export async function fetchProfileIsComplete(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, monthly_income, risk_tolerance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return false;
  return hasCompletedProfile(data);
}
