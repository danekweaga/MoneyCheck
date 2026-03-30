import Link from "next/link";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { formatCurrency } from "@/lib/formatters";
import type { MoneyCheck, MoneyCheckType } from "@/lib/types";

function typeIcon(type: MoneyCheckType): string {
  switch (type) {
    case "purchase":
      return "shopping_bag";
    case "bill":
      return "receipt_long";
    case "loan":
      return "account_balance";
    case "credit_card":
      return "credit_card";
    case "subscription":
      return "autorenew";
    default:
      return "analytics";
  }
}

function iconBgClass(level: MoneyCheck["risk_level"]): string {
  if (level === "low") return "bg-secondary-fixed text-on-secondary-fixed";
  if (level === "medium") return "bg-surface-container-high text-primary";
  return "bg-error-container text-error";
}

export function RecentChecksSection({ checks }: { checks: MoneyCheck[] }) {
  if (checks.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-surface-container-low">
            <span className="material-symbols-outlined text-7xl text-primary/20">account_balance_wallet</span>
          </div>
          <div className="max-w-xs space-y-2">
            <h3 className="text-xl font-bold font-headline">No Money Checks Yet</h3>
            <p className="text-sm text-on-surface-variant">
              Start your financial journey by creating your first health check analysis.
            </p>
          </div>
          <Link
            href="/check"
            className="rounded-lg bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            Create Your First Money Check
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-on-surface">Recent Money Checks</h2>
        <Link href="/history" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
          View All History
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        {checks.map((row) => (
          <Link
            key={row.id}
            href={`/check/result?id=${row.id}`}
            className="group flex flex-col justify-between border-b border-outline-variant/10 p-6 transition-colors last:border-b-0 hover:bg-surface-container-low md:flex-row md:items-center"
          >
            <div className="mb-4 flex items-center gap-4 md:mb-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBgClass(row.risk_level)}`}
              >
                <span className="material-symbols-outlined">{typeIcon(row.type)}</span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{row.title}</p>
                <p className="text-xs text-on-surface-variant">{new Date(row.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 md:justify-end">
              <div className="text-right">
                <p className="font-bold text-on-surface">{formatCurrency(row.amount)}</p>
                <p className="text-[10px] uppercase tracking-tighter text-on-surface-variant">Amount Checked</p>
              </div>
              <RiskBadge level={row.risk_level} />
              <span className="material-symbols-outlined cursor-pointer text-slate-300 transition-all group-hover:text-primary">
                chevron_right
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
