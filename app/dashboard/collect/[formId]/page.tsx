import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectWorkspaceClient from "../collect-workspace-client";

export const metadata = {
  title: "Customize Form — ProofKit",
  description: "Customize your testimonial collection form, questions, colors, and branding.",
};

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: form, error } = await supabase
    .from("forms")
    .select(
      "id, slug, headline, prompt, thank_you_message, theme_color, collect_photo, collect_rating, require_consent, custom_domain, custom_css, custom_font"
    )
    .eq("id", formId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !form) {
    redirect("/dashboard/collect");
  }

  return (
    <CollectWorkspaceClient
      user={{ id: user.id, email: user.email }}
      form={{
        id: form.id,
        slug: form.slug,
        headline: form.headline ?? "Tell us what stood out",
        prompt:
          form.prompt ??
          "A sentence or two is plenty. Your words help others decide, and they genuinely make our day.",
        thank_you_message:
          form.thank_you_message ??
          "Thank you for taking the time to share this. Every word helps us improve and helps others find us. We're so glad to have you with us.",
        theme_color: form.theme_color ?? "#2563EB",
        collect_photo: !!form.collect_photo,
        collect_rating: form.collect_rating ?? true,
        require_consent: form.require_consent ?? true,
        custom_domain: form.custom_domain || null,
        custom_css: (form as any).custom_css || null,
        custom_font: form.custom_font || "Inter",
      }}
      appUrl={APP_URL}
    />
  );
}
