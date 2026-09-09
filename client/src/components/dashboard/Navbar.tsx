"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      
      {/* Logo */}
      <div
        className="font-bold text-xl cursor-pointer"
        onClick={() => router.push("/")}
      >
        EduAir AI
      </div>

      {/* Links */}
      <div className="flex gap-6 text-sm">
        <button onClick={() => router.push("/features")}>Features</button>
        <button onClick={() => router.push("/pricing")}>Pricing</button>
        <button onClick={() => router.push("/schools")}>For Schools</button>
        <button onClick={() => router.push("/about")}>About EduAir</button>
        <button onClick={() => router.push("/contact")}>Contact</button>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Dashboard
      </button>
    </nav>
  );
}