import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mt-4">Contact Us</h1>
          <p className="text-lg text-slate-600 mt-3 max-w-2xl">
            Questions about EduAir AI? Want to partner with us? Or just have feedback? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Email */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <Mail size={20} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Email</h3>
            </div>
            <p className="text-slate-600 mb-4">Fastest way to reach our team. We typically respond within 24 hours.</p>
            <a href="mailto:support@eduair-ai.com" className="font-medium text-indigo-600 hover:text-indigo-700">
              support@eduair-ai.com →
            </a>
          </div>

          {/* Discord */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <MessageSquare size={20} className="text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Community Discord</h3>
            </div>
            <p className="text-slate-600 mb-4">Join our student community, ask questions, and connect with others using EduAir.</p>
            <a href="https://discord.gg/eduairai" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-600 hover:text-violet-700">
              Join Discord →
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How much does EduAir cost?</h3>
              <p className="text-slate-600">
                EduAir AI is free to start. Our free tier includes AI chat tutoring, basic quizzes, and document summarization. Premium Pro tier is NPR 499/month for unlimited features and priority support.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Which curriculum does EduAir cover?</h3>
              <p className="text-slate-600">
                We specialize in Nepal's NEB (National Examination Board) and SEE (Secondary Education Examination) curricula for Classes 8–10. Content is tailored specifically to what you'll be tested on.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I use EduAir offline?</h3>
              <p className="text-slate-600">
                Currently, EduAir requires an internet connection. However, you can download your notes and summaries as PDFs for offline access.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Is my data safe?</h3>
              <p className="text-slate-600">
                Yes. We use Supabase's industry-standard encryption and authentication. Your conversations and documents are private to your account. See our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> for full details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Do you offer school licenses?</h3>
              <p className="text-slate-600">
                Yes! Schools, coaching centers, and educational institutions can partner with us. <a href="mailto:schools@eduair-ai.com" className="text-indigo-600 hover:underline">Email schools@eduair-ai.com</a> for bulk pricing and institutional support.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Request Section */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-8 mb-16">
          <h2 className="text-xl font-bold text-indigo-900 mb-3">Have a feature request?</h2>
          <p className="text-indigo-800 mb-4">
            We're constantly improving EduAir based on student feedback. Got an idea? Send it our way and help shape the future of the platform.
          </p>
          <a href="mailto:feedback@eduair-ai.com" className="inline-block font-medium text-indigo-600 hover:text-indigo-700">
            Send Feedback →
          </a>
        </div>

        {/* Social Links */}
        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-600 mb-6">Follow EduAir on social media for updates and tips</p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://twitter.com/eduairai" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition text-2xl">
              𝕏
            </a>
            <a href="https://github.com/nirmalairee100-pixel/eduair-ai" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition text-2xl">
              🐙
            </a>
            <a href="https://instagram.com/eduairai" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition text-2xl">
              📸
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
