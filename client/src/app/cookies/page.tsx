import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — EduAir AI",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0B0A08] text-[#EDE4D3] px-6 py-16 antialiased">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-xs font-mono text-[#E2483D] hover:underline">
          ← Back to EduAir.ai
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-bold">Cookie Policy</h1>
        <p className="mt-2 text-sm text-[#9A8F7C]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#C7BCA8]">
          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">What cookies we use</h2>
            <p className="mt-2">
              EduAir AI uses cookies set by Supabase Auth to keep you signed in between visits.
              These are strictly necessary cookies — the site can't authenticate you without
              them. We don't use third-party advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">Session cookies</h2>
            <p className="mt-2">
              When you sign in (including via Google OAuth), Supabase sets secure, HTTP-only
              cookies containing your session token. These are used to verify your identity on
              each request to keep your dashboard, generated content, and Pro status accessible.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">Managing cookies</h2>
            <p className="mt-2">
              Because our cookies are essential for authentication, disabling them in your
              browser will prevent you from staying signed in to EduAir AI. If you clear your
              browser's cookies, you'll simply need to sign in again.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">Changes</h2>
            <p className="mt-2">
              If we ever introduce analytics or other non-essential cookies, we'll update this
              page and, where required, ask for your consent first.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-[#EDE4D3]">Contact</h2>
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
