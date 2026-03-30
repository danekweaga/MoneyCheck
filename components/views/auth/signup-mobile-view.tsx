import { SignupForm } from "@/components/auth/signup-form";

export function SignupMobileView() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto mb-12 flex items-center justify-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
          <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <span className="font-headline text-xl font-extrabold tracking-tight text-primary">MoneyCheck</span>
      </div>
      <div className="mx-auto w-full max-w-md">
        <SignupForm variant="mobile" />
      </div>
    </main>
  );
}
