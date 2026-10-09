import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyTierLimits, getWidgetOwnerPlan } from "@/lib/widget-tier";

export const runtime = "edge"; // Runs on the Vercel Edge Network

export async function GET(
  request: Request,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  const { widgetId } = await params;
  const supabase = createAdminClient();

  const [testimonialsRes, plan] = await Promise.all([
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags, source"
      )
      .eq("user_id", widgetId)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    getWidgetOwnerPlan(widgetId),
  ]);

  if (testimonialsRes.error) {
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 });
  }

  const { testimonials: limitedTestimonials } = applyTierLimits({
    plan,
    testimonials: testimonialsRes.data ?? [],
  });

  return NextResponse.json(limitedTestimonials, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allows embedding on any client website
      "Access-Control-Allow-Methods": "GET",
      // Cache-Control: Cache at edge for 1 hour, stale-while-revalidate for 60 seconds
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
    },
  });
}
