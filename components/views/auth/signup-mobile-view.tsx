import { SignupForm } from "@/components/auth/signup-form";

export function SignupMobileView() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary-fixed/20 blur-3xl" />
        <div className="absolute -left-48 top-1/2 h-80 w-80 rounded-full bg-primary-fixed/30 blur-3xl" />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary">
            <span className="text-xl font-bold">MC</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">MoneyCheck</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Create your account to start smarter spending.</p>
        </div>
        <SignupForm variant="mobile" />
      </div>
    </main>
  );
}
