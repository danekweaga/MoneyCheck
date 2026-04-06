import { redirect } from "next/navigation";
import { LoginDesktopView } from "@/components/views/auth/login-desktop-view";
import { LoginMobileView } from "@/components/views/auth/login-mobile-view";
import { isProfileComplete, getProfileForUser } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
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

  return isMobile ? <LoginMobileView /> : <LoginDesktopView />;
}
