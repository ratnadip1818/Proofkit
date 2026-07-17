import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectWorkspaceClient from "./collect-workspace-client";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function CollectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the primary review collection form for the user
  const { data: form, error } = await supabase
    .from("forms")
    .select(
      "id, slug, headline, prompt, thank_you_message, theme_color, collect_photo, collect_rating, require_consent, custom_domain"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching form:", error);
  }

  // Fallback if no form exists (though onboarding creates one)
  if (!form) {
    redirect("/dashboard");
  }

  return (
    <CollectWorkspaceClient
      user={{ id: user.id, email: user.email }}
      form={{
        id: form.id,
        slug: form.slug,
        headline: form.headline ?? "Leave a review",
        prompt: form.prompt ?? "Tell us what you think about our product.",
        thank_you_message: form.thank_you_message ?? "Thank you for your feedback!",
        theme_color: form.theme_color ?? "#E8743B",
        collect_photo: !!form.collect_photo,
        collect_rating: form.collect_rating ?? true,
        require_consent: form.require_consent ?? true,
        custom_domain: form.custom_domain || null,
      }}
      appUrl={APP_URL}
    />
  );
}
