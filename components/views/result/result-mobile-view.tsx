import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
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

function verdictTitle(level: MoneyCheck["risk_level"]) {
  if (level === "low") return "Verdict: Looks manageable";
  if (level === "medium") return "Verdict: Plan carefully";
  return "Verdict: Think twice";
}

export function ResultMobileView({ check, errorMessage }: Props) {
  if (!check) {
    return (
      <MobileShell>
        <Card className="architect-shadow border-dashed border-outline-variant/40 bg-surface-container-low">
          <CardHeader>
            <CardTitle>No result available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              {errorMessage ?? "This result cannot be loaded. Run a new check to get a fresh recommendation."}
            </p>
            <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient w-full text-white" }))}>
              Create New Check
            </Link>
            <Link href="/history" className={cn(buttonVariants({ variant: "outline", className: "w-full" }))}>
              Open History
            </Link>
          </CardContent>
        </Card>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-primary-container">Assessment Complete</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-primary">{verdictTitle(check.risk_level)}</h1>
        <div className="mt-3">
          <RiskBadge level={check.risk_level} />
        </div>
      </section>

      <div className="space-y-4">
        <Card className="architect-gradient border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Recommended Next Move</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-white/90">
            <p>{check.recommendation}</p>
            <Link href="/instructions" className={cn(buttonVariants({ variant: "outline", className: "w-full border-white/40 text-white" }))}>
              How to read this result
            </Link>
          </CardContent>
        </Card>
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container-low p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Budget impact</p>
              <p className="mt-1 text-xl font-extrabold text-primary">{formatPercent(check.budget_impact_percent)}</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Future value lost</p>
              <p className="mt-1 text-xl font-extrabold text-primary">{formatCurrency(check.future_value_lost)}</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Risk level</p>
              <div className="mt-2">
                <RiskBadge level={check.risk_level} />
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Regret score</p>
              <p className="mt-1 text-xl font-extrabold text-primary">{check.regret_score}/100</p>
            </div>
          </CardContent>
        </Card>
        <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient block w-full py-5 text-center font-bold text-white" }))}>
          Run Another Check
        </Link>
        <Link href="/history" className={cn(buttonVariants({ variant: "outline", className: "block w-full text-center" }))}>
          Back to History
        </Link>
      </div>
    </MobileShell>
  );
}
