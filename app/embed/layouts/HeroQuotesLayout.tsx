"use client";

import React, { useMemo } from "react";
import type { Testimonial } from "../constants";
import { buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { Stars } from "../components/Stars";
import { Avatar } from "../components/Avatar";
import { BadgeLink } from "../components/BadgeLink";

export interface HeroQuotesLayoutProps {
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
  // Specific Hero Quotes configuration
  columns?: 2 | 3;
  quotesStyle?: "editorial" | "card";
  avatarPosition?: "top" | "bottom";
  maxQuotes?: number;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
}

const DEFAULT_PORTRAITS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
];

export function HeroQuotesLayout({
  testimonials = [],
  theme = "light",
  showRatings = true,
  showBadge = true,
  accent,
  radius = "rounded",
  preset = "base",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
  columns = 3,
  quotesStyle = "editorial",
  avatarPosition = "top",
  maxQuotes = 5,
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
}: HeroQuotesLayoutProps) {
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

  const isDark = theme === "dark";

  // Limit testimonials slice
  const effectiveMax = Math.max(1, Math.min(maxQuotes, 12));
  const displayedTestimonials = useMemo(() => {
    return testimonials.slice(0, effectiveMax);
  }, [testimonials, effectiveMax]);

  // Dynamic layout calculations
  const isCard = quotesStyle === "card";

  return (
    <div
      className="w-full py-8 px-4 flex flex-col items-center select-none"
      style={{
        backgroundColor: isDark ? (colors.pageBg || "#0B0F19") : (colors.pageBg || "transparent"),
        color: colors.text,
      }}
    >
      {/* Centered Editorial Quotes Grid matching Senja Reference 3 */}
      <div
        className="w-full max-w-5xl flex flex-wrap justify-center gap-x-8 sm:gap-x-10 gap-y-12 sm:gap-y-16 text-center"
      >
        {displayedTestimonials.map((t, idx) => {
          const quote = t.display_body || t.body_original || "";
          const photoUrl = t.avatar_url || DEFAULT_PORTRAITS[idx % DEFAULT_PORTRAITS.length];
          const authorRole = t.author_role || t.tags?.[0] || "";

          return (
            <div
              key={t.id || `quote-${idx}`}
              className="w-full min-w-0 transition-transform duration-200 hover:-translate-y-1"
              style={{
                flex: columns === 2 ? "1 1 calc(50% - 2rem)" : "1 1 calc(33.333% - 2rem)",
                maxWidth: columns === 2 ? "calc(50% - 1rem)" : "calc(33.333% - 1rem)",
              }}
            >
              <div
                className={`mx-auto flex flex-col items-center gap-3.5 h-full ${
                  isCard
                    ? "p-6 rounded-2xl border shadow-xs transition-all " +
                      (isDark
                        ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
                        : "bg-white border-zinc-200/80 text-zinc-900")
                    : "p-2"
                }`}
                style={isCard && backgroundColor ? { backgroundColor } : undefined}
              >
                {/* 1. TOP AVATAR (Senja Reference 3 style) */}
                {avatarPosition === "top" && showPhotos && (
                  <div className="shrink-0 mb-1">
                    <div
                      className="rounded-full shadow-xs transition-transform duration-200 hover:scale-105"
                      style={{
                        padding: "2px",
                        backgroundColor: isDark ? "#27272A" : "#FFFFFF",
                        border: isDark ? "1px solid #3F3F46" : "1px solid #E5E7EB",
                      }}
                    >
                      <Avatar
                        name={t.author_name}
                        avatarUrl={photoUrl}
                        email={t.author_email || t.email}
                        colors={colors}
                        size={52}
                        showPhotos={true}
                        useGravatar={useGravatar}
                        fallbackAvatar={fallbackAvatar}
                      />
                    </div>
                  </div>
                )}

                {/* 2. QUOTE TEXT WITH TYPOGRAPHIC QUOTES */}
                <div className="text-center text-[15px] sm:text-base leading-snug px-1">
                  <span
                    className="font-serif font-bold text-lg sm:text-xl opacity-40 select-none mr-0.5"
                    style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                  >
                    &ldquo;
                  </span>
                  <span
                    className="font-normal leading-relaxed"
                    style={{
                      color: textColor || (isDark ? "#F4F4F5" : "#27272A"),
                    }}
                  >
                    {quote}
                  </span>
                  <span
                    className="font-serif font-bold text-lg sm:text-xl opacity-40 select-none ml-0.5"
                    style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                  >
                    &rdquo;
                  </span>
                </div>

                {/* 3. GOLD STAR RATING */}
                {showRatings && typeof t.rating === "number" && t.rating > 0 && (
                  <div className="flex justify-center mt-0.5">
                    <Stars rating={t.rating} colors={colors} size={15} marginBottom={0} />
                  </div>
                )}

                {/* 4. AUTHOR DETAILS */}
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="font-semibold text-sm tracking-tight"
                    style={{
                      color: isDark ? "#FFFFFF" : "#09090B",
                    }}
                  >
                    {t.author_name}
                  </span>
                  {authorRole && (
                    <span
                      className="text-xs"
                      style={{
                        color: isDark ? "#A1A1AA" : "#71717A",
                      }}
                    >
                      {authorRole}
                    </span>
                  )}
                </div>

                {/* 5. BOTTOM AVATAR (if avatarPosition === "bottom") */}
                {avatarPosition === "bottom" && showPhotos && (
                  <div className="shrink-0 mt-2">
                    <div
                      className="rounded-full shadow-xs"
                      style={{
                        padding: "2px",
                        backgroundColor: isDark ? "#27272A" : "#FFFFFF",
                        border: isDark ? "1px solid #3F3F46" : "1px solid #E5E7EB",
                      }}
                    >
                      <Avatar
                        name={t.author_name}
                        avatarUrl={photoUrl}
                        email={t.author_email || t.email}
                        colors={colors}
                        size={52}
                        showPhotos={true}
                        useGravatar={useGravatar}
                        fallbackAvatar={fallbackAvatar}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BLOVI COLLECTION BADGE */}
      {showBadge && (
        <div className="mt-12 sm:mt-14 flex justify-center">
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
