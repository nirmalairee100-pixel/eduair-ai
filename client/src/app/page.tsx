import Background from "@/components/landing/Background";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Background />
      <Navbar user={user} />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}