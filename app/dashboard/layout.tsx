import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "./dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_lifetime, full_name")
    .eq("id", user.id)
    .maybeSingle();

  // Onboarding is complete once a name is saved — until then, every
  // dashboard route funnels back through the onboarding flow.
  if (!profile?.full_name) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <DashboardSidebar
        email={user?.email ?? null}
        isLifetime={profile.is_lifetime ?? false}
      />
      {/* Offset: sidebar width on md+, top bar height on mobile */}
      <main className="md:pl-64 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
