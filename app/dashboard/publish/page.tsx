import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WidgetHubClient from "./widget-hub-client";

export const metadata = {
  title: "Publish & Design Widgets — Blovi",
  description: "Create and publish high-converting social proof widgets including Wall of Love, Orbit, and Card Spotlight.",
};

export default async function WidgetsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; widgetId?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let profile: { is_lifetime?: boolean; plan_tier?: string; full_name?: string | null } | null = null;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
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

  const planTier = profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free");
  const isPaid = planTier === "pro" || planTier === "business";

  // Fetch approved testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags"
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Fetch all saved created widgets for this user
  const { data: savedWidgets } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <WidgetHubClient
      userId={user.id}
      isLifetime={isPaid}
      email={user.email}
      fullName={profile?.full_name}
      testimonials={testimonials ?? []}
      savedWidgets={savedWidgets ?? []}
      initialTab={sp.tab || "saved"}
      initialWidgetId={sp.widgetId || null}
    />
  );
}
