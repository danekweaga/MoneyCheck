"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  const [rootError, setRootError] = useState<string | null>(null);
  const supabase = createClient();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    setNotice(null);
    setRootError(null);
    startTransition(async () => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${origin}/auth/update-password`,
      });
      if (error) {
        setRootError(error.message);
        return;
      }
      setNotice("Check your email for a reset link.");
    });
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold text-on-surface">Reset password</h1>
        <p className="text-sm text-on-surface-variant">We&apos;ll email you a link to choose a new password.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-on-surface-variant">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="h-12 rounded-lg border-none bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary/40"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {notice ? <p className="text-sm font-medium text-primary">{notice}</p> : null}
          {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
          <button
            type="submit"
            disabled={isPending}
            className="btn-gradient w-full rounded-lg py-4 font-bold text-on-primary disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </Form>
      <p className="text-center text-sm text-on-surface-variant">
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
