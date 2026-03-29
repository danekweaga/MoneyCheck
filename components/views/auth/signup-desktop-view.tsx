import { SignupForm } from "@/components/auth/signup-form";

export function SignupDesktopView() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <section className="architect-gradient relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative text-2xl font-extrabold tracking-tight">MoneyCheck</div>
        <div className="relative">
          <h1 className="text-6xl font-extrabold leading-none tracking-tight">
            Architect Your
            <br />
            <span className="text-secondary-fixed">Financial Future.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/80">
            Build clarity with modern financial architecture and practical insights.
          </p>
        </div>
        <p className="relative text-xs uppercase tracking-[0.2em] text-white/70">Secure 256-bit encryption</p>
      </section>
      <section className="relative flex items-center justify-center overflow-hidden p-10">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-secondary-fixed/10 blur-3xl" />
        <div className="w-full max-w-lg">
          <SignupForm variant="desktop" />
        </div>
      </section>
    </main>
  );
}
