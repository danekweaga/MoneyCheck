"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export type ProfileActionErrors = Partial<Record<keyof ProfileInput, string[]>> & { _form?: string[] };
export type ProfileActionResult = { error: ProfileActionErrors } | undefined;

export async function saveOnboardingProfile(input: ProfileInput): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors as ProfileActionErrors };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
}
