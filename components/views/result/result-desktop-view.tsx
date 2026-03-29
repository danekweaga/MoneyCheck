import Link from "next/link";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";

export function ResultDesktopView({ check }: { check: MoneyCheck }) {
  return (
    <DesktopShell>
      <section className="mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-primary-container">Analysis Result</p>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-primary">Verdict: Think twice</h1>
          </div>
          <div className="rounded-full bg-tertiary-fixed px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-error-container">
            {check.risk_level} risk
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <Card className="architect-gradient col-span-12 border-0 text-white lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-3xl">Practical Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-white/80">{check.recommendation}</CardContent>
        </Card>

        <Card className="architect-shadow col-span-12 border-outline-variant/30 bg-surface-container-lowest lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Risk level</span>
              <RiskBadge level={check.risk_level} />
            </div>
            <div className="flex justify-between">
              <span>Budget impact</span>
              <strong>{formatPercent(check.budget_impact_percent)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Future value lost</span>
              <strong>{formatCurrency(check.future_value_lost)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Regret score</span>
              <strong>{check.regret_score}/100</strong>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 flex justify-end">
        <Link href="/history" className="architect-gradient rounded-xl px-10 py-4 text-sm font-bold text-white">
          Save to History
        </Link>
      </footer>
    </DesktopShell>
  );
}
