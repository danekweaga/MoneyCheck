import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { AppFooter } from "@/components/layout/app-footer";

export function OnboardingMobileView() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="px-6 py-8">
        <h1 className="font-headline text-center text-2xl font-extrabold tracking-tight text-primary">MoneyCheck</h1>
      </header>
      <main className="flex-grow px-4 pb-8">
        <div className="mx-auto mb-8 max-w-2xl space-y-3">
          <span className="inline-flex items-center rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold uppercase tracking-wider text-on-secondary-fixed">
            Step 01 of 03
          </span>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">Design your financial future</h1>
          <p className="text-sm text-on-surface-variant">A few details unlock your personalized dashboard.</p>
        </div>
        <div className="mx-auto max-w-2xl">
          <OnboardingForm variant="mobile" />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
