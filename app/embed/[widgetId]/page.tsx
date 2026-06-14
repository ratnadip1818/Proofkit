import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Testimonial } from "../constants";
import WidgetClientWrapper from "../widget-client-wrapper";

// Cache the widget iframe at the edge for 60 seconds (stale-while-revalidate is handled automatically by Next.js / Vercel CDN)
export const revalidate = 60;

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

  const supabase = createAdminClient();
  const [{ data: testimonials }, { data: profile }] = await Promise.all([
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags"
      )
      .eq("user_id", widgetId)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", widgetId)
      .maybeSingle(),
  ]);

  const isLifetime = profile?.is_lifetime ?? false;
  const approved = (testimonials ?? []) as Testimonial[];

  return (
    <>
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
          transform: translateY(-50%) scale(1.08) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .blovi-card { transition: none; animation: none; }
          .blovi-card:hover { transform: none; box-shadow: none; }
          .blovi-arrow { transition: none; }
          .blovi-arrow:hover { transform: translateY(-50%) none !important; }
        }
      `}</style>

      <Suspense fallback={null}>
        <WidgetClientWrapper testimonials={approved} isLifetime={isLifetime} />
      </Suspense>
    </>
  );
}
