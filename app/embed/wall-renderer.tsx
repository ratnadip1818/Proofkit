"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  created_at: string;
  avatar_url?: string | null;
  tags?: string[] | null;
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
  avatarBg: string;
  avatarText: string;
  accent: string;
  dotInactive: string;
  arrowBg: string;
  arrowText: string;
}

export type WallLayout = "masonry" | "grid";
export type WallTheme = "light" | "dark";
export type WidgetType = "wall" | "carousel" | "marquee" | "single";
export type WidgetRadius = "sharp" | "rounded" | "pill";

export const RADIUS_PX: Record<WidgetRadius, number> = {
  sharp: 4,
  rounded: 12,
  pill: 22,
};

export interface WidgetStyle {
  colors: ThemeColors;
  radius: number;
}

/**
 * Resolve theme colors with an optional brand accent so the widget can
 * match the host site instead of always being Blovi-orange.
 */
export function buildStyle(
  theme: WallTheme,
  accent?: string,
  radius: WidgetRadius = "rounded"
): WidgetStyle {
  const base = THEME[theme];
  const colors: ThemeColors = accent
    ? {
        ...base,
        accent,
        starOn: theme === "light" ? accent : base.starOn,
        avatarText: theme === "light" ? accent : base.avatarText,
        avatarBg:
          theme === "light"
            ? `color-mix(in srgb, ${accent} 12%, white)`
            : base.avatarBg,
      }
    : base;
  return { colors, radius: RADIUS_PX[radius] };
}

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "sample-1",
    author_name: "Maria K.",
    author_role: "Founder, Lume",
    body_original: "I love this app — it saved me so much time. Highly recommend!",
    display_body: "I love this app — it saved me so much time. Highly recommend!",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    author_name: "Tom W.",
    author_role: "Indie hacker",
    body_original: "Honestly, I didn't expect to use it this much — it's that good.",
    display_body: "Honestly, I didn't expect to use it this much — it's that good.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    author_name: "Devon R.",
    author_role: "Freelance designer",
    body_original: "Setup was super quick, and the wall looks amazing on my site.",
    display_body: "Setup was super quick, and the wall looks amazing on my site.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-4",
    author_name: "Priya S.",
    author_role: "Agency owner",
    body_original: "Finally a tool I don't pay monthly for.",
    display_body: "Finally a tool I don't pay monthly for.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-5",
    author_name: "Ana L.",
    author_role: "Course creator",
    body_original: "Exactly what my course site needed — looks so clean.",
    display_body: "Exactly what my course site needed — looks so clean.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-6",
    author_name: "Jordan B.",
    author_role: "Marketing lead",
    body_original: "Our conversion rate went up after adding this wall to the homepage.",
    display_body: "Our conversion rate went up after adding this wall to the homepage.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-7",
    author_name: "Sofia M.",
    author_role: "Shop owner",
    body_original: "Customers trust us more now that they can see real reviews.",
    display_body: "Customers trust us more now that they can see real reviews.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-8",
    author_name: "Liam P.",
    author_role: "SaaS founder",
    body_original: "The AI polish feature turns messy feedback into great copy instantly.",
    display_body: "The AI polish feature turns messy feedback into great copy instantly.",
    rating: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-9",
    author_name: "Hana T.",
    author_role: "Consultant",
    body_original: "Took five minutes to set up and it just works.",
    display_body: "Took five minutes to set up and it just works.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
];

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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
    avatarBg: "#FFF4EE",
    avatarText: "#E8743B",
    accent: "#E8743B",
    dotInactive: "#e4e4e7",
    arrowBg: "#ffffff",
    arrowText: "#3f3f46",
  },
  dark: {
    pageBg: "transparent",
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
    avatarBg: "#2A2A35",
    avatarText: "#ffffff",
    accent: "#E8743B",
    dotInactive: "#3f3f46",
    arrowBg: "#1F1F28",
    arrowText: "#ffffff",
  },
};

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

function Stars({
  rating,
  colors,
  size = 16,
  marginBottom = 10,
}: {
  rating: number;
  colors: ThemeColors;
  size?: number;
  marginBottom?: number;
}) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= rating ? colors.starOn : colors.starOff,
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({
  name,
  avatarUrl,
  colors,
  size = 40,
}: {
  name: string;
  avatarUrl?: string | null;
  colors: ThemeColors;
  size?: number;
}) {
  if (avatarUrl) {
    let optimizedUrl = avatarUrl;
    if (avatarUrl.includes("/storage/v1/object/public/avatars/")) {
      const doubleSize = size * 2;
      optimizedUrl = `${avatarUrl}?width=${doubleSize}&height=${doubleSize}&resize=contain`;
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={optimizedUrl}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: `1px solid ${colors.cardBorder}`,
        }}
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.avatarBg,
        color: colors.avatarText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

function EmptyState({ colors }: { colors: ThemeColors }) {
  return (
    <p style={{ textAlign: "center", color: colors.emptyText, fontSize: "14px" }}>
      No testimonials yet.
    </p>
  );
}

function BadgeLink({ colors }: { colors: ThemeColors }) {
  return (
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
  );
}

function VerifiedBadge({ id }: { id: string }) {
  if (id.startsWith("sample-")) return null;
  return (
    <a
      href={`/verify/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Verified by Blovi"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#2E9E6B",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: "block" }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </a>
  );
}

function TestimonialCard({
  t,
  showRatings,
  colors,
  radius,
  layout,
  index = 0,
  onReadMore,
}: {
  t: Testimonial;
  showRatings: boolean;
  colors: ThemeColors;
  radius: number;
  layout?: WallLayout;
  index?: number;
  onReadMore?: (t: Testimonial) => void;
}) {
  const text = t.display_body ?? t.body_original;
  const isGrid = layout === "grid";
  const threshold = isGrid ? 140 : 320;
  const shouldClamp = text.length > threshold;

  return (
    <div
      className="blovi-card"
      style={{
        position: "relative",
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: `${radius}px`,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        breakInside: "avoid",
        overflow: "hidden",
        boxShadow: colors.cardBg === "#ffffff" ? "0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.02)" : "0 4px 20px rgba(0, 0, 0, 0.15)",
        height: isGrid ? "240px" : "auto",
        boxSizing: "border-box",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "6px",
          right: "14px",
          fontSize: "52px",
          lineHeight: 1,
          fontFamily: "Georgia, serif",
          color: colors.accent,
          opacity: 0.14,
          pointerEvents: "none",
        }}
      >
        ”
      </span>
      {showRatings && t.rating !== null && (
        <Stars rating={t.rating} colors={colors} />
      )}
      
      {shouldClamp ? (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0, marginBottom: "16px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.65",
              color: colors.text,
              display: "-webkit-box",
              WebkitLineClamp: isGrid ? 4 : 8,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReadMore?.(t);
            }}
            style={{
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              padding: "4px 0 0 0",
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              color: colors.accent,
              cursor: "pointer",
              fontFamily: FONT,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Read more
          </button>
        </div>
      ) : (
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "14px",
            lineHeight: "1.65",
            color: colors.text,
            flexGrow: 1,
          }}
        >
          {text}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={34} />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              fontWeight: 700,
              color: colors.name,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {t.author_name}
            <VerifiedBadge id={t.id} />
          </p>
          {t.author_role && (
            <p style={{ margin: "1px 0 0", fontSize: "12px", color: colors.role }}>
              {t.author_role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TestimonialModal({
  t,
  onClose,
  colors,
  radius,
  showRatings,
}: {
  t: Testimonial;
  onClose: () => void;
  colors: ThemeColors;
  radius: number;
  showRatings: boolean;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "proofkit-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <style>{`
        @keyframes proofkit-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes proofkit-scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: `${radius}px`,
          width: "100%",
          maxWidth: "500px",
          maxHeight: "85vh",
          padding: "32px",
          boxSizing: "border-box",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          animation: "proofkit-scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            padding: "8px",
            cursor: "pointer",
            color: colors.role,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${colors.cardBorder} 40%, transparent)`;
            e.currentTarget.style.color = colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.role;
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "12px",
            right: "48px",
            fontSize: "72px",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            color: colors.accent,
            opacity: 0.14,
            pointerEvents: "none",
          }}
        >
          ”
        </span>

        {showRatings && t.rating !== null && (
          <Stars rating={t.rating} colors={colors} marginBottom={14} />
        )}

        <div style={{ overflowY: "auto", flexGrow: 1, marginBottom: "24px", paddingRight: "8px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.7",
              color: colors.text,
              whiteSpace: "pre-wrap",
            }}
          >
            {t.display_body ?? t.body_original}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: `1px solid ${colors.cardBorder}`, paddingTop: "20px" }}>
          <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={40} />
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 700,
                color: colors.name,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {t.author_name}
              <VerifiedBadge id={t.id} />
            </p>
            {t.author_role && (
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: colors.role }}>
                {t.author_role}
              </p>
            )}
          </div>
        </div>
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
  accent,
  radius = "rounded",
}: {
  testimonials: Testimonial[];
  layout: WallLayout;
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  maxCount: number | null;
  accent?: string;
  radius?: WidgetRadius;
}) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  // Extract all unique tags present in testimonials
  const allTags = Array.from(
    new Set(testimonials.flatMap((t) => t.tags || []))
  ).filter(Boolean);

  const list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

  // Filter list by selected tag
  const filteredList = selectedTag
    ? list.filter((t) => t.tags && t.tags.includes(selectedTag))
    : list;

  // Whenever selectedTag changes, send height resize message to parent frame
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.parent.postMessage(
        { type: "proofkit-resize", height: document.body.scrollHeight },
        "*"
      );
    }
  }, [selectedTag, filteredList.length]);

  const count = filteredList.length;
  const containerMaxWidth =
    count === 1 ? "450px" :
    count === 2 ? "820px" :
    count === 3 ? "1140px" :
    "100%";

  return (
    <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
      {/* Dynamic Tag Filter Pills */}
      {allTags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            style={{
              fontFamily: FONT,
              fontSize: "12.5px",
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: "9999px",
              cursor: "pointer",
              border: `1px solid ${selectedTag === null ? colors.accent : colors.cardBorder}`,
              background: selectedTag === null ? colors.accent : colors.cardBg,
              color: selectedTag === null ? (colors.accent === "#ffffff" ? "#1F1F28" : "#ffffff") : colors.text,
              transition: "all 0.15s ease",
            }}
          >
            All
          </button>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{
                  fontFamily: FONT,
                  fontSize: "12.5px",
                  fontWeight: 500,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  border: `1px solid ${isSelected ? colors.accent : colors.cardBorder}`,
                  background: isSelected ? colors.accent : colors.cardBg,
                  color: isSelected ? (colors.accent === "#ffffff" ? "#1F1F28" : "#ffffff") : colors.text,
                  transition: "all 0.15s ease",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {filteredList.length === 0 ? (
        <EmptyState colors={colors} />
      ) : layout === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
            maxWidth: containerMaxWidth,
            margin: "0 auto",
          }}
        >
          {filteredList.map((t, idx) => (
            <TestimonialCard
              key={t.id}
              t={t}
              showRatings={showRatings}
              colors={colors}
              radius={radiusPx}
              layout={layout}
              index={idx}
              onReadMore={setActiveModalTestimonial}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            columns: "280px",
            columnGap: "16px",
            maxWidth: containerMaxWidth,
            margin: "0 auto",
          }}
        >
          {filteredList.map((t, idx) => (
            <div key={t.id} style={{ marginBottom: "16px" }}>
              <TestimonialCard
                t={t}
                showRatings={showRatings}
                colors={colors}
                radius={radiusPx}
                layout={layout}
                index={idx}
                onReadMore={setActiveModalTestimonial}
              />
            </div>
          ))}
        </div>
      )}

      {showBadge && <BadgeLink colors={colors} />}

      {activeModalTestimonial && (
        <TestimonialModal
          t={activeModalTestimonial}
          onClose={() => setActiveModalTestimonial(null)}
          colors={colors}
          radius={radiusPx}
          showRatings={showRatings}
        />
      )}
    </div>
  );
}

function arrowStyle(side: "left" | "right", colors: ThemeColors): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `1px solid ${colors.cardBorder}`,
    background: colors.arrowBg,
    color: colors.arrowText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    padding: 0,
  };
  return side === "left" ? { ...base, left: 8 } : { ...base, right: 8 };
}

export function CarouselContent({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
}: {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
}) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (testimonials.length <= 1 || paused) return;
    // Respect reduced-motion: no autoplay (arrows/dots still work)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length, paused]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.parent.postMessage(
        { type: "proofkit-resize", height: document.body.scrollHeight },
        "*"
      );
    }, 450);
    return () => clearTimeout(timeout);
  }, [index]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const safeIndex = index % testimonials.length;

  return (
    <div
      style={{ fontFamily: FONT, padding: "24px 16px", background: colors.pageBg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        setPaused(false);
        if (start === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) < 40) return;
        setIndex((i) =>
          delta < 0
            ? (i + 1) % testimonials.length
            : (i - 1 + testimonials.length) % testimonials.length
        );
      }}
    >
      <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ overflow: "hidden", borderRadius: `${radiusPx}px`, padding: "8px 0" }}>
          <div
            style={{
              display: "flex",
              transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: `translateX(-${safeIndex * 100}%)`,
            }}
          >
            {testimonials.map((t) => (
              <div key={t.id} style={{ flex: "0 0 100%", boxSizing: "border-box" }}>
                <div
                  className="blovi-card"
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: `${radiusPx}px`,
                    padding: "28px 48px",
                    textAlign: "center",
                    boxShadow: colors.cardBg === "#ffffff" ? "0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.02)" : "0 4px 20px rgba(0, 0, 0, 0.15)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "18px",
                      fontSize: "64px",
                      lineHeight: 1,
                      fontFamily: "Georgia, serif",
                      color: colors.accent,
                      opacity: 0.14,
                      pointerEvents: "none",
                    }}
                  >
                    ”
                  </span>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                    <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} />
                  </div>
                  {showRatings && t.rating !== null && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Stars rating={t.rating} colors={colors} />
                    </div>
                  )}
                  <p style={{ fontSize: "15px", lineHeight: "1.65", color: colors.text, margin: "8px 0 16px" }}>
                    {t.display_body ?? t.body_original}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                      color: colors.name,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    {t.author_name}
                    <VerifiedBadge id={t.id} />
                  </p>
                  {t.author_role && (
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: colors.role }}>
                      {t.author_role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {testimonials.length > 1 && (
          <>
            <button
              type="button"
              className="blovi-arrow"
              onClick={() =>
                setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
              }
              aria-label="Previous testimonial"
              style={arrowStyle("left", colors)}
            >
              ‹
            </button>
            <button
              type="button"
              className="blovi-arrow"
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              aria-label="Next testimonial"
              style={arrowStyle("right", colors)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {testimonials.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "16px" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === safeIndex ? 18 : 8,
                height: 8,
                borderRadius: "4px",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === safeIndex ? colors.accent : colors.dotInactive,
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>
      )}

      {showBadge && <BadgeLink colors={colors} />}
    </div>
  );
}

export function MarqueeContent({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
}: {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
}) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const items = [...testimonials, ...testimonials];
  const duration = Math.max(15, testimonials.length * 5);

  return (
    <div
      style={{
        fontFamily: FONT,
        padding: "16px 0",
        background: colors.pageBg,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes proofkit-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .proofkit-marquee-track {
          animation: proofkit-marquee ${duration}s linear infinite;
        }
        .proofkit-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .proofkit-marquee-track { animation: none; }
        }
      `}</style>
      <div
        className="proofkit-marquee-track"
        style={{ display: "flex", gap: "12px", width: "max-content" }}
      >
        {items.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: `${radiusPx}px`,
              padding: "12px 16px",
              height: "96px",
              width: "280px",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={36} />
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "13px",
                  color: colors.name,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.author_name}
                </span>
                <VerifiedBadge id={t.id} />
              </p>
              {showRatings && t.rating !== null && (
                <Stars rating={t.rating} colors={colors} size={11} marginBottom={2} />
              )}
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: colors.text,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {truncate(t.display_body ?? t.body_original, 100)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showBadge && (
        <div style={{ marginTop: "12px" }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}

export function SingleQuoteContent({
  testimonial,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
}: {
  testimonial: Testimonial | null;
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
}) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);

  if (!testimonial) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: FONT,
        padding: "32px 24px",
        background: colors.pageBg,
        textAlign: "center",
      }}
    >
      <div
        className="blovi-card"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: `${radiusPx}px`,
          padding: "36px 32px",
          boxShadow: colors.cardBg === "#ffffff" ? "0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.02)" : "0 4px 20px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "6px",
            right: "18px",
            fontSize: "64px",
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            color: colors.accent,
            opacity: 0.14,
            pointerEvents: "none",
          }}
        >
          ”
        </span>
        <p style={{ fontSize: "17px", lineHeight: "1.65", color: colors.text, fontWeight: 500, margin: "0 0 20px 0" }}>
          {testimonial.display_body ?? testimonial.body_original}
        </p>
        {showRatings && testimonial.rating !== null && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Stars rating={testimonial.rating} colors={colors} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
          <Avatar name={testimonial.author_name} avatarUrl={testimonial.avatar_url} colors={colors} />
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "14.5px",
                color: colors.name,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              {testimonial.author_name}
              <VerifiedBadge id={testimonial.id} />
            </p>
            {testimonial.author_role && (
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: colors.role }}>
                {testimonial.author_role}
              </p>
            )}
          </div>
        </div>
      </div>
      {showBadge && <BadgeLink colors={colors} />}
    </div>
  );
}
