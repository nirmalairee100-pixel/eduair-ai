"use client";

import React, { useState } from "react";
import LoginButton from "@/components/landing/LoginButton";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Namaste! 👋 I am your EduAir AI assistant. Ready to master your Nepali curriculum modules today?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const updated = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(updated);
    setChatInput("");

    let reply = "I'm processing that topic against your school syllabus parameters now. Ask me to generate a matching quiz or clear study notes!";
    const lower = userMsg.toLowerCase().trim();

    if (lower === "hi" || lower === "hello") {
      reply = "Namaste! 👋 Drop a textbook topic or formula, and let's break it down together.";
    } else if (lower.includes("chemical") || lower.includes("reaction")) {
      reply = "Chemical Reactions! I can instantly balance equations or map out decomposition, displacement, and redox parameters for your Class 10 SEE preparation.";
    }

    setTimeout(() => {
      setChatMessages([...updated, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden antialiased">
      
      {/* BACKGROUND AMBIENCE CORE */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* FIXED PREMIUM NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80 h-16 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <a href="/" className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md border border-blue-400/20">
              E
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              EduAir<span className="text-blue-500">.ai</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 sm:border-l sm:border-slate-800 sm:pl-2.5">
            Founded by Nirmal Airee
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
        </div>

        <LoginButton
          label="Open Dashboard"
          showIcon={false}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 text-center block"
        />
      </nav>

      {/* GOD-LEVEL HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-900 rounded-full font-mono text-[11px] text-slate-400 mb-6 backdrop-blur-sm">
          <span>🇳🇵</span> Made for Nepal
          <span className="text-slate-800">•</span>
          <span className="text-blue-400 font-semibold">Based on Nepali School Syllabus</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Study Smarter. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-indigo-400">
            Achieve More With EduAir AI
          </span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
          Your deep context learning assistant. Chat with customized AI, compile textbooks into instant summaries, auto-generate syllabus exam mockups, and accelerate your academic workloads.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <LoginButton
            showIcon={false}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 text-center block"
          />
          <a
            href="#features"
            className="w-full sm:w-auto border border-slate-900 bg-slate-900/20 text-slate-300 hover:text-white text-sm font-medium px-6 py-3.5 rounded-xl transition-all block text-center"
          >
            Explore Features
          </a>
        </div>

        <div className="mt-8 text-[10px] font-mono text-slate-600 uppercase tracking-wider select-none">
          Platform Architecture // Engineered by Nirmal Airee
        </div>
      </section>

      {/* SECTION DIVIDER BREAKPOINTS */}
      <hr className="border-slate-900/60 max-w-7xl mx-auto" />

      {/* CORE MODULAR APPLICATIONS / FEATURES */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto scroll-mt-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-2">// System Engines</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Engineered for Academic Pipelines</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/20 border border-slate-900/80 rounded-2xl hover:border-slate-800 transition-all">
            <div className="text-xl mb-3">🤖</div>
            <h3 className="font-bold text-white text-base">AI Chat Tutor</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">Ask any conceptual question and receive breakdowns structured directly to local NEB criteria guidelines.</p>
          </div>

          <div className="p-6 bg-slate-900/20 border border-slate-900/80 rounded-2xl hover:border-slate-800 transition-all">
            <div className="text-xl mb-3">📄</div>
            <h3 className="font-bold text-white text-base">Syllabus PDF Analyst</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">Drop comprehensive reference textbooks or chapter documents and distill them into actionable matrices instantly.</p>
          </div>

          <div className="p-6 bg-slate-900/20 border border-slate-900/80 rounded-2xl hover:border-slate-800 transition-all">
            <div className="text-xl mb-3">🧠</div>
            <h3 className="font-bold text-white text-base">Quiz Blueprint Core</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">Instantly construct targeted evaluation parameter exams to map out existing learning gaps prior to tests.</p>
          </div>

          <div className="p-6 bg-slate-900/20 border border-slate-900/80 rounded-2xl hover:border-slate-800 transition-all">
            <div className="text-xl mb-3">📝</div>
            <h3 className="font-bold text-white text-base">Notes Matrix Creator</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">Synthesize scattered textbook paragraphs into hyperlinked summaries optimized for immediate retention.</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE INTEGRATED WORKSPACE SIMULATOR */}
      <section id="simulator" className="px-4 sm:px-8 py-16 bg-slate-950 max-w-6xl mx-auto border border-slate-900/80 rounded-3xl mb-24 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/[0.01] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Live Workspace Preview</h2>
          <p className="text-xs text-slate-500 mt-1">Simulate the core dashboard interface systems below</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 bg-slate-900/10 border border-slate-900 rounded-2xl p-3 min-h-[400px]">
          {/* Internal Navigation Sidebar */}
          <div className="md:col-span-1 flex md:flex-col gap-1 border-b md:border-b-0 md:border-r border-slate-900 pb-3 md:pb-0 md:pr-3">
            <button 
              onClick={() => setActiveTab("chat")} 
              className={`w-full text-left text-xs font-mono px-3 py-2.5 rounded-xl transition-all ${activeTab === "chat" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
            >
              AI Tutor Chat
            </button>
            <button 
              onClick={() => setActiveTab("doc")} 
              className={`w-full text-left text-xs font-mono px-3 py-2.5 rounded-xl transition-all ${activeTab === "doc" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
            >
              PDF Summary
            </button>
            <button 
              onClick={() => setActiveTab("quiz")} 
              className={`w-full text-left text-xs font-mono px-3 py-2.5 rounded-xl transition-all ${activeTab === "quiz" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
            >
              Quiz Engine
            </button>
          </div>

          {/* Dynamic Content Frame */}
          <div className="md:col-span-3 flex flex-col justify-between p-2 min-h-[320px]">
            {activeTab === "chat" && (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed border ${msg.sender === "user" ? "bg-blue-600/10 border-blue-500/20 text-blue-200" : "bg-slate-900/60 border-slate-900 text-slate-300"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 bg-slate-900/40 border border-slate-900 rounded-xl p-1.5 focus-within:border-slate-800 transition-all">
                  <input 
                    type="text" 
                    placeholder="Type 'Chemical reactions' or your query..." 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    className="flex-1 bg-transparent text-xs text-white outline-none pl-2.5 placeholder-slate-600"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all">
                    Send
                  </button>
                </form>
              </div>
            )}

            {activeTab === "doc" && (
              <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-slate-900 rounded-2xl bg-slate-950/40 h-full">
                <span className="text-2xl mb-2">📥</span>
                <p className="text-xs text-slate-300 font-medium">Drop curriculum materials here</p>
                <p className="text-[10px] text-slate-600 font-mono mt-1">PDF, DOCX up to 16MB // Automatic parsing match</p>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-4 py-2">
                <div className="p-3 bg-slate-900/30 border border-slate-900/80 rounded-xl">
                  <p className="text-xs font-semibold text-slate-300">Question 1: Which of the following is a displacement reaction?</p>
                  <div className="mt-2.5 space-y-1.5">
                    <button className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-900/50 border border-slate-900 hover:border-slate-800 text-slate-400">A) $2H_2 + O_2 \rightarrow 2H_2O$</button>
                    <button className="w-full text-left text-[11px] p-2 rounded-lg bg-blue-600/5 border border-blue-500/20 text-blue-400 font-medium">B) $Fe + CuSO_4 \rightarrow FeSO_4 + Cu$ (Correct Match)</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE METADATA / ABOUT */}
      <section id="about" className="px-4 py-20 border-t border-slate-900 bg-slate-950/30 text-center scroll-mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Engineered for the Local Ecosystem</h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
          EduAir AI is built natively in Nepal to bypass standard generalized AI limitations. By directly structuring deep optimization processing chains directly against local evaluation frameworks, it delivers immediate contextual alignment.
        </p>
      </section>

      {/* SYSTEM FOOTER */}
      <footer className="px-4 sm:px-8 py-8 border-t border-slate-900/80 bg-slate-950 text-center text-xs text-slate-500 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-slate-600">© 2026 EduAir AI. Modular Infrastructure. All rights reserved.</p>
        <p className="font-mono text-[11px] text-slate-400">Founded & Engineered by <span className="text-blue-500 font-semibold">Nirmal Airee</span></p>
      </footer>

    </main>
  );
}