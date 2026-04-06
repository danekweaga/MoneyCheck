import { redirect } from "next/navigation";
import { SettingsDesktopView } from "@/components/views/settings/settings-desktop-view";
import { SettingsMobileView } from "@/components/views/settings/settings-mobile-view";
import { getAiCreditsStatus } from "@/lib/data/ai-credits";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  let credits = { remainingToday: 0, usedToday: 0, dailyLimit: 20 };
  let hasCreditsError = false;
  try {
    credits = await getAiCreditsStatus(user.id);
  } catch (error) {
    console.error("Failed to load AI credits status.", error);
    hasCreditsError = true;
  }

  return isMobile ? (
    <SettingsMobileView
      profile={profile}
      creditsRemaining={credits.remainingToday}
      creditsUsed={credits.usedToday}
      creditsLimit={credits.dailyLimit}
      hasCreditsError={hasCreditsError}
    />
  ) : (
    <SettingsDesktopView
      profile={profile}
      creditsRemaining={credits.remainingToday}
      creditsUsed={credits.usedToday}
      creditsLimit={credits.dailyLimit}
      hasCreditsError={hasCreditsError}
    />
  );
}
