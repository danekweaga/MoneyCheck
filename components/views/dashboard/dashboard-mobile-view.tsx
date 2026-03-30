import Link from "next/link";
import { RecentChecksSection } from "@/components/dashboard/recent-checks";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { MoneyCheck, Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function DashboardMobileView({ profile, checks, hasChecksError }: Props) {
  const firstName = profile.full_name.split(" ")[0] ?? profile.full_name;
  const discretionary = Math.max(0, profile.monthly_income - profile.monthly_expenses);

  return (
    <MobileShell>
      <section className="mb-8 space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">Welcome back, {firstName}!</h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          About <span className="font-bold text-secondary">{formatCurrency(discretionary)}</span> left after typical expenses this
          month.
        </p>
        <Link
          href="/check"
          className="btn-gradient inline-flex rounded-lg px-5 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20"
        >
          New Check
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
