import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge"; // Runs on the Vercel Edge Network

export async function GET(
  request: Request,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  const { widgetId } = await params;
  const supabase = createAdminClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags, source"
    )
    .eq("user_id", widgetId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 });
  }

  return NextResponse.json(testimonials ?? [], {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allows embedding on any client website
      "Access-Control-Allow-Methods": "GET",
      // Instant updates: Disable stale CDN caching
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}
