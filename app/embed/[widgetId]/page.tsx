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
  type WidgetRadius,
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
    accent?: string;
    radius?: string;
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
  // Brand accent: 6-digit hex only (with or without #) — anything else is ignored
  const accentHex = (sp.accent ?? "").replace(/^#/, "");
  const accent = /^[0-9a-fA-F]{6}$/.test(accentHex) ? `#${accentHex}` : undefined;
  const radius: WidgetRadius =
    sp.radius === "sharp" || sp.radius === "pill" ? sp.radius : "rounded";

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
      {/* Card hover lift + reduced-motion manners, shared by all types */}
      <style>{`
        .blovi-card { transition: transform .25s ease, box-shadow .25s ease; }
        .blovi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.10);
        }
        @media (prefers-reduced-motion: reduce) {
          .blovi-card { transition: none; }
          .blovi-card:hover { transform: none; box-shadow: none; }
        }
      `}</style>

      {type === "carousel" ? (
        <CarouselContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
        />
      ) : type === "marquee" ? (
        <MarqueeContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
        />
      ) : type === "single" ? (
        <SingleQuoteContent
          testimonial={list[featuredIndex] ?? list[0] ?? null}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
        />
      ) : (
        <WallContent
          testimonials={list}
          layout={layout}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          maxCount={maxCount}
          accent={accent}
          radius={radius}
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

      {/* Hidden container for testimonials data to safely pass to the parent page schema builder */}
      <div
        id="proofkit-schema-data"
        style={{ display: "none" }}
        data-testimonials={JSON.stringify(
          list.map((t) => ({
            author_name: t.author_name,
            body: t.display_body ?? t.body_original,
            rating: t.rating,
            created_at: t.created_at,
          }))
        )}
      />

      {/* Post height and schema data to parent */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let lastWidth = window.innerWidth;
            function sendHeight() {
              window.parent.postMessage(
                { type: "proofkit-resize", height: document.body.scrollHeight },
                "*"
              );
            }
            window.addEventListener("load", () => {
              sendHeight();
              try {
                const dataEl = document.getElementById("proofkit-schema-data");
                if (dataEl) {
                  const testimonials = JSON.parse(dataEl.getAttribute("data-testimonials"));
                  window.parent.postMessage({ type: "proofkit-schema", testimonials }, "*");
                }
              } catch (e) {
                console.error("Failed to send schema testimonials", e);
              }
            });
            window.addEventListener("resize", () => {
              if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                sendHeight();
              }
            });
            if (document.fonts) document.fonts.ready.then(sendHeight);
          `,
        }}
      />
    </>
  );
}
