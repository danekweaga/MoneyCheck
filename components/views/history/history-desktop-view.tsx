import Link from "next/link";
import { HistoryFilteredList } from "@/components/history/history-filtered-list";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoneyCheck } from "@/lib/types";

type Props = {
  checks: MoneyCheck[];
  hasChecksError: boolean;
};

export function HistoryDesktopView({ checks, hasChecksError }: Props) {
  return (
    <DesktopShell>
      <div className="mb-8 flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/api/export/records"
          className="rounded-lg bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
        >
          Export Excel
        </Link>
        <Link
          href="/check"
          className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-bold text-on-primary shadow-sm transition-all active:scale-95"
        >
          New Check
        </Link>
      </div>

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
        <HistoryFilteredList checks={checks} />
      )}
    </DesktopShell>
  );
}
