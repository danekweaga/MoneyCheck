import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HistoryDesktopView } from "@/components/views/history/history-desktop-view";
import { HistoryMobileView } from "@/components/views/history/history-mobile-view";
import { getAllMoneyChecks } from "@/lib/data/money-checks";
import { getProfileForUser, isProfileComplete } from "@/lib/data/profile";
import { isMobileRequest } from "@/lib/device";
import { createClient } from "@/lib/supabase/server";
import type { MoneyCheck } from "@/lib/types";

export const metadata: Metadata = {
  title: "History | MoneyCheck",
};

export default async function HistoryPage() {
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
    checks = await getAllMoneyChecks(user.id);
  } catch (error) {
    console.error("Failed to load money check history.", error);
    hasChecksError = true;
  }

  return isMobile ? (
    <HistoryMobileView checks={checks} hasChecksError={hasChecksError} />
  ) : (
    <HistoryDesktopView checks={checks} hasChecksError={hasChecksError} />
  );
}
