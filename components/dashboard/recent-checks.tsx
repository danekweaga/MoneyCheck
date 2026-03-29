import Link from "next/link";
import { RiskBadge } from "@/components/money-check/risk-badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { MoneyCheck } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecentChecksSection({ checks }: { checks: MoneyCheck[] }) {
  if (checks.length === 0) {
    return (
      <Card className="architect-shadow border-dashed border-outline-variant/40 bg-surface-container-low">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent money checks</CardTitle>
          <CardDescription className="text-on-surface-variant">You have not saved a check yet. Start with your first one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/check" className={cn(buttonVariants({ className: "architect-gradient text-white" }))}>
            New check
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="architect-shadow border-outline-variant/25 bg-surface-container-lowest">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent money checks</CardTitle>
          <CardDescription className="text-on-surface-variant">Newest decisions first.</CardDescription>
        </div>
        <Link
          href="/history"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-outline-variant/40 bg-surface-container-low")}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-0 sm:px-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-on-primary-container">Title</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-on-primary-container">Amount</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-on-primary-container">Risk</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-on-primary-container">Budget impact</TableHead>
              <TableHead className="hidden text-right text-[11px] font-bold uppercase tracking-wider text-on-primary-container sm:table-cell">
                Future value lost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.map((row) => (
              <TableRow key={row.id} className="hover:bg-surface-container-low/70">
                <TableCell className="max-w-[140px] truncate font-medium">{row.title}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(row.amount)}</TableCell>
                <TableCell>
                  <RiskBadge level={row.risk_level} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatPercent(row.budget_impact_percent)}</TableCell>
                <TableCell className="hidden text-right tabular-nums sm:table-cell">
                  {formatCurrency(row.future_value_lost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
