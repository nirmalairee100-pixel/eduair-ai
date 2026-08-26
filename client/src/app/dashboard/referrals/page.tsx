"use client";

import { useEffect, useState } from "react";
import { Loader2, Gift, Copy, Check } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemStatus, setRedeemStatus] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/referral/code");
        const json = await res.json();
        if (res.ok) {
          setCode(json.code);
          setReferralCount(json.referralCount ?? 0);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const shareLink = code ? `https://eduair-ai.vercel.app/login?ref=${code}` : "";

  async function handleCopy() {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRedeem() {
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    setRedeemStatus(null);
    try {
      const res = await apiFetch("/api/referral/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setRedeemStatus(`Success! You both got ${json.bonusDays} days of Pro.`);
    } catch (err) {
      setRedeemStatus(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-slate-500" size={20} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-8">
      <div className="flex items-center gap-2">
        <Gift className="text-indigo-400" size={20} />
        <h1 className="font-serif text-2xl font-bold text-white">Refer a Friend</h1>
      </div>
      <p className="mt-1 text-sm text-slate-400">
        Share your link. When a friend signs up with it, you both get 7 days of Pro — free.
      </p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
        {referralCount === 0 ? "No referrals yet — share your link!" : `You've referred ${referralCount} friend${referralCount === 1 ? "" : "s"}`}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Your referral link</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300">
            {shareLink}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Have a code from a friend?</p>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            maxLength={6}
            className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleRedeem}
            disabled={redeeming || !redeemCode.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {redeeming ? "Redeeming..." : "Redeem"}
          </button>
        </div>
        {redeemStatus && (
          <p className="mt-2 text-sm text-slate-300">{redeemStatus}</p>
        )}
      </div>
    </main>
  );
}
