export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  created_at: string;
}

export interface ThemeColors {
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
  starOn: string;
  starOff: string;
}

export type WallLayout = "masonry" | "grid";
export type WallTheme = "light" | "dark";

export const THEME: Record<WallTheme, ThemeColors> = {
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
    starOn: "#f59e0b",
    starOff: "#e4e4e7",
  },
  dark: {
    pageBg: "#16161D",
    cardBg: "#1F1F28",
    cardBorder: "#2A2A35",
    text: "#ffffff",
    name: "#ffffff",
    role: "#a1a1aa",
    emptyText: "#a1a1aa",
    badgeBg: "#1F1F28",
    badgeBorder: "#2A2A35",
    badgeText: "#a1a1aa",
    starOn: "#ffffff",
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
            color: n <= rating ? colors.starOn : colors.starOff,
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

export function WallContent({
  testimonials,
  layout,
  theme,
  showRatings,
  showBadge,
  maxCount,
}: {
  testimonials: Testimonial[];
  layout: WallLayout;
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  maxCount: number | null;
}) {
  const colors = THEME[theme];
  const list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

  return (
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
  );
}
