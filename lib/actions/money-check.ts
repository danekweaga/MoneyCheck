"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateMoneyCheck } from "@/lib/calculations/money-check";
import { getEffectiveSpendableIncome } from "@/lib/effective-income";
import { createClient } from "@/lib/supabase/server";
import {
  moneyCheckFormSchema,
  toPersistedMoneyCheck,
  type MoneyCheckFormInput,
} from "@/lib/validations/money-check";

export type MoneyCheckActionErrors = Partial<Record<keyof MoneyCheckFormInput, string[]>> & { _form?: string[] };
export type MoneyCheckActionResult = { error: MoneyCheckActionErrors } | undefined;

export async function createMoneyCheck(input: MoneyCheckFormInput): Promise<MoneyCheckActionResult> {
  try {
    const parsed = moneyCheckFormSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors as MoneyCheckActionErrors };

    const row = toPersistedMoneyCheck(parsed.data);

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: { _form: ["Could not verify your login session. Please sign in again."] } };
    if (!user) return { error: { _form: ["You must be signed in."] } };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("monthly_income, extra_spendable")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) return { error: { _form: ["Complete onboarding before creating a check."] } };

    const effectiveIncome = getEffectiveSpendableIncome({
      monthly_income: Number(profile.monthly_income),
      extra_spendable: Number((profile as { extra_spendable?: number | null }).extra_spendable ?? 0),
    });

    const calc = calculateMoneyCheck(
      row.amount,
      effectiveIncome,
      row.months_to_payoff,
      row.interest_rate,
      row.inflation_rate,
    );

    const { data: inserted, error } = await supabase
      .from("money_checks")
      .insert({
        user_id: user.id,
        title: row.title,
        type: row.type,
        category: row.category,
        amount: row.amount,
        interest_rate: row.interest_rate,
        inflation_rate: row.inflation_rate,
        months_to_payoff: row.months_to_payoff,
        budget_impact_percent: calc.budget_impact_percent,
        future_value_lost: calc.future_value_lost,
        risk_level: calc.risk_level,
        regret_score: calc.regret_score,
        recommendation: calc.recommendation,
      })
      .select("id")
      .single();

    if (error) return { error: { _form: [error.message] } };

    revalidatePath("/dashboard");
    revalidatePath("/history");
    if (!inserted?.id) {
      redirect("/history");
    }
    redirect(`/check/result?id=${inserted.id}`);
  } catch (error) {
    console.error("Failed to create money check.", error);
    return { error: { _form: ["Could not save this check right now. Please try again."] } };
  }
}
