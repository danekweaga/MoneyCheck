import type { RiskLevel } from "@/lib/types";

function toTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

export function getRiskLevel(budgetImpactPercent: number): RiskLevel {
  if (budgetImpactPercent < 3) return "low";
  if (budgetImpactPercent <= 10) return "medium";
  return "high";
}

export function getRegretScore(amount: number, monthlyIncome: number, riskLevel: RiskLevel): number {
  const amountRatio = monthlyIncome > 0 ? amount / monthlyIncome : 1;
  const ratioPoints = Math.min(60, Math.round(amountRatio * 100));
  const riskPoints = riskLevel === "low" ? 10 : riskLevel === "medium" ? 25 : 40;
  return Math.min(100, ratioPoints + riskPoints);
}

export function getRecommendation(riskLevel: RiskLevel): string {
  if (riskLevel === "low") return "Looks manageable. Proceed if it fits your monthly plan.";
  if (riskLevel === "medium") return "Consider delaying or reducing this cost to protect savings.";
  return "High impact. Pause and revisit this decision with a smaller budget.";
}

function effectiveGrowthRate(interestRatePercent: number, inflationRatePercent: number): number {
  return Math.max(0, (interestRatePercent + inflationRatePercent) / 100);
}

export function calculateMoneyCheck(
  amount: number,
  monthlyIncome: number,
  monthsToPayoff: number,
  interestRate: number,
  inflationRate: number,
) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const safeIncome = Number.isFinite(monthlyIncome) && monthlyIncome > 0 ? monthlyIncome : 0;
  const safeMonths = Number.isFinite(monthsToPayoff) && monthsToPayoff > 0 ? monthsToPayoff : 1;
  const safeInterest = Number.isFinite(interestRate) ? interestRate : 0;
  const safeInflation = Number.isFinite(inflationRate) ? inflationRate : 0;

  const budgetImpactPercent = safeIncome > 0 ? (safeAmount / safeIncome) * 100 : 0;
  const years = safeMonths / 12;
  const annualRate = effectiveGrowthRate(safeInterest, safeInflation);
  const futureValueLost = safeAmount * Math.pow(1 + annualRate, years);
  const riskLevel = getRiskLevel(budgetImpactPercent);
  const regretScore = getRegretScore(safeAmount, safeIncome || 1, riskLevel);

  return {
    budget_impact_percent: toTwoDecimals(budgetImpactPercent),
    future_value_lost: toTwoDecimals(futureValueLost),
    risk_level: riskLevel,
    regret_score: regretScore,
    recommendation: getRecommendation(riskLevel),
  };
}
