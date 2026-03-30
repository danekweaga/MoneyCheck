import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingDesktopView } from "@/components/views/onboarding/onboarding-desktop-view";
import { OnboardingMobileView } from "@/components/views/onboarding/onboarding-mobile-view";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Onboarding | MoneyCheck",
};

export default async function OnboardingPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (isProfileComplete(profile)) redirect("/dashboard");

  return isMobile ? <OnboardingMobileView /> : <OnboardingDesktopView />;
}
