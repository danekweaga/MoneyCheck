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
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

type SignupFormProps = {
  variant?: "mobile" | "desktop";
};

export function SignupForm({ variant = "mobile" }: SignupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const supabase = createClient();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", acceptTerms: false },
  });

  function onSubmit(values: SignupInput) {
    setRootError(null);
    setNotice(null);
    startTransition(async () => {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setRootError(error.message);
        return;
      }

      if (!data.session) {
        setNotice("Account created. Verify your email, then sign in.");
        return;
      }

      router.push("/onboarding");
      router.refresh();
    });
  }

  const headingAlign = variant === "desktop" ? "text-center lg:text-left" : "text-center";

  return (
    <div className="w-full max-w-md space-y-8">
      <div className={`mb-10 space-y-2 ${headingAlign}`}>
        <h2 className="font-headline text-3xl font-bold text-on-surface">Create an account</h2>
        <p className="font-medium text-on-surface-variant">Get started with your editorial wealth experience.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant" htmlFor="signup-email">
                  <span className="material-symbols-outlined text-base">mail</span>
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="h-12 rounded-lg border-none bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline/60 transition-all duration-300 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
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
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant" htmlFor="signup-password">
                  <span className="material-symbols-outlined text-base">lock</span>
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="h-12 rounded-lg border-none bg-surface-container-low px-4 py-3 pr-12 text-on-surface placeholder:text-outline/60 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </div>
                </FormControl>
                <p className="px-1 text-[10px] text-outline">Must be at least 8 characters with a mix of letters and numbers.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant" htmlFor="signup-confirm">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="h-12 rounded-lg border-none bg-surface-container-low px-4 py-3 pr-12 text-on-surface placeholder:text-outline/60 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 py-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel htmlFor="terms" className="!mt-0 cursor-pointer text-xs leading-relaxed text-on-surface-variant">
                    By clicking Sign Up, you agree to our{" "}
                    <a href="#" className="font-bold text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-bold text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {notice ? <p className="text-sm font-medium text-primary">{notice}</p> : null}
          {rootError ? <p className="text-sm font-medium text-destructive">{rootError}</p> : null}

          <button
            type="submit"
            disabled={isPending}
            className="btn-gradient w-full rounded-lg py-4 text-base font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-[1.01] disabled:opacity-60"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </Form>

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="flex w-full items-center gap-4">
          <div className="h-px flex-grow bg-outline-variant/30" />
          <span className="text-xs font-semibold uppercase tracking-widest text-outline">Or continue with</span>
          <div className="h-px flex-grow bg-outline-variant/30" />
        </div>
        <SocialAuthButtons />
        <p className="text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="ml-1 font-bold text-primary transition-all hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
