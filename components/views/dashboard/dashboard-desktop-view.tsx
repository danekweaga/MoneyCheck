import Link from "next/link";
import { RecentChecksSection } from "@/components/dashboard/recent-checks";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoneyCheck, Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function DashboardDesktopView({ profile, checks, hasChecksError }: Props) {
  return (
    <DesktopShell>
      <section className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-primary-container">Overview</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">
            Hi, {profile.full_name.split(" ")[0] ?? profile.full_name}!
          </h1>
          <p className="mt-2 max-w-xl text-on-surface-variant">Your financial architecture is looking stable today. Here is your blueprint.</p>
        </div>
        <Link href="/check" className="architect-gradient rounded-xl px-6 py-3 font-semibold text-white architect-shadow">
          Check New Spend
        </Link>
      </section>

      <SummaryCards
        monthlyIncome={profile.monthly_income}
        monthlyExpenses={profile.monthly_expenses}
        monthlySavingsGoal={profile.monthly_savings_goal}
      />

      <div className="mt-10">
        {hasChecksError ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle>Could not load recent checks</CardTitle>
              <CardDescription>Please refresh and try again.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/check" className="text-sm font-semibold text-primary underline">
                Create a new check
              </Link>
            </CardContent>
          </Card>
        ) : (
          <RecentChecksSection checks={checks} />
        )}
      </div>
    </DesktopShell>
  );
}
