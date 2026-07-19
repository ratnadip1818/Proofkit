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

  let profile: { is_lifetime?: boolean; plan_tier?: string; full_name: string | null } | null = null;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    // Fallback if database migration hasn't been applied yet
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime, full_name")
      .eq("id", user.id)
      .maybeSingle();
    
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
        full_name: fallbackData.full_name,
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  // Onboarding is complete once a name is saved — until then, every
  // dashboard route funnels back through the onboarding flow.
  if (!profile?.full_name) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <DashboardSidebar
        email={user?.email ?? null}
        fullName={profile?.full_name ?? null}
        planTier={profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free")}
      />
      {/* Offset: sidebar width 64 (16rem) on md+, top bar height on mobile */}
      <main className="md:pl-64 pt-14 md:pt-0 min-h-screen bg-canvas">
        {children}
      </main>
    </div>
  );
}
