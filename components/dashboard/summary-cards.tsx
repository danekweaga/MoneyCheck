import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

type Props = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavingsGoal: number;
};

export function SummaryCards({ monthlyIncome, monthlyExpenses, monthlySavingsGoal }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <Card className="architect-shadow overflow-hidden border-outline-variant/25 bg-surface-container-lowest">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Monthly income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold tracking-tight text-primary">{formatCurrency(monthlyIncome)}</p>
          <p className="mt-2 text-xs font-semibold text-secondary">+12% from last month</p>
        </CardContent>
      </Card>
      <Card className="architect-shadow overflow-hidden border-outline-variant/25 bg-surface-container-lowest">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Monthly expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold tracking-tight text-primary">{formatCurrency(monthlyExpenses)}</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full w-[37%] rounded-full bg-primary-container" />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">37% of monthly budget used</p>
        </CardContent>
      </Card>
      <Card className="architect-gradient overflow-hidden border-0 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/70">Savings goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(monthlySavingsGoal)}</p>
          <p className="mt-2 text-xs font-semibold text-secondary-fixed">Architected growth target</p>
        </CardContent>
      </Card>
    </div>
  );
}
