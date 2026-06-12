import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "@/lib/limits";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
  SAMPLE_TESTIMONIALS,
  type Testimonial,
  type WidgetType,
} from "../wall-renderer";

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ widgetId: string }>;
  searchParams: Promise<{
    type?: string;
    layout?: string;
    theme?: string;
    max?: string;
    ratings?: string;
    badge?: string;
    featured?: string;
    demo?: string;
  }>;
}) {
  const { widgetId } = await params;
  const sp = await searchParams;
  const isDemo = sp.demo === "1";

  const requestedType: WidgetType =
    sp.type === "carousel" || sp.type === "marquee" || sp.type === "single"
      ? sp.type
      : "wall";
  const layout = sp.layout === "grid" ? "grid" : "masonry";
  const theme = sp.theme === "dark" ? "dark" : "light";
  const showRatings = sp.ratings !== "false";
  const maxCount =
    sp.max === "3" || sp.max === "6" || sp.max === "9" ? Number(sp.max) : null;
  const featuredIndex = sp.featured ? Math.max(0, parseInt(sp.featured, 10) || 0) : 0;

  const supabase = createAdminClient();
  const [{ data: testimonials }, { data: profile }] = await Promise.all([
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, display_body, rating, created_at"
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
  const showBadge = !isLifetime || sp.badge !== "false";

  // Free tier: Wall of Love only, capped at the most recent approved
  // testimonials (enforced here, not just in the dashboard UI)
  const type: WidgetType = isLifetime || isDemo ? requestedType : "wall";
  const approved = (testimonials ?? []) as Testimonial[];
  const capped = !isDemo && !isLifetime && approved.length > FREE_WIDGET_TESTIMONIAL_LIMIT;
  const list = isDemo
    ? SAMPLE_TESTIMONIALS
    : isLifetime
      ? approved
      : approved.slice(0, FREE_WIDGET_TESTIMONIAL_LIMIT);

  return (
    <>
      {type === "carousel" ? (
        <CarouselContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
        />
      ) : type === "marquee" ? (
        <MarqueeContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
        />
      ) : type === "single" ? (
        <SingleQuoteContent
          testimonial={list[featuredIndex] ?? list[0] ?? null}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
        />
      ) : (
        <WallContent
          testimonials={list}
          layout={layout}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          maxCount={maxCount}
        />
      )}

      {capped && (
        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <a
            href="https://www.blovi.space/pricing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: theme === "dark" ? "#a1a1aa" : "#9ca3af",
              textDecoration: "none",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Showing {FREE_WIDGET_TESTIMONIAL_LIMIT} of {approved.length} — upgrade for unlimited
          </a>
        </div>
      )}

      {/* Post height to parent for iframe auto-resize */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function sendHeight() {
              window.parent.postMessage(
                { type: "proofkit-resize", height: document.body.scrollHeight },
                "*"
              );
            }
            window.addEventListener("load", sendHeight);
            window.addEventListener("resize", sendHeight);
            if (document.fonts) document.fonts.ready.then(sendHeight);
          `,
        }}
      />
    </>
  );
}
