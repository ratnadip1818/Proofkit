"use client";

import { useEffect, useState } from "react";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "../constants";
import { FONT, RADIUS_PX, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme, WallLayout as WallLayoutType } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
  TestimonialModal,
} from "../components";
import { sendWidgetHeight } from "../utils";

export interface WallLayoutProps {
  testimonials: Testimonial[];
  layout?: WallLayoutType;
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  maxCount: number | null;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  heading?: string;
  subheading?: string;
  showPhotos?: boolean;
  fallbackAvatar?: string;
}

export function WallLayout({
  testimonials,
  layout = "grid",
  theme,
  showRatings,
  showBadge,
  maxCount,
  accent,
  radius = "rounded",
  preset = "base",
  heading = "Loved by the best teams",
  subheading = "Software companies and agencies rely on Blovi to turn happy customers into their best growth engine.",
  showPhotos = true,
  fallbackAvatar = "Initials",
}: WallLayoutProps) {
  const isDesktopPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("desktop") === "1";
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  // Synchronize and update pageSize dynamically based on responsive layout rules (capped at 6 for desktop 3x2 grid)
  useEffect(() => {
    if (isDesktopPreview) {
      setPageSize(6);
      return;
    }

    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setPageSize(3);
      } else if (w < 1024) {
        setPageSize(4);
      } else {
        setPageSize(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktopPreview]);

  // Reset page index when tag filter, maxCount, or screen size changes
  const [prevSelectedTag, setPrevSelectedTag] = useState(selectedTag);
  const [prevMaxCount, setPrevMaxCount] = useState(maxCount);
  const [prevPageSize, setPrevPageSize] = useState(pageSize);

  if (selectedTag !== prevSelectedTag || maxCount !== prevMaxCount || pageSize !== prevPageSize) {
    setPrevSelectedTag(selectedTag);
    setPrevMaxCount(maxCount);
    setPrevPageSize(pageSize);
    setPageIndex(0);
  }

  // Extract all unique tags present in testimonials
  const allTags = Array.from(
    new Set(testimonials.flatMap((t) => t.tags || []))
  ).filter(Boolean);

  let list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

  // Filter list by selected tag
  const filteredList = selectedTag
    ? list.filter((t) => t.tags && t.tags.includes(selectedTag))
    : list;

  const totalItems = filteredList.length;
  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const renderedList = filteredList.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedTag, filteredList.length, pageIndex, pageSize]);

  return (
    <div style={{ fontFamily: FONT, padding: "32px 16px", background: colors.pageBg, color: colors.text }}>
      <style>{`
        .blovi-wall-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 640px) {
          .blovi-wall-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .blovi-wall-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>

      {/* Dynamic Tag Filter Pills */}
      {allTags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            style={{
              fontFamily: FONT,
              fontSize: "12.5px",
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: `${RADIUS_PX.full}px`,
              cursor: "pointer",
              border: `1px solid ${selectedTag === null ? colors.accent : colors.cardBorder}`,
              background: selectedTag === null ? colors.accent : colors.cardBg,
              color: selectedTag === null ? (colors.accent === "#ffffff" ? "#1F1F28" : "#ffffff") : colors.text,
              transition: TRANSITIONS.fast,
            }}
          >
            All
          </button>
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{
                  fontFamily: FONT,
                  fontSize: "12.5px",
                  fontWeight: 500,
                  padding: "6px 14px",
                  borderRadius: `${RADIUS_PX.full}px`,
                  cursor: "pointer",
                  border: `1px solid ${isSelected ? colors.accent : colors.cardBorder}`,
                  background: isSelected ? colors.accent : colors.cardBg,
                  color: isSelected ? (colors.accent === "#ffffff" ? "#1F1F28" : "#ffffff") : colors.text,
                  transition: TRANSITIONS.fast,
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {filteredList.length === 0 ? (
        <EmptyState colors={colors} />
      ) : (
        <div style={{ position: "relative", width: "100%", padding: "4px 0 20px" }}>
          <div className="blovi-wall-grid">
            {renderedList.map((t, idx) => (
              <div key={t.id} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <TestimonialCard
                  t={t}
                  showRatings={showRatings}
                  colors={colors}
                  radius={radiusPx}
                  layout={layout}
                  index={idx}
                  onReadMore={setActiveModalTestimonial}
                  showPhotos={showPhotos}
                  fallbackAvatar={fallbackAvatar}
                />
              </div>
            ))}
          </div>

          {/* Subtle Bottom Gradient Fade (no show more button) */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "75px",
              background: `linear-gradient(to bottom, rgba(250, 248, 245, 0) 0%, ${colors.pageBg || "#FAF8F5"} 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {showBadge && <BadgeLink colors={colors} />}

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
