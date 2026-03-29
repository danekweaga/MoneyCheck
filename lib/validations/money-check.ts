import { z } from "zod";

export const moneyCheckSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  type: z.enum(["purchase", "bill", "loan", "credit_card", "subscription"]),
  category: z.string().trim().min(2, "Category is required."),
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  interest_rate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  inflation_rate: z.coerce.number().min(0, "Inflation rate cannot be negative."),
  months_to_payoff: z.coerce.number().int().positive("Months must be at least 1."),
});

export type MoneyCheckInput = z.infer<typeof moneyCheckSchema>;
