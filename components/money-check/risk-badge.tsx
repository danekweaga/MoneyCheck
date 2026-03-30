import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<RiskLevel, string> = {
  low: "bg-secondary-container text-on-secondary-container",
  medium: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  high: "bg-error-container text-on-error-container",
};

const labels: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

type Props = {
  level: RiskLevel;
  className?: string;
};

export function RiskBadge({ level, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
        styles[level],
        className,
      )}
    >
      {labels[level]}
    </span>
  );
}
