"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, TRANSITIONS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import {
  Stars,
  Avatar,
  EmptyState,
  BadgeLink,
  VerifiedBadge,
  TestimonialModal,
} from "../components";
import { sendWidgetHeight } from "../utils";

export interface CarouselLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
}

export function CarouselLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
}: CarouselLayoutProps) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<Testimonial | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (testimonials.length <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonials.length, paused]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      sendWidgetHeight();
    }, 450);
    return () => clearTimeout(timeout);
  }, [index]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const safeIndex = index % testimonials.length;

  return (
    <div
      style={{ fontFamily: FONT, padding: "24px 16px", background: colors.pageBg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        setPaused(false);
        if (start === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) < 40) return;
        setIndex((i) =>
          delta < 0
            ? (i + 1) % testimonials.length
            : (i - 1 + testimonials.length) % testimonials.length
        );
      }}
    >
      <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ overflow: "hidden", borderRadius: `${radiusPx}px`, padding: "8px 0" }}>
          <div
            style={{
              display: "flex",
              transition: TRANSITIONS.slide,
              transform: `translateX(-${safeIndex * 100}%)`,
            }}
          >
            {testimonials.map((t) => {
              const text = t.display_body ?? t.body_original;
              const threshold = 130;
              const shouldClamp = text.length > threshold;

              return (
                <div key={t.id} style={{ flex: "0 0 100%", boxSizing: "border-box" }}>
                  <div
                    className="blovi-card"
                    style={{
                      background: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: `${radiusPx}px`,
                      padding: "20px 32px",
                      textAlign: "center",
                      boxShadow: colors.cardBg === "#ffffff" ? SHADOWS.cardLight : SHADOWS.cardDark,
                      position: "relative",
                      overflow: "hidden",
                      height: "260px",
                      display: "flex",
                      flexDirection: "column",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        color: colors.accent,
                        opacity: 0.08,
                        pointerEvents: "none",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.1 14.1H8.3c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3zM20.1 14.1h-2.8c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3z" />
                      </svg>
                    </span>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                      <Avatar name={t.author_name} avatarUrl={t.avatar_url} colors={colors} size={36} source={t.source} />
                    </div>
                    {showRatings && t.rating !== null && (
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                        <Stars rating={t.rating} colors={colors} />
                      </div>
                    )}

                    {shouldClamp ? (
                      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0, justifyContent: "center", alignItems: "center" }}>
                        <p style={{
                          fontSize: "14px",
                          lineHeight: "1.5",
                          color: colors.text,
                          margin: "4px 0",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {text}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalTestimonial(t);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            padding: "2px 0 0 0",
                            margin: 0,
                            fontSize: "13px",
                            fontWeight: 600,
                            color: colors.accent,
                            cursor: "pointer",
                            fontFamily: FONT,
                            textDecoration: "none",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          Read more
                        </button>
                      </div>
                    ) : (
                      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 0 }}>
                        <p style={{ fontSize: "14px", lineHeight: "1.5", color: colors.text, margin: "4px 0" }}>
                          {text}
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: "auto" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: colors.name,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        {t.author_name}
                        <VerifiedBadge id={t.id} />
                      </p>
                      {t.author_role && (
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.role }}>
                          {t.author_role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            className="blovi-arrow"
            onClick={() =>
              setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
            }
            aria-label="Previous testimonial"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `1px solid ${colors.cardBorder}`,
              background: colors.arrowBg,
              color: colors.arrowText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ‹
          </button>

          <div style={{ display: "flex", gap: "6px" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === safeIndex ? 18 : 8,
                  height: 8,
                  borderRadius: "4px",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === safeIndex ? colors.accent : colors.dotInactive,
                  transition: TRANSITIONS.smooth,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="blovi-arrow"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            aria-label="Next testimonial"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `1px solid ${colors.cardBorder}`,
              background: colors.arrowBg,
              color: colors.arrowText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ›
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
