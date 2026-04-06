import { redirect } from "next/navigation";
import { SignupDesktopView } from "@/components/views/auth/signup-desktop-view";
import { SignupMobileView } from "@/components/views/auth/signup-mobile-view";
import { isProfileComplete, getProfileForUser } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (user && !userError) {
    const profile = await getProfileForUser(user.id);
    redirect(isProfileComplete(profile) ? "/dashboard" : "/onboarding");
  }

  return isMobile ? <SignupMobileView /> : <SignupDesktopView />;
}
