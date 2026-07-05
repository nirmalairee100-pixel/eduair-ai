"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <h1
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")}
        >
          EduAir AI
        </h1>

        <div className="flex gap-6 text-sm">
          <button onClick={() => router.push("/features")}>Features</button>
          <button onClick={() => router.push("/pricing")}>Pricing</button>
          <button onClick={() => router.push("/schools")}>For Schools</button>
          <button onClick={() => router.push("/about")}>About</button>
          <button onClick={() => router.push("/contact")}>Contact</button>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Dashboard
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center px-6 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          The AI Study Companion Built for Nepal 🇳🇵
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Chat with AI, generate quizzes, summarize PDFs, create notes, and
          master the Nepali syllabus with EduAir AI.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue with Google
          </button>

          <button
            onClick={() => router.push("/features")}
            className="border px-6 py-3 rounded-lg"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-12 text-center">
        <div>
          <h2 className="text-2xl font-bold">10,000+</h2>
          <p className="text-gray-600">Students</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">500K+</h2>
          <p className="text-gray-600">Questions Solved</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">50K+</h2>
          <p className="text-gray-600">Quizzes Generated</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">100+</h2>
          <p className="text-gray-600">Schools</p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Powerful AI Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">🤖 AI Chat Tutor</h3>
            <p className="text-gray-600 mt-2">
              Ask anything and get instant explanations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">📄 PDF Summarizer</h3>
            <p className="text-gray-600 mt-2">
              Turn long PDFs into simple notes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">🧠 Quiz Generator</h3>
            <p className="text-gray-600 mt-2">
              Generate MCQs for any topic instantly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">📝 Notes Maker</h3>
            <p className="text-gray-600 mt-2">
              Convert topics into simple study notes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">📚 SEE Preparation</h3>
            <p className="text-gray-600 mt-2">
              Focused learning for Nepali students.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg">📊 Progress Tracking</h3>
            <p className="text-gray-600 mt-2">
              Track your learning progress easily.
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Your AI Dashboard
        </h2>

        <p className="text-gray-600 mt-2">
          Everything you need in one place
        </p>

        <div className="mt-6 border rounded-lg p-10 bg-gray-100 max-w-4xl mx-auto">
          <p className="text-gray-500">
            (Dashboard preview goes here — replace with screenshot)
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Open Dashboard
        </button>
      </section>

      {/* ABOUT */}
      <section className="px-6 py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold">Why EduAir AI?</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          EduAir AI was built in Nepal to help students learn smarter using AI.
          Unlike generic tools, it is designed specifically for the NEB syllabus.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t text-center text-sm text-gray-600">
        <p>© 2026 EduAir AI. All rights reserved.</p>
        <p>Founded by Nirmal Airee</p>
      </footer>

    </main>
  );
}