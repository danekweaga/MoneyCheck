import type { Profile } from "@/lib/types";

export function getEffectiveSpendableIncome(profile: Pick<Profile, "monthly_income" | "extra_spendable">): number {
  const monthlyIncome = Number(profile.monthly_income);
  const extraSpendable = Number(profile.extra_spendable);
  const safeIncome = Number.isFinite(monthlyIncome) ? monthlyIncome : 0;
  const safeExtra = Number.isFinite(extraSpendable) ? extraSpendable : 0;
  return safeIncome + safeExtra;
}
