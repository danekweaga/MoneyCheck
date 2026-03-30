"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { saveOnboardingProfile } from "@/lib/actions/profile";
import type { RiskTolerance } from "@/lib/types";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type OnboardingFormProps = {
  variant?: "mobile" | "desktop";
};

function riskToStep(r: RiskTolerance): number {
  if (r === "low") return 2;
  if (r === "high") return 5;
  return 3;
}

function stepToRisk(s: number): RiskTolerance {
  if (s <= 2) return "low";
  if (s >= 4) return "high";
  return "medium";
}

function riskLabel(r: RiskTolerance): string {
  if (r === "low") return "Conservative";
  if (r === "high") return "Aggressive";
  return "Moderate";
}

export function OnboardingForm({ variant: _variant = "mobile" }: OnboardingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileInput>,
    defaultValues: {
      full_name: "",
      monthly_income: 0,
      monthly_expenses: 0,
      monthly_savings_goal: 0,
      risk_tolerance: "medium",
    },
  });

  const riskValue = form.watch("risk_tolerance");
  const riskStep = riskToStep(riskValue);

  function onSubmit(values: ProfileInput) {
    setRootError(null);
    startTransition(async () => {
      try {
        const result = await saveOnboardingProfile(values);
        if (result?.error) {
          const msg =
            result.error._form?.[0] ??
            Object.values(result.error)
              .flat()
              .filter(Boolean)
              .join(" ");
          setRootError(msg || "Could not save profile.");
        }
      } catch (error) {
        if (isRedirectError(error)) throw error;
        setRootError("Could not save profile.");
      }
    });
  }

  const cardClass =
    "w-full rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(11,28,48,0.06)] lg:p-12";

  return (
    <div className={cardClass}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 ml-1 block text-sm font-bold text-on-surface-variant" htmlFor="full_name">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="full_name"
                      placeholder="E.g. Julian Thorne"
                      className="rounded-lg border-none bg-surface-container-low px-4 py-4 text-on-surface outline-none transition-all placeholder:text-outline-variant focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="monthly_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 ml-1 flex items-center text-sm font-bold text-on-surface-variant" htmlFor="income">
                      Monthly Income
                      <span
                        className="material-symbols-outlined ml-2 cursor-help text-sm text-outline"
                        title="Used to calculate your personalized risk scores and liquidity ratios."
                      >
                        info
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-on-surface-variant">$</span>
                        <Input
                          id="income"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="rounded-lg border-none bg-surface-container-low py-4 pl-8 pr-4 outline-none focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 ml-1 flex items-center text-sm font-bold text-on-surface-variant" htmlFor="expenses">
                      Monthly Expenses
                      <span
                        className="material-symbols-outlined ml-2 cursor-help text-sm text-outline"
                        title="Allows us to estimate your runway and emergency fund health."
                      >
                        info
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-on-surface-variant">$</span>
                        <Input
                          id="expenses"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className="rounded-lg border-none bg-surface-container-low py-4 pl-8 pr-4 outline-none focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="monthly_savings_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 ml-1 block text-sm font-bold text-on-surface-variant" htmlFor="savings_goal">
                    Monthly Savings Goal
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-on-surface-variant">$</span>
                      <Input
                        id="savings_goal"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="Target per month"
                        className="rounded-lg border-none bg-surface-container-low py-4 pl-8 pr-4 outline-none focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="risk_tolerance"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4 ml-1 flex items-end justify-between">
                    <FormLabel className="flex items-center text-sm font-bold text-on-surface-variant">
                      Risk Tolerance
                      <span
                        className="material-symbols-outlined ml-2 cursor-help text-sm text-outline"
                        title="Influences how our editorial insights prioritize stability vs. growth opportunities."
                      >
                        info
                      </span>
                    </FormLabel>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary">{riskLabel(field.value)}</span>
                  </div>
                  <FormControl>
                    <div className="px-2">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={riskStep}
                        onChange={(e) => field.onChange(stepToRisk(Number(e.target.value)))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-primary"
                      />
                      <div className="mt-3 flex justify-between px-1 text-[10px] font-bold uppercase tracking-tighter text-outline-variant">
                        <span>Conservative</span>
                        <span>Moderate</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="editorial-gradient group flex w-full items-center justify-center gap-3 rounded-lg py-5 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Complete Setup"}
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <p className="mt-4 px-6 text-center text-xs leading-relaxed text-on-surface-variant/60">
              By completing setup, you agree to our terms of intelligence curation. Your data is encrypted and used only for personalized insights.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
