import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupDesktopView } from "@/components/views/auth/signup-desktop-view";
import { SignupMobileView } from "@/components/views/auth/signup-mobile-view";
import { isProfileComplete, getProfileForUser } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign Up | MoneyCheck",
};

export default async function SignupPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await getProfileForUser(user.id);
    redirect(isProfileComplete(profile) ? "/dashboard" : "/onboarding");
  }

  return isMobile ? <SignupMobileView /> : <SignupDesktopView />;
}
