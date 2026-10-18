"use client";

import React, { useMemo, useState } from "react";
import type { Testimonial } from "../constants";
import { buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { Stars } from "../components/Stars";
import { Avatar } from "../components/Avatar";
import { BadgeLink } from "../components/BadgeLink";

export interface AvatarsLayoutProps {
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
  // Specific Avatars customization props
  maxAvatars?: number;
  avatarSize?: "sm" | "md" | "lg";
  avatarAlign?: "left" | "center" | "right";
  avatarContainer?: "plain" | "pill" | "card";
  avatarText?: string;
  showRatingNumber?: boolean;
  avatarBorderColor?: string;
  avatarUrl?: string;
}

const DEFAULT_AVATAR_PHOTOS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
];

export function AvatarsLayout({
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
  maxAvatars = 5,
  avatarSize = "md",
  avatarAlign = "left",
  avatarContainer = "plain",
  avatarText,
  showRatingNumber = false,
  avatarBorderColor,
  avatarUrl,
}: AvatarsLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(
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
    if (avatarText && avatarText.trim()) {
      return avatarText
        .replace(/{count}/g, totalCount.toString())
        .replace(/{testimonial_count}/g, totalCount.toString())
        .replace(/{avg}/g, displayAvg);
    }
    return `from ${totalCount} reviews`;
  }, [avatarText, totalCount, displayAvg]);

  // 3. Resolve Colors & Sizing
  const isDark = theme === "dark";
  const resolvedTextColor = textColor || (isDark ? "#D1D5DB" : "#374151");
  const resolvedBorderColor = avatarBorderColor || (isDark ? "#27272A" : "#FFFFFF");

  const sizePx = avatarSize === "sm" ? 32 : avatarSize === "lg" ? 48 : 40;
  const overlapMargin = avatarSize === "sm" ? "-8px" : avatarSize === "lg" ? "-14px" : "-10px";

  // 4. Avatars slice & remaining count
  const effectiveMax = Math.max(1, Math.min(maxAvatars, 12));
  const displayedTestimonials = useMemo(() => {
    return testimonials.slice(0, effectiveMax);
  }, [testimonials, effectiveMax]);

  const remainingCount = totalCount > displayedTestimonials.length ? totalCount - displayedTestimonials.length : 0;

  // 5. Alignment Classes
  const alignClasses =
    avatarAlign === "center"
      ? "justify-center text-center"
      : avatarAlign === "right"
      ? "justify-end text-right"
      : "justify-start text-left";

  // 6. Container Style Classes
  let containerClasses = "inline-flex items-center gap-3.5 transition-all";
  let containerStyle: React.CSSProperties = {};

  if (avatarContainer === "pill") {
    containerClasses +=
      " px-4 py-2.5 rounded-full border shadow-2xs " +
      (isDark
        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
        : "bg-white/95 border-zinc-200/80 text-zinc-900");
    if (backgroundColor) containerStyle.backgroundColor = backgroundColor;
  } else if (avatarContainer === "card") {
    containerClasses +=
      " p-3.5 rounded-2xl border shadow-2xs " +
      (isDark
        ? "bg-zinc-900 border-zinc-800 text-zinc-100"
        : "bg-white border-zinc-200/80 text-zinc-900");
    if (backgroundColor) containerStyle.backgroundColor = backgroundColor;
  }

  // 7. Interactive Link Wrapper
  const WrapperTag = avatarUrl ? "a" : "div";
  const wrapperProps = avatarUrl
    ? {
        href: avatarUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl",
      }
    : {
        className: "inline-block",
      };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`w-full flex ${alignClasses} pt-2 pb-28 select-none`}>
      <WrapperTag {...(wrapperProps as any)}>
        <div className={containerClasses} style={containerStyle}>
          {/* Overlapping Avatars Stack (Senja Reference 2) */}
          <div className="flex items-center shrink-0" style={{ isolation: "isolate" }}>
            {displayedTestimonials.map((t, idx) => {
              const quoteSnippet = t.display_body || t.body_original || "";
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={t.id || `avatar-${idx}`}
                  className="relative group transition-all duration-200 ease-out hover:z-40"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    marginRight: idx === displayedTestimonials.length - 1 && remainingCount === 0 ? 0 : overlapMargin,
                    zIndex: isHovered ? 50 : displayedTestimonials.length - idx,
                  }}
                >
                  <div
                    className={`rounded-full transition-transform duration-200 cursor-pointer ${
                      isHovered ? "scale-115" : "group-hover:scale-115"
                    }`}
                    title={`${t.author_name}${quoteSnippet ? `: "${quoteSnippet}"` : ""}`}
                    style={{
                      border: `2px solid ${resolvedBorderColor}`,
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <Avatar
                      name={t.author_name}
                      avatarUrl={t.avatar_url || DEFAULT_AVATAR_PHOTOS[idx % DEFAULT_AVATAR_PHOTOS.length]}
                      email={t.author_email || t.email}
                      colors={colors}
                      size={sizePx}
                      showPhotos={true}
                      useGravatar={true}
                      fallbackAvatar="Initials"
                    />
                  </div>

                  {/* Interactive Micro-Card Preview on Hover */}
                  {quoteSnippet && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-56 p-3 rounded-xl text-left shadow-xl pointer-events-none z-50 transition-all duration-150 ${
                        isHovered
                          ? "opacity-100 visible scale-100"
                          : "opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#27272A" : "#FFFFFF",
                        color: isDark ? "#F4F4F5" : "#18181B",
                        border: isDark ? "1px solid #3F3F46" : "1px solid #E4E4E7",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {/* Triangle pointer pointing up */}
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-5px] w-2.5 h-2.5 rotate-45"
                        style={{
                          backgroundColor: isDark ? "#27272A" : "#FFFFFF",
                          borderLeft: isDark ? "1px solid #3F3F46" : "1px solid #E4E4E7",
                          borderTop: isDark ? "1px solid #3F3F46" : "1px solid #E4E4E7",
                        }}
                      />
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className="font-semibold text-xs truncate"
                          style={{ color: isDark ? "#F4F4F5" : "#09090B" }}
                        >
                          {t.author_name}
                        </span>
                        {typeof t.rating === "number" && t.rating > 0 && (
                          <div className="shrink-0 flex items-center">
                            <Stars rating={t.rating} colors={colors} size={11} marginBottom={0} />
                          </div>
                        )}
                      </div>
                      <p
                        className="text-[11px] leading-relaxed line-clamp-3"
                        style={{ color: isDark ? "#D4D4D8" : "#3F3F46" }}
                      >
                        &ldquo;{quoteSnippet}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Optional Overflow Pill (+N) */}
            {remainingCount > 0 && (
              <div
                className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0 select-none transition-transform hover:scale-110"
                style={{
                  width: sizePx,
                  height: sizePx,
                  border: `2px solid ${resolvedBorderColor}`,
                  backgroundColor: accent || (isDark ? "#3F3F46" : "#E4E4E7"),
                  color: accent ? "#FFFFFF" : isDark ? "#F4F4F5" : "#27272A",
                  zIndex: 0,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                +{remainingCount > 99 ? "99" : remainingCount}
              </div>
            )}
          </div>

          {/* Stars & Social Proof Stack */}
          <div className="flex flex-col justify-center gap-0.5 min-w-0">
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

              {/* Optional Rating Number (e.g. "5.0" or "4.9") */}
              {showRatingNumber && (
                <span
                  className="font-bold text-xs sm:text-sm leading-none ml-0.5 tracking-tight"
                  style={{ color: resolvedTextColor }}
                >
                  {displayAvg}
                </span>
              )}
            </div>

            {/* Subtitle Text (e.g. "from 128 reviews" or "Loved by 10,000+ creators") */}
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
