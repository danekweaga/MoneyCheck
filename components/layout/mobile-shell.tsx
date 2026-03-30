import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { AppFooter } from "@/components/layout/app-footer";
import { AppTopNav } from "@/components/layout/app-top-nav";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface pb-8 text-on-surface">
      <AppTopNav />
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pb-8 pt-[7.5rem] sm:px-6 sm:pt-28">{children}</main>
      <AppFooter />
      <ChatbotWidget />
    </div>
  );
}
