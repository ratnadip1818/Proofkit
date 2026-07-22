import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Testimonial } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";

// Force dynamic rendering so widget customization updates reflect live instantly without 12-hour CDN caching
export const revalidate = 0;
export const dynamic = "force-dynamic";

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
}: {
  params: Promise<{ widgetId: string }>;
}) {
  const { widgetId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blovi.space";

  const testimonialsPromise = fetch(`${baseUrl}/api/widgets/${widgetId}`, {
    next: { tags: [`widget-${widgetId}`] },
  })
    .then((res) => {
      if (!res.ok) return [];
      return res.json() as Promise<Testimonial[]>;
    })
    .catch(() => []);

  const supabase = createAdminClient();
  const [testimonials, { data: profile }] = await Promise.all([
    testimonialsPromise,
    supabase
      .from("profiles")
      .select("is_lifetime, full_name")
      .eq("id", widgetId)
      .maybeSingle(),
  ]);

  let form: { headline?: string | null; custom_css?: string | null; custom_font?: string | null } | null = null;
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .select("headline, custom_css, custom_font")
    .eq("user_id", widgetId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!formError && formData) {
    form = formData;
  }

  const isLifetime = profile?.is_lifetime ?? false;
  const approved = testimonials as Testimonial[];

  const customFont = form?.custom_font || "Inter";
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
        <WidgetClientWrapper testimonials={approved} isLifetime={isLifetime} />
      </Suspense>
    </div>
  );
}
