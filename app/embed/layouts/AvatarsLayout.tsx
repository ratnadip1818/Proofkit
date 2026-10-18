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
import { sendWidgetHeight } from "../utils";

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
  showRatingNumber = false,
  avatarText,
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

  // 2. Subtitle Text & Formatting (Senja Reference 2: "from 4 reviews")
  const formattedSubtitle = useMemo(() => {
    if (avatarText && avatarText.trim()) {
      return avatarText
        .replace(/{count}/g, totalCount.toString())
        .replace(/{testimonial_count}/g, totalCount.toString());
    }
    return `from ${totalCount} reviews`;
  }, [avatarText, totalCount]);

  // 3. Resolve Colors & Default Seamless Sizing
  const isDark = theme === "dark";
  const resolvedTextColor = textColor || (isDark ? "#D1D5DB" : "#4B5563");

  // Fixed optimal avatar size (40px) with clean seamless negative overlap
  const sizePx = 40;
  const overlapMargin = "-10px";

  // 4. Avatars slice & remaining count
  const effectiveMax = Math.max(1, Math.min(maxAvatars, 12));
  const displayedTestimonials = useMemo(() => {
    return testimonials.slice(0, effectiveMax);
  }, [testimonials, effectiveMax]);

  const remainingCount = totalCount > displayedTestimonials.length ? totalCount - displayedTestimonials.length : 0;

  // 5. Interactive State for Preview Card (Hover & Click support)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  // Active item is either clicked or hovered
  const activeIndex = clickedIndex !== null ? clickedIndex : hoveredIndex;

  // Dynamic height reporting to embed parent
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, testimonials.length]);

  // 6. Interactive Link Wrapper
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

  return (
    <div className="w-full flex items-center justify-start px-2 pt-2 pb-36 select-none">
      <WrapperTag {...(wrapperProps as any)}>
        {/* Seamless Inline Avatar Cluster Group (Matching Senja Reference 2) */}
        <div className="inline-flex items-center gap-3">
          {/* Overlapping Avatars Stack (No Border Rings, Seamless Overlap) */}
          <div className="flex items-center shrink-0" style={{ isolation: "isolate" }}>
            {displayedTestimonials.map((t, idx) => {
              const quoteSnippet = t.display_body || t.body_original || "";
              const isActive = activeIndex === idx;
              const photoUrl = t.avatar_url || DEFAULT_AVATAR_PHOTOS[idx % DEFAULT_AVATAR_PHOTOS.length];

              const cardPositionClass =
                idx <= 1
                  ? "left-0"
                  : idx >= displayedTestimonials.length - 2
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";

              return (
                <div
                  key={t.id || `avatar-${idx}`}
                  className="relative group transition-all duration-200 ease-out hover:z-40"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setClickedIndex(clickedIndex === idx ? null : idx);
                  }}
                  style={{
                    marginRight: idx === displayedTestimonials.length - 1 && remainingCount === 0 ? 0 : overlapMargin,
                    zIndex: isActive ? 50 : displayedTestimonials.length - idx,
                  }}
                >
                  {/* Clean Borderless Avatar Circle (Zero Ring Outline) */}
                  <div
                    className={`rounded-full transition-transform duration-200 cursor-pointer overflow-hidden shadow-2xs ${
                      isActive ? "scale-110 shadow-md ring-2 ring-blue-500/30" : "group-hover:scale-110"
                    }`}
                    title={t.author_name}
                    style={{
                      borderRadius: "50%",
                    }}
                  >
                    <Avatar
                      name={t.author_name}
                      avatarUrl={photoUrl}
                      email={t.author_email || t.email}
                      colors={colors}
                      size={sizePx}
                      showPhotos={true}
                      useGravatar={true}
                      fallbackAvatar="Initials"
                    />
                  </div>

                  {/* Fully Visible Expand View Card */}
                  {quoteSnippet && (
                    <div
                      className={`absolute ${cardPositionClass} top-full mt-2.5 w-64 p-3.5 rounded-2xl text-left shadow-2xl z-50 transition-all duration-200 pointer-events-auto ${
                        isActive
                          ? "opacity-100 visible translate-y-0 scale-100"
                          : "opacity-0 invisible -translate-y-1 scale-95 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto"
                      }`}
                      style={{
                        backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                        color: isDark ? "#F4F4F5" : "#18181B",
                        border: isDark ? "1px solid #27272A" : "1px solid #E4E4E7",
                        boxShadow: isDark
                          ? "0 18px 40px -6px rgba(0, 0, 0, 0.7), 0 6px 16px rgba(0, 0, 0, 0.5)"
                          : "0 18px 40px -6px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.05)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Author row with photo, name & stars */}
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={photoUrl}
                            alt={t.author_name}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span
                            className="font-semibold text-xs truncate"
                            style={{ color: isDark ? "#F4F4F5" : "#09090B" }}
                          >
                            {t.author_name}
                          </span>
                        </div>
                        {typeof t.rating === "number" && t.rating > 0 && (
                          <div className="shrink-0 flex items-center">
                            <Stars rating={t.rating} colors={colors} size={11} marginBottom={0} />
                          </div>
                        )}
                      </div>

                      {/* Clean review text */}
                      <p
                        className="text-xs leading-relaxed line-clamp-4 font-normal"
                        style={{ color: isDark ? "#D4D4D8" : "#3F3F46" }}
                      >
                        {quoteSnippet}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Overflow Pill (+N) Without Border Ring */}
            {remainingCount > 0 && (
              <div
                className="relative flex items-center justify-center rounded-full font-bold text-xs shrink-0 select-none transition-transform hover:scale-110 shadow-2xs"
                style={{
                  width: sizePx,
                  height: sizePx,
                  backgroundColor: accent || (isDark ? "#3F3F46" : "#E4E4E7"),
                  color: accent ? "#FFFFFF" : isDark ? "#F4F4F5" : "#27272A",
                  zIndex: 0,
                }}
              >
                +{remainingCount > 99 ? "99" : remainingCount}
              </div>
            )}
          </div>

          {/* Stacked Stars & Reviews Subtitle (Senja Reference 2 Signature) */}
          <div className="flex flex-col justify-center gap-1 shrink-0 min-w-0">
            <div className="flex items-center gap-1.5">
              {showRatings && (
                <Stars
                  rating={roundedRating}
                  colors={colors}
                  size={15}
                  marginBottom={0}
                />
              )}

              {/* Optional Rating Score Number (e.g. "4.9") */}
              {showRatingNumber && (
                <span
                  className="font-bold text-xs sm:text-sm leading-none ml-0.5 tracking-tight"
                  style={{ color: resolvedTextColor }}
                >
                  {displayAvg}
                </span>
              )}
            </div>

            <div
              className="text-xs sm:text-[13px] font-medium tracking-tight truncate transition-opacity"
              style={{ color: resolvedTextColor }}
            >
              {formattedSubtitle}
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
