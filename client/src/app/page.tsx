"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LoginButton from "@/components/landing/LoginButton";

// Reusable scroll-triggered reveal wrapper
function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

const tabPanelVariants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* ANIMATED FLOATING GRADIENT ORBS */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/[0.06] rounded-full blur-[130px] pointer-events-none"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[600px] -right-40 w-[450px] h-[450px] bg-blue-500/[0.05] rounded-full blur-[120px] pointer-events-none"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* FLOATING OCTOPUS MASCOT 🐙 */}
      <motion.div
        aria-hidden
        className="absolute top-20 sm:top-28 right-2 sm:right-10 md:right-20 text-3xl sm:text-5xl md:text-6xl select-none pointer-events-none z-10 opacity-70 sm:opacity-100 drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]"
        animate={{
          y: [0, -22, 0, 14, 0],
          x: [0, 10, -6, 8, 0],
          rotate: [0, -8, 6, -4, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        🐙
      </motion.div>

      {/* FIXED PREMIUM NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80"
      >
        <div className="h-16 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <a href="/" className="flex items-center gap-2 cursor-pointer group min-w-0">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md border border-blue-400/20"
            >
              E
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-white truncate">
              EduAir<span className="text-blue-500">.ai</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono text-slate-500 border-l border-slate-800 pl-2.5 whitespace-nowrap">
              Founded by Nirmal Airee
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            {[
              { href: "#features", label: "Features" },
              { href: "#simulator", label: "Simulator" },
              { href: "#about", label: "About Us" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="relative group/link hover:text-white transition-colors">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover/link:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <LoginButton
                label="Open Dashboard"
                showIcon={false}
                className="hidden sm:block bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 text-center"
              />
              <LoginButton
                label="Login"
                showIcon={false}
                className="sm:hidden bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-2 rounded-lg transition-all shadow-md shadow-blue-600/10 text-center"
              />
            </motion.div>

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/40 text-slate-300"
            >
              <motion.span
                className="absolute h-[1.5px] w-4 bg-current rounded-full"
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute h-[1.5px] w-4 bg-current rounded-full"
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute h-[1.5px] w-4 bg-current rounded-full"
                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-b border-slate-900/80 bg-slate-950/95 backdrop-blur-md"
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {[
                  { href: "#features", label: "Features" },
                  { href: "#simulator", label: "Simulator" },
                  { href: "#about", label: "About Us" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-300 hover:text-white py-2.5 px-2 rounded-lg hover:bg-slate-900/60 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-1">
                  <LoginButton
                    label="Open Dashboard"
                    showIcon={false}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all text-center block"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* GOD-LEVEL HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1.5 bg-slate-900/50 border border-slate-900 rounded-2xl sm:rounded-full font-mono text-[10px] sm:text-[11px] text-slate-400 mb-6 backdrop-blur-sm max-w-[92vw] sm:max-w-none"
        >
          <span className="flex items-center gap-1.5">
            <motion.span animate={{ rotate: [0, 14, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}>🇳🇵</motion.span>
            Made for Nepal
          </span>
          <span className="hidden xs:inline text-slate-800">•</span>
          <span className="text-blue-400 font-semibold">Based on Nepali School Syllabus</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-3xl xs:text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.1] mb-6 px-1"
        >
          Study Smarter. <br />
          <motion.span
            className="bg-clip-text text-transparent bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-200 to-indigo-400"
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            Achieve More With EduAir AI
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10"
        >
          Your deep context learning assistant. Chat with customized AI, compile textbooks into instant summaries, auto-generate syllabus exam mockups, and accelerate your academic workloads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(37,99,235,0.45)" }}
            whileTap={{ scale: 0.97 }}
          >
            <LoginButton
              showIcon={false}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 text-center block"
            />
          </motion.div>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.04, borderColor: "rgba(100,116,139,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto border border-slate-900 bg-slate-900/20 text-slate-300 hover:text-white text-sm font-medium px-6 py-3.5 rounded-xl transition-all block text-center"
          >
            Explore Features
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-[10px] font-mono text-slate-600 uppercase tracking-wider select-none"
        >
          Platform Architecture // Engineered by Nirmal Airee
        </motion.div>
      </section>

      {/* SECTION DIVIDER BREAKPOINTS */}
      <hr className="border-slate-900/60 max-w-7xl mx-auto" />

      {/* CORE MODULAR APPLICATIONS / FEATURES */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto scroll-mt-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-2">// System Engines</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Engineered for Academic Pipelines</h2>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { icon: "🤖", title: "AI Chat Tutor", desc: "Ask any conceptual question and receive breakdowns structured directly to local NEB criteria guidelines." },
            { icon: "📄", title: "Syllabus PDF Analyst", desc: "Drop comprehensive reference textbooks or chapter documents and distill them into actionable matrices instantly." },
            { icon: "🧠", title: "Quiz Blueprint Core", desc: "Instantly construct targeted evaluation parameter exams to map out existing learning gaps prior to tests." },
            { icon: "📝", title: "Notes Matrix Creator", desc: "Synthesize scattered textbook paragraphs into hyperlinked summaries optimized for immediate retention." },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
              }}
              whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(59,130,246,0.4)", boxShadow: "0 12px 40px -12px rgba(37,99,235,0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-6 bg-slate-900/20 border border-slate-900/80 rounded-2xl transition-colors cursor-default"
            >
              <motion.div whileHover={{ scale: 1.2, rotate: 8 }} className="text-xl mb-3 w-fit">{f.icon}</motion.div>
              <h3 className="font-bold text-white text-base">{f.title}</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* INTERACTIVE INTEGRATED WORKSPACE SIMULATOR */}
      <Reveal>
        <section id="simulator" className="px-4 sm:px-8 py-16 bg-slate-950 max-w-6xl mx-auto border border-slate-900/80 rounded-3xl mb-24 relative overflow-hidden scroll-mt-20">
          <motion.div
            className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/[0.02] rounded-full blur-[100px] pointer-events-none"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold text-white">Live Workspace Preview</h2>
            <p className="text-xs text-slate-500 mt-1">Simulate the core dashboard interface systems below</p>
          </div>

          <div className="grid md:grid-cols-4 gap-3 sm:gap-4 bg-slate-900/10 border border-slate-900 rounded-2xl p-2.5 sm:p-3 min-h-[400px]">
            {/* Internal Navigation Sidebar */}
            <div className="md:col-span-1 flex md:flex-col gap-1 overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-slate-900 pb-3 md:pb-0 md:pr-3">
              {[
                { id: "chat", label: "AI Tutor Chat" },
                { id: "doc", label: "PDF Summary" },
                { id: "quiz", label: "Quiz Engine" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 md:w-full text-left text-[11px] sm:text-xs font-mono whitespace-nowrap px-3 py-2.5 rounded-xl transition-colors ${activeTab === tab.id ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="simulator-tab-highlight"
                      className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content Frame */}
            <div className="md:col-span-3 flex flex-col justify-between p-1.5 sm:p-2 min-h-[320px] overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="flex flex-col h-full justify-between gap-4"
                  >
                    <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {chatMessages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed border ${msg.sender === "user" ? "bg-blue-600/10 border-blue-500/20 text-blue-200" : "bg-slate-900/60 border-slate-900 text-slate-300"}`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2 bg-slate-900/40 border border-slate-900 rounded-xl p-1.5 focus-within:border-slate-800 transition-all">
                      <input 
                        type="text" 
                        placeholder="Type 'Chemical reactions' or your query..." 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        className="flex-1 bg-transparent text-xs text-white outline-none pl-2.5 placeholder-slate-600"
                      />
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all">
                        Send
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {activeTab === "doc" && (
                  <motion.div
                    key="doc"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-slate-900 rounded-2xl bg-slate-950/40 h-full"
                  >
                    <motion.span
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl mb-2"
                    >📥</motion.span>
                    <p className="text-xs text-slate-300 font-medium">Drop curriculum materials here</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-1">PDF, DOCX up to 16MB // Automatic parsing match</p>
                  </motion.div>
                )}

                {activeTab === "quiz" && (
                  <motion.div
                    key="quiz"
                    variants={tabPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-4 py-2"
                  >
                    <div className="p-3 bg-slate-900/30 border border-slate-900/80 rounded-xl">
                      <p className="text-xs font-semibold text-slate-300">Question 1: Which of the following is a displacement reaction?</p>
                      <div className="mt-2.5 space-y-1.5">
                        <motion.button whileHover={{ x: 3 }} className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-900/50 border border-slate-900 hover:border-slate-800 text-slate-400">A) $2H_2 + O_2 \rightarrow 2H_2O$</motion.button>
                        <motion.button
                          whileHover={{ x: 3 }}
                          animate={{ boxShadow: ["0 0 0px rgba(37,99,235,0)", "0 0 16px rgba(37,99,235,0.25)", "0 0 0px rgba(37,99,235,0)"] }}
                          transition={{ boxShadow: { duration: 2.4, repeat: Infinity } }}
                          className="w-full text-left text-[11px] p-2 rounded-lg bg-blue-600/5 border border-blue-500/20 text-blue-400 font-medium"
                        >
                          B) $Fe + CuSO_4 \rightarrow FeSO_4 + Cu$ (Correct Match)
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SYSTEM ARCHITECTURE METADATA / ABOUT */}
      <section id="about" className="px-4 py-20 border-t border-slate-900 bg-slate-950/30 text-center scroll-mt-10">
        <Reveal>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Engineered for the Local Ecosystem</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
            EduAir AI is built natively in Nepal to bypass standard generalized AI limitations. By directly structuring deep optimization processing chains directly against local evaluation frameworks, it delivers immediate contextual alignment.
          </p>
        </Reveal>
      </section>

      {/* SYSTEM FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-8 py-8 border-t border-slate-900/80 bg-slate-950 text-center text-xs text-slate-500 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p className="font-mono text-[10px] text-slate-600">© 2026 EduAir AI. Modular Infrastructure. All rights reserved.</p>
        <p className="font-mono text-[11px] text-slate-400">Founded & Engineered by <span className="text-blue-500 font-semibold">Nirmal Airee</span></p>
      </motion.footer>

    </main>
  );
}
