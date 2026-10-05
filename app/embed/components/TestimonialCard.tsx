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
  const isLightSurface = colors.cardBg === "#ffffff" || colors.cardBg === "#fffdfa" || !colors.cardBg;

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: isLightSurface ? "#ffffff" : colors.cardBg,
    border: isLightSurface ? "1px solid #E5E7EB" : `1px solid ${colors.cardBorder}`,
    borderRadius: `${Math.max(radius, 12)}px`,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    boxShadow: isLightSurface
      ? "0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 12px 0 rgba(0,0,0,0.02)"
      : SHADOWS.cardDark,
    boxSizing: "border-box",
    animationDelay: `${index * 0.05}s`,
  };

  return (
    <div className="blovi-card blovi-wall-card" style={cardStyle}>
      {showRatings && t.rating !== null && (
        <div style={{ marginBottom: "14px" }}>
          <Stars rating={t.rating} colors={colors} />
        </div>
      )}
      
      <p
        style={{
          margin: "0 0 20px 0",
          fontSize: "14.5px",
          fontWeight: 400,
          lineHeight: "1.6",
          color: colors.text,
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={36} source={t.source} showPhotos={showPhotos} fallbackAvatar={fallbackAvatar} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: "13px",
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
            <div style={{ margin: "2px 0 0", fontSize: "12px", color: colors.role, lineHeight: "1.3" }}>
              {t.author_role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
