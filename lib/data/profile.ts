import { hasCompletedProfile } from "@/lib/profile-completion";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getProfileForUser(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, monthly_income, monthly_expenses, monthly_savings_goal, risk_tolerance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export function isProfileComplete(profile: Profile | null): profile is Profile {
  return hasCompletedProfile(profile);
}
