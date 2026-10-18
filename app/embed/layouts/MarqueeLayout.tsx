"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, TestimonialCard } from "../components";
import styles from "./marquee.module.css";

export interface MarqueeLayoutProps {
  testimonials: Testimonial[];
  theme: WidgetTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
  marqueeRows?: 1 | 2;
  marqueeDirection?: "left" | "right" | "opposing";
  marqueeSpeed?: "slow" | "normal" | "fast";
  marqueePauseOnHover?: boolean;
  cardLayout?: "top" | "bottom";
  cardWidth?: number;
}

export function MarqueeLayout({
  testimonials, theme, showRatings, showBadge, accent, radius = "rounded", preset = "base",
  showPhotos = true, useGravatar = true, fallbackAvatar = "Initials",
  backgroundColor, textColor, ratingColor, ratingBorderColor, highlightColor,
  marqueeRows = 2, marqueeDirection = "opposing", marqueeSpeed = "normal",
  marqueePauseOnHover = true, cardLayout = "top", cardWidth = 320,
}: MarqueeLayoutProps) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius,
    getPresetDefinition(preset).preset.overrides,
    { backgroundColor, textColor, ratingColor, ratingBorderColor, highlightColor });
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const safeWidth = Number.isFinite(cardWidth) ? Math.min(480, Math.max(240, cardWidth)) : 320;
  const actualWidth = Math.min(safeWidth, Math.max(220, width - 32));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    resize.observe(container);
    let inView = true;
    const updateVisibility = () => setOffscreen(!inView || document.hidden);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
    });
    intersection.observe(container);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const rows = useMemo(() => {
    if (marqueeRows === 1 || testimonials.length < 2) return [testimonials];
    return [testimonials.filter((_, i) => i % 2 === 0), testimonials.filter((_, i) => i % 2 === 1)];
  }, [testimonials, marqueeRows]);

  return (
    <div ref={containerRef} className={styles.marquee} data-hover-pause={marqueePauseOnHover}
      style={{ fontFamily: FONT, color: colors.text, background: colors.pageBg, "--marquee-accent": colors.accent } as CSSProperties}>
      {testimonials.length === 0 ? <EmptyState colors={colors} /> : <>
        <div className={styles.controls}>
          <span>Words from our customers</span>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            {paused ? "Play" : "Pause"}
          </button>
        </div>
        {rows.map((items, rowIndex) => {
          const repeats = Math.max(1, Math.ceil((width + actualWidth) / (items.length * (actualWidth + 16))));
          const pixelsPerSecond = { slow: 22, normal: 36, fast: 60 }[marqueeSpeed] ?? 36;
          const duration = items.length * repeats * (actualWidth + 16) / pixelsPerSecond;
          const reverse = marqueeDirection === "right" || (marqueeDirection === "opposing" && rowIndex === 1);
          return (
            <div className={styles.viewport} key={rowIndex} role="region" tabIndex={0} aria-label={`Customer reviews, row ${rowIndex + 1}`}>
              <div className={styles.track} style={{
                animationDuration: `${duration}s`,
                animationDirection: reverse ? "reverse" : "normal",
                animationPlayState: paused || offscreen || expandedKey !== null ? "paused" : undefined,
                "--review-width": `${actualWidth}px`,
              } as CSSProperties}>
                {[0, 1].map((copy) => <div key={copy} className={styles.group} data-copy={copy} role="group" aria-label={copy === 1 ? "Repeated customer reviews" : "Customer reviews"}>
                  {Array.from({ length: repeats }, (_, repeat) => items.map((t, index) => {
                    const key = `${rowIndex}-${copy}-${repeat}-${t.id}-${index}`;
                    const reviewKey = `${rowIndex}-${t.id}`;
                    return <div className={styles.item} key={key} data-repeat={repeat > 0}>
                      <TestimonialCard t={t} showRatings={showRatings} colors={colors} radius={radiusPx}
                        showPhotos={showPhotos} useGravatar={useGravatar} fallbackAvatar={fallbackAvatar}
                        cardLayout={cardLayout} showDate={false} lineClamp={4}
                        expanded={expandedKey === reviewKey} onExpandChange={(open) => setExpandedKey(open ? reviewKey : null)} />
                    </div>;
                  }))}
                </div>)}
              </div>
            </div>
          );
        })}
      </>}
      {showBadge && <div className={styles.branding}><BadgeLink colors={colors} /></div>}
    </div>
  );
}
