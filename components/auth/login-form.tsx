"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

type LoginFormProps = {
  variant?: "mobile" | "desktop";
};

export function LoginForm({ variant = "mobile" }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const supabase = createClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    setRootError(null);
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setRootError(error.message);
        return;
      }
      const nextPath = searchParams.get("next");
      const safeNext = nextPath && nextPath.startsWith("/") ? nextPath : "/";
      router.push(safeNext);
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
          Welcome back
        </CardTitle>
        <CardDescription className="text-on-surface-variant">
          {variant === "desktop" ? "Sign in to your account." : "Sign in to continue your MoneyCheck plan."}
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
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-none bg-surface-container-highest"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}
            <Button
              type="submit"
              className={
                variant === "desktop"
                  ? "architect-gradient w-full rounded-xl py-6 text-base font-bold text-white"
                  : "architect-gradient w-full rounded-xl py-6 text-base font-bold text-white"
              }
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        <p className="mt-5 text-center text-sm text-on-surface-variant">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
