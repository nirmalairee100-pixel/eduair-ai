"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay then push to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

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
            <p className="text-xs text-slate-400 leading-relaxed">Authenticate to access your customized Nepali syllabus workspace and AI modules.</p>
          </div>

          {/* Social Auth */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-11 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 text-sm mb-6"
          >
            <svg className="h-4 w-4 shrink-0 text-slate-300 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.743-.08-1.313-.177-1.877H12.24z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-900" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-slate-950/50 px-3 text-slate-600">// Or use institutional email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="student@school.edu.np"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                Passkey
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl mt-2 tracking-wide transition-all shadow-md text-sm flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Syncing Matrix...
                </span>
              ) : (
                "Authenticate Module"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}