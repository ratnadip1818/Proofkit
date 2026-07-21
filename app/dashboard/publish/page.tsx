import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WidgetBuilder from "./widget-builder";

export const metadata = {
  title: "Publish & Design Widgets — Blovi",
  description: "Customize and build social proof widgets including Wall of Love, Marquee, and Carousels.",
};

export default async function WidgetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  const planTier = profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free");
  const isPaid = planTier === "pro" || planTier === "business";

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags"
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-[#F5F4F1]">
      <WidgetBuilder
        userId={user.id}
        isLifetime={isPaid}
        email={user.email}
        testimonials={testimonials ?? []}
      />
    </div>
  );
}
