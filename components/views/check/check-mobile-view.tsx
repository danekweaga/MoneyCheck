import { NewCheckForm } from "@/components/check/new-check-form";
import { MobileShell } from "@/components/layout/mobile-shell";

export function CheckMobileView() {
  return (
    <MobileShell>
      <header className="mb-8 text-center">
        <h1 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-on-surface">New Check</h1>
        <p className="text-sm font-medium text-on-surface-variant">Measure impact before you commit.</p>
      </header>
      <div className="mx-auto flex justify-center">
        <NewCheckForm variant="mobile" />
      </div>
    </MobileShell>
  );
}
