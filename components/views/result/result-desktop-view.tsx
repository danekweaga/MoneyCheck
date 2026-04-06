import Link from "next/link";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  check?: MoneyCheck | null;
  errorMessage?: string | null;
};

function verdictTone(level: MoneyCheck["risk_level"]) {
  if (level === "low") return { title: "Verdict: Looks manageable", sub: "green" };
  if (level === "medium") return { title: "Verdict: Plan carefully", sub: "amber" };
  return { title: "Verdict: Think twice", sub: "red" };
}

export function ResultDesktopView({ check, errorMessage }: Props) {
  if (!check) {
    return (
      <DesktopShell>
        <Card className="architect-shadow border-dashed border-outline-variant/40 bg-surface-container-low">
          <CardHeader>
            <CardTitle>No result available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              {errorMessage ?? "This result is missing or no longer available. Run a new check to get an updated decision."}
            </p>
            <div className="flex gap-3">
              <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient text-white" }))}>
                Create New Check
              </Link>
              <Link href="/history" className={cn(buttonVariants({ variant: "outline" }))}>
                Open History
              </Link>
            </div>
          </CardContent>
        </Card>
      </DesktopShell>
    );
  }

  const verdict = verdictTone(check.risk_level);

  return (
    <DesktopShell>
      <section className="mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-primary-container">Analysis Result</p>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-primary">{verdict.title}</h1>
          </div>
          <RiskBadge level={check.risk_level} />
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <Card className="architect-gradient col-span-12 border-0 text-white lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-3xl">Recommended Next Move</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg text-white/90">
            <p>{check.recommendation}</p>
            <div className="flex gap-3">
              <Link href="/check" className={cn(buttonVariants({ className: "bg-white text-primary hover:bg-white/90" }))}>
                Re-run with new numbers
              </Link>
              <Link href="/instructions" className={cn(buttonVariants({ variant: "outline", className: "border-white/40 text-white" }))}>
                How to read scores
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="architect-shadow col-span-12 border-outline-variant/30 bg-surface-container-lowest lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-xl">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Budget impact</p>
              <p className="mt-2 text-2xl font-extrabold text-primary">{formatPercent(check.budget_impact_percent)}</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Future value lost</p>
              <p className="mt-2 text-2xl font-extrabold text-primary">{formatCurrency(check.future_value_lost)}</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Risk level</p>
              <div className="mt-2">
                <RiskBadge level={check.risk_level} />
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Regret score</p>
              <p className="mt-2 text-2xl font-extrabold text-primary">{check.regret_score}/100</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 flex justify-end gap-3">
        <Link href="/history" className={cn(buttonVariants({ variant: "outline", className: "px-10 py-4 text-sm font-bold" }))}>
          Back to History
        </Link>
        <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient px-10 py-4 text-sm font-bold text-white" }))}>
          Run Another Check
        </Link>
      </footer>
    </DesktopShell>
  );
}
