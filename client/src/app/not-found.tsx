import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0A08] px-6 text-center text-[#EDE4D3] antialiased">
      <div className="max-w-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E2483D]">
          Marking Scheme Engine
        </p>
        <h1 className="mt-3 font-serif text-6xl font-bold">404</h1>
        <p className="mt-3 font-serif text-lg text-[#EDE4D3]">
          This page didn&apos;t make the marking scheme.
        </p>
        <p className="mt-2 text-sm text-[#9A8F7C]">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#C6362E] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#AD2E27]"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#2A251E] px-5 py-2.5 text-sm font-semibold text-[#C7BCA8] transition-all hover:border-[#3A342A] hover:text-[#EDE4D3]"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
