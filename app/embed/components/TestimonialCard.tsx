import { useState } from "react";
import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import { FONT, SHADOWS } from "../theme/tokens";
import { WallLayout } from "../types/widget";
import { Stars } from "./Stars";
import { Avatar } from "./Avatar";

function formatReviewDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

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
  useGravatar = true,
  fallbackAvatar = "Initials",
  onExpandChange,
  showDate = true,
  cardLayout = "top",
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
  useGravatar?: boolean;
  fallbackAvatar?: string;
  onExpandChange?: (expanded: boolean) => void;
  showDate?: boolean;
  cardLayout?: "top" | "bottom";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rawText = t.display_body ?? t.body_original ?? "";
  const text = rawText.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
  const isLong = text.length > 170 || text.includes("\n");
  const isLightSurface = colors.cardBg === "#ffffff" || colors.cardBg === "#fffdfa" || !colors.cardBg;
  const formattedDate = formatReviewDate(t.created_at);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandChange?.(next);
  };

  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: colors.cardBg || (isLightSurface ? "#ffffff" : colors.cardBg),
    border: `1px solid ${colors.cardBorder || (isLightSurface ? "#E5E7EB" : "#374151")}`,
    borderRadius: `${Math.max(radius, 14)}px`,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    overflow: "hidden",
    boxShadow: isLightSurface
      ? "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)"
      : SHADOWS.cardDark,
    boxSizing: "border-box",
    transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
  };

  if (cardLayout === "bottom") {
    // Classic Blovi Bottom-Author Layout
    return (
      <div className="blovi-card blovi-wall-card" style={cardStyle}>
        {showRatings && t.rating !== null && (
          <div style={{ marginBottom: "12px" }}>
            <Stars rating={t.rating} colors={colors} size={16} marginBottom={0} />
          </div>
        )}

        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", marginBottom: "16px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "1.55",
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
                fontFamily: "inherit",
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <Avatar
              name={t.author_name}
              avatarUrl={t.avatar_url}
              email={t.author_email || (t as { email?: string }).email}
              colors={colors}
              size={38}
              source={t.source}
              tags={t.tags}
              showPhotos={showPhotos}
              useGravatar={useGravatar}
              fallbackAvatar={fallbackAvatar}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  margin: 0,
                  fontSize: "13.5px",
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
          {showDate && formattedDate && (
            <div style={{ fontSize: "12px", color: isLightSurface ? "#9CA3AF" : "#6B7280", flexShrink: 0 }}>
              {formattedDate}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Senja Standard Top-Author Layout (Matches Senja widget 04d2cfcf-1d23-4b63-b72e-451b7d023971)
  return (
    <div className="blovi-card blovi-wall-card" style={cardStyle}>
      {/* 1. TOP AUTHOR PROFILE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <Avatar
            name={t.author_name}
            avatarUrl={t.avatar_url}
            email={t.author_email || (t as { email?: string }).email}
            colors={colors}
            size={40}
            source={t.source}
            tags={t.tags}
            showPhotos={showPhotos}
            useGravatar={useGravatar}
            fallbackAvatar={fallbackAvatar}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: colors.name,
                lineHeight: "1.3",
                letterSpacing: "-0.01em",
              }}
            >
              {t.author_name}
            </div>
            {t.author_role && (
              <div
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: colors.role,
                  lineHeight: "1.3",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={t.author_role}
              >
                {t.author_role}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. STARS RATING (Directly beneath author row) */}
      {showRatings && t.rating !== null && (
        <div style={{ marginBottom: "10px" }}>
          <Stars rating={t.rating} colors={colors} size={16} marginBottom={0} />
        </div>
      )}

      {/* 3. TESTIMONIAL QUOTE BODY */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "1.55",
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
              fontFamily: "inherit",
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

      {/* 4. FOOTER DATE STAMP */}
      {showDate && formattedDate && (
        <div
          style={{
            marginTop: "14px",
            fontSize: "12px",
            color: isLightSurface ? "#9CA3AF" : "#6B7280",
            fontWeight: 400,
          }}
        >
          {formattedDate}
        </div>
      )}
    </div>
  );
}
