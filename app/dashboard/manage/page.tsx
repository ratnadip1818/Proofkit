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

  const [{ data: forms }, { data: rawTestimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug, headline")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, author_company, body_original, body_improved, display_body, is_ai_improved, rating, status, created_at, avatar_url, tags, source, form_id"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const primaryForm = forms?.[0];
  const formUrl = primaryForm ? `${APP_URL}/c/${primaryForm.slug}` : null;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8">
        <ManageWorkspaceClient
          user={{ id: user.id, email: user.email }}
          testimonials={rawTestimonials ?? []}
          forms={forms ?? []}
          formUrl={formUrl}
        />
      </div>
    </div>
  );
}
