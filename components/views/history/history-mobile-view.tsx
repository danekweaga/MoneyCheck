import Link from "next/link";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { MobileShell } from "@/components/layout/mobile-shell";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function HistoryMobileView({ checks, hasChecksError }: Props) {
  return (
    <MobileShell>
      <section className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Archive Portfolio</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">History</h1>
        <p className="mt-2 text-on-surface-variant">Every check you have run, newest first.</p>
        <div className="mt-4">
          <Link href="/api/export/records" className={cn(buttonVariants({ className: "architect-gradient inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white" }))}>
            Download Excel
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
            <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient w-full text-white" }))}>
              Create your first check
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {checks.map((row) => (
            <Card key={row.id} className="architect-shadow border-outline-variant/25 bg-surface-container-lowest">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 font-semibold tracking-tight text-primary">{row.title}</p>
                  <RiskBadge level={row.risk_level} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-on-surface-variant">Amount</p>
                    <p className="tabular-nums font-semibold">{formatCurrency(row.amount)}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Budget impact</p>
                    <p className="tabular-nums font-semibold">{formatPercent(row.budget_impact_percent)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-on-surface-variant">Future value lost</p>
                    <p className="tabular-nums font-semibold">{formatCurrency(row.future_value_lost)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MobileShell>
  );
}
