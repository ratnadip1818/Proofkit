"use client";

import { useEffect, useState, useMemo } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
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
  // Dual-Row Marquee Specific Options (Optimized for Consistent Sizing & Calm Slow Pace)
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
  marqueePauseOnHover = true,
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

  // In-place inline expansion state (No popup modal per user requirement!)
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const isAnyExpanded = expandedKey !== null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [testimonials.length, expandedKey]);

  // Calm, readable slow pace default
  const row1Duration = 55;
  const row2Duration = 60;

  // Fixed consistent card dimensions (320px width x 185px height base)
  const consistentCardWidth = 320;
  const consistentCardHeight = 185;

  // Prepare duplicate items for infinite smooth scrolling (Always 2 Rows)
  const { row1Items, row2Items } = useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return { row1Items: [], row2Items: [] };
    }

    // Split evenly across 2 opposing rows (permanently dual marquee)
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
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="blovi-marquee-container"
      style={{
        fontFamily: FONT,
        padding: "16px 0 36px 0",
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
          align-items: flex-start;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: blovi-marquee-left ${row1Duration}s linear infinite;
          padding: 6px 0 20px 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .blovi-marquee-track-row2 {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          width: max-content;
          will-change: transform;
          animation: blovi-marquee-right ${row2Duration}s linear infinite;
          padding: 6px 0 20px 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        /* Stop animation immediately on pointer hover across container OR when any card is expanded */
        ${
          marqueePauseOnHover
            ? `
        .blovi-marquee-container:hover .blovi-marquee-track-row1,
        .blovi-marquee-container:hover .blovi-marquee-track-row2 {
          animation-play-state: paused !important;
        }
        `
            : ""
        }
        ${
          isAnyExpanded
            ? `
        .blovi-marquee-track-row1,
        .blovi-marquee-track-row2 {
          animation-play-state: paused !important;
        }
        `
            : ""
        }
        /* Consistent Card Sizing: 320px width & 185px base height with inline downward expansion */
        .blovi-marquee-card-wrapper {
          width: ${consistentCardWidth}px;
          min-height: ${consistentCardHeight}px;
          height: auto;
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .blovi-marquee-card-wrapper:hover {
          transform: translateY(-2px);
        }
        .blovi-marquee-card-wrapper.is-expanded {
          z-index: 50;
        }
        .blovi-marquee-card-wrapper .blovi-card {
          min-height: ${consistentCardHeight}px !important;
          height: auto !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          padding: 16px 18px !important;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .blovi-marquee-card-wrapper:hover .blovi-card {
          border-color: ${colors.accent || "#2563EB"} !important;
          box-shadow: ${
            isDark
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(37, 99, 235, 0.15)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 15px -3px rgba(37, 99, 235, 0.1)"
          } !important;
        }
        .blovi-marquee-card-wrapper.is-expanded .blovi-card {
          border-color: ${colors.accent || "#2563EB"} !important;
          box-shadow: ${
            isDark
              ? "0 20px 45px -8px rgba(0, 0, 0, 0.8), 0 0 20px -3px rgba(37, 99, 235, 0.25)"
              : "0 20px 45px -8px rgba(0, 0, 0, 0.18), 0 0 20px -3px rgba(37, 99, 235, 0.12)"
          } !important;
        }
        /* When NOT expanded: clamp to 3 lines cleanly */
        .blovi-marquee-card-wrapper:not(.is-expanded) .blovi-card p {
          display: -webkit-box !important;
          -webkit-line-clamp: 3 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          font-size: 13.5px !important;
          line-height: 1.5 !important;
        }
        /* When expanded: show full text downwards without any popup modal */
        .blovi-marquee-card-wrapper.is-expanded .blovi-card p {
          display: block !important;
          -webkit-line-clamp: unset !important;
          overflow: visible !important;
          font-size: 13.5px !important;
          line-height: 1.55 !important;
        }
        /* Style the read more / show less toggle button */
        .blovi-marquee-card-wrapper .blovi-card button {
          display: inline-flex !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          color: ${colors.accent || "#2563EB"} !important;
          margin-top: 6px !important;
          cursor: pointer !important;
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
          gap: "14px",
          padding: "4px 0",
        }}
      >
        {/* ROW 1 (Dual Marquee - Scrolls Left) */}
        <div className="blovi-marquee-track-row1">
          {row1Items.map((t, i) => {
            const cardKey = `r1-${t.id}-${i}`;
            const isExpanded = expandedKey === cardKey;

            return (
              <div
                key={cardKey}
                className={`blovi-marquee-card-wrapper ${isExpanded ? "is-expanded" : ""}`}
                onClick={(e) => {
                  // Toggle expand in place downwards (No popup modal!)
                  e.stopPropagation();
                  setExpandedKey(isExpanded ? null : cardKey);
                }}
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
                  cardLayout="top"
                  showDate={false}
                  onExpandChange={(exp) => setExpandedKey(exp ? cardKey : null)}
                />
              </div>
            );
          })}
        </div>

        {/* ROW 2 (Dual Marquee - Scrolls Right) */}
        {row2Items.length > 0 && (
          <div className="blovi-marquee-track-row2">
            {row2Items.map((t, i) => {
              const cardKey = `r2-${t.id}-${i}`;
              const isExpanded = expandedKey === cardKey;

              return (
                <div
                  key={cardKey}
                  className={`blovi-marquee-card-wrapper ${isExpanded ? "is-expanded" : ""}`}
                  onClick={(e) => {
                    // Toggle expand in place downwards (No popup modal!)
                    e.stopPropagation();
                    setExpandedKey(isExpanded ? null : cardKey);
                  }}
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
                    cardLayout="top"
                    showDate={false}
                    onExpandChange={(exp) => setExpandedKey(exp ? cardKey : null)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBadge && (
        <div style={{ marginTop: "16px" }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
