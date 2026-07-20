"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import {
  EmptyState,
  BadgeLink,
  TestimonialCard,
  TestimonialModal,
} from "../components";
import { sendWidgetHeight } from "../utils";

export interface MarqueeLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

export function MarqueeLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: MarqueeLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  let multipliedItems = [...testimonials];
  while (multipliedItems.length < 12) {
    multipliedItems = [...multipliedItems, ...testimonials];
  }
  const items = [...multipliedItems, ...multipliedItems];
  const duration = Math.max(15, multipliedItems.length * 4);
  const singleStepWidth = 280 + 12;
  const totalShiftPx = multipliedItems.length * singleStepWidth;

  return (
    <div
      style={{
        fontFamily: FONT,
        padding: "16px 0",
        background: colors.pageBg,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes proofkit-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-${totalShiftPx}px, 0, 0); }
        }
        .proofkit-marquee-track {
          animation: proofkit-marquee ${duration}s linear infinite;
          padding: 8px 0;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .proofkit-marquee-track:hover {
          animation-play-state: paused;
        }
        .proofkit-marquee-card-wrapper {
          width: 280px;
          flex-shrink: 0;
          cursor: pointer;
          transition: ${TRANSITIONS.hover};
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .proofkit-marquee-card-wrapper:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .blovi-card {
          transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .proofkit-marquee-card-wrapper:hover .blovi-card {
          border-color: ${colors.accent} !important;
          box-shadow: ${colors.cardBg === "#ffffff" ? SHADOWS.cardHoverLight : SHADOWS.cardHoverDark} !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .proofkit-marquee-track { animation: none; }
        }
      `}</style>
      <div
        style={{
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div
          className="proofkit-marquee-track"
          style={{ display: "flex", gap: "12px", width: "max-content" }}
        >
          {items.map((t, i) => (
            <div
              key={`${t.id}-${i}`}
              className="proofkit-marquee-card-wrapper"
              onClick={() => setActiveModalTestimonial(t)}
            >
              <TestimonialCard
                t={t}
                showRatings={showRatings}
                colors={colors}
                radius={radiusPx}
                index={i}
                onReadMore={setActiveModalTestimonial}
              />
            </div>
          ))}
        </div>
      </div>

      {showBadge && (
        <div style={{ marginTop: "12px" }}>
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
