import { Suspense } from "react";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { logWidgetView } from "@/lib/tracking";
import { type Testimonial } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";
import { applyTierLimits, getWidgetOwnerPlan } from "@/lib/widget-tier";

// Cache the widget iframe at the edge for 12 hours (stale-while-revalidate is handled automatically by Next.js / Vercel CDN)
export const revalidate = 43200;

// Export generateStaticParams to convert this route into a statically generated / ISR route
export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .limit(10);
  return (profiles ?? []).map((p) => ({
    widgetId: p.id,
  }));
}

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ widgetId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { widgetId } = await params;
  const sParams = await searchParams;

  const supabase = createAdminClient();

  // 1. Check if widgetId is a saved widget record ID
  const { data: savedWidgetRecord } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", widgetId)
    .maybeSingle();

  const ownerUserId = savedWidgetRecord ? savedWidgetRecord.user_id : widgetId;
  const savedSettings = (savedWidgetRecord?.settings as Record<string, any>) || {};

  // 2. Build merged searchParams so saved widget configurations apply to embeds
  const mergedSearchParams: { [key: string]: string } = {};

  if (savedWidgetRecord) {
    if (savedSettings.layout || savedWidgetRecord.widget_type) {
      mergedSearchParams.type = savedSettings.layout || savedWidgetRecord.widget_type;
    }
    if (savedWidgetRecord.theme) mergedSearchParams.theme = savedWidgetRecord.theme;
    if (savedWidgetRecord.accent) mergedSearchParams.accent = savedWidgetRecord.accent;
    if (savedSettings.preset) mergedSearchParams.preset = savedSettings.preset;
    if (savedSettings.max_avatars) mergedSearchParams.maxAvatars = String(savedSettings.max_avatars);
    if (savedSettings.show_rating_number !== undefined) mergedSearchParams.showRatingNumber = String(savedSettings.show_rating_number);
    if (savedSettings.avatar_border_color) mergedSearchParams.avatarBorderColor = savedSettings.avatar_border_color;
    if (savedSettings.avatar_url) mergedSearchParams.avatarUrl = savedSettings.avatar_url;
    if (savedSettings.rating_color) mergedSearchParams.ratingColor = savedSettings.rating_color;
    if (savedSettings.background_color) mergedSearchParams.backgroundColor = savedSettings.background_color;
    if (savedSettings.text_color) mergedSearchParams.textColor = savedSettings.text_color;
    if (savedSettings.show_photos !== undefined) mergedSearchParams.showPhotos = String(savedSettings.show_photos);
    if (savedSettings.show_date !== undefined) mergedSearchParams.showDate = String(savedSettings.show_date);
    if (savedSettings.card_layout) mergedSearchParams.cardLayout = savedSettings.card_layout;
    if (savedSettings.font_family) mergedSearchParams.font = savedSettings.font_family;
    if (savedSettings.show_branding !== undefined) mergedSearchParams.badge = String(savedSettings.show_branding);
    if (savedSettings.badge_style) mergedSearchParams.badgeStyle = savedSettings.badge_style;
    if (savedSettings.badge_text) mergedSearchParams.badgeText = savedSettings.badge_text;
    if (savedSettings.rating_box_bg) mergedSearchParams.ratingBoxBg = savedSettings.rating_box_bg;
    if (savedSettings.rating_box_text) mergedSearchParams.ratingBoxText = savedSettings.rating_box_text;
    if (savedSettings.badge_url) mergedSearchParams.badgeUrl = savedSettings.badge_url;
    if (savedSettings.quotes_columns) mergedSearchParams.quotesColumns = String(savedSettings.quotes_columns);
    if (savedSettings.quotes_style) mergedSearchParams.quotesStyle = savedSettings.quotes_style;
    if (savedSettings.max_quotes) mergedSearchParams.maxQuotes = String(savedSettings.max_quotes);
    if (savedSettings.marquee_rows) mergedSearchParams.marqueeRows = String(savedSettings.marquee_rows);
    if (savedSettings.marquee_direction) mergedSearchParams.marqueeDirection = savedSettings.marquee_direction;
    if (savedSettings.marquee_speed) mergedSearchParams.marqueeSpeed = savedSettings.marquee_speed;
    if (savedSettings.marquee_pause_on_hover !== undefined) mergedSearchParams.marqueePauseOnHover = String(savedSettings.marquee_pause_on_hover);
    if (savedSettings.marquee_card_width) mergedSearchParams.marqueeCardWidth = String(savedSettings.marquee_card_width);
  }

  // Explicit URL query params take precedence
  for (const [key, val] of Object.entries(sParams)) {
    if (typeof val === "string") {
      mergedSearchParams[key] = val;
    }
  }

  try {
    const headersList = await headers();
    const referer = headersList.get("referer");
    const widgetTypeParam = typeof mergedSearchParams.type === "string" ? mergedSearchParams.type : typeof mergedSearchParams.layout === "string" ? mergedSearchParams.layout : "wall";
    const safeWidgetType = (["wall", "carousel", "marquee", "single", "spotlight", "conversation", "bento", "orbit", "stack", "badge", "avatars", "quotes"].includes(widgetTypeParam) ? widgetTypeParam : "wall") as "wall" | "carousel" | "marquee" | "single";
    logWidgetView(ownerUserId, safeWidgetType, referer).catch(() => {});
  } catch {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blovi.space";

  const testimonialsPromise = fetch(`${baseUrl}/api/widgets/${ownerUserId}`, {
    next: { tags: [`widget-${ownerUserId}`, `widget-${widgetId}`] },
  })
    .then((res) => {
      if (!res.ok) return [];
      return res.json() as Promise<Testimonial[]>;
    })
    .catch(() => []);

  const [testimonials, plan, { data: profile }] = await Promise.all([
    testimonialsPromise,
    getWidgetOwnerPlan(ownerUserId),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", ownerUserId)
      .maybeSingle(),
  ]);

  let form: { headline?: string | null; custom_css?: string | null; custom_font?: string | null } | null = null;
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .select("headline, custom_css, custom_font")
    .eq("user_id", ownerUserId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!formError && formData) {
    form = formData;
  }

  const { testimonials: limitedTestimonials, isPaid } = applyTierLimits({
    plan,
    testimonials: (testimonials as Testimonial[]) ?? [],
    config: {
      showBadge: mergedSearchParams.badge !== "false",
      type: typeof mergedSearchParams.type === "string" ? mergedSearchParams.type : typeof mergedSearchParams.layout === "string" ? mergedSearchParams.layout : undefined,
    },
  });

  const isLifetime = isPaid;
  const approved = limitedTestimonials;

  const fontParam = typeof mergedSearchParams.font === "string" ? mergedSearchParams.font : typeof mergedSearchParams.fontFamily === "string" ? mergedSearchParams.fontFamily : undefined;
  const customFont = fontParam || form?.custom_font || "Plus Jakarta Sans";
  const customCss = form?.custom_css;

  // Calculate review average rating and count for SEO Rich Schema
  let totalRating = 0;
  let ratedCount = 0;
  for (const t of approved) {
    if (t.rating) {
      totalRating += t.rating;
      ratedCount++;
    }
  }
  const averageRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : null;
  const reviewCount = approved.length;
  const productName = form?.headline || profile?.full_name || "Reviews";

  const schemaMarkup = averageRating ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  return (
    <div style={{ fontFamily: `'${customFont}', sans-serif` }}>
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(customFont)}:wght@400;500;600;700;800;900&display=swap`}
      />
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      {/* Card hover lift + reduced-motion manners, shared by all types */}
      <style>{`
        @keyframes blovi-fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .blovi-card {
          transition: transform .35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .35s cubic-bezier(0.16, 1, 0.3, 1);
          animation: blovi-fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .blovi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }
        .blovi-arrow {
          transition: transform .25s cubic-bezier(0.16, 1, 0.3, 1), background-color .25s ease, border-color .25s ease;
        }
        .blovi-arrow:hover {
          transform: scale(1.06);
        }
        .blovi-arrow:active {
          transform: scale(0.94);
        }
        @media (prefers-reduced-motion: reduce) {
          .blovi-card { transition: none; animation: none; }
          .blovi-card:hover { transform: none; box-shadow: none; }
          .blovi-arrow { transition: none; }
          .blovi-arrow:hover { transform: none !important; }
        }
      `}</style>

      <Suspense fallback={null}>
        <WidgetClientWrapper testimonials={approved} isLifetime={isLifetime} searchParams={mergedSearchParams} />
      </Suspense>
    </div>
  );
}
