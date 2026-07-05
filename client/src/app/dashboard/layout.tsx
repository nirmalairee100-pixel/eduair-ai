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

  // Belt-and-suspenders: middleware already redirects signed-out users,
  // but double-checking here means every /dashboard/* page is safe even
  // if middleware config ever changes.
  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={user.email ?? ""} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
