import { NewCheckForm } from "@/components/check/new-check-form";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CheckDesktopView() {
  return (
    <DesktopShell>
      <section className="mb-8 max-w-5xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-primary-container">Spending Blueprint</p>
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">New Money Check</h1>
        <p className="mt-2 text-on-surface-variant">
          Calculate the true cost of your next big move, including future opportunity cost.
        </p>
      </section>

      <div className="grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <NewCheckForm variant="desktop" />
        <aside className="space-y-6">
          <Card className="architect-gradient border-0 text-white architect-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Why this matters</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/80">
              Compound growth can turn today&apos;s spending into significant future opportunity cost.
            </CardContent>
          </Card>
          <Card className="border-outline-variant/30 bg-surface-container-low">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Live Market Pulse</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-on-surface-variant">
              Use realistic rates to improve your estimate quality.
            </CardContent>
          </Card>
        </aside>
      </div>
    </DesktopShell>
  );
}
