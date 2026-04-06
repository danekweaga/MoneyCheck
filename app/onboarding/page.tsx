import { redirect } from "next/navigation";
import { OnboardingDesktopView } from "@/components/views/onboarding/onboarding-desktop-view";
import { OnboardingMobileView } from "@/components/views/onboarding/onboarding-mobile-view";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (isProfileComplete(profile)) redirect("/dashboard");

  return isMobile ? <OnboardingMobileView /> : <OnboardingDesktopView />;
}
