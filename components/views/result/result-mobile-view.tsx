import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";

export function ResultMobileView({ check }: { check: MoneyCheck }) {
  return (
    <MobileShell>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-primary-container">Assessment Complete</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-primary">Verdict: Think twice</h1>
        <div className="mt-3 inline-flex rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-error-container">
          {check.risk_level} risk
        </div>
      </section>

      <div className="space-y-4">
        <Card className="architect-gradient border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Practical Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="text-white/85">{check.recommendation}</CardContent>
        </Card>
        <Card className="architect-shadow border-outline-variant/30 bg-surface-container-lowest">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span>Risk</span>
              <RiskBadge level={check.risk_level} />
            </div>
            <div className="flex items-center justify-between">
              <span>Budget impact</span>
              <strong>{formatPercent(check.budget_impact_percent)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Future value lost</span>
              <strong>{formatCurrency(check.future_value_lost)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Regret score</span>
              <strong>{check.regret_score}/100</strong>
            </div>
          </CardContent>
        </Card>
        <Link href="/history" className="architect-gradient block rounded-xl px-6 py-4 text-center font-bold text-white">
          Save to History
        </Link>
      </div>
    </MobileShell>
  );
}
