import Link from "next/link";
import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { LogoutButton } from "@/components/dashboard/logout-button";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="fixed left-0 top-0 z-40 w-full border-b border-outline-variant/20 bg-surface-container-lowest/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight">MoneyCheck</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="px-6 pb-12 pt-24">{children}</main>

      <nav className="fixed bottom-0 left-0 z-50 w-full rounded-t-xl border-t border-outline-variant/20 bg-surface-container-lowest/95 px-4 pb-5 pt-3 backdrop-blur">
        <div className="flex items-center justify-around">
          <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Dashboard
          </Link>
          <Link href="/history" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            History
          </Link>
          <Link href="/settings" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Settings
          </Link>
          <Link href="/check" className="architect-gradient rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white">
            New Check
          </Link>
        </div>
      </nav>
      <ChatbotWidget />
    </div>
  );
}
