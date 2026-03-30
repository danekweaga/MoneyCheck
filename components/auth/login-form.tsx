"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

type LoginFormProps = {
  variant?: "mobile" | "desktop";
};

export function LoginForm({ variant = "mobile" }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  function onSubmit(values: LoginInput) {
    setRootError(null);
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setRootError(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  const headingAlign = variant === "desktop" ? "text-center lg:text-left" : "text-center";

  return (
    <div className="w-full max-w-md space-y-8">
      <div className={`space-y-2 ${headingAlign}`}>
        <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">Welcome back</h2>
        <p className="font-medium text-on-surface-variant">Enter your credentials to access your dashboard</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="ml-1 text-sm font-semibold text-on-surface-variant">Email Address</FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary">
                        mail
                      </span>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        className="h-12 rounded-lg border-none bg-surface-container-low py-3.5 pl-12 pr-4 font-medium text-on-surface placeholder:text-outline/60 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
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
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <FormLabel className="text-sm font-semibold text-on-surface-variant">Password</FormLabel>
                    <Link href="/forgot-password" className="text-xs font-bold text-primary transition-colors hover:text-primary-container">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="group relative">
                      <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-outline transition-colors group-focus-within:text-primary">
                        lock
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-12 rounded-lg border-none bg-surface-container-low py-3.5 pl-12 pr-12 font-medium text-on-surface placeholder:text-outline/60 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 px-1">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary/20"
                    id="remember"
                  />
                </FormControl>
                <FormLabel htmlFor="remember" className="!mt-0 cursor-pointer text-sm font-medium text-on-surface-variant">
                  Keep me signed in for 30 days
                </FormLabel>
              </FormItem>
            )}
          />

          {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}

          <button
            type="submit"
            disabled={isPending}
            className="primary-gradient editorial-shadow w-full transform rounded-lg py-4 text-base font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
      </Form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30" />
        </div>
        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
          <span className="bg-surface px-4 text-outline">Or continue with</span>
        </div>
      </div>

      <SocialAuthButtons />

      <p className="text-center font-medium text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="ml-1 font-bold text-primary underline-offset-4 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
