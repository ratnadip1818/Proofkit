import { useState } from "react";
import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import { FONT, SHADOWS } from "../theme/tokens";
import { WallLayout } from "../types/widget";
import { Stars } from "./Stars";
import { Avatar } from "./Avatar";

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
  fallbackAvatar = "Initials",
  onExpandChange,
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
  onExpandChange?: (expanded: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rawText = t.display_body ?? t.body_original ?? "";
  const text = rawText.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
  const isLong = text.length > 170 || text.includes("\n");
  const isLightSurface = colors.cardBg === "#ffffff" || colors.cardBg === "#fffdfa" || !colors.cardBg;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandChange?.(next);
  };

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: isLightSurface ? "#ffffff" : colors.cardBg,
    border: isLightSurface ? "1px solid #E5E7EB" : `1px solid ${colors.cardBorder}`,
    borderRadius: `${Math.max(radius, 12)}px`,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    overflow: "hidden",
    boxShadow: isLightSurface
      ? "0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 12px 0 rgba(0,0,0,0.02)"
      : SHADOWS.cardDark,
    boxSizing: "border-box",
    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
  };

  return (
    <div className="blovi-card blovi-wall-card" style={cardStyle}>
      {showRatings && t.rating !== null && (
        <div style={{ marginBottom: "14px" }}>
          <Stars rating={t.rating} colors={colors} />
        </div>
      )}
      
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", marginBottom: "18px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "14.5px",
            fontWeight: 400,
            lineHeight: "1.6",
            color: colors.text,
            whiteSpace: isExpanded ? "pre-line" : "normal",
            display: isExpanded ? "block" : "-webkit-box",
            WebkitLineClamp: isExpanded ? undefined : 4,
            WebkitBoxOrient: "vertical",
            overflow: isExpanded ? "visible" : "hidden",
            textOverflow: isExpanded ? "clip" : "ellipsis",
          }}
        >
          {text}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={handleToggleExpand}
            style={{
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              padding: "6px 0 0 0",
              margin: 0,
              fontSize: "12.5px",
              fontWeight: 600,
              color: colors.accent || "#2563EB",
              cursor: "pointer",
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              opacity: 0.9,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
          >
            {isExpanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={36} source={t.source} showPhotos={showPhotos} fallbackAvatar={fallbackAvatar} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              color: colors.name,
              lineHeight: "1.3",
            }}
          >
            {t.author_name}
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
