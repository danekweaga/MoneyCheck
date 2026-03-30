import Image from "next/image";
import Link from "next/link";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";

const resultImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3sruX2tqkCdueBMWnJvIq3In8y2KyroeV5fHrcWBzbZbl-7KggVcqUXNgboqWjYx1TVG9EBXUXz-LtbYhqZdlFA2_FwlfpXIwNTdjzbwatYIFHtAK75KD8MP23l7duCR-11dpT2LajHZMja7vtvvAtBmgaNkcvSQbcttc_NBby-TGT3ABmmZPvRlXLBakYp2Eob2eZzjayc_GEzB9on8FK-gdrfVx1f13PZm1XUsgVf6nqJCMAPBTWUqkwTt1W3r7-3tefml6JyCm";

function riskPillClass(level: MoneyCheck["risk_level"]): string {
  if (level === "low") return "bg-secondary-fixed text-on-secondary-fixed";
  if (level === "medium") return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
  return "bg-error-container text-on-error-container";
}

export function ResultDesktopView({ check }: { check: MoneyCheck }) {
  return (
    <DesktopShell>
      <div className="mx-auto max-w-5xl">
        <div className="mt-4 rounded-xl border-2 border-primary/10 bg-indigo-50 p-8 dark:border-primary/20 dark:bg-slate-900/40">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="min-w-0 flex-grow space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span
                    className={`mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${riskPillClass(check.risk_level)}`}
                  >
                    {check.risk_level.toUpperCase()} RISK
                  </span>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">Analysis Complete</h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Regret Score</div>
                  <div className="text-4xl font-extrabold text-primary">
                    {check.regret_score}
                    <span className="text-sm font-medium text-outline-variant">/100</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                  <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">Monthly Impact</p>
                  <p className="text-xl font-bold text-on-surface">
                    {formatPercent(check.budget_impact_percent)}{" "}
                    <span className="text-xs font-normal text-outline">of income</span>
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-slate-800">
                  <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">Opportunity Cost</p>
                  <p className="text-xl font-bold text-error">{formatCurrency(check.future_value_lost)}</p>
                  <p className="text-[10px] italic text-outline">Modeled future value at payoff horizon</p>
                </div>
              </div>

              <p className="border-l-4 border-secondary pl-4 text-sm italic leading-relaxed text-on-surface-variant">
                &quot;{check.recommendation}&quot;
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-64">
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <Image src={resultImg} alt="" width={400} height={320} className="h-full w-full object-cover" unoptimized />
                <div className="pointer-events-none absolute inset-0 bg-primary/20 mix-blend-multiply" />
              </div>
              <Link
                href="/history"
                className="w-full rounded-lg bg-primary py-3 text-center font-bold text-on-primary transition-colors hover:bg-primary-container"
              >
                View in history
              </Link>
              <Link
                href="/check"
                className="w-full rounded-lg border border-outline-variant py-3 text-center font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                New check
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}
