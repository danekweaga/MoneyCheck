import { z } from "zod";

export const moneyCheckFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  type: z.enum(["purchase", "bill", "loan", "credit_card", "subscription"]),
  category: z.string().trim().min(2, "Category is required."),
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  interest_rate: z.coerce.number().min(0, "Interest rate cannot be negative."),
  inflation_rate: z.coerce.number().min(0, "Inflation rate cannot be negative."),
  months_to_payoff: z.coerce.number().int().positive("Months must be at least 1."),
  pay_in_full_cash: z.boolean().default(false),
});

export type MoneyCheckFormInput = z.infer<typeof moneyCheckFormSchema>;

/** Row fields stored and passed to calculations (no `pay_in_full_cash`). */
export type MoneyCheckPersistedInput = Omit<MoneyCheckFormInput, "pay_in_full_cash">;

export function toPersistedMoneyCheck(data: MoneyCheckFormInput): MoneyCheckPersistedInput {
  const paidCash = data.type === "purchase" && data.pay_in_full_cash;
  const { pay_in_full_cash: _, ...rest } = data;
  if (!paidCash) return rest;
  return { ...rest, interest_rate: 0, months_to_payoff: 1 };
}
