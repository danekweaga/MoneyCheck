import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

const heroImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBOVA2KJzl_z7ctEU-3m895FocQJl7i4HP2LIQzSQN-ugAUnZAuq9PXXjNfIoXSUkeGhbR-35LzX1ZMnyyll40St2cAhpRjZjZ1xDj3e14uQuodwOlxEew154ClN_FHMAwGIl3o2NwTZC2TzXaX22JMfLsWh8d6nafOiTyu1a2RThbfg91S5pUCHNwgP6mAQG8MXfAm8zEJMwK3wOfKDGMDy0fHz09lVb-ErErJ8LjH6MXi0y_-8MPrd8ayb_7tRYqmPW6XpSwO5amW";

export function LoginDesktopView() {
  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-surface">
      <section className="primary-gradient relative hidden w-1/2 flex-col justify-between overflow-hidden p-16 text-white lg:flex">
        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container">
              <span className="material-symbols-outlined text-on-secondary-container">account_balance_wallet</span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tight text-white">MoneyCheck</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-headline text-5xl font-extrabold leading-tight text-white">Make smarter spending decisions</h1>
            <p className="mt-6 text-lg font-medium leading-relaxed text-indigo-100 opacity-90">
              The premium editorial platform for the next generation of financial intelligence. Track, analyze, and master your capital.
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-auto">
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <span className="material-symbols-outlined mb-3 text-secondary-fixed">trending_up</span>
              <div className="mb-1 text-xl font-bold text-white">+24.5%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Net Worth Growth</div>
            </div>
            <div className="flex-1 rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <span className="material-symbols-outlined mb-3 text-secondary-fixed">security</span>
              <div className="mb-1 text-xl font-bold text-white">Encrypted</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Tier-1 Security</div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary-container blur-[120px]" />
          <div className="absolute bottom-48 -left-24 h-64 w-64 rounded-full bg-indigo-400 blur-[100px]" />
        </div>
        <Image
          src={heroImg}
          alt=""
          width={1200}
          height={1600}
          className="pointer-events-none absolute bottom-0 right-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
          unoptimized
        />
      </section>
      <section className="flex w-full items-center justify-center bg-surface p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="material-symbols-outlined text-sm text-on-primary">account_balance_wallet</span>
              </div>
              <span className="font-headline text-xl font-extrabold tracking-tight text-primary">MoneyCheck</span>
            </div>
          </div>
          <LoginForm variant="desktop" />
        </div>
      </section>
      <footer className="pointer-events-none fixed bottom-0 w-full py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <p className="pointer-events-auto text-[10px] font-medium uppercase tracking-widest text-outline/50 md:text-xs">
            © {new Date().getFullYear()} MoneyCheck. Editorial Financial Intelligence.
          </p>
          <div className="pointer-events-auto flex gap-6">
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-outline/50 transition-colors hover:text-primary md:text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-outline/50 transition-colors hover:text-primary md:text-xs">
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
