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
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [hasExpandedCard, setHasExpandedCard] = useState(false);

  // Extract all unique tags present in testimonials
  const allTags = Array.from(
    new Set(testimonials.flatMap((t) => t.tags || []))
  ).filter(Boolean);

  let list = maxCount !== null ? testimonials.slice(0, maxCount) : testimonials;

  // Filter list by selected tag
  const filteredList = selectedTag
    ? list.filter((t) => t.tags && t.tags.includes(selectedTag))
    : list;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedTag, filteredList.length]);

  // Offset streams for each column so every review is represented across devices
  const col1Items = [...filteredList];
  const col2Items = filteredList.length > 1
    ? [...filteredList.slice(Math.ceil(filteredList.length / 3)), ...filteredList.slice(0, Math.ceil(filteredList.length / 3))]
    : [...filteredList];
  const col3Items = filteredList.length > 2
    ? [...filteredList.slice(Math.ceil((filteredList.length * 2) / 3)), ...filteredList.slice(0, Math.ceil((filteredList.length * 2) / 3))]
    : [...filteredList];

  const prepareLoop = (arr: Testimonial[]) => {
    if (arr.length === 0) return [];
    let res = [...arr];
    while (res.length < 5) {
      res = [...res, ...arr];
    }
    return [...res, ...res]; // Duplicate for seamless 50% translateY loop
  };

  const track1 = prepareLoop(col1Items);
  const track2 = prepareLoop(col2Items);
  const track3 = prepareLoop(col3Items);

  return (
    <div style={{ fontFamily: FONT, padding: "20px 16px 28px", background: colors.pageBg, color: colors.text }}>
      <style>{`
        @keyframes blovi-v-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }
        .blovi-marquee-stage {
          position: relative;
          height: 560px;
          overflow: hidden;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .blovi-marquee-cols {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 20px;
          height: 100%;
          align-items: start;
        }
        @media (min-width: 640px) {
          .blovi-marquee-cols {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .blovi-marquee-cols {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .blovi-marquee-track {
          display: flex;
          flex-direction: column;
          gap: 20px;
          will-change: transform;
        }
        .blovi-track-1 {
          animation: blovi-v-marquee 32s linear infinite;
        }
        .blovi-track-2 {
          animation: blovi-v-marquee 38s linear infinite;
        }
        .blovi-track-3 {
          animation: blovi-v-marquee 35s linear infinite;
        }
        .blovi-marquee-track:hover,
        .blovi-marquee-frozen .blovi-marquee-track {
          animation-play-state: paused !important;
        }
        @media (max-width: 639px) {
          .blovi-col-2, .blovi-col-3 {
            display: none !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .blovi-col-3 {
            display: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .blovi-marquee-track {
            animation: none !important;
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
            marginBottom: "20px",
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
        <div className={`blovi-marquee-stage ${hasExpandedCard ? "blovi-marquee-frozen" : ""}`}>
          {/* Top Gradient Fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "55px",
              background: `linear-gradient(to bottom, ${colors.pageBg || "#FAF8F5"} 0%, rgba(250, 248, 245, 0) 100%)`,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* 3 Columns Marquee Grid */}
          <div className="blovi-marquee-cols">
            {/* Column 1 */}
            <div className="blovi-col-1" style={{ overflow: "hidden" }}>
              <div className="blovi-marquee-track blovi-track-1">
                {track1.map((t, idx) => (
                  <TestimonialCard
                    key={`c1-${t.id}-${idx}`}
                    t={t}
                    showRatings={showRatings}
                    colors={colors}
                    radius={radiusPx}
                    layout={layout}
                    index={idx}
                    showPhotos={showPhotos}
                    fallbackAvatar={fallbackAvatar}
                    onExpandChange={(expanded) => setHasExpandedCard(expanded)}
                  />
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div className="blovi-col-2" style={{ overflow: "hidden" }}>
              <div className="blovi-marquee-track blovi-track-2">
                {track2.map((t, idx) => (
                  <TestimonialCard
                    key={`c2-${t.id}-${idx}`}
                    t={t}
                    showRatings={showRatings}
                    colors={colors}
                    radius={radiusPx}
                    layout={layout}
                    index={idx}
                    showPhotos={showPhotos}
                    fallbackAvatar={fallbackAvatar}
                    onExpandChange={(expanded) => setHasExpandedCard(expanded)}
                  />
                ))}
              </div>
            </div>

            {/* Column 3 */}
            <div className="blovi-col-3" style={{ overflow: "hidden" }}>
              <div className="blovi-marquee-track blovi-track-3">
                {track3.map((t, idx) => (
                  <TestimonialCard
                    key={`c3-${t.id}-${idx}`}
                    t={t}
                    showRatings={showRatings}
                    colors={colors}
                    radius={radiusPx}
                    layout={layout}
                    index={idx}
                    showPhotos={showPhotos}
                    fallbackAvatar={fallbackAvatar}
                    onExpandChange={(expanded) => setHasExpandedCard(expanded)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Gradient Fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "85px",
              background: `linear-gradient(to top, ${colors.pageBg || "#FAF8F5"} 0%, rgba(250, 248, 245, 0) 100%)`,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
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
