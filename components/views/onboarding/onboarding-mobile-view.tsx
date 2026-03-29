import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export function OnboardingMobileView() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 pb-12 pt-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary-fixed/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-primary-container">Step 2 of 5</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">Set up your profile</h1>
          <p className="text-on-surface-variant">Build your baseline so MoneyCheck can model smarter decisions.</p>
        </div>
        <OnboardingForm variant="mobile" />
      </div>
    </main>
  );
}
