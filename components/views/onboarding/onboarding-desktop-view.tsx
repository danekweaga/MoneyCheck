import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export function OnboardingDesktopView() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <section className="flex items-center justify-center px-10 py-16">
          <OnboardingForm variant="desktop" />
        </section>
        <section className="architect-gradient relative hidden overflow-hidden p-12 text-white lg:block">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary-fixed/20 blur-3xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-secondary-fixed">Design Philosophy</p>
          <h2 className="relative mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white">
            The Ledger is your Legacy.
          </h2>
          <p className="relative mt-6 text-sm text-white/80">
            Financial architecture starts with a strong foundation. Your onboarding profile powers smarter checks.
          </p>
        </section>
      </div>
    </main>
  );
}
