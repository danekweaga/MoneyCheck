"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! Ask me about your spending, risk, or what check to run next." },
  ]);
  const [creditsLabel, setCreditsLabel] = useState<string | null>(null);

  async function submitMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const payload = (await response.json()) as {
        answer?: string;
        error?: string;
        remainingCredits?: number;
        dailyLimit?: number;
      };

      if (!response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", text: payload.error ?? "Something went wrong." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: payload.answer ?? "No response." }]);
      }

      if (typeof payload.remainingCredits === "number" && typeof payload.dailyLimit === "number") {
        setCreditsLabel(`${payload.remainingCredits}/${payload.dailyLimit} AI credits left today`);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-5 z-[60] sm:bottom-8 sm:right-8">
      {open ? (
        <div className="architect-shadow w-[320px] rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-3 sm:w-[360px]">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-bold text-primary">MoneyCheck AI</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high"
            >
              Close
            </button>
          </div>
          <div className="mb-2 h-64 space-y-2 overflow-y-auto rounded-xl bg-surface-container-low p-2">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto w-[90%] rounded-xl bg-primary p-2 text-sm text-white"
                    : "mr-auto w-[90%] rounded-xl bg-surface-container-highest p-2 text-sm text-on-surface"
                }
              >
                {message.text}
              </div>
            ))}
          </div>
          {creditsLabel ? <p className="mb-2 px-1 text-[11px] font-medium text-on-surface-variant">{creditsLabel}</p> : null}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitMessage();
                }
              }}
              placeholder="Ask about your spending..."
              className="h-10 flex-1 rounded-xl border-none bg-surface-container-highest px-3 text-sm outline-none ring-0 focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => void submitMessage()}
              disabled={loading}
              className="architect-gradient rounded-xl px-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="architect-gradient architect-shadow rounded-full px-4 py-3 text-sm font-bold text-white"
        >
          Chat with AI
        </button>
      )}
    </div>
  );
}
