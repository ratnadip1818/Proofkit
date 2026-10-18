"use client";

import React, { useMemo, useState, useEffect } from "react";
import type { Testimonial } from "../constants";
import { buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { Stars } from "../components/Stars";
import { Avatar } from "../components/Avatar";
import { BadgeLink } from "../components/BadgeLink";
import { TestimonialModal } from "../components/TestimonialModal";
import { sendWidgetHeight } from "../utils";

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
  // Hero Quotes configuration
  columns?: 2 | 3;
  maxQuotes?: number;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  // Retained for backward-compatibility
  quotesStyle?: "editorial" | "card";
  avatarPosition?: "top" | "bottom";
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
  maxQuotes = 3,
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
}: HeroQuotesLayoutProps) {
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

  // Dynamic height reporting to embed parent
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [testimonials.length, columns, maxQuotes]);

  const isDark = theme === "dark";

  // Limit testimonials slice
  const effectiveMax = Math.max(1, Math.min(maxQuotes, 12));
  const displayedTestimonials = useMemo(() => {
    return testimonials.slice(0, effectiveMax);
  }, [testimonials, effectiveMax]);

  const isSingleQuote = displayedTestimonials.length === 1;
  const isTwoQuotes = displayedTestimonials.length === 2 || columns === 2;

  return (
    <div
      className="w-full py-6 px-4 flex flex-col items-center select-none"
      style={{
        backgroundColor: (backgroundColor && backgroundColor !== "#FFFFFF") ? backgroundColor : (isDark ? "#0B0F19" : "transparent"),
        color: colors.text,
      }}
    >
      {/* Frameless Editorial Quotes Presentation (Zero Card Box Behind Quotes) */}
      {isSingleQuote ? (
        /* Variant A: Single Hero Statement (Max Quotes = 1) */
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center py-4 px-2">
          {displayedTestimonials.map((t, idx) => {
            const rawQuote = t.display_body || t.body_original || "";
            const quote = rawQuote.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
            const photoUrl = t.avatar_url || DEFAULT_PORTRAITS[idx % DEFAULT_PORTRAITS.length];
            const authorRole = t.author_role || t.tags?.[0] || "";

            return (
              <div
                key={t.id || `single-quote-${idx}`}
                className="w-full flex flex-col items-center gap-4 cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
                onClick={() => setActiveModalTestimonial(t)}
              >
                {/* 1. Prominent Top Avatar (Clean, no card border) */}
                {showPhotos && (
                  <div className="shrink-0 mb-1">
                    <div
                      className="rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden"
                      style={{
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Avatar
                        name={t.author_name}
                        avatarUrl={photoUrl}
                        email={t.author_email || t.email}
                        colors={colors}
                        size={64}
                        showPhotos={true}
                        useGravatar={useGravatar}
                        fallbackAvatar={fallbackAvatar}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Premium Hero Quote Typography */}
                <div className="text-center px-2 max-w-2xl mx-auto">
                  <p
                    className="text-xl sm:text-2xl md:text-[27px] font-normal leading-[1.48] tracking-[-0.015em]"
                    style={{
                      color: textColor || (isDark ? "#F9FAFB" : "#111827"),
                    }}
                  >
                    <span
                      className="font-serif text-2xl sm:text-3xl opacity-35 select-none mr-1.5"
                      style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                    >
                      &ldquo;
                    </span>
                    {quote}
                    <span
                      className="font-serif text-2xl sm:text-3xl opacity-35 select-none ml-1.5"
                      style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                    >
                      &rdquo;
                    </span>
                  </p>
                </div>

                {/* 3. Gold Stars Rating */}
                {showRatings && typeof t.rating === "number" && t.rating > 0 && (
                  <div className="flex justify-center mt-0.5">
                    <Stars rating={t.rating} colors={colors} size={18} marginBottom={0} />
                  </div>
                )}

                {/* 4. Author Details */}
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  <span
                    className="font-semibold text-base sm:text-[17px] tracking-tight"
                    style={{
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                  >
                    {t.author_name}
                  </span>
                  {authorRole && (
                    <span
                      className="text-xs sm:text-sm font-normal"
                      style={{
                        color: isDark ? "#9CA3AF" : "#6B7280",
                      }}
                    >
                      {authorRole}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Variant B: Multi-Quote Frameless Grid (Max Quotes = 2, 3, 4, 6) */
        <div
          className={`w-full max-w-5xl grid gap-x-8 sm:gap-x-12 gap-y-10 sm:gap-y-14 text-center ${
            isTwoQuotes
              ? "grid-cols-1 sm:grid-cols-2 max-w-4xl"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {displayedTestimonials.map((t, idx) => {
            const rawQuote = t.display_body || t.body_original || "";
            const quote = rawQuote.replace(/^["“'\u201C\u201D]+|["”'\u201C\u201D]+$/g, "").trim();
            const photoUrl = t.avatar_url || DEFAULT_PORTRAITS[idx % DEFAULT_PORTRAITS.length];
            const authorRole = t.author_role || t.tags?.[0] || "";

            return (
              <div
                key={t.id || `quote-${idx}`}
                className="w-full flex flex-col items-center gap-3.5 p-2 cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
                onClick={() => setActiveModalTestimonial(t)}
              >
                {/* 1. Top Avatar (Clean, no card border) */}
                {showPhotos && (
                  <div className="shrink-0 mb-1">
                    <div
                      className="rounded-full shadow-2xs transition-transform duration-200 group-hover:scale-105 overflow-hidden"
                      style={{
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Avatar
                        name={t.author_name}
                        avatarUrl={photoUrl}
                        email={t.author_email || t.email}
                        colors={colors}
                        size={54}
                        showPhotos={true}
                        useGravatar={useGravatar}
                        fallbackAvatar={fallbackAvatar}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Frameless Editorial Quote Text */}
                <div className="text-center px-1 max-w-sm mx-auto">
                  <p
                    className="text-[15px] sm:text-[16px] font-normal leading-[1.55] tracking-tight line-clamp-4"
                    style={{
                      color: textColor || (isDark ? "#F3F4F6" : "#1F2937"),
                    }}
                  >
                    <span
                      className="font-serif text-lg opacity-35 select-none mr-1"
                      style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                    >
                      &ldquo;
                    </span>
                    {quote}
                    <span
                      className="font-serif text-lg opacity-35 select-none ml-1"
                      style={{ color: isDark ? "#A1A1AA" : "#71717A" }}
                    >
                      &rdquo;
                    </span>
                  </p>
                </div>

                {/* 3. Gold Stars Rating */}
                {showRatings && typeof t.rating === "number" && t.rating > 0 && (
                  <div className="flex justify-center mt-0.5">
                    <Stars rating={t.rating} colors={colors} size={15} marginBottom={0} />
                  </div>
                )}

                {/* 4. Author Details */}
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                  <span
                    className="font-semibold text-sm sm:text-[15px] tracking-tight"
                    style={{
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                  >
                    {t.author_name}
                  </span>
                  {authorRole && (
                    <span
                      className="text-xs font-normal"
                      style={{
                        color: isDark ? "#9CA3AF" : "#6B7280",
                      }}
                    >
                      {authorRole}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BLOVI COLLECTION BADGE */}
      {showBadge && (
        <div className="mt-10 sm:mt-12 flex justify-center">
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
