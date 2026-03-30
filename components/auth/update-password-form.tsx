"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/lib/validations/auth";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rootError, setRootError] = useState<string | null>(null);
  const supabase = createClient();

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: UpdatePasswordInput) {
    setRootError(null);
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) {
        setRootError(error.message);
        return;
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-headline text-3xl font-bold text-on-surface">Set new password</h1>
        <p className="text-sm text-on-surface-variant">Enter a new password for your account.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" className="h-12 rounded-lg border-none bg-surface-container-low" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" className="h-12 rounded-lg border-none bg-surface-container-low" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {rootError ? <p className="text-sm text-destructive">{rootError}</p> : null}
          <button type="submit" disabled={isPending} className="btn-gradient w-full rounded-lg py-4 font-bold text-on-primary disabled:opacity-60">
            {isPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </Form>
      <p className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
