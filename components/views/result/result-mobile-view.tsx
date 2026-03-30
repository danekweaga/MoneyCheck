import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";

export function ResultMobileView({ check }: { check: MoneyCheck }) {
  return (
    <MobileShell>
      <div className="rounded-xl border-2 border-primary/10 bg-indigo-50 p-6 dark:bg-slate-900/40">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h1 className="font-headline text-xl font-bold text-on-surface">Analysis Complete</h1>
            <RiskBadge level={check.risk_level} className="mt-2" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant">Regret</p>
            <p className="text-2xl font-extrabold text-primary">
              {check.regret_score}
              <span className="text-xs">/100</span>
            </p>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3 dark:bg-slate-800">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant">Monthly impact</p>
            <p className="font-bold">{formatPercent(check.budget_impact_percent)}</p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-slate-800">
            <p className="text-[10px] font-bold uppercase text-on-surface-variant">Opportunity</p>
            <p className="font-bold text-error">{formatCurrency(check.future_value_lost)}</p>
          </div>
        </div>
        <p className="mb-6 border-l-4 border-secondary pl-3 text-sm italic text-on-surface-variant">&quot;{check.recommendation}&quot;</p>
        <div className="flex flex-col gap-2">
          <Link href="/history" className="rounded-lg bg-primary py-3 text-center font-bold text-on-primary">
            View in history
          </Link>
          <Link href="/check" className="rounded-lg border border-outline-variant py-3 text-center font-bold text-on-surface-variant">
            New check
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
