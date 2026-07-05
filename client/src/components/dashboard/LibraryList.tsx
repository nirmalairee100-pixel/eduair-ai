"use client";

import { useState } from "react";
import { FileText, Sparkles, NotebookPen, CalendarDays, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Item = {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  created_at: string;
};

const TABS = [
  { key: "documents", label: "PDF Summaries", icon: FileText },
  { key: "quizzes", label: "Quizzes", icon: Sparkles },
  { key: "notes", label: "Notes", icon: NotebookPen },
  { key: "plans", label: "Study Plans", icon: CalendarDays },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function LibraryList({
  items,
}: {
  items: Record<TabKey, Item[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("documents");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const list = items[activeTab];

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setExpandedId(null);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeTab === key
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className="text-xs opacity-60">({items[key].length})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.length === 0 && (
          <p className="text-sm text-slate-400">Nothing here yet.</p>
        )}
        {list.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white">
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`shrink-0 text-slate-400 transition-transform ${
                  expandedId === item.id ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedId === item.id && (
              <div className="border-t border-slate-100 px-4 py-3">
                <div className="prose prose-sm max-w-none prose-strong:text-slate-900">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {item.body}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
