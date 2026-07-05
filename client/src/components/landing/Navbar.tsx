import Link from "next/link";
import LoginButton from "@/components/landing/LoginButton";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
            🚀
          </div>
          <span className="text-lg font-bold text-slate-900">
            EduAir <span className="text-indigo-600">AI</span>
          </span>
        </div>

        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          <a href="#schools" className="hover:text-indigo-600">For Schools</a>
          <a href="#about" className="hover:text-indigo-600">About</a>
          <a href="#contact" className="hover:text-indigo-600">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <button className="hidden text-sm font-medium text-slate-600 hover:text-indigo-600 sm:block">
                Login
              </button>
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
