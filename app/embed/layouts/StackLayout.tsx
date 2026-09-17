"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars } from "../components";
import { sendWidgetHeight } from "../utils";

export interface StackLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

const AUTOPLAY_MS = 4500;
const PEEK_CARDS = 3; // how many stacked cards visible behind the front

export function StackLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: StackLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [topIndex, setTopIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(sendWidgetHeight);
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, [topIndex, testimonials.length]);

  const advance = useCallback(() => {
    if (testimonials.length <= 1 || exiting) return;
    setExiting(true);
    setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % testimonials.length);
      setExiting(false);
    }, 320);
  }, [testimonials.length, exiting]);

  // Autoplay
  useEffect(() => {
    if (testimonials.length <= 1) return;
    timerRef.current = setTimeout(advance, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [topIndex, advance, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const t = testimonials[topIndex];
  const quote = t.display_body ?? t.body_original ?? "";
  const initials = ((t.author_name ?? "A").trim().split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2)).toUpperCase();

  const isDark = colors.cardBg !== "#ffffff";

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: FONT, background: colors.pageBg, padding: "32px 24px 28px", boxSizing: "border-box" }}
    >
      <style>{`
        @keyframes proofkit-stack-exit {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          60%  { transform: translateY(-22px) scale(1.04) rotate(-2deg); opacity: 0.6; }
          100% { transform: translateY(-60px) scale(0.95) rotate(-4deg); opacity: 0; }
        }
        .proofkit-stack-exit {
          animation: proofkit-stack-exit 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes proofkit-stack-enter {
          from { transform: translateY(10px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        .proofkit-stack-enter {
          animation: proofkit-stack-enter 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .proofkit-stack-exit, .proofkit-stack-enter { animation: none; }
        }
      `}</style>

      {/* Stack container */}
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto" }}>

        {/* Peek cards behind */}
        {Array.from({ length: Math.min(PEEK_CARDS, testimonials.length - 1) }).map((_, i) => {
          const peekIdx = (topIndex + i + 1) % testimonials.length;
          const depth = i + 1;
          return (
            <div
              key={`peek-${peekIdx}`}
              style={{
                position: "absolute",
                top: depth * 8,
                left: depth * 6,
                right: depth * 6,
                height: "100%",
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: radiusPx,
                boxShadow: isDark ? SHADOWS.cardDark : SHADOWS.cardLight,
                opacity: 1 - depth * 0.18,
                zIndex: PEEK_CARDS - depth,
                transform: `scale(${1 - depth * 0.025})`,
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* Top card */}
        <div
          className={exiting ? "proofkit-stack-exit" : "proofkit-stack-enter"}
          style={{
            position: "relative",
            zIndex: PEEK_CARDS + 1,
            background: colors.cardBg,
            border: `1.5px solid ${colors.cardBorder}`,
            borderRadius: radiusPx,
            padding: "28px 28px 24px",
            boxShadow: isDark ? SHADOWS.cardHoverDark : SHADOWS.cardHoverLight,
            cursor: "pointer",
          }}
          onClick={advance}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") advance(); }}
          aria-label="Next testimonial"
        >
          {/* Quote mark */}
          <div
            style={{
              fontSize: 56,
              lineHeight: 1,
              color: colors.accent,
              opacity: 0.15,
              fontFamily: "Georgia, serif",
              marginBottom: -8,
              marginTop: -8,
              userSelect: "none",
            }}
          >
            &ldquo;
          </div>

          {showRatings && t.rating && (
            <div style={{ marginBottom: 12 }}>
              <Stars rating={t.rating} colors={colors} size={16} marginBottom={0} />
            </div>
          )}

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: colors.text,
              margin: "0 0 20px",
              fontStyle: "italic",
            }}
          >
            {quote}
          </p>

          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {t.avatar_url ? (
              <img
                src={t.avatar_url}
                alt={t.author_name}
                width={44}
                height={44}
                loading="lazy"
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.accent}20` }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: colors.avatarBg,
                  color: colors.avatarText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  border: `2px solid ${colors.accent}20`,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.name }}>{t.author_name}</div>
              {t.author_role && (
                <div style={{ fontSize: 12, color: colors.role, marginTop: 2 }}>{t.author_role}</div>
              )}
            </div>

            {/* Tap hint */}
            <div
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: colors.role,
                opacity: 0.7,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{topIndex + 1}/{testimonials.length}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {testimonials.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setExiting(false); setTopIndex(i); }}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === topIndex ? 20 : 7,
                height: 7,
                borderRadius: 4,
                background: i === topIndex ? colors.accent : colors.dotInactive,
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {showBadge && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
