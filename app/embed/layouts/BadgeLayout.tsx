"use client";

import React, { useMemo } from "react";
import type { Testimonial } from "../constants";
import { buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { Stars } from "../components/Stars";

export interface BadgeLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings?: boolean;
  showBadge?: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
  // Specific Badge customization props
  badgeStyle?: "large" | "inline";
  badgeText?: string;
  badgeAlign?: "left" | "center" | "right";
  badgeContainer?: "plain" | "pill" | "card";
  badgeUrl?: string;
  ratingBoxBg?: string;
  ratingBoxText?: string;
}

export function BadgeLayout({
  testimonials = [],
  theme = "light",
  showRatings = true,
  // Note: Blovi branding is intentionally excluded on this widget per design requirements
  showBadge = false,
  accent,
  radius = "rounded",
  preset = "base",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
  badgeStyle = "large",
  badgeUrl,
  ratingBoxBg,
  ratingBoxText,
}: BadgeLayoutProps) {
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

  // 1. Calculate Average Rating & Count
  const { avgRating, roundedRating } = useMemo(() => {
    const rated = testimonials.filter((t) => typeof t.rating === "number" && t.rating > 0);
    const count = testimonials.length > 0 ? testimonials.length : 128;
    if (rated.length === 0) {
      return { avgRating: 4.9, totalCount: count, roundedRating: 5 };
    }
    const sum = rated.reduce((acc, t) => acc + (t.rating || 5), 0);
    const avg = sum / rated.length;
    return {
      avgRating: avg,
      totalCount: count,
      roundedRating: Math.round(avg),
    };
  }, [testimonials]);

  const displayAvg = avgRating.toFixed(1);

  // 2. Resolve Colors & Box Aesthetics
  const isDark = theme === "dark";
  const resolvedTextColor = textColor || (isDark ? "#D1D5DB" : "#374151");
  const boxBg = ratingBoxBg || (accent ? accent : isDark ? "#27272A" : "#18181B");
  const boxText = ratingBoxText || "#FFFFFF";

  // 3. Interactive Link Component wrapper
  const WrapperTag = badgeUrl ? "a" : "div";
  const wrapperProps = badgeUrl
    ? {
        href: badgeUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl",
      }
    : {
        className: "inline-block",
      };

  return (
    <div className="w-full flex items-center justify-start py-1 select-none">
      <WrapperTag {...(wrapperProps as any)}>
        {/* Default Seamless Presentation (No Pill, No Card Container) */}
        {badgeStyle === "large" ? (
          /* Style A: Large Boxed Score + Stars Row (Reference 1 Signature) */
          <div className="inline-flex items-center gap-2.5 transition-all">
            <div
              className="flex items-center justify-center px-2.5 py-1.5 font-bold text-sm sm:text-base leading-none tracking-tight shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: boxBg,
                color: boxText,
                borderRadius: `${Math.min(radiusPx, 8)}px`,
              }}
            >
              <span>{displayAvg}</span>
            </div>

            {showRatings && (
              <div className="shrink-0 flex items-center">
                <Stars
                  rating={roundedRating}
                  colors={colors}
                  size={18}
                  marginBottom={0}
                />
              </div>
            )}
          </div>
        ) : (
          /* Style B: Seamless Inline Stars + Score Text */
          <div className="inline-flex items-center gap-2 transition-all">
            {showRatings && (
              <div className="shrink-0 flex items-center">
                <Stars
                  rating={roundedRating}
                  colors={colors}
                  size={18}
                  marginBottom={0}
                />
              </div>
            )}

            <span
              className="font-bold text-sm sm:text-base leading-none tracking-tight"
              style={{ color: resolvedTextColor }}
            >
              {displayAvg}
            </span>
          </div>
        )}
      </WrapperTag>
    </div>
  );
}
