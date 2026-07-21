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
  const text = t.display_body ?? t.body_original;
  const isFeatured = Boolean((t as any).featured || text.length > 180 || index === 0);
  const threshold = isFeatured ? 260 : 160;
  const shouldClamp = text.length > threshold;
  const isLightSurface = colors.cardBg === "#ffffff" || colors.cardBg === "#fffdfa";

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: (t as any).tint ?? surface ?? colors.cardBg,
    border: isLightSurface ? "1px solid rgba(0,0,0,0.04)" : `1px solid ${colors.cardBorder}`,
    borderRadius: `${Math.max(radius, 10)}px`,
    padding: isFeatured ? "32px 32px" : "28px",
    display: "flex",
    flexDirection: "column",
    breakInside: "avoid",
    marginBottom: "1.5rem",
    overflow: "hidden",
    boxShadow: isLightSurface ? "0 2px 12px rgba(0,0,0,0.03)" : SHADOWS.cardDark,
    boxSizing: "border-box",
    animationDelay: `${index * 0.05}s`,
  };

  return (
    <div className="blovi-card blovi-masonry-item" style={cardStyle}>
      {showRatings && t.rating !== null && (
        <div style={{ marginBottom: "20px" }}>
          <Stars rating={t.rating} colors={colors} />
        </div>
      )}
      
      {shouldClamp ? (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0, marginBottom: "32px" }}>
          <p
            style={{
              margin: 0,
              fontSize: isFeatured ? "19px" : "15px",
              fontWeight: isFeatured ? 500 : 400,
              letterSpacing: isFeatured ? "-0.01em" : "normal",
              lineHeight: "1.6",
              color: colors.text,
              display: "-webkit-box",
              WebkitLineClamp: isFeatured ? 6 : 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            "{text}"
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
            margin: "0 0 32px 0",
            fontSize: isFeatured ? "19px" : "15px",
            fontWeight: isFeatured ? 500 : 400,
            letterSpacing: isFeatured ? "-0.01em" : "normal",
            lineHeight: "1.6",
            color: colors.text,
            flexGrow: 1,
          }}
        >
          "{text}"
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "auto" }}>
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={44} source={t.source} showPhotos={showPhotos} fallbackAvatar={fallbackAvatar} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 500,
              color: colors.name,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              lineHeight: "1.375",
            }}
          >
            {t.author_name}
            <VerifiedBadge id={t.id} />
          </div>
          {t.author_role && (
            <div style={{ margin: "2px 0 0", fontSize: "12px", color: colors.role, lineHeight: "1.375" }}>
              {t.author_role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
