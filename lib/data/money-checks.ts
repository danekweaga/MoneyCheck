import { createClient } from "@/lib/supabase/server";
import type { MoneyCheck } from "@/lib/types";

const MONEY_CHECK_COLUMNS =
  "id, user_id, title, type, category, amount, interest_rate, inflation_rate, months_to_payoff, budget_impact_percent, future_value_lost, risk_level, regret_score, recommendation, created_at";

function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toMoneyCheckRow(row: Record<string, unknown>): MoneyCheck {
  return {
    id: String(row.id ?? ""),
    user_id: String(row.user_id ?? ""),
    title: String(row.title ?? ""),
    type: (row.type as MoneyCheck["type"]) ?? "purchase",
    category: String(row.category ?? ""),
    amount: toFiniteNumber(row.amount),
    interest_rate: toFiniteNumber(row.interest_rate),
    inflation_rate: toFiniteNumber(row.inflation_rate),
    months_to_payoff: Math.max(1, Math.floor(toFiniteNumber(row.months_to_payoff, 1))),
    budget_impact_percent: toFiniteNumber(row.budget_impact_percent),
    future_value_lost: toFiniteNumber(row.future_value_lost),
    risk_level: (row.risk_level as MoneyCheck["risk_level"]) ?? "medium",
    regret_score: Math.max(0, Math.min(100, Math.round(toFiniteNumber(row.regret_score)))),
    recommendation: String(row.recommendation ?? ""),
    created_at: String(row.created_at ?? new Date(0).toISOString()),
  };
}

export async function getRecentMoneyChecks(userId: string, limit = 5): Promise<MoneyCheck[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select(MONEY_CHECK_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!data) return [];
  return data.map((row) => toMoneyCheckRow(row as Record<string, unknown>));
}

export async function getAllMoneyChecks(userId: string): Promise<MoneyCheck[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select(MONEY_CHECK_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];
  return data.map((row) => toMoneyCheckRow(row as Record<string, unknown>));
}

export async function getMoneyCheckById(userId: string, checkId: string): Promise<MoneyCheck | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select(MONEY_CHECK_COLUMNS)
    .eq("user_id", userId)
    .eq("id", checkId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load money check by ID.", error);
    return null;
  }
  if (!data) return null;
  return toMoneyCheckRow(data as Record<string, unknown>);
}
