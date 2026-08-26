"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import LoginButton from "@/components/landing/LoginButton";

/* ---------- palette (kept out of Tailwind's default slate scale on
   purpose — see globals.css .landing-v2 guard) ----------
   ink      #0B0A08  page background, warm near-black
   panel    #16130F  raised surface
   paper    #EDE4D3  primary text, parchment-white
   dim      #9A8F7C  secondary text, warm taupe
   rule     #2A251E  hairline dividers
   red      #C6362E  the one accent — teacher's red pen
*/

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
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

// The signature element: a hand-drawn red-ink tick, the kind a
// teacher draws next to a correct answer. Draws itself in on scroll.
function InkCheck({ delay = 0, size = 30 }: { delay?: number; size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className="shrink-0">
      <motion.circle
        cx="17" cy="17" r="14.5"
        stroke="#C6362E" strokeWidth="1.4"
        initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      />
      <motion.path
        d="M10.5 17.5l4.3 4.3L23.5 12.5"
        stroke="#C6362E" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
        initial={reduce ? undefined : { pathLength: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.4, delay: delay + 0.45, ease: "easeOut" }}
      />
    </svg>
  );
}

// Faint paper grain, sits above the background, below content.
function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

const tabPanelVariants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(4px)" },
};

const markingRows = [
  {
    q: "Q1",
    prompt: "Don&apos;t understand a concept?",
    answer:
      "Air, your AI tutor, explains it in plain language and maps every answer back to your actual NEB or SEE syllabus — not a generic textbook.",
  },
  {
    q: "Q2",
    prompt: "Chapter too long to revise the night before?",
    answer:
      "Drop the PDF in. EduAir condenses it into notes you can actually read before you sleep.",
  },
  {
    q: "Q3",
    prompt: "Don&apos;t know what you don&apos;t know?",
    answer:
      "The Quiz Engine builds a test from your own chapters and shows you the gaps before your teacher does.",
  },
  {
    q: "Q4",
    prompt: "Notes scattered across five different apps?",
    answer:
      "Every subject lives in one place, searchable at 11pm the night before the exam.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Namaste 👋 I'm Air, your EduAir AI tutor. Give me a topic from your syllabus and I'll break it down." },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const updated = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(updated);
    setChatInput("");

    let reply = "Noted — I'm mapping that against your syllabus now. Ask me to turn it into a quiz or a one-page summary any time.";
    const lower = userMsg.toLowerCase().trim();

    if (lower === "hi" || lower === "hello") {
      reply = "Namaste! Drop a topic, formula, or chapter name and let's get through it together.";
    } else if (lower.includes("chemical") || lower.includes("reaction")) {
      reply = "Chemical reactions — I can balance the equation and separate decomposition, displacement, and redox for your Class 10 SEE prep.";
    }

    setTimeout(() => {
      setChatMessages([...updated, { sender: "ai", text: reply }]);
    }, 600);
  };

  return (
    <main className="landing-v2 relative min-h-screen bg-[#0B0A08] text-[#EDE4D3] font-sans selection:bg-[#C6362E]/30 overflow-x-hidden antialiased">
      <Grain />

      {/* warm top-down spotlight, replaces the blue glow orbs */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 0%, rgba(198,54,46,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(237,228,211,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,228,211,0.035) 1px, transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
          maskImage: "radial-gradient(ellipse 60% 45% at 50% 8%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 45% at 50% 8%, #000 60%, transparent 100%)",
        }}
      />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A08]/80 backdrop-blur-md border-b border-[#2A251E]"
      >
        <div className="h-16 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group min-w-0">
            <span className="h-7 w-7 shrink-0 rounded-full border border-[#C6362E]/70 flex items-center justify-center font-serif text-[13px] text-[#E2483D]">
              E
            </span>
            <span className="font-serif text-lg tracking-tight text-[#EDE4D3] truncate">
              EduAir<span className="text-[#E2483D]">.ai</span>
            </span>
            <span className="hidden sm:inline text-[10px] font-mono text-[#6B6156] border-l border-[#2A251E] pl-2.5 whitespace-nowrap uppercase tracking-wider">
              Symbol No. — Set 2083
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] font-mono uppercase tracking-wide text-[#9A8F7C]">
            {[
              { href: "#marking-scheme", label: "Features" },
              { href: "#workspace", label: "Workspace" },
              { href: "#about", label: "About" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="relative group/link hover:text-[#EDE4D3] transition-colors">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C6362E] transition-all duration-300 group-hover/link:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LoginButton
              label="Open Dashboard"
              showIcon={false}
              className="hidden sm:block bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-sm px-4 py-2 rounded-full transition-all text-center"
            />
            <LoginButton
              label="Login"
              showIcon={false}
              className="sm:hidden bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-xs px-3.5 py-2 rounded-full transition-all text-center"
            />

            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full border border-[#2A251E] bg-[#16130F] text-[#EDE4D3]"
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

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-b border-[#2A251E] bg-[#0B0A08]/95 backdrop-blur-md"
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {[
                  { href: "#marking-scheme", label: "Features" },
                  { href: "#workspace", label: "Workspace" },
                  { href: "#about", label: "About" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-mono uppercase tracking-wide text-[#9A8F7C] hover:text-[#EDE4D3] py-2.5 px-2 rounded-lg hover:bg-[#16130F] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-1">
                  <LoginButton
                    label="Open Dashboard"
                    showIcon={false}
                    className="w-full bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-sm px-4 py-2.5 rounded-full transition-all text-center block"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3.5 py-1.5 border border-[#2A251E] rounded-full font-mono text-[10px] sm:text-[11px] text-[#9A8F7C] mb-8 uppercase tracking-widest max-w-[92vw] sm:max-w-none"
        >
          <span>🇳🇵 Made in Nepal</span>
          <span className="text-[#2A251E]">•</span>
          <span className="text-[#E2483D]">Built for NEB &amp; SEE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-serif text-[2.6rem] xs:text-5xl sm:text-7xl font-medium tracking-tight text-[#EDE4D3] leading-[1.08] mb-7 px-1"
        >
          Study smarter.
          <br />
          <span className="italic text-[#E2483D]">Walk in ready.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="text-[#9A8F7C] max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-10"
        >
          EduAir turns your NEB and SEE syllabus into a tutor that explains, notes that summarize,
          and quizzes that match what&apos;s actually on the paper.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3.5"
        >
          <LoginButton
            label="Start studying — it&apos;s free"
            showIcon={false}
            className="w-full sm:w-auto bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all text-center block"
          />
          <a
            href="#marking-scheme"
            className="w-full sm:w-auto border border-[#2A251E] text-[#9A8F7C] hover:text-[#EDE4D3] hover:border-[#3a3327] text-sm font-medium px-7 py-3.5 rounded-full transition-all block text-center"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-7 text-[11px] font-mono text-[#6B6156] uppercase tracking-wider select-none"
        >
          No credit card — works on any phone
        </motion.div>
      </section>

      <hr className="border-[#2A251E] max-w-7xl mx-auto" />

      {/* 01 — THE BLANK PAGE */}
      <section className="px-4 py-24 max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] font-mono text-[#E2483D] uppercase tracking-[0.2em] mb-5">01 — Before EduAir</p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#EDE4D3] leading-snug mb-6">
            Every board exam starts the same way — a blank page, and a syllabus you didn&apos;t quite finish.
          </h2>
          <p className="text-[#9A8F7C] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Notes spread across a dozen PDFs. A group chat full of panic the week before SEE.
            Cramming three chapters the night before, with no way to know what you&apos;ve actually missed.
          </p>
        </Reveal>
      </section>

      <hr className="border-[#2A251E] max-w-7xl mx-auto" />

      {/* 02 — MARKING SCHEME (signature section) */}
      <section id="marking-scheme" className="px-4 sm:px-8 py-24 max-w-3xl mx-auto scroll-mt-20">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-mono text-[#E2483D] uppercase tracking-[0.2em] mb-5">02 — How EduAir Marks You Up</p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#EDE4D3] leading-snug">
            Four gaps between what you know and what&apos;s on the paper — closed.
          </h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-[#2A251E] border-y border-[#2A251E]">
          {markingRows.map((row, i) => (
            <Reveal key={row.q} delay={i * 0.05} y={16} className="py-7 sm:py-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <span className="font-serif italic text-[#6B6156] text-sm pt-1 w-7 shrink-0">{row.q}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#EDE4D3] font-medium text-[15px] sm:text-base mb-1.5">{row.prompt}</p>
                  <p className="text-[#9A8F7C] text-sm leading-relaxed">{row.answer}</p>
                </div>
                <InkCheck delay={0.15} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="border-[#2A251E] max-w-7xl mx-auto" />

      {/* 03 — FULL MARKS / WORKSPACE SIMULATOR */}
      <Reveal>
        <section id="workspace" className="px-4 sm:px-8 py-24 max-w-5xl mx-auto scroll-mt-20">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono text-[#E2483D] uppercase tracking-[0.2em] mb-5">03 — See It In Action</p>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#EDE4D3]">Your workspace, open to page one.</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-3 sm:gap-4 bg-[#0f0d0a] border border-[#2A251E] rounded-2xl p-2.5 sm:p-3 min-h-[400px]">
            <div className="md:col-span-1 flex md:flex-col gap-1 overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-[#2A251E] pb-3 md:pb-0 md:pr-3">
              {[
                { id: "chat", label: "Tutor — Air" },
                { id: "doc", label: "Summarizer" },
                { id: "quiz", label: "Quiz Engine" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 md:w-full text-left text-[11px] sm:text-xs font-mono whitespace-nowrap px-3 py-2.5 rounded-xl transition-colors ${activeTab === tab.id ? "text-[#E2483D]" : "text-[#6B6156] hover:text-[#9A8F7C]"}`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="simulator-tab-highlight"
                      className="absolute inset-0 bg-[#C6362E]/[0.08] border border-[#C6362E]/25 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

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
                            <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed border ${msg.sender === "user" ? "bg-[#C6362E]/[0.08] border-[#C6362E]/20 text-[#EDE4D3]" : "bg-[#16130F] border-[#2A251E] text-[#9A8F7C]"}`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2 bg-[#16130F] border border-[#2A251E] rounded-xl p-1.5 focus-within:border-[#3a3327] transition-all">
                      <input
                        type="text"
                        placeholder="Type 'chemical reactions' or your query..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-transparent text-xs text-[#EDE4D3] outline-none pl-2.5 placeholder-[#6B6156]"
                      />
                      <button type="submit" className="bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all">
                        Send
                      </button>
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
                    className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-[#2A251E] rounded-2xl bg-[#0B0A08]/40 h-full"
                  >
                    <span className="text-2xl mb-2">📄</span>
                    <p className="text-xs text-[#EDE4D3] font-medium">Drop a chapter or past paper here</p>
                    <p className="text-[10px] text-[#6B6156] font-mono mt-1 uppercase tracking-wide">PDF, DOCX up to 16MB</p>
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
                    <div className="p-3.5 bg-[#0B0A08]/40 border border-[#2A251E] rounded-xl">
                      <p className="text-xs font-medium text-[#EDE4D3]">Q1. Which of the following is a displacement reaction?</p>
                      <div className="mt-2.5 space-y-1.5">
                        <div className="w-full text-left text-[11px] p-2 rounded-lg bg-[#16130F] border border-[#2A251E] text-[#6B6156]">A) 2H2 + O2 -&gt; 2H2O</div>
                        <div className="flex items-center gap-2 w-full text-left text-[11px] p-2 rounded-lg bg-[#C6362E]/[0.06] border border-[#C6362E]/25 text-[#EDE4D3] font-medium">
                          <InkCheck size={16} delay={0.1} />
                          B) Fe + CuSO4 -&gt; FeSO4 + Cu
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </Reveal>

      <hr className="border-[#2A251E] max-w-7xl mx-auto" />

      {/* 04 — ABOUT */}
      <section id="about" className="px-4 py-24 max-w-3xl mx-auto text-center scroll-mt-10">
        <Reveal>
          <p className="text-[11px] font-mono text-[#E2483D] uppercase tracking-[0.2em] mb-5">04 — Built Where It&apos;s Used</p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#EDE4D3] mb-6 leading-snug">
            Built in Nepal, for the Nepali curriculum.
          </h2>
          <p className="text-[#9A8F7C] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Not a generic AI wrapper. EduAir is written directly against the NEB and SEE syllabus,
            by a student who sat the same exams — so what it teaches you is what you&apos;ll actually be asked.
          </p>
        </Reveal>
      </section>

      <hr className="border-[#2A251E] max-w-7xl mx-auto" />

      {/* 05 — FINAL CTA */}
      <section className="px-4 py-24 max-w-2xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] font-mono text-[#E2483D] uppercase tracking-[0.2em] mb-5">05 — Ready When You Are</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#EDE4D3] mb-8 leading-tight">
            Your next result starts with tonight&apos;s revision.
          </h2>
          <LoginButton
            label="Start studying — it&apos;s free"
            showIcon={false}
            className="inline-block bg-[#C6362E] hover:bg-[#AD2E27] text-white font-semibold text-sm px-8 py-4 rounded-full transition-all text-center"
          />
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="px-4 sm:px-8 py-8 border-t border-[#2A251E] text-center text-xs max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[10px] text-[#6B6156] uppercase tracking-wide">© 2026 EduAir AI. All rights reserved.</p>
        <div className="flex items-center gap-4 font-mono text-[10px] text-[#6B6156] uppercase tracking-wide">
          <Link href="/privacy" className="hover:text-[#9A8F7C] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#9A8F7C] transition-colors">Terms</Link>
          <Link href="/cookies" className="hover:text-[#9A8F7C] transition-colors">Cookies</Link>
        </div>
        <p className="font-mono text-[11px] text-[#9A8F7C]">Prepared in Nepal 🇳🇵 by <span className="text-[#E2483D] font-semibold">Nirmal Airee</span></p>
      </footer>
    </main>
  );
}
