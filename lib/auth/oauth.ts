"use client";

import { createClient } from "@/lib/supabase/client";

export function getAuthCallbackUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(),
    },
  });
  return error ? { error: error.message } : {};
}

export async function signInWithApple(): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: getAuthCallbackUrl(),
    },
  });
  return error ? { error: error.message } : {};
}
