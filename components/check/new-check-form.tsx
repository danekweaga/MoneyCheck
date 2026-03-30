"use client";

import { useEffect, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { createMoneyCheck } from "@/lib/actions/money-check";
import type { MoneyCheckType } from "@/lib/types";
import { moneyCheckFormSchema, type MoneyCheckFormInput } from "@/lib/validations/money-check";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const typeLabels: Record<MoneyCheckType, string> = {
  purchase: "Purchase",
  bill: "Bill",
  loan: "Loan",
  credit_card: "Credit Card",
  subscription: "Subscription",
};

type NewCheckFormProps = {
  variant?: "mobile" | "desktop";
};

function microLabel(text: string) {
  return <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{text}</span>;
}

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
  const monthsVal = form.watch("months_to_payoff");

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

  const maxW = variant === "desktop" ? "max-w-3xl" : "max-w-lg";

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_rgba(11,28,48,0.06)] ${maxW}`}>
      <div className="absolute left-0 top-0 h-1 w-full editorial-gradient" />
      <div className="p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    {microLabel("Check Title")}
                    <FormControl>
                      <Input
                        placeholder="e.g., New MacBook Pro"
                        className="rounded-lg border-none bg-surface-container-low p-4 font-medium text-on-surface placeholder:text-outline-variant focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
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
                    {microLabel("Type")}
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-auto rounded-lg border-none bg-surface-container-low p-4 font-medium focus:ring-2 focus:ring-primary/40">
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
                    {microLabel("Category")}
                    <FormControl>
                      <Input
                        placeholder="Tech, Travel, Housing…"
                        className="rounded-lg border-none bg-surface-container-low p-4 font-medium focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {checkType === "purchase" ? (
              <FormField
                control={form.control}
                name="pay_in_full_cash"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-xl bg-surface-container-low px-4 py-3">
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

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-surface-container-low p-6 md:grid-cols-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    {microLabel("Amount ($)")}
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min={0}
                        placeholder="0.00"
                        className="rounded-lg border-none bg-surface-container-lowest p-3 text-lg font-bold focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!(checkType === "purchase" && payInFullCash) ? (
                <FormField
                  control={form.control}
                  name="interest_rate"
                  render={({ field }) => (
                    <FormItem>
                      {microLabel("Interest (%)")}
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min={0}
                          placeholder="0"
                          className="rounded-lg border-none bg-surface-container-lowest p-3 font-medium focus-visible:ring-2 focus-visible:ring-primary/40"
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
                  <FormItem className={checkType === "purchase" && payInFullCash ? "col-span-2" : undefined}>
                    {microLabel("Inflation (%)")}
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min={0}
                        placeholder="2.5"
                        className="rounded-lg border-none bg-surface-container-lowest p-3 font-medium focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!(checkType === "purchase" && payInFullCash) ? (
                <FormField
                  control={form.control}
                  name="months_to_payoff"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      {microLabel("Payoff Period (Months)")}
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={1}
                            max={120}
                            step={1}
                            value={Number(field.value) || 1}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-2 flex-grow cursor-pointer appearance-none rounded-full bg-surface-container-highest accent-primary"
                          />
                          <span className="w-12 text-center text-sm font-bold text-primary">{monthsVal}m</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}

            <div className="flex flex-col items-center justify-between gap-4 pt-6 md:flex-row">
              <Link
                href="/history"
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to History
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="editorial-gradient w-full rounded-xl px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-60 md:w-auto"
              >
                {isPending ? "Analyzing..." : "Check Impact"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
