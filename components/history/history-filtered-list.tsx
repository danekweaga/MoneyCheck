"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck, MoneyCheckType } from "@/lib/types";

type FilterKey = "all" | MoneyCheckType;

const chips: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "purchase", label: "Purchase" },
  { key: "bill", label: "Bill" },
  { key: "subscription", label: "Subscription" },
  { key: "loan", label: "Loan" },
  { key: "credit_card", label: "Card" },
];

type Props = {
  checks: MoneyCheck[];
};

export function HistoryFilteredList({ checks }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return checks.filter((c) => {
      if (filter !== "all" && c.type !== filter) return false;
      if (!q) return true;
      return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    });
  }, [checks, query, filter]);

  const totalFutureLost = useMemo(() => checks.reduce((s, c) => s + c.future_value_lost, 0), [checks]);

  return (
    <>
      <header className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline mb-2 text-5xl font-extrabold tracking-tight text-on-surface">Your Spending History</h1>
            <p className="max-w-2xl text-lg text-on-surface-variant">
              Refined insights into your previous financial decisions, curated for your long-term growth.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="group relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border-none bg-surface-container-low py-2.5 pl-10 pr-4 text-sm transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 md:w-64"
                placeholder="Search checks..."
                type="search"
                aria-label="Search checks"
              />
            </div>
            <div className="flex flex-wrap rounded-lg bg-surface-container-low p-1">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setFilter(chip.key)}
                  className={
                    filter === chip.key
                      ? "rounded-md bg-surface-container-lowest px-4 py-1.5 text-xs font-bold text-primary shadow-sm"
                      : "rounded-md px-4 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
                  }
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(11,28,48,0.04)] md:col-span-8">
          <div className="absolute right-0 top-0 p-8">
            <span className="material-symbols-outlined text-6xl text-secondary-container opacity-20" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
          </div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Quarterly Momentum</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-4xl font-extrabold">{checks.length} Checks</span>
          </div>
          <p className="mt-4 max-w-md text-on-surface-variant">
            You have recorded <span className="font-bold text-secondary">{filtered.length}</span> matching{" "}
            {filter === "all" ? "entries" : chips.find((c) => c.key === filter)?.label.toLowerCase() ?? "entries"}
            {query.trim() ? " for your search" : ""}.
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-primary p-8 text-white shadow-xl md:col-span-4">
          <div>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-widest opacity-70">Modeled opportunity cost</h3>
            <p className="font-headline text-3xl font-bold">{formatCurrency(totalFutureLost)}</p>
            <p className="mt-2 text-xs text-primary-fixed-dim">Sum of future value lost across all saved checks (illustrative).</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low py-16 text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-outline">receipt_long</span>
            <h2 className="font-headline mb-2 text-2xl font-bold">No matching checks</h2>
            <p className="mx-auto mb-8 max-w-sm text-on-surface-variant">Try another search or filter.</p>
            <Link href="/check" className="inline-block rounded-lg bg-primary px-8 py-3 font-bold text-on-primary shadow-lg">
              Start First Check
            </Link>
          </div>
        ) : (
          filtered.map((row) => {
            const d = new Date(row.created_at);
            return (
              <Link
                key={row.id}
                href={`/check/result?id=${row.id}`}
                className="group flex cursor-pointer flex-col items-center gap-6 rounded-xl bg-surface-container-lowest p-6 transition-all duration-300 hover:bg-surface-container-high md:flex-row"
              >
                <div className="flex min-w-[100px] flex-col items-center md:items-start">
                  <span className="text-xs font-bold uppercase text-outline-variant">
                    {d.toLocaleString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="font-headline text-xl font-extrabold text-on-surface">{d.getFullYear()}</span>
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{row.title}</h4>
                    <span className="rounded-full bg-surface-variant px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
                      {row.category}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-on-surface-variant">{row.recommendation}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-12 md:w-auto md:justify-end">
                  <div className="text-right">
                    <p className="font-headline text-xl font-extrabold text-on-surface">{formatCurrency(row.amount)}</p>
                    <p className="text-xs font-medium text-outline">Budget Impact: {formatPercent(row.budget_impact_percent)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <RiskBadge level={row.risk_level} className="!text-[11px]" />
                    <span className="material-symbols-outlined text-outline transition-colors group-hover:text-primary">chevron_right</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
