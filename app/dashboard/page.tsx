import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkLimits } from "@/lib/limits";
import { getWorkspaceStats } from "@/lib/tracking";
import HomeWorkspaceClient from "./home-workspace-client";

export const metadata = {
  title: "Dashboard — Blovi",
  description: "View incoming proof, take immediate moderation action, and monitor live website widgets.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch form configuration, testimonials, profile, limits, and tracking in parallel
  const [
    { data: form },
    { data: testimonials },
    { data: profileData },
    limits,
    trackingStats,
  ] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug, custom_domain, headline")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select(
        "id, status, rating, display_body, body_original, author_name, author_role, author_company, avatar_url, created_at, tags, source"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("full_name, plan_tier, is_lifetime")
      .eq("id", user.id)
      .maybeSingle(),
    checkLimits(user.id),
    getWorkspaceStats(user.id),
  ]);

  return (
    <div className="w-full">
      <HomeWorkspaceClient
        user={{ id: user.id, email: user.email }}
        form={form}
        testimonials={testimonials ?? []}
        profile={profileData}
        limits={limits}
        trackingStats={trackingStats}
        appUrl={APP_URL}
      />
    </div>
  );
}
