"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export type ProfileActionErrors = Partial<Record<keyof ProfileInput, string[]>> & { _form?: string[] };
export type ProfileActionResult = { error: ProfileActionErrors } | undefined;

export async function saveOnboardingProfile(input: ProfileInput): Promise<ProfileActionResult> {
  try {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors as ProfileActionErrors };

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: { _form: ["Could not verify your login session. Please sign in again."] } };
    if (!user) return { error: { _form: ["You must be signed in."] } };

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        full_name: parsed.data.full_name,
        monthly_income: parsed.data.monthly_income,
        monthly_expenses: parsed.data.monthly_expenses,
        monthly_savings_goal: parsed.data.monthly_savings_goal,
        risk_tolerance: parsed.data.risk_tolerance,
      },
      { onConflict: "user_id" },
    );

    if (error) return { error: { _form: [error.message] } };

    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    redirect("/dashboard");
  } catch (error) {
    console.error("Failed to save onboarding profile.", error);
    return { error: { _form: ["Could not save your onboarding data. Please try again."] } };
  }
}

export async function updateProfileFromSettings(input: ProfileInput): Promise<ProfileActionResult> {
  try {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors as ProfileActionErrors };

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: { _form: ["Could not verify your login session. Please sign in again."] } };
    if (!user) return { error: { _form: ["You must be signed in."] } };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        monthly_income: parsed.data.monthly_income,
        monthly_expenses: parsed.data.monthly_expenses,
        monthly_savings_goal: parsed.data.monthly_savings_goal,
        risk_tolerance: parsed.data.risk_tolerance,
      })
      .eq("user_id", user.id);

    if (error) return { error: { _form: [error.message] } };

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Failed to update profile from settings.", error);
    return { error: { _form: ["Could not update your profile right now. Please try again."] } };
  }
}

export type ExtraFundsActionResult = { error: { _form?: string[] } } | undefined;

export async function adjustExtraSpendable(delta: number): Promise<ExtraFundsActionResult> {
  try {
    const parsed = z.coerce.number().finite().safeParse(delta);
    if (!parsed.success || parsed.data === 0) {
      return { error: { _form: ["Enter a non-zero amount."] } };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: { _form: ["Could not verify your login session. Please sign in again."] } };
    if (!user) return { error: { _form: ["You must be signed in."] } };

    const { data: row, error: fetchError } = await supabase
      .from("profiles")
      .select("extra_spendable")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) return { error: { _form: [fetchError.message] } };
    if (!row) return { error: { _form: ["Complete onboarding first."] } };

    const currentRaw = Number((row as { extra_spendable?: number | null }).extra_spendable ?? 0);
    const current = Number.isFinite(currentRaw) ? currentRaw : 0;
    const next = current + parsed.data;
    if (next < 0) {
      return {
        error: {
          _form: ["That would make extra cash negative. Enter a smaller reduction or clear extra cash."],
        },
      };
    }

    const { error } = await supabase.from("profiles").update({ extra_spendable: next }).eq("user_id", user.id);

    if (error) return { error: { _form: [error.message] } };

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Failed to adjust extra spendable.", error);
    return { error: { _form: ["Could not update extra cash right now. Please try again."] } };
  }
}

export async function clearExtraSpendable(): Promise<ExtraFundsActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return { error: { _form: ["Could not verify your login session. Please sign in again."] } };
    if (!user) return { error: { _form: ["You must be signed in."] } };

    const { error } = await supabase.from("profiles").update({ extra_spendable: 0 }).eq("user_id", user.id);

    if (error) return { error: { _form: [error.message] } };

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Failed to clear extra spendable.", error);
    return { error: { _form: ["Could not clear extra cash right now. Please try again."] } };
  }
}
