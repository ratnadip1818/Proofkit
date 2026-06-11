import { createClient } from "@/lib/supabase/server";
import { getPlanStatus, getTrialDaysLeft, type PlanStatus } from "@/lib/plan";
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

  let planStatus: PlanStatus = "trial";
  let daysLeft = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_lifetime, created_at")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) {
      planStatus = getPlanStatus(profile);
      daysLeft = getTrialDaysLeft(profile);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <DashboardSidebar
        email={user?.email ?? null}
        planStatus={planStatus}
        daysLeft={daysLeft}
      />
      {/* Offset: sidebar width on md+, top bar height on mobile */}
      <main className="md:pl-64 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
