"use client";

import { useState } from "react";
import styles from "./wall.module.css";
import { type Testimonial } from "../constants";
import { FONT, RADIUS_PX, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme, WallLayout as WallLayoutType } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
} from "../components";

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
  showDate?: boolean;
  cardLayout?: "top" | "bottom";
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
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
  showDate = true,
  cardLayout = "top",
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

  // Extract all unique tags present in testimonials
  const allTags = Array.from(
    new Set(testimonials.flatMap((t) => t.tags || []))
  ).filter(Boolean);

  // Filter list by selected tag
  const matchingList = selectedTag
    ? testimonials.filter((t) => t.tags?.includes(selectedTag))
    : testimonials;
  const filteredList = maxCount !== null ? matchingList.slice(0, maxCount) : matchingList;


  return (
    <div style={{ containerType: "inline-size", fontFamily: FONT, padding: "20px 16px 28px", background: colors.pageBg, color: colors.text }}>


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
            aria-pressed={selectedTag === null}
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
                aria-pressed={isSelected}
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
          <div className={`blovi-masonry-grid ${styles.grid}`}>
            {filteredList.map((t) => (
              <div key={t.id} className={styles.item}>
                <TestimonialCard t={t} showRatings={showRatings} colors={colors} radius={radiusPx}
                  layout={layout} showPhotos={showPhotos} useGravatar={useGravatar}
                  fallbackAvatar={fallbackAvatar} showDate={showDate} cardLayout={cardLayout} />
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
