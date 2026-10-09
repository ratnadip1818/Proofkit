import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_TESTIMONIAL_LIMIT } from "@/lib/limits";
import { logFormView } from "@/lib/tracking";
import CollectionForm from "./collection-form";

interface FormRow {
  id: string;
  user_id: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo?: boolean;
  collect_rating: boolean;
  require_consent: boolean;
  custom_css?: string | null;
  custom_font?: string | null;
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  let form: FormRow | null = null;
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .select(
      "id, user_id, headline, prompt, thank_you_message, theme_color, collect_photo, collect_rating, require_consent, custom_css, custom_font"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (formError && (formError.message.includes("custom_css") || formError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("forms")
      .select(
        "id, user_id, headline, prompt, thank_you_message, theme_color, collect_photo, collect_rating, require_consent"
      )
      .eq("slug", slug)
      .single();
    if (fallbackData) {
      form = {
        ...fallbackData,
        custom_css: null,
        custom_font: "Inter",
      };
    }
  } else if (formData) {
    form = formData;
  }

  if (!form) notFound();

  // Non-blocking privacy-friendly form view tracking
  logFormView(form.user_id, form.id).catch(() => {});

  // Free plan holds 3 testimonials total — show a friendly closed state
  // instead of letting visitors fill a form that will reject them
  const admin = createAdminClient();
  let ownerProfile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const [{ data: profileData, error: profileError }, { count }] = await Promise.all([
    admin.from("profiles").select("is_lifetime, plan_tier").eq("id", form.user_id).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", form.user_id),
  ]);

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await admin
      .from("profiles")
      .select("is_lifetime")
      .eq("id", form.user_id)
      .maybeSingle();
    if (fallbackData) {
      ownerProfile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    ownerProfile = profileData;
  }

function parseFormMetadata(customCss?: string | null): {
  heading_font?: string;
  body_font?: string;
} {
  if (!customCss) return {};
  try {
    const match = customCss.match(/\/\* __BLOVI_CONFIG__=([\s\S]*?) \*\//);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch {}
  return {};
}

  const isPaid = ownerProfile?.is_lifetime === true || ownerProfile?.plan_tier === "pro" || ownerProfile?.plan_tier === "business";

  const meta = parseFormMetadata(form.custom_css);
  const headingFont = meta.heading_font || form.custom_font || "Instrument Serif";
  const bodyFont = meta.body_font || form.custom_font || "DM Sans";
  const customCss = form.custom_css;
  const brandColor = form.theme_color || "#6556A8";

  if (!isPaid && (count ?? 0) >= FREE_TESTIMONIAL_LIMIT) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-5 md:px-10 py-12"
        style={{
          fontFamily: `'${bodyFont}', sans-serif`,
          background: `radial-gradient(ellipse at 50% 9%, color-mix(in srgb, ${brandColor} 13%, transparent), transparent 40%), #faf9f6`,
          color: "#292723",
        }}
      >
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            headingFont
          )}:ital,wght@0,400..800;1,400..800&family=${encodeURIComponent(
            bodyFont
          )}:ital,wght@0,400..700;1,400..700&display=swap`}
        />
        {customCss && (
          <style dangerouslySetInnerHTML={{ __html: customCss }} />
        )}
        <div className="w-full max-w-lg rounded-2xl border border-[#e9e5df] bg-[#fffdfc] p-8 text-center shadow-xs">
          <h1
            className="text-2xl font-bold text-[#292723]"
            style={{ fontFamily: `'${headingFont}', sans-serif` }}
          >
            This form isn&apos;t accepting new testimonials right now
          </h1>
          <p className="mt-3 text-sm text-[#77716b]">
            Thanks for wanting to share — please check back later.
          </p>
          <p className="mt-6 text-xs text-[#77716b]">
            Are you the owner?{" "}
            <a
              href="/"
              className="font-semibold hover:underline"
              style={{ color: brandColor }}
            >
              Upgrade for unlimited testimonials
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 md:px-8 py-12"
      style={{
        fontFamily: `'${bodyFont}', sans-serif`,
        background: `radial-gradient(ellipse at 50% 9%, color-mix(in srgb, ${brandColor} 13%, transparent), transparent 40%), #faf9f6`,
        color: "#292723",
      }}
    >
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          headingFont
        ).replace(/%20/g, "+")}&family=${encodeURIComponent(
          bodyFont
        ).replace(/%20/g, "+")}&display=swap`}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `h1, h2, h3, .blovi-h1 { font-family: '${headingFont}', Georgia, serif !important; }`,
        }}
      />
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      <CollectionForm form={form as FormRow} />
    </div>
  );
}
