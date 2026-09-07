import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — EduAir AI",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0B0A08] text-[#EDE4D3] px-6 py-16 antialiased">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-xs font-mono text-[#E2483D] hover:underline">
          ← Back to EduAir.ai
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#9A8F7C]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#C7BCA8]">
          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">1. What we collect</h2>
            <p className="mt-2">
              When you create an account on EduAir AI, we collect your name, email address, and
              (if you sign in with Google) your Google profile info via Supabase Auth. We store
              content you generate or upload — quizzes, notes, study plans, PDF summaries, model
              question sets, and chat history — so you can access it later from your dashboard.
            </p>
            <p className="mt-2">
              If you subscribe to EduAir Pro, we store payment records (transaction ID, amount,
              plan, and status) needed to verify and manage your subscription. We do not store
              your eSewa password or full payment credentials — those are handled directly by
              eSewa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">2. How we use it</h2>
            <p className="mt-2">
              We use your data to run the core features of EduAir AI: generating AI study
              content via the Gemini API, tracking your usage against daily rate limits, managing
              your Pro subscription status, and improving the product based on aggregate,
              non-identifying usage patterns.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">3. Third parties</h2>
            <p className="mt-2">
              We use Supabase for authentication and database storage, Google Gemini (and
              fallback AI providers) to generate content, Vercel for hosting, and eSewa for
              payment processing. Each of these providers processes data under their own privacy
              policies. We do not sell your personal data to advertisers or data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">4. Data retention & deletion</h2>
            <p className="mt-2">
              We retain your account data and generated content for as long as your account is
              active. You can request deletion of your account and associated data at any time
              by contacting us — see the Contact page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">5. Security</h2>
            <p className="mt-2">
              Your data is protected using Supabase’s row-level security, meaning your content is
              only accessible to your authenticated account. We use HTTPS for all traffic and do
              not store plaintext passwords when you sign in via Google OAuth.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">6. Children’s privacy</h2>
            <p className="mt-2">
              EduAir AI is built for NEB/SEE students, many of whom are minors. We only collect
              the minimum data needed to operate the platform and do not use student data for
              targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">7. Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy as EduAir AI evolves. Material changes will be reflected
              by updating the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">8. Contact</h2>
            <p className="mt-2">
              Questions about this policy? Reach out via the{" "}
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
