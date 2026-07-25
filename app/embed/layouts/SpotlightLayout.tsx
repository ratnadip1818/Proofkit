"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars, VerifiedBadge } from "../components";
import { sendWidgetHeight } from "../utils";

export interface SpotlightLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

export function SpotlightLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: SpotlightLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Measure and send widget height on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        sendWidgetHeight();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, testimonials.length]);

  // Initial entrance animation flag
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Transition handler
  const selectTestimonial = useCallback(
    (newIndex: number) => {
      if (newIndex === currentIndex || isExiting || isEntering || testimonials.length === 0) return;

      setIsExiting(true);

      // Exit phase (180-200ms)
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsExiting(false);
        setIsEntering(true);

        // Enter phase reset (300ms)
        setTimeout(() => {
          setIsEntering(false);
        }, 300);
      }, 180);
    },
    [currentIndex, isExiting, isEntering, testimonials.length]
  );

  const goNext = useCallback(() => {
    if (testimonials.length === 0) return;
    const nextIdx = (currentIndex + 1) % testimonials.length;
    selectTestimonial(nextIdx);
  }, [currentIndex, testimonials.length, selectTestimonial]);

  const goPrev = useCallback(() => {
    if (testimonials.length === 0) return;
    const prevIdx = (currentIndex - 1 + testimonials.length) % testimonials.length;
    selectTestimonial(prevIdx);
  }, [currentIndex, testimonials.length, selectTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const current = testimonials[currentIndex] || testimonials[0];
  const quoteText = current.display_body ?? current.body_original;

  return (
    <div
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        color: colors.text,
        padding: "32px 24px",
        boxSizing: "border-box",
        width: "100%",
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) > 40) {
          if (delta < 0) goNext();
          else goPrev();
        }
      }}
    >
      <style>{`
        .spotlight-container {
          display: flex;
          gap: 48px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: flex-start;
        }

        .spotlight-main {
          flex: 1 1 70%;
          min-width: 0;
        }

        .spotlight-sidebar {
          flex: 0 0 28%;
          max-width: 300px;
        }

        .spotlight-photo-frame {
          width: 360px;
          height: 360px;
          overflow: hidden;
          background: ${colors.cardBorder};
          margin-bottom: 28px;
          position: relative;
        }

        .spotlight-photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-photo-frame:hover img {
          transform: scale(1.02);
        }

        .spotlight-quote {
          font-size: 32px;
          line-height: 1.5;
          font-weight: 400;
          color: ${colors.text};
          margin: 0 0 24px 0;
          letter-spacing: -0.015em;
          transition: opacity 0.2s ease, filter 0.2s ease;
        }

        .spotlight-meta {
          transition: opacity 0.16s ease, transform 0.16s ease;
        }

        .spotlight-name {
          font-size: 18px;
          font-weight: 600;
          color: ${colors.name};
          letter-spacing: -0.01em;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .spotlight-role {
          font-size: 14px;
          color: ${colors.role};
          opacity: 0.7;
          margin: 0;
        }

        .spotlight-divider {
          width: 40%;
          height: 1px;
          background: ${colors.cardBorder};
          margin: 28px 0;
        }

        .spotlight-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .spotlight-nav-btn {
          background: transparent;
          border: none;
          padding: 0;
          font-family: ${FONT};
          font-size: 13px;
          font-weight: 500;
          color: ${colors.accent};
          cursor: pointer;
          opacity: 0.75;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .spotlight-nav-btn:hover {
          opacity: 1;
          transform: translateX(0);
        }

        .spotlight-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-family: ${FONT};
          transition: opacity 0.15s ease;
        }

        .spotlight-sidebar-item:hover .spotlight-sidebar-name {
          opacity: 1 !important;
        }

        .spotlight-sidebar-indicator {
          font-size: 12px;
          color: ${colors.accent};
          user-select: none;
          width: 14px;
          text-align: center;
        }

        .spotlight-sidebar-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          background: ${colors.cardBorder};
          flex-shrink: 0;
        }

        .spotlight-sidebar-name {
          font-size: 13px;
          font-weight: 600;
          color: ${colors.name};
          line-height: 1.2;
          transition: opacity 0.15s ease;
        }

        .spotlight-sidebar-company {
          font-size: 12px;
          color: ${colors.role};
          opacity: 0.6;
          line-height: 1.2;
        }

        /* Mobile specific rules */
        .spotlight-mobile-header {
          display: none;
        }

        .spotlight-mobile-dots {
          display: none;
        }

        @media (max-width: 767px) {
          .spotlight-container {
            flex-direction: column;
            gap: 24px;
          }

          .spotlight-sidebar {
            display: none;
          }

          .spotlight-photo-frame {
            display: none;
          }

          .spotlight-mobile-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
          }

          .spotlight-mobile-avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            background: ${colors.cardBorder};
          }

          .spotlight-quote {
            font-size: 22px;
            line-height: 1.45;
            margin-bottom: 20px;
          }

          .spotlight-divider {
            width: 60px;
            margin: 20px 0;
          }

          .spotlight-mobile-dots {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
          }

          .spotlight-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }
        }
      `}</style>

      <div className="spotlight-container">
        {/* Left Featured Section */}
        <div className="spotlight-main">
          {/* Desktop Photo */}
          <div
            className="spotlight-photo-frame"
            style={{
              opacity: !isLoaded ? 0 : isExiting ? 0 : 1,
              transform: !isLoaded
                ? "scale(0.97)"
                : isExiting
                ? "scale(0.97)"
                : "scale(1)",
              transition:
                "opacity 0.18s ease-out, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {current.avatar_url ? (
              <img src={current.avatar_url} alt={current.author_name} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                  fontWeight: 600,
                  color: colors.role,
                  background: colors.cardBg,
                }}
              >
                {current.author_name.charAt(0)}
              </div>
            )}
          </div>

          {/* Mobile Header (72px Circle + Meta) */}
          <div className="spotlight-mobile-header">
            {current.avatar_url ? (
              <img
                src={current.avatar_url}
                alt={current.author_name}
                className="spotlight-mobile-avatar"
              />
            ) : (
              <div
                className="spotlight-mobile-avatar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: colors.role,
                  background: colors.cardBg,
                }}
              >
                {current.author_name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="spotlight-name">
                {current.author_name}
                <VerifiedBadge id={current.id} />
              </h3>
              <p className="spotlight-role">{current.author_role || "Customer"}</p>
            </div>
          </div>

          {/* Desktop Meta */}
          <div
            className="spotlight-meta hidden-mobile"
            style={{
              display: "block",
              opacity: !isLoaded ? 0 : isExiting ? 0 : 1,
              transform: !isLoaded
                ? "translateY(6px)"
                : isExiting
                ? "translateX(-8px)"
                : "translateX(0)",
              transition: "opacity 0.14s ease-out, transform 0.22s ease-out",
              marginBottom: "20px",
            }}
          >
            <h3 className="spotlight-name">
              {current.author_name}
              <VerifiedBadge id={current.id} />
            </h3>
            <p className="spotlight-role">{current.author_role || "Customer"}</p>
          </div>

          {/* Rating Stars if enabled */}
          {showRatings && current.rating !== null && (
            <div style={{ marginBottom: "16px" }}>
              <Stars rating={current.rating} colors={colors} />
            </div>
          )}

          {/* Featured Quote */}
          <blockquote
            className="spotlight-quote"
            style={{
              opacity: !isLoaded ? 0 : isExiting ? 0 : 1,
              filter: isExiting ? "blur(4px)" : "blur(0px)",
              transition: "opacity 0.2s ease-out, filter 0.2s ease-out",
            }}
          >
            "{quoteText}"
          </blockquote>

          <div className="spotlight-divider" />

          {/* Prev / Next Links */}
          <div className="spotlight-nav-links">
            <button
              type="button"
              className="spotlight-nav-btn"
              onClick={goPrev}
              aria-label="Previous testimonial"
            >
              ← Prev
            </button>
            <button
              type="button"
              className="spotlight-nav-btn"
              onClick={goNext}
              aria-label="Next testimonial"
            >
              Next →
            </button>
          </div>

          {/* Mobile Dot Pagination */}
          <div className="spotlight-mobile-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className="spotlight-dot"
                onClick={() => selectTestimonial(idx)}
                style={{
                  background: idx === currentIndex ? colors.accent : colors.dotInactive,
                  transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
                }}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar List (Desktop Only) */}
        <div className="spotlight-sidebar">
          {testimonials.map((t, idx) => {
            const isActive = idx === currentIndex;
            const companyName =
              t.author_role?.split("at")[1]?.trim() ||
              t.author_role?.split("·")[1]?.trim() ||
              t.author_role ||
              "";

            return (
              <button
                key={t.id}
                type="button"
                className="spotlight-sidebar-item"
                onClick={() => selectTestimonial(idx)}
              >
                <span className="spotlight-sidebar-indicator">
                  {isActive ? "●" : "○"}
                </span>

                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.author_name}
                    className="spotlight-sidebar-avatar"
                  />
                ) : (
                  <div
                    className="spotlight-sidebar-avatar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: colors.role,
                    }}
                  >
                    {t.author_name.charAt(0)}
                  </div>
                )}

                <div>
                  <div
                    className="spotlight-sidebar-name"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {t.author_name}
                  </div>
                  {companyName && (
                    <div className="spotlight-sidebar-company">{companyName}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showBadge && (
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
