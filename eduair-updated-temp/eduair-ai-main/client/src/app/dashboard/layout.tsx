import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Secure all child execution contexts down-tree
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#030712] text-slate-100 font-sans antialiased selection:bg-indigo-500/30 relative">
      
      {/* GLOBAL BACKGROUND INTERFACE MATRIX FRAME */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_0.8px,transparent_0.8px),linear-gradient(to_bottom,#0f172a_0.8px,transparent_0.8px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-25 z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.01] rounded-full blur-[130px] pointer-events-none z-0" />

      {/* CORE CONTROL SIDEBAR DISPLAY */}
      <aside className="relative z-20 shrink-0 border-r border-slate-900/60 bg-[#030712]/40 backdrop-blur-xl">
        <Sidebar userEmail={user.email ?? ""} />
      </aside>

      {/* INTERACTIVE WORKSPACE MAIN PORT */}
      <div className="flex-1 relative z-10 overflow-y-auto min-w-0">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
      
    </div>
  );
}