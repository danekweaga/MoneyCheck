import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  monthly_income: z.coerce.number().positive("Monthly income must be greater than 0."),
  monthly_expenses: z.coerce.number().min(0, "Monthly expenses cannot be negative."),
  monthly_savings_goal: z.coerce.number().min(0, "Monthly savings goal cannot be negative."),
  risk_tolerance: z.enum(["low", "medium", "high"]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
