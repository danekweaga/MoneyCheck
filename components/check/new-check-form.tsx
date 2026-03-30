"use client";

import { useEffect, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { createMoneyCheck } from "@/lib/actions/money-check";
import type { MoneyCheckType } from "@/lib/types";
import { moneyCheckFormSchema, type MoneyCheckFormInput } from "@/lib/validations/money-check";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const typeLabels: Record<MoneyCheckType, string> = {
  purchase: "Purchase",
  bill: "Bill",
  loan: "Loan",
  credit_card: "Credit card",
  subscription: "Subscription",
};

type NewCheckFormProps = {
  variant?: "mobile" | "desktop";
};

export function NewCheckForm({ variant = "mobile" }: NewCheckFormProps) {
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<MoneyCheckFormInput>({
    resolver: zodResolver(moneyCheckFormSchema) as Resolver<MoneyCheckFormInput>,
    defaultValues: {
      title: "",
      type: "purchase",
      category: "",
      amount: 0,
      interest_rate: 8,
      inflation_rate: 2.5,
      months_to_payoff: 12,
      pay_in_full_cash: false,
    },
  });

  const checkType = form.watch("type");
  const payInFullCash = form.watch("pay_in_full_cash");

  useEffect(() => {
    if (checkType !== "purchase") {
      form.setValue("pay_in_full_cash", false);
    }
  }, [checkType, form]);

  function onSubmit(values: MoneyCheckFormInput) {
    setRootError(null);
    startTransition(async () => {
      try {
        const result = await createMoneyCheck(values);
        if (result?.error) {
          const msg =
            result.error._form?.[0] ??
            Object.values(result.error)
              .flat()
              .filter(Boolean)
              .join(" ");
          setRootError(msg || "Something went wrong.");
        }
      } catch (error) {
        if (isRedirectError(error)) throw error;
        setRootError("Something went wrong.");
      }
    });
  }

  return (
    <Card
      className={
        variant === "desktop"
          ? "architect-shadow w-full max-w-4xl border-outline-variant/30 bg-surface-container-lowest"
          : "architect-shadow w-full max-w-lg border-outline-variant/30 bg-surface-container-lowest"
      }
    >
      <CardHeader>
        <CardTitle
          className={
            variant === "desktop" ? "text-4xl font-extrabold tracking-tight text-primary" : "text-2xl font-extrabold tracking-tight text-primary"
          }
        >
          New Money Check
        </CardTitle>
        <CardDescription className="text-on-surface-variant">
          Compare a purchase against your budget and estimate future value lost using compound growth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New laptop" className="h-12 rounded-xl border-none bg-surface-container-highest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full rounded-xl border-none bg-surface-container-highest">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(typeLabels) as MoneyCheckType[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {typeLabels[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Electronics" className="h-12 rounded-xl border-none bg-surface-container-highest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {checkType === "purchase" ? (
              <FormField
                control={form.control}
                name="pay_in_full_cash"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-xl bg-surface-container-highest px-4 py-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="pay_in_full_cash"
                        checked={field.value}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("interest_rate", 0);
                            form.setValue("months_to_payoff", 1);
                          }
                        }}
                        className="h-4 w-4 shrink-0 rounded border border-outline-variant accent-primary"
                      />
                    </FormControl>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <FormLabel htmlFor="pay_in_full_cash" className="cursor-pointer text-sm font-semibold text-on-surface">
                        Paid in full with cash
                      </FormLabel>
                      <p className="text-xs text-on-surface-variant">No financing. Interest is treated as 0% and payoff is immediate.</p>
                    </div>
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="1200"
                      className="h-12 rounded-xl border-none bg-surface-container-highest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {!(checkType === "purchase" && payInFullCash) ? (
                <FormField
                  control={form.control}
                  name="interest_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Interest rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min={0}
                          placeholder="8"
                          className="h-12 rounded-xl border-none bg-surface-container-highest"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <FormField
                control={form.control}
                name="inflation_rate"
                render={({ field }) => (
                  <FormItem className={checkType === "purchase" && payInFullCash ? "sm:col-span-2" : undefined}>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Inflation rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min={0}
                        placeholder="2.5"
                        className="h-12 rounded-xl border-none bg-surface-container-highest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!(checkType === "purchase" && payInFullCash) ? (
              <FormField
                control={form.control}
                name="months_to_payoff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Months to payoff</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        placeholder="12"
                        className="h-12 rounded-xl border-none bg-surface-container-highest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
            <Button
              type="submit"
              className={variant === "desktop" ? "architect-gradient w-full rounded-xl py-6 text-base font-bold text-white" : "architect-gradient w-full rounded-xl py-6 text-base font-bold text-white"}
              disabled={isPending}
            >
              {isPending ? "Analyzing..." : "Analyze Impact"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
