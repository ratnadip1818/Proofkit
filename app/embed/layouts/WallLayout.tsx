"use client";

import { useEffect, useState, useRef } from "react";
import { type Testimonial } from "../constants";
import { FONT, RADIUS_PX, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme, WallLayout as WallLayoutType } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
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
  useGravatar?: boolean;
  fallbackAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
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
  useGravatar = true,
  fallbackAvatar = "Initials",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
}: WallLayoutProps) {
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [numColumns, setNumColumns] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract all unique tags present in testimonials
  const allTags = Array.from(
    new Set(testimonials.flatMap((t) => t.tags || []))
  ).filter(Boolean);

  let list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

  // Filter list by selected tag
  const filteredList = selectedTag
    ? list.filter((t) => t.tags && t.tags.includes(selectedTag))
    : list;

  // Dynamically calculate column count based on available container width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateColumns = (width: number) => {
      if (width < 640) {
        setNumColumns(1);
      } else {
        setNumColumns(3);
      }
    };

    updateColumns(containerRef.current.clientWidth);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateColumns(entry.contentRect.width);
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Post message to parent container whenever layout or filter dimensions adjust
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedTag, filteredList.length, numColumns]);

  // Round-robin distribution across responsive flex columns (Pinterest-style)
  const columns = Array.from({ length: numColumns }, () => [] as Testimonial[]);
  filteredList.forEach((t, i) => {
    columns[i % numColumns].push(t);
  });

  return (
    <div style={{ fontFamily: FONT, padding: "20px 16px 28px", background: colors.pageBg, color: colors.text }}>
      <style>{`
        .blovi-masonry-grid {
          gap: 20px;
        }
        .blovi-masonry-col {
          gap: 20px;
        }
        @media (max-width: 639px) {
          .blovi-masonry-grid,
          .blovi-masonry-col {
            gap: 16px !important;
          }
          .blovi-wall-card {
            padding: 20px 18px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .blovi-masonry-grid,
          .blovi-masonry-col {
            gap: 14px !important;
          }
          .blovi-wall-card {
            padding: 18px 16px !important;
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
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Responsive 3-Column Round-Robin Masonry */}
          <div
            ref={containerRef}
            className="blovi-masonry-grid"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {columns.map((colItems, colIdx) => (
              <div
                key={`masonry-col-${colIdx}`}
                className={`blovi-masonry-col blovi-col-${colIdx + 1}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {colItems.map((t, itemIdx) => (
                  <TestimonialCard
                    key={`t-${t.id}-${itemIdx}`}
                    t={t}
                    showRatings={showRatings}
                    colors={colors}
                    radius={radiusPx}
                    layout={layout}
                    index={itemIdx}
                    showPhotos={showPhotos}
                    useGravatar={useGravatar}
                    fallbackAvatar={fallbackAvatar}
                    onExpandChange={() => {
                      if (typeof window !== "undefined") {
                        setTimeout(() => sendWidgetHeight(), 100);
                      }
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {showBadge && (
        <div style={{ marginTop: "16px" }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
