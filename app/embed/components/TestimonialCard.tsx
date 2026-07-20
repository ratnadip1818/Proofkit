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
  const threshold = 140;
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
        boxShadow: colors.cardBg === "#ffffff" ? SHADOWS.cardLight : SHADOWS.cardDark,
        height: "240px",
        boxSizing: "border-box",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          color: colors.accent,
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.1 14.1H8.3c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3zM20.1 14.1h-2.8c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3z" />
        </svg>
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
        <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={34} source={t.source} />
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
