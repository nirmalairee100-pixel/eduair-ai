import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/landing/LoginButton";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold">
          🚀 EduAir <span className="text-blue-500">AI</span>
        </h1>

        <nav className="hidden gap-8 md:flex">
          <a href="#" className="hover:text-blue-400">Features</a>
          <a href="#" className="hover:text-blue-400">Pricing</a>
          <a href="#" className="hover:text-blue-400">About</a>
          <a href="#" className="hover:text-blue-400">Contact</a>
        </nav>

        {user ? (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  );
}