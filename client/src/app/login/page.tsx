"use client";

import { useRouter } from "next/navigation";
import LoginButton from "@/components/landing/LoginButton";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden antialiased selection:bg-blue-500/30">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto w-full max-w-md relative z-10 px-4">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8 cursor-pointer" onClick={() => router.push("/")}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg border border-blue-400/20">
              E
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              EduAir<span className="text-blue-500">.ai</span>
            </span>
          </div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Syllabus Gateway // Founded by Nirmal Airee
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/40 border border-slate-900/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Initialize Session</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with Google to access your customized Nepali syllabus workspace and AI modules.
            </p>
          </div>

          <LoginButton
            className="w-full h-11 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 text-sm"
            label="Continue with Google"
          />

          <p className="mt-6 text-center text-[11px] text-slate-600 font-mono">
            // No password needed. One tap, you're in.
          </p>
        </div>
      </div>
    </main>
  );
}
