import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { AppFooter } from "@/components/layout/app-footer";
import { AppTopNav } from "@/components/layout/app-top-nav";

export function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <AppTopNav />
      <main className="mx-auto w-full max-w-7xl flex-grow px-6 pb-16 pt-28">{children}</main>
      <AppFooter />
      <ChatbotWidget />
    </div>
  );
}
