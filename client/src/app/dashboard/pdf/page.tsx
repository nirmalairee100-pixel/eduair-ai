"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Doc = {
  id: string;
  file_name: string;
  summary: string;
  created_at: string;
};

export default function PdfSummarizerPage() {
  const [extracting, setExtracting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastDocs, setPastDocs] = useState<Doc[]>([]);
  const [loadedPast, setLoadedPast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadPastDocs() {
    if (loadedPast) return;
    const { data } = await supabase
      .from("documents")
      .select("id, file_name, summary, created_at")
      .order("created_at", { ascending: false });
    setPastDocs((data as Doc[]) ?? []);
    setLoadedPast(true);
  }

  async function handleFile(file: File) {
    setError(null);
    setSummary(null);
    setFileName(file.name);
    setExtracting(true);

    try {
      // pdfjs-dist is loaded dynamically so it only runs in the browser.
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText +=
          content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
          "\n";
      }

      setExtracting(false);

      if (!fullText.trim()) {
        setError(
          "Couldn't find any text in that PDF — it might be a scanned image."
        );
        return;
      }

      setSummarizing(true);
      const res = await fetch("/api/pdf-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, text: fullText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setSummary(data.summary);
      setPastDocs((prev) => [
        {
          id: data.documentId,
          file_name: file.name,
          summary: data.summary,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setLoadedPast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setExtracting(false);
      setSummarizing(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">PDF Summarizer</h1>
      <p className="mt-1 text-slate-500">
        Upload lecture notes or a chapter PDF and get the key points.
      </p>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Upload className="text-blue-600" size={22} />
        </div>
        <p className="font-medium text-slate-700">Click to upload a PDF</p>
        <p className="mt-1 text-sm text-slate-400">
          Text-based PDFs work best (not scanned images)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {(extracting || summarizing) && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} />
          {extracting ? "Reading your PDF…" : "Summarizing…"}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {summary && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-500">
              {fileName}
            </span>
          </div>
          <div className="prose prose-sm max-w-none prose-strong:text-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={loadPastDocs}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {loadedPast ? "Past summaries" : "Show past summaries"}
        </button>
        {loadedPast && (
          <div className="mt-3 space-y-2">
            {pastDocs.length === 0 && (
              <p className="text-sm text-slate-400">No summaries yet.</p>
            )}
            {pastDocs.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSummary(d.summary);
                  setFileName(d.file_name);
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <FileText size={14} className="text-slate-400" />
                <span className="truncate text-slate-700">{d.file_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
