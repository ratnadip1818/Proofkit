"use client";

import { useEffect, useState, useMemo } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
  TestimonialModal,
} from "../components";
import { sendWidgetHeight } from "../utils";

export interface MarqueeLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
  // Dual-Row Marquee Specific Options (Matching Senja Reference #4)
  marqueeRows?: 1 | 2;
  marqueeDirection?: "left" | "right" | "opposing";
  marqueeSpeed?: "slow" | "normal" | "fast";
  marqueePauseOnHover?: boolean;
  cardLayout?: "top" | "bottom";
  cardWidth?: number;
}

export function MarqueeLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
  marqueeRows = 2,
  marqueeDirection = "opposing",
  marqueeSpeed = "normal",
  marqueePauseOnHover = true,
  cardLayout = "top",
  cardWidth = 290,
}: MarqueeLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(
    theme,
    accent,
    radius,
    presetDef.preset.overrides,
    {
      backgroundColor,
      textColor,
      ratingColor,
      ratingBorderColor,
      highlightColor,
    }
  );

  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [testimonials.length, marqueeRows]);

  // Duration in seconds based on speed
  const durationSeconds = useMemo(() => {
    switch (marqueeSpeed) {
      case "fast":
        return 18;
      case "slow":
        return 48;
      case "normal":
      default:
        return 30;
    }
  }, [marqueeSpeed]);

  // Prepare items for Row 1 and Row 2
  const { row1Items, row2Items } = useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return { row1Items: [], row2Items: [] };
    }

    if (marqueeRows === 1) {
      let mult = [...testimonials];
      while (mult.length < 8) {
        mult = [...mult, ...testimonials];
      }
      return {
        row1Items: [...mult, ...mult],
        row2Items: [],
      };
    }

    // Split for 2 rows
    let r1: Testimonial[] = [];
    let r2: Testimonial[] = [];

    if (testimonials.length === 1) {
      r1 = [testimonials[0]];
      r2 = [testimonials[0]];
    } else {
      testimonials.forEach((t, i) => {
        if (i % 2 === 0) {
          r1.push(t);
        } else {
          r2.push(t);
        }
      });
      if (r2.length === 0) r2 = [...r1];
    }

    while (r1.length < 6) {
      r1 = [...r1, ...r1];
    }
    while (r2.length < 6) {
      r2 = [...r2, ...r2];
    }

    return {
      row1Items: [...r1, ...r1],
      row2Items: [...r2, ...r2],
    };
  }, [testimonials, marqueeRows]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  // Row 1 & Row 2 animation class names and durations
  const row1AnimationName =
    marqueeDirection === "right" ? "blovi-marquee-right" : "blovi-marquee-left";
  const row2AnimationName =
    marqueeDirection === "opposing"
      ? "blovi-marquee-right"
      : marqueeDirection === "right"
      ? "blovi-marquee-right"
      : "blovi-marquee-left";

  const isDark = theme === "dark";

  return (
    <div
      style={{
        fontFamily: FONT,
        padding: "20px 0",
        background: isDark ? (colors.pageBg || "#0B0F19") : (colors.pageBg || "transparent"),
        overflow: "hidden",
        width: "100%",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes blovi-marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes blovi-marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .blovi-marquee-track-row1 {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: ${row1AnimationName} ${durationSeconds}s linear infinite;
          padding: 4px 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .blovi-marquee-track-row2 {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: ${row2AnimationName} ${Math.round(durationSeconds * 1.08)}s linear infinite;
          padding: 4px 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        ${
          marqueePauseOnHover
            ? `
        .blovi-marquee-track-row1:hover,
        .blovi-marquee-track-row2:hover {
          animation-play-state: paused;
        }
        `
            : ""
        }
        .blovi-marquee-card-wrapper {
          width: ${cardWidth}px;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .blovi-marquee-card-wrapper:hover {
          transform: translateY(-3px);
        }
        .blovi-card {
          transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .blovi-marquee-card-wrapper:hover .blovi-card {
          border-color: ${colors.accent || "#2563EB"} !important;
          box-shadow: ${
            isDark
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(37, 99, 235, 0.15)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 15px -3px rgba(37, 99, 235, 0.1)"
          } !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .blovi-marquee-track-row1,
          .blovi-marquee-track-row2 {
            animation: none;
          }
        }
      `}</style>

      {/* Masked Marquee Wrapper with soft edge gradients */}
      <div
        style={{
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "6px 0",
        }}
      >
        {/* ROW 1 */}
        <div className="blovi-marquee-track-row1">
          {row1Items.map((t, i) => (
            <div
              key={`r1-${t.id}-${i}`}
              className="blovi-marquee-card-wrapper"
              onClick={() => setActiveModalTestimonial(t)}
            >
              <TestimonialCard
                t={t}
                showRatings={showRatings}
                colors={colors}
                radius={radiusPx}
                index={i}
                showPhotos={showPhotos}
                useGravatar={useGravatar}
                fallbackAvatar={fallbackAvatar}
                cardLayout={cardLayout}
                showDate={false}
                onReadMore={setActiveModalTestimonial}
              />
            </div>
          ))}
        </div>

        {/* ROW 2 (Dual Marquee) */}
        {marqueeRows === 2 && row2Items.length > 0 && (
          <div className="blovi-marquee-track-row2">
            {row2Items.map((t, i) => (
              <div
                key={`r2-${t.id}-${i}`}
                className="blovi-marquee-card-wrapper"
                onClick={() => setActiveModalTestimonial(t)}
              >
                <TestimonialCard
                  t={t}
                  showRatings={showRatings}
                  colors={colors}
                  radius={radiusPx}
                  index={i}
                  showPhotos={showPhotos}
                  useGravatar={useGravatar}
                  fallbackAvatar={fallbackAvatar}
                  cardLayout={cardLayout}
                  showDate={false}
                  onReadMore={setActiveModalTestimonial}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showBadge && (
        <div style={{ marginTop: "16px" }}>
          <BadgeLink colors={colors} />
        </div>
      )}

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
