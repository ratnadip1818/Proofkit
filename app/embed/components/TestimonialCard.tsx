import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import { FONT, SHADOWS } from "../theme/tokens";
import { WallLayout } from "../types/widget";
import { Stars } from "./Stars";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";

export function TestimonialCard({
  t,
  showRatings,
  colors,
  radius,
  layout,
  index = 0,
  onReadMore,
  surface,
  showPhotos = true,
  fallbackAvatar = "Placeholder",
}: {
  t: Testimonial;
  showRatings: boolean;
  colors: ThemeColors;
  radius: number;
  layout?: WallLayout;
  index?: number;
  onReadMore?: (t: Testimonial) => void;
  /** Optional wall-only surface tint. Other layouts retain the selected theme surface. */
  surface?: string;
  showPhotos?: boolean;
  fallbackAvatar?: string;
}) {
  const rawText = t.display_body ?? t.body_original ?? "";
  const text = rawText.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
  const isFeatured = Boolean((t as any).featured);
  const threshold = 180;
  const shouldClamp = text.length > threshold;
  const isLightSurface = colors.cardBg === "#ffffff" || colors.cardBg === "#fffdfa";

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: (t as any).tint ?? surface ?? colors.cardBg,
    border: isLightSurface ? "1px solid rgba(0,0,0,0.04)" : `1px solid ${colors.cardBorder}`,
    borderRadius: `${Math.max(radius, 10)}px`,
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    breakInside: "avoid",
    marginBottom: "1.25rem",
    overflow: "hidden",
    boxShadow: isLightSurface ? "0 2px 12px rgba(0,0,0,0.03)" : SHADOWS.cardDark,
    boxSizing: "border-box",
    animationDelay: `${index * 0.05}s`,
  };

  return (
    <div className="blovi-card blovi-masonry-item" style={cardStyle}>
      {showRatings && t.rating !== null && (
        <div style={{ marginBottom: "16px" }}>
          <Stars rating={t.rating} colors={colors} />
        </div>
      )}
      
      {shouldClamp ? (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0, marginBottom: "24px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: "1.6",
              color: colors.text,
              display: "-webkit-box",
              WebkitLineClamp: 4,
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
              padding: "6px 0 0 0",
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
            margin: "0 0 24px 0",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: colors.text,
            flexGrow: 1,
          }}
        >
          {text}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={36} source={t.source} showPhotos={showPhotos} fallbackAvatar={fallbackAvatar} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: "12.5px",
              fontWeight: 600,
              color: colors.name,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              lineHeight: "1.3",
            }}
          >
            {t.author_name}
            <VerifiedBadge id={t.id} />
          </div>
          {t.author_role && (
            <div style={{ margin: "1px 0 0", fontSize: "11.5px", color: colors.role, lineHeight: "1.3" }}>
              {t.author_role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
