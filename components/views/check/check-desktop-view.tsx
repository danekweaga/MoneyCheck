import { NewCheckForm } from "@/components/check/new-check-form";
import { DesktopShell } from "@/components/layout/desktop-shell";

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
          <div className="architect-gradient rounded-xl p-6 text-white architect-shadow">
            <h3 className="text-lg font-bold">Why this matters</h3>
            <p className="mt-3 text-sm text-white/80">
              Compound growth can turn today&apos;s spending into significant future opportunity cost.
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-primary-container">Live Market Pulse</h4>
            <p className="mt-3 text-sm text-on-surface-variant">Use realistic rates to improve your estimate quality.</p>
          </div>
        </aside>
      </div>
    </DesktopShell>
  );
}
