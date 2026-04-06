import { NewCheckForm } from "@/components/check/new-check-form";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CheckMobileView() {
  return (
    <MobileShell>
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Spending Blueprint</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">New Money Check</h1>
        <p className="mt-2 text-on-surface-variant">Map out your next financial move with precision.</p>
      </section>
      <NewCheckForm variant="mobile" />
      <div className="mt-6 grid gap-4">
        <Card className="architect-gradient border-0 text-white">
          <CardHeader>
            <CardTitle className="text-base">Why this matters</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/80">
            Even small changes in rates and payoff time can significantly change your future value lost.
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
