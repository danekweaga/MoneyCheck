"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/dashboard/logout-button";

const mainNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
];

export function AppTopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/10 bg-white/80 shadow-[0_20px_40px_rgba(11,28,48,0.06)] backdrop-blur-xl dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4 md:gap-8">
          <Link
            href="/dashboard"
            className="shrink-0 text-xl font-extrabold tracking-tight text-indigo-900 dark:text-indigo-100 font-headline"
          >
            MoneyCheck
          </Link>
          <div className="hidden items-center gap-4 md:flex md:gap-6">
            {mainNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "border-b-2 border-indigo-600 pb-1 text-sm font-bold text-indigo-700 dark:border-indigo-400 dark:text-indigo-400"
                      : "text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/check"
            className="btn-gradient rounded-lg px-3 py-2 text-xs font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            New Check
          </Link>
          <div className="flex items-center gap-1 border-l border-surface-container pl-2 sm:ml-2 sm:gap-2 sm:pl-4">
            <Link
              href="/settings"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-indigo-50/50 hover:text-indigo-600 dark:hover:bg-slate-800"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">account_circle</span>
            </Link>
            <LogoutButton variant="icon" />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 border-t border-outline-variant/10 px-4 py-2 md:hidden">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "text-xs font-bold text-indigo-700"
                  : "text-xs font-medium text-slate-500 hover:text-indigo-600"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
