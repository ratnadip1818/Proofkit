"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, Stars, Avatar } from "../components";
import { sendWidgetHeight } from "../utils";

export interface StackLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  showPhotos?: boolean;
  fallbackAvatar?: string;
}

// 10 seconds serene reading window modeled after uicolors.app
const AUTOPLAY_MS = 10000;

export function StackLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
  showPhotos = true,
  fallbackAvatar = "Initials",
}: StackLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Send widget height updates on change
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(sendWidgetHeight);
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, [currentIndex, testimonials.length]);

  // Smooth floating transition to next testimonial
  const next = useCallback(() => {
    if (testimonials.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);

    // Phase 1: Sink & fade out (220ms)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setAnimKey((k) => k + 1);
      setIsTransitioning(false);
    }, 220);
  }, [testimonials.length, isTransitioning]);

  // Autoplay management (10s duration, pauses when hovered or transitioning)
  useEffect(() => {
    if (testimonials.length <= 1 || isHovered || isTransitioning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isHovered, isTransitioning, next, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "20px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const t = testimonials[currentIndex];
  const rawText = t.display_body ?? t.body_original ?? "";
  const quote = rawText.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
  const isDark = colors.cardBg !== "#ffffff" && colors.cardBg !== "#fffdfa";

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: FONT,
        background: "transparent",
        padding: "4px 4px 12px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes bloviSpotlightFloatIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Single Pristine Floating Card (Zero Fake Layers, Zero Clutter) */}
      <div
        key={`spotlight-${animKey}`}
        onClick={next}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={testimonials.length > 1 ? "Click to view next review" : undefined}
        style={{
          background: isDark ? colors.cardBg : "#ffffff",
          border: `1px solid ${colors.cardBorder || (isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB")}`,
          borderRadius: `${Math.max(radiusPx, 14)}px`,
          padding: "16px 18px",
          boxShadow: isDark
            ? SHADOWS.cardDark
            : "0 4px 16px -2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)",
          boxSizing: "border-box",
          cursor: testimonials.length > 1 ? "pointer" : "default",
          userSelect: "none",
          transition: isTransitioning
            ? "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)"
            : "border-color 0.2s ease, box-shadow 0.2s ease",
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
          animation: !isTransitioning ? "bloviSpotlightFloatIn 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards" : "none",
        }}
      >
        {/* Header Row: Avatar + Author + Stars */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {/* Avatar on left */}
          <Avatar
            name={t.author_name}
            avatarUrl={t.avatar_url}
            colors={colors}
            size={34}
            source={t.source}
            showPhotos={showPhotos}
            fallbackAvatar={fallbackAvatar}
          />

          {/* Right column: Author name + Stars + Role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: colors.name,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    lineHeight: "1.3",
                  }}
                >
                  {t.author_name}
                </span>

                {t.author_role && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: colors.role,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      lineHeight: "1.3",
                      opacity: 0.85,
                    }}
                  >
                    • {t.author_role}
                  </span>
                )}
              </div>

              {/* Verified Star Ratings */}
              {showRatings && t.rating && (
                <div style={{ flexShrink: 0 }}>
                  <Stars rating={t.rating} colors={colors} size={13} marginBottom={0} />
                </div>
              )}
            </div>

            {/* Testimonial Quote Text */}
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.55",
                color: colors.text,
                margin: "8px 0 0",
                fontWeight: 400,
              }}
            >
              {quote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
