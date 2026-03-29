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
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  const credits = await getAiCreditsStatus(user.id);

  return isMobile ? (
    <SettingsMobileView
      profile={profile}
      creditsRemaining={credits.remainingToday}
      creditsUsed={credits.usedToday}
      creditsLimit={credits.dailyLimit}
    />
  ) : (
    <SettingsDesktopView
      profile={profile}
      creditsRemaining={credits.remainingToday}
      creditsUsed={credits.usedToday}
      creditsLimit={credits.dailyLimit}
    />
  );
}
