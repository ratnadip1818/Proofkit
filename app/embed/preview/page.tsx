import { createAdminClient } from "@/lib/supabase/admin";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";

/**
 * Dashboard-only dynamic preview surface.
 * Bypasses cached customer-facing routes so layout and style switches render instantly
 * on the server without any cached static fallback or visual flashing.
 */
export const dynamic = "force-dynamic";

export default async function EmbedPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sParams = await searchParams;
  const userId = typeof sParams.user === "string" ? sParams.user : undefined;

  let testimonials: Testimonial[] = SAMPLE_TESTIMONIALS;
  let isLifetime = false;

  if (userId && userId !== "demo-widget") {
    const supabase = createAdminClient();
    const [testimonialsRes, profileRes] = await Promise.all([
      supabase
        .from("testimonials")
        .select("id, author_name, author_role, body_original, display_body, rating, avatar_url, created_at, tags")
        .eq("user_id", userId)
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("is_lifetime, plan_tier")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    if (testimonialsRes.data && testimonialsRes.data.length > 0) {
      testimonials = testimonialsRes.data as Testimonial[];
    }
    const profile = profileRes.data;
    isLifetime = profile?.is_lifetime === true || profile?.plan_tier === "pro" || profile?.plan_tier === "business";
  }

  return <WidgetClientWrapper testimonials={testimonials} isLifetime={isLifetime} searchParams={sParams} />;
}
