import { useEffect, useRef } from "react";
import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import { BRAND_COLORS } from "../theme/brand";
import { SHADOWS, Z_INDEX } from "../theme/tokens";
import { Stars } from "./Stars";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";

export function TestimonialModal({
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
        zIndex: Z_INDEX.modal,
        background: BRAND_COLORS.modalOverlay,
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
          boxShadow: SHADOWS.modal,
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
          <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={40} source={t.source} />
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
