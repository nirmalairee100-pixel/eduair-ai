"use client";

import { useState } from "react";
import { NotebookPen, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Note = {
  id: string;
  topic: string;
  content: string;
  created_at: string;
};

export default function NotesMakerPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [pastNotes, setPastNotes] = useState<Note[]>([]);
  const [loadedPast, setLoadedPast] = useState(false);
  const supabase = createClient();

  async function loadPastNotes() {
    if (loadedPast) return;
    const { data } = await supabase
      .from("notes")
      .select("id, topic, content, created_at")
      .order("created_at", { ascending: false });
    setPastNotes((data as Note[]) ?? []);
    setLoadedPast(true);
  }

  async function generateNotes() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    setContent(null);

    try {
      const res = await fetch("/api/notes-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setContent(data.content);
      setActiveTopic(topic);
      setPastNotes((prev) => [
        { id: data.noteId, topic, content: data.content, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setLoadedPast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Notes Maker</h1>
      <p className="mt-1 text-slate-500">
        Turn any topic into clear, organized study notes.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateNotes()}
          placeholder="e.g. The French Revolution, Newton's Laws of Motion"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
        />
        <button
          onClick={generateNotes}
          disabled={loading || !topic.trim()}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <NotebookPen size={16} />}
          Generate
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {content && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-3 text-sm font-medium text-slate-500">{activeTopic}</p>
          <div className="prose prose-sm max-w-none prose-strong:text-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={loadPastNotes}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {loadedPast ? "Past notes" : "Show past notes"}
        </button>
        {loadedPast && (
          <div className="mt-3 space-y-2">
            {pastNotes.length === 0 && (
              <p className="text-sm text-slate-400">No notes yet.</p>
            )}
            {pastNotes.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setContent(n.content);
                  setActiveTopic(n.topic);
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <NotebookPen size={14} className="text-slate-400" />
                <span className="truncate text-slate-700">{n.topic}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
