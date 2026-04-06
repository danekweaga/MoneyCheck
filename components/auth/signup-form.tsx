"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

type SignupFormProps = {
  variant?: "mobile" | "desktop";
};

export function SignupForm({ variant = "mobile" }: SignupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const supabase = createClient();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignupInput) {
    setRootError(null);
    setNotice(null);
    startTransition(async () => {
      const { data, error } = await supabase.auth.signUp(values);
      if (error) {
        setRootError(error.message);
        return;
      }

      if (!data.session) {
        setNotice("Account created. Verify your email, then sign in.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <Card
      className={
        variant === "desktop"
          ? "glass-panel architect-shadow w-full max-w-lg border-outline-variant/30 bg-surface-container-lowest/90"
          : "glass-panel architect-shadow w-full max-w-md border-outline-variant/30 bg-surface-container-lowest/90"
      }
    >
      <CardHeader className={variant === "desktop" ? "space-y-2 px-8 pt-8" : "space-y-2 px-7 pt-7"}>
        <CardTitle className={variant === "desktop" ? "text-3xl font-extrabold tracking-tight text-primary" : "text-2xl font-bold tracking-tight text-primary"}>
          Create account
        </CardTitle>
        <CardDescription className="text-on-surface-variant">
          {variant === "desktop"
            ? "Start your journey toward financial clarity today."
            : "Start making smarter money decisions today."}
        </CardDescription>
      </CardHeader>
      <CardContent className={variant === "desktop" ? "px-8 pb-8" : "px-7 pb-7"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-12 rounded-xl border-none bg-surface-container-highest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Create Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      className="h-12 rounded-xl border-none bg-surface-container-highest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {notice ? <p className="text-sm font-medium text-primary">{notice}</p> : null}
            {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
            <Button
              type="submit"
              className="architect-gradient w-full rounded-xl py-6 text-base font-bold text-white"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
        <p className="mt-5 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
