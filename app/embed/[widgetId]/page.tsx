import { createAdminClient } from "@/lib/supabase/admin";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
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
  }>;
}) {
  const { widgetId } = await params;
  const sp = await searchParams;

  const type: WidgetType =
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

  const list = (testimonials ?? []) as Testimonial[];

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
