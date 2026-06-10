import { createAdminClient } from "@/lib/supabase/admin";

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  created_at: string;
}

interface ThemeColors {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  name: string;
  role: string;
  emptyText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  starOff: string;
}

const THEME: Record<"light" | "dark", ThemeColors> = {
  light: {
    pageBg: "transparent",
    cardBg: "#ffffff",
    cardBorder: "#e4e4e7",
    text: "#3f3f46",
    name: "#18181b",
    role: "#71717a",
    emptyText: "#71717a",
    badgeBg: "#ffffff",
    badgeBorder: "#e4e4e7",
    badgeText: "#71717a",
    starOff: "#e4e4e7",
  },
  dark: {
    pageBg: "#09090b",
    cardBg: "#18181b",
    cardBorder: "#3f3f46",
    text: "#d4d4d8",
    name: "#fafafa",
    role: "#a1a1aa",
    emptyText: "#a1a1aa",
    badgeBg: "#18181b",
    badgeBorder: "#3f3f46",
    badgeText: "#a1a1aa",
    starOff: "#3f3f46",
  },
};

function Stars({ rating, colors }: { rating: number; colors: ThemeColors }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= rating ? "#f59e0b" : colors.starOff,
            fontSize: "16px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({
  t,
  showRatings,
  colors,
}: {
  t: Testimonial;
  showRatings: boolean;
  colors: ThemeColors;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        breakInside: "avoid",
      }}
    >
      {showRatings && t.rating !== null && (
        <Stars rating={t.rating} colors={colors} />
      )}
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          lineHeight: "1.6",
          color: colors.text,
          flexGrow: 1,
        }}
      >
        {t.display_body ?? t.body_original}
      </p>
      <div>
        <p
          style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: colors.name }}
        >
          {t.author_name}
        </p>
        {t.author_role && (
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.role }}>
            {t.author_role}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ widgetId: string }>;
  searchParams: Promise<{
    layout?: string;
    theme?: string;
    max?: string;
    ratings?: string;
    badge?: string;
  }>;
}) {
  const { widgetId } = await params;
  const sp = await searchParams;

  const layout = sp.layout === "grid" ? "grid" : "masonry";
  const theme = sp.theme === "dark" ? "dark" : "light";
  const showRatings = sp.ratings !== "off";
  const maxCount =
    sp.max === "3" || sp.max === "6" || sp.max === "9" ? Number(sp.max) : null;
  const colors = THEME[theme];

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
  const showBadge = !isLifetime || sp.badge !== "off";

  let list = (testimonials ?? []) as Testimonial[];
  if (maxCount !== null) list = list.slice(0, maxCount);

  return (
    <>
      <div
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "16px",
          background: colors.pageBg,
        }}
      >
        {list.length === 0 ? (
          <p style={{ textAlign: "center", color: colors.emptyText, fontSize: "14px" }}>
            No testimonials yet.
          </p>
        ) : layout === "grid" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {list.map((t) => (
              <TestimonialCard key={t.id} t={t} showRatings={showRatings} colors={colors} />
            ))}
          </div>
        ) : (
          <div style={{ columns: "280px", columnGap: "16px" }}>
            {list.map((t) => (
              <div key={t.id} style={{ marginBottom: "16px" }}>
                <TestimonialCard t={t} showRatings={showRatings} colors={colors} />
              </div>
            ))}
          </div>
        )}

        {showBadge && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a
              href="https://www.blovi.space"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: colors.badgeText,
                textDecoration: "none",
                border: `1px solid ${colors.badgeBorder}`,
                borderRadius: "999px",
                padding: "4px 12px",
                background: colors.badgeBg,
              }}
            >
              ⚡ Powered by Blovi
            </a>
          </div>
        )}
      </div>

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
