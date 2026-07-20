"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../constants";
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
}: WallLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  // Synchronize and update pageSize dynamically based on responsive layout rules
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setPageSize(3);
      } else if (w < 1024) {
        setPageSize(6);
      } else {
        setPageSize(9);
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

  return (
    <div style={{ fontFamily: FONT, padding: "24px 16px 48px 16px", background: colors.pageBg, color: colors.text }}>
      <style>{`
        .blovi-masonry {
          column-count: 1;
          column-gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .blovi-masonry {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .blovi-masonry {
            column-count: 3;
          }
        }
        .blovi-masonry-item {
          break-inside: avoid;
        }
      `}</style>

      {/* Hero Header Section */}
      <div style={{ maxWidth: "672px", margin: "0 auto 48px auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: colors.name,
            margin: "0 0 16px 0",
            lineHeight: "1.2",
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: colors.role,
            margin: 0,
          }}
        >
          {subheading}
        </p>
      </div>

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
        <div style={{ width: "100%", padding: "8px 0" }}>
          <div className="blovi-masonry">
            {renderedList.map((t, idx) => (
              <div key={t.id} className="blovi-masonry-item">
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
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", marginBottom: "16px" }}>
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
