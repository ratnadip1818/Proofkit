"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars } from "../components";
import { sendWidgetHeight } from "../utils";

export interface LivingFeedLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  headerTitle?: string;
  pageSize?: number;
}

const ACTION_VERBS = [
  "submitted a testimonial",
  "left a review",
  "updated her story",
  "recommended Blovi",
  "shared customer feedback",
];

function getActionVerb(testimonial: Testimonial, index: number): string {
  const source = testimonial.source?.toLowerCase() || "";
  if (source.includes("twitter") || source.includes("x.com")) return "shared a tweet";
  if (source.includes("linkedin")) return "posted on LinkedIn";
  if (source.includes("google")) return "left a Google review";
  if (source.includes("producthunt")) return "recommended on Product Hunt";
  return ACTION_VERBS[index % ACTION_VERBS.length];
}

function getRelativeTimeStr(minutesAgo: number, isMobile: boolean): string {
  if (minutesAgo < 1) return isMobile ? "just now" : "just now";
  if (minutesAgo < 60) return isMobile ? `${minutesAgo}m` : `${minutesAgo}m ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return isMobile ? `${hoursAgo}h` : `${hoursAgo}h ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  return isMobile ? `${daysAgo}d` : `${daysAgo}d ago`;
}

export function LivingFeedLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
  headerTitle = "Right now, teams everywhere are collecting proof.",
  pageSize = 4,
}: LivingFeedLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showNewBadges, setShowNewBadges] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Time ticker state to trigger client-side re-render every 60s
  const [ticker, setTicker] = useState(0);

  // Detect mobile width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Report height to parent window/iframe via ResizeObserver
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      sendWidgetHeight();
    });
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, [visibleCount, expandedIds]);

  // Update relative timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-expire "● NEW" badge after 60 seconds of rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewBadges(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // Synthetic relative time for testimonials without exact date
  const timeOffsets = useMemo(() => {
    const offsets = [4, 15, 62, 185, 340, 720, 1440, 2880, 4320];
    return testimonials.map((_, i) => offsets[i % offsets.length] + i * 2);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div ref={containerRef} className="p-6">
        <EmptyState colors={colors} />
      </div>
    );
  }

  const currentItems = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, testimonials.length));
      setIsLoadingMore(false);
    }, 350);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const accentColor = accent || colors.accent || "#10B981";

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-left transition-colors duration-300"
      style={{
        fontFamily: FONT,
        backgroundColor: colors.pageBg,
        color: colors.text,
      }}
    >
      {/* SECTION HEADER */}
      <div className="pb-4 mb-2 border-b border-gray-200 dark:border-zinc-800/80">
        <h2 className="text-base sm:text-lg font-medium tracking-tight opacity-90">
          {headerTitle}
        </h2>
      </div>

      {/* FEED ENTRIES LOG */}
      <div className="divide-y divide-gray-200/70 dark:divide-zinc-800/70">
        {currentItems.map((item, index) => {
          const itemId = item.id || `feed-item-${index}`;
          const isNew = showNewBadges && index < 2;
          const minutesAgo = (timeOffsets[index] || (index + 1) * 15) + ticker;
          const relativeTime = getRelativeTimeStr(minutesAgo, isMobile);
          const verb = getActionVerb(item, index);
          const isExpanded = !!expandedIds[itemId];
          const text = item.display_body || item.body_original || "";
          const isLongText = text.length > 180;
          const authorName = item.author_name || "Anonymous";
          const roleTitle = item.author_role || "";
          const initial = authorName.trim().charAt(0).toUpperCase() || "?";

          return (
            <div
              key={itemId}
              className="group py-4 px-1 sm:px-2 transition-colors duration-200 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] flex gap-3 sm:gap-4 items-start relative"
            >
              {/* ACTIVITY INDICATOR DOT */}
              <div className="pt-1.5 shrink-0 flex items-center justify-center">
                <span
                  className="w-2 h-2 rounded-full inline-block transition-transform duration-300 group-hover:scale-125"
                  style={{
                    backgroundColor: isNew ? accentColor : colors.cardBorder || accentColor,
                    boxShadow: isNew ? `0 0 8px ${accentColor}80` : "none",
                  }}
                />
              </div>

              {/* AVATAR (32px) */}
              <div className="shrink-0 pt-0.5">
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200"
                    style={{
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                    }}
                  >
                    [{initial}]
                  </div>
                )}
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 min-w-0">
                {/* NAME, ACTION & TIMESTAMP ROW */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 text-sm sm:text-base">
                    <span className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                      {authorName}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-normal text-xs sm:text-sm">
                      {verb}
                    </span>
                  </div>

                  {/* TIMESTAMP */}
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 font-mono tracking-tight">
                    {relativeTime}
                  </span>
                </div>

                {/* ROLE & COMPANY */}
                {roleTitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2 font-normal">
                    {roleTitle}
                  </div>
                )}

                {/* OPTIONAL STAR RATING */}
                {showRatings && item.rating && (
                  <div className="mb-1.5">
                    <Stars rating={item.rating} colors={colors} size={12} />
                  </div>
                )}

                {/* QUOTE TEXT */}
                <div
                  onClick={() => isLongText && toggleExpand(itemId)}
                  className={`text-[15px] sm:text-base leading-[1.6] opacity-80 group-hover:opacity-100 transition-opacity duration-200 text-gray-800 dark:text-gray-200 ${
                    isLongText ? "cursor-pointer" : ""
                  }`}
                >
                  <p>
                    &ldquo;
                    {isLongText && !isExpanded
                      ? `${text.slice(0, 175)}...`
                      : text}
                    &rdquo;
                  </p>
                  {isLongText && (
                    <span className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline ml-1 font-medium">
                      {isExpanded ? "show less" : "show full"}
                    </span>
                  )}
                </div>

                {/* NEW BADGE (Mobile / Desktop aligned to end) */}
                {isNew && (
                  <div className="mt-2 sm:mt-0 sm:absolute sm:right-2 sm:bottom-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-full border border-current opacity-90 transition-opacity duration-500"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      <span className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                      NEW
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE LINK */}
      {hasMore && (
        <div className="pt-6 pb-2 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors lowercase cursor-pointer group"
          >
            <span
              className={`inline-block transition-transform duration-300 ${
                isLoadingMore ? "animate-spin" : "group-hover:translate-y-0.5"
              }`}
            >
              ↓
            </span>
            {isLoadingMore ? "loading..." : "load more"}
          </button>
        </div>
      )}

      {/* FOOTER BADGE LINK */}
      {showBadge && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/50 flex justify-center">
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
