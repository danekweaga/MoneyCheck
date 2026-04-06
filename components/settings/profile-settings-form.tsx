"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { updateProfileFromSettings } from "@/lib/actions/profile";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  profile: Profile;
  variant?: "mobile" | "desktop";
};

export function ProfileSettingsForm({ profile, variant = "mobile" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileInput>,
    defaultValues: {
      full_name: profile.full_name,
      monthly_income: profile.monthly_income,
      monthly_expenses: profile.monthly_expenses,
      monthly_savings_goal: profile.monthly_savings_goal,
      risk_tolerance: profile.risk_tolerance,
    },
  });

  function onSubmit(values: ProfileInput) {
    setRootError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await updateProfileFromSettings(values);
        if (result?.error) {
          const msg =
            result.error._form?.[0] ??
            Object.values(result.error)
              .flat()
              .filter(Boolean)
              .join(" ");
          setRootError(msg || "Could not save profile.");
          return;
        }
        setSaved(true);
        router.refresh();
      } catch (error) {
        if (isRedirectError(error)) throw error;
        setRootError("Could not save profile.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Full name
              </FormLabel>
              <FormControl>
                <Input className="h-11 rounded-xl border-none bg-surface-container-highest" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="monthly_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Monthly income
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-xl border-none bg-surface-container-highest"
                    {...field}
                  />
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
                <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Monthly expenses
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    className="h-11 rounded-xl border-none bg-surface-container-highest"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                    className="h-11 rounded-xl border-none bg-surface-container-highest"
                    {...field}
                  />
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
                <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Risk tolerance
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl border-none bg-surface-container-highest">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
        {saved ? <p className="text-sm font-medium text-primary">Saved.</p> : null}
        <Button
          type="submit"
          className={
            variant === "desktop"
              ? "architect-gradient rounded-xl px-6 py-5 text-sm font-bold text-white"
              : "architect-gradient w-full rounded-xl py-5 text-sm font-bold text-white"
          }
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </Form>
  );
}
