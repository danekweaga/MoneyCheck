import Link from "next/link";
import { RecentChecksSection } from "@/components/dashboard/recent-checks";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoneyCheck, Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function DashboardMobileView({ profile, checks, hasChecksError }: Props) {
  return (
    <MobileShell>
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Overview</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-primary">
          Hi, {profile.full_name.split(" ")[0] ?? profile.full_name}!
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">Your financial architecture is looking stable today.</p>
        <Link href="/check" className="architect-gradient mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white">
          Check New Spend
        </Link>
      </section>

      <SummaryCards
        monthlyIncome={profile.monthly_income}
        monthlyExpenses={profile.monthly_expenses}
        monthlySavingsGoal={profile.monthly_savings_goal}
      />

      <div className="mt-8">
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
    </MobileShell>
  );
}
