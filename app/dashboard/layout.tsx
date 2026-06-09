import { createClient } from "@/lib/supabase/server";
import DashboardNav from "./dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      <DashboardNav email={user?.email ?? null} />
      <main className="w-full">{children}</main>
    </div>
  );
}
