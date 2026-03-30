import { NewCheckForm } from "@/components/check/new-check-form";
import { DesktopShell } from "@/components/layout/desktop-shell";

export function CheckDesktopView() {
  return (
    <DesktopShell>
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="font-headline mb-4 text-5xl font-extrabold tracking-tight text-on-surface">New Check</h1>
          <p className="mx-auto max-w-xl text-lg font-medium text-on-surface-variant">
            Measure the long-term impact of your next big decision before you commit.
          </p>
        </header>
        <NewCheckForm variant="desktop" />
      </div>
    </DesktopShell>
  );
}
