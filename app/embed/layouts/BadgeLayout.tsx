"use client";

import React, { useMemo } from "react";
import type { Testimonial } from "../constants";
import { buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { Stars } from "../components/Stars";
import { BadgeLink } from "../components/BadgeLink";

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
  badgeText,
  badgeAlign = "left",
  badgeContainer = "plain",
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
  const { avgRating, totalCount, roundedRating } = useMemo(() => {
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

  // 2. Format Subtitle Text
  const formattedText = useMemo(() => {
    if (badgeText && badgeText.trim()) {
      return badgeText
        .replace(/{count}/g, totalCount.toString())
        .replace(/{testimonial_count}/g, totalCount.toString());
    }
    return `from ${totalCount} reviews`;
  }, [badgeText, totalCount]);

  // 3. Resolve Colors
  const isDark = theme === "dark";
  const resolvedTextColor = textColor || (isDark ? "#D1D5DB" : "#374151");
  const boxBg = ratingBoxBg || (accent ? accent : isDark ? "#27272A" : "#18181B");
  const boxText = ratingBoxText || "#FFFFFF";

  // 4. Alignment Classes
  const alignClasses =
    badgeAlign === "center"
      ? "justify-center text-center"
      : badgeAlign === "right"
      ? "justify-end text-right"
      : "justify-start text-left";

  // 5. Container Style Classes
  let containerClasses = "inline-flex items-center gap-3.5 transition-all";
  let containerStyle: React.CSSProperties = {};

  if (badgeContainer === "pill") {
    containerClasses +=
      " px-4 py-2 rounded-full border shadow-2xs " +
      (isDark
        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
        : "bg-white/95 border-zinc-200/80 text-zinc-900");
    if (backgroundColor) containerStyle.backgroundColor = backgroundColor;
  } else if (badgeContainer === "card") {
    containerClasses +=
      " p-3.5 rounded-2xl border shadow-2xs " +
      (isDark
        ? "bg-zinc-900 border-zinc-800 text-zinc-100"
        : "bg-white border-zinc-200/80 text-zinc-900");
    if (backgroundColor) containerStyle.backgroundColor = backgroundColor;
  }

  // 6. Interactive Link Component wrapper
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
    <div className={`w-full flex ${alignClasses} py-2 select-none`}>
      <WrapperTag {...(wrapperProps as any)}>
        <div className={containerClasses} style={containerStyle}>
          {/* A. Large Boxed Rating Score (Senja Reference 1 Signature) */}
          {badgeStyle === "large" && (
            <div
              className="flex flex-col justify-center items-center rounded-lg px-2.5 py-1.5 font-black text-sm sm:text-base leading-none tracking-tight shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: boxBg,
                color: boxText,
                borderRadius: `${Math.min(radiusPx, 10)}px`,
              }}
            >
              <span>{displayAvg}</span>
            </div>
          )}

          {/* B. Stars & Social Proof Stack */}
          <div className="flex flex-col justify-center gap-1 min-w-0">
            {/* Stars Row */}
            <div className="flex items-center gap-1.5">
              {showRatings && (
                <Stars
                  rating={roundedRating}
                  colors={colors}
                  size={15}
                  marginBottom={0}
                />
              )}

              {/* Inline Score if not in Large mode */}
              {badgeStyle === "inline" && (
                <span
                  className="font-black text-sm sm:text-base leading-none ml-0.5 tracking-tight"
                  style={{ color: resolvedTextColor }}
                >
                  {displayAvg}
                </span>
              )}
            </div>

            {/* Social Proof Subtitle (e.g., "from 128 reviews") */}
            <div
              className="text-xs sm:text-[13px] font-medium tracking-tight truncate group-hover:opacity-85 transition-opacity"
              style={{ color: resolvedTextColor }}
            >
              {formattedText}
            </div>
          </div>

          {/* Optional Tiny Blovi Badge/Watermark */}
          {showBadge && (
            <div className="ml-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
              <BadgeLink colors={colors} />
            </div>
          )}
        </div>
      </WrapperTag>
    </div>
  );
}
