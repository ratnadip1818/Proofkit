"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../constants";
import { FONT, RADIUS_PX, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme, WallLayout as WallLayoutType } from "../types/widget";
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
}: WallLayoutProps) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  // Synchronize and update pageSize dynamically based on responsive layout rules
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 600) {
        setPageSize(1);
      } else if (w < 900) {
        setPageSize(4);
      } else {
        setPageSize(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

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

  const displayCount = renderedList.length;
  const containerMaxWidth =
    displayCount === 1 ? "450px" :
    displayCount === 2 ? "820px" :
    "880px";

  return (
    <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
      <style>{`
        .blovi-flex-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          max-width: ${containerMaxWidth};
          margin: 0 auto;
        }
        .blovi-flex-card-wrapper {
          flex: 0 0 280px;
          max-width: 280px;
          box-sizing: border-box;
        }
        @media (max-width: 900px) {
          .blovi-flex-grid {
            max-width: 580px;
          }
          .blovi-flex-card-wrapper {
            flex: 0 0 280px;
            max-width: 280px;
          }
        }
        @media (max-width: 600px) {
          .blovi-flex-grid {
            max-width: 100%;
          }
          .blovi-flex-card-wrapper {
            flex: 1 1 100%;
            max-width: 100%;
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
            marginBottom: "24px",
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
        <div style={{ width: "100%", padding: "8px 0" }}>
          <div className="blovi-flex-grid">
            {renderedList.map((t, idx) => (
              <div key={t.id} className="blovi-flex-card-wrapper">
                <TestimonialCard
                  t={t}
                  showRatings={showRatings}
                  colors={colors}
                  radius={radiusPx}
                  layout={layout}
                  index={idx}
                  onReadMore={setActiveModalTestimonial}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show More / Show Less Button */}
      {totalItems > pageSize && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px", marginBottom: "8px" }}>
          <button
            type="button"
            onClick={() => {
              const hasMore = endIndex < totalItems;
              if (hasMore) {
                setPageIndex((prev) => prev + 1);
              } else {
                setPageIndex(0);
              }
            }}
            style={{
              fontFamily: FONT,
              fontSize: "13.5px",
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: `${RADIUS_PX.full}px`,
              cursor: "pointer",
              border: `1px solid ${colors.cardBorder}`,
              background: colors.cardBg,
              color: colors.text,
              boxShadow: SHADOWS.button,
              transition: TRANSITIONS.normal,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.color = colors.accent;
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
              e.currentTarget.style.color = colors.text;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {endIndex < totalItems ? "Show more" : "Show less"}
          </button>
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
