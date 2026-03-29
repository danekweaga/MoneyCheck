import { redirect } from "next/navigation";
import { CheckDesktopView } from "@/components/views/check/check-desktop-view";
import { CheckMobileView } from "@/components/views/check/check-mobile-view";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export default async function CheckPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  return isMobile ? <CheckMobileView /> : <CheckDesktopView />;
}
