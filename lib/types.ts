export type RiskTolerance = "low" | "medium" | "high";

export type MoneyCheckType =
  | "purchase"
  | "bill"
  | "loan"
  | "credit_card"
  | "subscription";

export type RiskLevel = "low" | "medium" | "high";

export interface Profile {
  user_id: string;
  full_name: string;
  monthly_income: number;
  monthly_expenses: number;
  monthly_savings_goal: number;
  risk_tolerance: RiskTolerance;
}

export interface MoneyCheck {
  id: string;
  user_id: string;
  title: string;
  type: MoneyCheckType;
  category: string;
  amount: number;
  interest_rate: number;
  inflation_rate: number;
  months_to_payoff: number;
  budget_impact_percent: number;
  future_value_lost: number;
  risk_level: RiskLevel;
  regret_score: number;
  recommendation: string;
  created_at: string;
}
