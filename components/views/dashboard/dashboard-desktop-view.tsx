import Image from "next/image";
import Link from "next/link";
import { RecentChecksSection } from "@/components/dashboard/recent-checks";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { MoneyCheck, Profile } from "@/lib/types";

const heroImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDm2tYB300aJ1OBLFMVI0nSI3xHpaxuIAml2S-bd0LTFByagQvbtxBVV2ohmkamsMDoa9zpxFP462U7pcLDWGXWhPXF-rr8FtmWzAUER3m7hljhxvUlGgw1681GaW7SAFgYm5dEVvrkj4jSG4aQuJGF0vBG4ihKSxiTqG3f9RoDAMNNof6JJQkl7IvRc_WqwJRUfTEYgWz9YGic5p0LNG6UlEkMrpHzEbW6bv3Aj_aHnaV6BW7Tvh7Mul61D-hI_gfYrPc5IcNTCHNU";

type Props = {
  profile: Profile;
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function DashboardDesktopView({ profile, checks, hasChecksError }: Props) {
  const firstName = profile.full_name.split(" ")[0] ?? profile.full_name;
  const discretionary = Math.max(0, profile.monthly_income - profile.monthly_expenses);
  const savingsProgress =
    profile.monthly_income > 0
      ? Math.min(100, Math.round((profile.monthly_savings_goal / profile.monthly_income) * 100))
      : 0;

  return (
    <DesktopShell>
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-sm lg:col-span-8 md:flex-row">
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Welcome back, {firstName}!</h1>
            <p className="max-w-md leading-relaxed text-on-surface-variant">
              Your plan has{" "}
              <span className="font-bold text-secondary">{formatCurrency(discretionary)}</span> discretionary cash after typical
              expenses. Remember: &quot;The habit of saving is itself an education; it fosters every virtue.&quot;
            </p>
            <div className="pt-2">
              <Link
                href="/check"
                className="inline-flex rounded-full bg-secondary-container px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-on-secondary-container transition-all hover:opacity-90"
              >
                View Curated Insights
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-12 -right-12 hidden opacity-10 md:block">
            <span className="material-symbols-outlined text-[12rem]">insights</span>
          </div>
          <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl bg-surface-container md:ml-auto">
            <Image src={heroImg} alt="" width={400} height={400} className="h-full w-full object-cover" unoptimized />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-primary p-8 text-on-primary shadow-xl lg:col-span-4">
          <div>
            <span className="material-symbols-outlined mb-4 text-4xl text-secondary-fixed">auto_awesome</span>
            <h3 className="mb-2 text-xl font-bold">Editor&apos;s Pick</h3>
            <p className="text-sm leading-relaxed text-primary-fixed-dim">
              You aimed to save {savingsProgress}% of income this month. Run a Money Check before any purchase over{" "}
              {formatCurrency(profile.monthly_income * 0.05)} to keep momentum.
            </p>
          </div>
          <Link
            href="/check"
            className="mt-6 flex items-center gap-2 text-sm font-bold text-secondary-fixed transition-all hover:gap-3"
          >
            Start Optimization <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

      <SummaryCards
        monthlyIncome={profile.monthly_income}
        monthlyExpenses={profile.monthly_expenses}
        monthlySavingsGoal={profile.monthly_savings_goal}
      />

      {hasChecksError ? (
        <Card className="mb-12 border-destructive/40 bg-destructive/5">
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
    </DesktopShell>
  );
}
