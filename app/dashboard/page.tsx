import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeWorkspaceClient from "./home-workspace-client";

export const metadata = {
  title: "Overview — Blovi",
  description: "View your campaign performance, setup checklist, and moderate testimonials in real-time.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch form configuration and testimonials in parallel
  const [{ data: form }, { data: testimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select("id, status, rating, display_body, author_name, author_role, avatar_url, created_at")
      .eq("user_id", user.id),
  ]);

  // Fetch user profile information
  let profile: { full_name?: string | null } | null = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileData) {
    profile = profileData;
  }

  return (
    <div className="max-w-[960px] mx-auto p-6 md:p-12">
      <HomeWorkspaceClient
        user={{ id: user.id, email: user.email }}
        form={form}
        testimonials={testimonials ?? []}
        profile={profile}
        appUrl={APP_URL}
      />
    </div>
  );
}
