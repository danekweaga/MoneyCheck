export type ProfileCompletionInput = {
  full_name: string | null;
  monthly_income: number | null;
  risk_tolerance: "low" | "medium" | "high" | null;
};

export function hasCompletedProfile(profile: ProfileCompletionInput | null): boolean {
  return Boolean(profile?.full_name?.trim() && (profile.monthly_income ?? 0) > 0 && profile.risk_tolerance);
}
