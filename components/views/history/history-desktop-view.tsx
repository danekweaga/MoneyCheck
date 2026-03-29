import Link from "next/link";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";

type Props = {
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function HistoryDesktopView({ checks, hasChecksError }: Props) {
  return (
    <DesktopShell>
      <section className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-primary-container">Archive Portfolio</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">Check History</h1>
          <p className="mt-2 text-on-surface-variant">A chronological architectural view of your checks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/api/export/records" className="rounded-xl bg-surface-container-high px-5 py-3 text-sm font-semibold text-primary">
            Export Excel
          </Link>
          <Link href="/check" className="architect-gradient rounded-xl px-6 py-3 text-sm font-bold text-white">
            Check New Spend
          </Link>
        </div>
      </section>

      {hasChecksError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardHeader>
            <CardTitle>Could not load history</CardTitle>
            <CardDescription>Please refresh and try again.</CardDescription>
          </CardHeader>
        </Card>
      ) : checks.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-muted/20">
          <CardHeader>
            <CardTitle>No checks yet</CardTitle>
            <CardDescription>When you save a check, it appears here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/check" className="text-sm font-semibold text-primary underline">
              Create your first check
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {checks.map((row) => (
            <Card key={row.id} className="architect-shadow border-outline-variant/25 bg-surface-container-lowest transition-all hover:-translate-y-0.5">
              <CardContent className="flex items-center justify-between gap-6 p-6">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-3">
                    <p className="truncate text-xl font-bold tracking-tight text-primary">{row.title}</p>
                    <RiskBadge level={row.risk_level} />
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Budget impact {formatPercent(row.budget_impact_percent)} - Future value lost {formatCurrency(row.future_value_lost)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-extrabold tracking-tight text-primary">{formatCurrency(row.amount)}</p>
                  <p className="text-xs font-medium text-on-surface-variant">{new Date(row.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DesktopShell>
  );
}
