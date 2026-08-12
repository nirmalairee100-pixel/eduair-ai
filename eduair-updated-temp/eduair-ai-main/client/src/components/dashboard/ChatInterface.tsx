"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "Quiz me on basic algebra",
  "Explain photosynthesis simply",
  "Help me write a study plan for exams",
  "What's the difference between mitosis and meiosis?",
];

export default function ChatInterface({
  conversationId,
  onConversationCreated,
}: {
  conversationId: string | null;
  onConversationCreated: (id: string, title: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoadingHistory(true);
    supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data as Message[]) ?? []);
        setLoadingHistory(false);
      });
  }, [conversationId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: conversationId ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (!conversationId) {
        onConversationCreated(data.conversationId, text.slice(0, 60));
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Sorry, I couldn't reach the AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showWelcome = !conversationId && messages.length === 0;

  return (
    <div className="flex h-screen flex-1 flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-end px-4 py-8">
          {showWelcome && !loadingHistory && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <Sparkles className="text-indigo-600" size={22} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                What are you studying today?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ask a question, request a quiz, or get help with homework.
              </p>

              <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loadingHistory && (
            <p className="text-center text-sm text-slate-400">Loading…</p>
          )}

          <div className="space-y-6">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm text-white">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="prose prose-sm max-w-none text-slate-800 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-slate-900"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              )
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-indigo-400">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Message EduAir AI…"
            disabled={loading}
            rows={1}
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={16} />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-400">
          EduAir AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}
