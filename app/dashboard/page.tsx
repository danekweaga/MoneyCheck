import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardDesktopView } from "@/components/views/dashboard/dashboard-desktop-view";
import { DashboardMobileView } from "@/components/views/dashboard/dashboard-mobile-view";
import { getRecentMoneyChecks } from "@/lib/data/money-checks";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";
import type { MoneyCheck } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard | MoneyCheck",
};

export default async function DashboardPage() {
  const isMobile = await isMobileRequest();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfileForUser(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  let checks: MoneyCheck[] = [];
  let hasChecksError = false;

  try {
    checks = await getRecentMoneyChecks(user.id, 5);
  } catch (error) {
    console.error("Failed to load recent checks on dashboard.", error);
    hasChecksError = true;
  }

  return isMobile ? (
    <DashboardMobileView profile={profile} checks={checks} hasChecksError={hasChecksError} />
  ) : (
    <DashboardDesktopView profile={profile} checks={checks} hasChecksError={hasChecksError} />
  );
}
