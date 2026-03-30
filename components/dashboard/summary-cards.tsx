import { formatCurrency } from "@/lib/formatters";

type Props = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavingsGoal: number;
};

export function SummaryCards({ monthlyIncome, monthlyExpenses, monthlySavingsGoal }: Props) {
  const savingsPercent =
    monthlyIncome > 0 ? Math.min(100, Math.round((monthlySavingsGoal / monthlyIncome) * 100)) : 0;
  const onTrack = monthlyExpenses <= monthlyIncome * 0.9;

  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-xl bg-surface-container-low p-6 transition-all hover:bg-surface-container">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-secondary-fixed p-2">
            <span className="material-symbols-outlined text-on-secondary-fixed">payments</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Monthly Income</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-2xl font-extrabold">{formatCurrency(monthlyIncome)}</h4>
          <p className="flex items-center gap-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-xs text-secondary">trending_up</span>
            Baseline for budget impact checks
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-6 transition-all hover:bg-surface-container">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-error-container p-2">
            <span className="material-symbols-outlined text-on-error-container">shopping_cart</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-error">Monthly Expenses</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-2xl font-extrabold">{formatCurrency(monthlyExpenses)}</h4>
          <p className="flex items-center gap-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-xs text-error">info</span>
            {onTrack ? "Within typical budget range" : "Review spending vs income"}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-6 transition-all hover:bg-surface-container">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-primary-fixed p-2">
            <span className="material-symbols-outlined text-on-primary-fixed">target</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Savings Goal</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-extrabold">{savingsPercent}%</h4>
            <span className="text-xs text-on-surface-variant">
              {formatCurrency(monthlySavingsGoal)} / {formatCurrency(monthlyIncome)} income
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${savingsPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
