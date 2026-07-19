import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ManageWorkspaceClient from "./manage-workspace-client";

export const metadata = {
  title: "Manage Reviews — Blovi",
  description: "Moderate, approve, archive, tag, and organize your collected user testimonials.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function ManagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: rawTestimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, display_body, rating, status, created_at, avatar_url, tags, source"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const formUrl = form ? `${APP_URL}/c/${form.slug}` : null;

  return (
    <ManageWorkspaceClient
      user={{ id: user.id, email: user.email }}
      testimonials={rawTestimonials ?? []}
      formUrl={formUrl}
    />
  );
}
