import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/lib/types";

const styles: Record<RiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300",
  high: "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge className={styles[level]}>{level}</Badge>;
}
