import { LoginForm } from "@/components/auth/login-form";

export function LoginMobileView() {
  return (
    <main className="min-h-screen bg-surface px-6 pb-24 pt-10">
      <div className="mx-auto mb-10 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="material-symbols-outlined text-sm text-on-primary">account_balance_wallet</span>
          </div>
          <span className="font-headline text-xl font-extrabold tracking-tight text-primary">MoneyCheck</span>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <LoginForm variant="mobile" />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 py-6 text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest text-outline/50">
          © {new Date().getFullYear()} MoneyCheck
        </p>
      </footer>
    </main>
  );
}
