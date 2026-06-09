import { createAdminClient } from "@/lib/supabase/admin";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, body_original, rating, created_at")
    .eq("user_id", userId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500, headers: CORS }
    );
  }

  return Response.json(data, { headers: CORS });
}
