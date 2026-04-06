"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { saveOnboardingProfile } from "@/lib/actions/profile";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OnboardingFormProps = {
  variant?: "mobile" | "desktop";
};

export function OnboardingForm({ variant = "mobile" }: OnboardingFormProps) {
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

  return (
    <Card
      className={
        variant === "desktop"
          ? "glass-panel architect-shadow w-full max-w-3xl border-outline-variant/30 bg-surface-container-lowest/90"
          : "glass-panel architect-shadow w-full max-w-2xl border-outline-variant/30 bg-surface-container-lowest/90"
      }
    >
      <CardHeader>
        <CardTitle className={variant === "desktop" ? "text-4xl font-extrabold tracking-tight text-primary" : "text-3xl font-extrabold tracking-tight text-primary"}>
          Let&apos;s build your financial architecture.
        </CardTitle>
        <CardDescription className="text-on-surface-variant">
          {variant === "desktop"
            ? "We use your monthly income to calibrate your dashboard insights."
            : "We use this to personalize your budget impact checks."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="rounded-xl bg-surface-container-low p-3 text-xs text-on-surface-variant">
              <p className="font-semibold uppercase tracking-wider text-on-primary-container">Profile Setup</p>
              <p className="mt-1">Step 1 of 2: share your monthly baseline to personalize every check.</p>
            </div>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Johnson" className="h-12 rounded-xl border-none bg-surface-container-highest" {...field} />
                  </FormControl>
                  <p className="text-xs text-on-surface-variant">Use your preferred first and last name.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">Monthly finances</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="monthly_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Monthly income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="2500"
                        className="h-12 rounded-xl border-none bg-surface-container-highest"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-on-surface-variant">After-tax income. Include recurring allowance/paycheck.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Monthly expenses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="1400"
                        className="h-12 rounded-xl border-none bg-surface-container-highest"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-on-surface-variant">Rent, transport, food, subscriptions, and bills.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">Goals and risk</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="monthly_savings_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Monthly savings goal
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="500"
                        className="h-12 rounded-xl border-none bg-surface-container-highest"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-on-surface-variant">How much you want to set aside each month.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="risk_tolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Risk tolerance</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-xl border-none bg-surface-container-highest">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-on-surface-variant">Low = safer choices, High = more flexible trade-offs.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
            <Button
              type="submit"
              className="architect-gradient w-full rounded-xl py-6 text-base font-bold text-white"
              disabled={isPending}
            >
              {isPending ? "Saving profile..." : "Continue to Dashboard"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
