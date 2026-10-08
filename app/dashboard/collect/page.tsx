import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormsHubClient from "./forms-hub-client";

export const metadata = {
  title: "Your Forms — ProofKit",
  description: "Use forms to collect testimonials and feedback from your customers.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function CollectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all review collection forms and testimonial activity for this user
  const [formsResult, testimonialsResult] = await Promise.all([
    supabase
      .from("forms")
      .select(
        "id, slug, headline, prompt, thank_you_message, theme_color, collect_photo, collect_rating, require_consent, custom_domain, custom_css, custom_font, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("testimonials")
      .select("id, form_id, status, rating, created_at")
      .eq("user_id", user.id),
  ]);

  if (formsResult.error) {
    console.error("Error fetching forms:", formsResult.error);
  }

  const forms = formsResult.data || [];
  const testimonials = testimonialsResult.data || [];

  return (
    <FormsHubClient
      user={{ id: user.id, email: user.email }}
      forms={forms}
      testimonials={testimonials}
      appUrl={APP_URL}
    />
  );
}
