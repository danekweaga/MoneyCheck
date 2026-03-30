import Link from "next/link";
import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { LogoutButton } from "@/components/dashboard/logout-button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/check", label: "New Check" },
  { href: "/settings", label: "Settings" },
];

export function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-outline-variant/20 bg-surface-container-low px-4 py-8">
        <div className="mb-12 px-2">
          <h1 className="text-xl font-extrabold tracking-tight">MoneyCheck</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-on-primary-container">Financial Architect</p>
        </div>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 pt-8">
          <LogoutButton />
        </div>
      </aside>

      <header className="fixed right-0 top-0 z-40 flex h-20 w-[calc(100%-16rem)] items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest/80 px-8 backdrop-blur-xl">
        <div className="relative w-full max-w-md">
          <input
            placeholder="Search..."
            className="w-full rounded-full border-none bg-surface-container-highest px-4 py-2 text-sm focus:ring-2 focus:ring-ring"
          />
        </div>
        <Link href="/check" className="architect-gradient rounded-full px-6 py-2.5 text-sm font-bold text-white">
          Check New Spend
        </Link>
      </header>

      <main className="ml-64 min-h-screen px-8 pb-12 pt-28">{children}</main>
      <ChatbotWidget />
    </div>
  );
}
