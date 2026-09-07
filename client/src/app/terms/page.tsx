import Link from "next/link";

export const metadata = {
  title: "Terms of Service — EduAir AI",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#0B0A08] text-[#EDE4D3] px-6 py-16 antialiased">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-xs font-mono text-[#E2483D] hover:underline">
          ← Back to EduAir.ai
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-[#9A8F7C]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#C7BCA8]">
          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">1. Acceptance of terms</h2>
            <p className="mt-2">
              By creating an account or using EduAir AI, you agree to these Terms of Service. If
              you don’t agree, please don’t use the platform.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">2. What EduAir AI is</h2>
            <p className="mt-2">
              EduAir AI is an AI-powered study platform for NEB/SEE students in Nepal, offering
              AI chat, quiz generation, notes, PDF summarization, model question sets, and study
              planning. Content is generated using AI (Gemini and fallback providers) and is
              intended as a study aid, not a substitute for official NEB/CDC materials or your
              school’s curriculum.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">3. AI-generated content accuracy</h2>
            <p className="mt-2">
              While we design our AI features to closely follow real NEB/SEE exam patterns and
              marking schemes, AI-generated content can contain errors, outdated information, or
              inaccuracies. Always verify important content (formulas, dates, marking schemes)
              against official NEB/CDC sources before relying on it for exam preparation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">4. Accounts</h2>
            <p className="mt-2">
              You’re responsible for keeping your account credentials secure and for all activity
              under your account. You must provide accurate information when signing up.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">5. Usage limits & fair use</h2>
            <p className="mt-2">
              Free and Pro accounts are subject to daily usage limits per feature, shown on our
              Pricing page. We may adjust these limits to keep the platform sustainable and
              available to all users. Attempting to circumvent rate limits (e.g. via automation
              or multiple accounts) may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">6. Payments (EduAir Pro)</h2>
            <p className="mt-2">
              EduAir Pro is a paid subscription processed via eSewa. Subscriptions are billed as
              described on the Pricing page at the time of purchase. Payments are generally
              non-refundable once your Pro access has been activated, except where required by
              law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">7. Acceptable use</h2>
            <p className="mt-2">
              Don’t use EduAir AI to generate harmful, harassing, or academically dishonest
              content beyond normal study aid use (e.g. impersonating official NEB materials for
              distribution as if they were real board-published papers), attempt to compromise
              platform security, or resell/redistribute the service without permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">8. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate accounts that violate these terms. You may stop using
              the service and request account deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">9. Limitation of liability</h2>
            <p className="mt-2">
              EduAir AI is provided “as is” without warranties of any kind. We are not liable for
              exam outcomes, decisions made based on AI-generated content, or service
              interruptions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">10. Changes to these terms</h2>
            <p className="mt-2">
              We may update these terms as the platform evolves. Continued use after changes
              means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">11. Contact</h2>
            <p className="mt-2">
              Questions? Reach out via the{" "}
              <Link href="/contact" className="text-[#E2483D] hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
