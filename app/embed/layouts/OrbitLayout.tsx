"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars, VerifiedBadge } from "../components";
import { sendWidgetHeight } from "../utils";

export interface OrbitLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  brandName?: string;
  brandLogoUrl?: string;
}

export function OrbitLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
  brandName,
  brandLogoUrl,
}: OrbitLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Split testimonials into Inner Ring (5-6) and Outer Ring (remaining up to 14)
  const { innerRing, outerRing } = useMemo(() => {
    const list = testimonials.length > 0 ? testimonials : [];
    const innerCount = Math.min(6, Math.ceil(list.length / 2));
    const inner = list.slice(0, innerCount);
    const outer = list.slice(innerCount, 14);
    return { innerRing: inner, outerRing: outer };
  }, [testimonials]);

  // Handle ResizeObserver for dynamic iframe height reporting
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      sendWidgetHeight();
    });
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, []);

  // Keyboard Navigation: Escape to unlock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTestimonial(null);
        setIsLocked(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAvatarHover = useCallback(
    (t: Testimonial) => {
      if (!isLocked) {
        setActiveTestimonial(t);
      }
    },
    [isLocked]
  );

  const handleAvatarLeave = useCallback(() => {
    if (!isLocked) {
      setActiveTestimonial(null);
    }
  }, [isLocked]);

  const handleAvatarClick = useCallback(
    (t: Testimonial) => {
      if (isLocked && activeTestimonial?.id === t.id) {
        setIsLocked(false);
        setActiveTestimonial(null);
      } else {
        setIsLocked(true);
        setActiveTestimonial(t);
      }
    },
    [isLocked, activeTestimonial]
  );

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg, width: "100%", boxSizing: "border-box" }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const selectedItem = activeTestimonial;
  const isAnyHoveredOrLocked = !!selectedItem || isLocked;

  // Identify which ring contains the active node to elevate its z-index above center logo
  const isInnerActive = innerRing.some((item) => item.id === selectedItem?.id);
  const isOuterActive = outerRing.some((item) => item.id === selectedItem?.id);

  // Solid non-transparent card background so avatars behind do NOT bleed through
  const solidCardBg = theme === "dark" ? "#18181B" : "#FFFFFF";

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        color: colors.text,
        padding: "24px 16px 12px 16px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes orbitSpinCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitSpinCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes counterSpinCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes counterSpinCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 20px ${colors.accent}25; }
          50% { box-shadow: 0 0 35px ${colors.accent}45; }
        }

        @keyframes popoverScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .orbit-wrapper {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .orbit-canvas {
          position: relative;
          width: 440px;
          height: 440px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .orbit-canvas { display: none; }
          .orbit-mobile-scroll { display: flex !important; }
        }

        /* Center Earth Icon z-index: 10 */
        .orbit-center-logo {
          position: absolute;
          top: 220px;
          left: 220px;
          transform: translate(-50%, -50%);
          z-index: 10;
          width: 60px;
          height: 60px;
          background: transparent !important;
          border: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 16px ${colors.accent}50);
          transition: transform 0.3s ease;
          pointer-events: auto;
        }

        .orbit-center-logo:hover {
          transform: translate(-50%, -50%) scale(1.15);
        }

        .orbit-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 440px;
          height: 440px;
          transform-origin: 220px 220px;
          pointer-events: none;
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          z-index: 1;
        }

        /* Active Ring sits ABOVE the center logo (z-index 100 > 10) */
        .orbit-ring.is-active-ring {
          z-index: 100 !important;
        }

        .orbit-ring-inner {
          animation: orbitSpinCW 25s linear infinite;
        }

        .orbit-ring-outer {
          animation: orbitSpinCCW 40s linear infinite;
        }

        .orbit-paused .orbit-ring-inner,
        .orbit-paused .orbit-ring-outer {
          animation-play-state: paused !important;
        }

        .orbit-node {
          position: absolute;
          pointer-events: auto;
          cursor: pointer;
          transition: opacity 0.25s ease;
          will-change: transform, opacity;
          z-index: 20;
        }

        /* Active node sits highest */
        .orbit-node.is-active {
          z-index: 99999 !important;
        }

        .orbit-node-face {
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          position: relative;
        }

        .orbit-ring-inner .orbit-node-face {
          animation: counterSpinCW 25s linear infinite;
          transform-origin: center center;
        }

        .orbit-ring-outer .orbit-node-face {
          animation: counterSpinCCW 40s linear infinite;
          transform-origin: center center;
        }

        .orbit-paused .orbit-node-face {
          animation-play-state: paused !important;
        }

        .orbit-avatar-btn {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          border: 2px solid ${solidCardBg};
          background: ${solidCardBg};
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orbit-avatar-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .orbit-node.is-active .orbit-avatar-btn {
          transform: scale(1.35) translateZ(0);
          border-color: ${colors.accent};
          box-shadow: 0 8px 24px ${colors.accent}50;
        }

        .orbit-node.is-dimmed {
          opacity: 0.3;
        }

        /* FULL HORIZONTALLY EXPANDING REVIEW POPOVER CARD */
        .orbit-popover-card {
          position: absolute;
          z-index: 99999 !important;
          width: max-content;
          min-width: 280px;
          max-width: 380px;
          background: ${solidCardBg} !important;
          border: 1px solid ${colors.cardBorder};
          border-radius: 16px;
          padding: 16px;
          box-sizing: border-box;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
          pointer-events: auto;
          animation: popoverScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .orbit-popover-card.pos-above {
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        }

        .orbit-popover-card.pos-below {
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        }

        .orbit-popover-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: ${colors.cardBorder}60;
          color: ${colors.text};
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
        }

        .orbit-popover-close:hover {
          background: ${colors.accent};
          color: #FFF;
        }

        /* Mobile Scroll Layout */
        .orbit-mobile-scroll {
          display: none;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .orbit-mobile-cards {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          width: 100%;
          padding: 12px 4px 16px 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .orbit-mobile-card {
          flex: 0 0 260px;
          scroll-snap-align: center;
          background: ${solidCardBg};
          border: 1px solid ${colors.cardBorder};
          border-radius: 16px;
          padding: 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `}</style>

      <div className={`orbit-wrapper ${isAnyHoveredOrLocked ? "orbit-paused" : ""}`}>
        {/* DESKTOP CANVAS (440px x 440px with Center at 220px, 220px) */}
        <div className="orbit-canvas">
          {/* Gravitational Earth Circle Logo (z-index 10) */}
          <div className="orbit-center-logo" title="Global Community">
            {brandLogoUrl ? (
              <img
                src={brandLogoUrl}
                alt="Community"
                style={{ width: "44px", height: "44px", borderRadius: "9999px", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "44px", lineHeight: 1, userSelect: "none" }}>🌍</span>
            )}
          </div>

          {/* Inner Ring (Radius 110px, Clockwise) */}
          <div className={`orbit-ring orbit-ring-inner ${isInnerActive ? "is-active-ring" : ""}`}>
            {innerRing.map((item, idx) => {
              const count = innerRing.length;
              const angleDeg = (360 / count) * idx;
              const radiusPx = 110;
              const angleRad = (angleDeg * Math.PI) / 180;

              // Exact Center (220, 220) - 21px (half avatar size)
              const x = 220 + Math.cos(angleRad) * radiusPx - 21;
              const y = 220 + Math.sin(angleRad) * radiusPx - 21;

              const isSelected = selectedItem?.id === item.id;
              const isDimmed = isAnyHoveredOrLocked && !isSelected;

              return (
                <div
                  key={item.id || idx}
                  className={`orbit-node ${isSelected ? "is-active" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  onMouseEnter={() => handleAvatarHover(item)}
                  onMouseLeave={handleAvatarLeave}
                  onClick={() => handleAvatarClick(item)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAvatarClick(item);
                    }
                  }}
                  role="button"
                  aria-label={`View testimonial by ${item.author_name}`}
                >
                  <div className="orbit-node-face">
                    <div className="orbit-avatar-btn">
                      <img
                        src={
                          item.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author_name)}`
                        }
                        alt={item.author_name}
                      />
                    </div>

                    {/* HORIZONTALLY EXPANDING REVIEW POPOVER CARD */}
                    {isSelected && (
                      <div className={`orbit-popover-card ${y < 220 ? "pos-below" : "pos-above"}`}>
                        {isLocked && (
                          <button
                            type="button"
                            className="orbit-popover-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLocked(false);
                              setActiveTestimonial(null);
                            }}
                            aria-label="Close popover"
                          >
                            ✕
                          </button>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          <img
                            src={
                              item.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author_name)}`
                            }
                            alt={item.author_name}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "9999px",
                              border: `2px solid ${colors.accent}`,
                              objectFit: "cover",
                            }}
                          />
                          <div style={{ overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: colors.text,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.author_name}
                              </span>
                              <VerifiedBadge id={item.id} />
                            </div>
                            {item.author_role && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: colors.role,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.author_role}
                              </div>
                            )}
                          </div>
                        </div>

                        {showRatings && (item.rating ?? 5) > 0 && (
                          <div style={{ marginBottom: "8px" }}>
                            <Stars rating={item.rating ?? 5} colors={colors} size={14} />
                          </div>
                        )}

                        {/* FULL COMPLETE REVIEW TEXT */}
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.5,
                            fontWeight: 500,
                            color: colors.text,
                            margin: 0,
                            fontStyle: "normal",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {item.display_body ?? item.body_original}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outer Ring (Radius 185px, Counter-Clockwise) */}
          <div className={`orbit-ring orbit-ring-outer ${isOuterActive ? "is-active-ring" : ""}`}>
            {outerRing.map((item, idx) => {
              const count = outerRing.length;
              const angleDeg = (360 / count) * idx + 30; // 30 deg offset for visual stagger
              const radiusPx = 185;
              const angleRad = (angleDeg * Math.PI) / 180;

              // Exact Center (220, 220) - 21px (half avatar size)
              const x = 220 + Math.cos(angleRad) * radiusPx - 21;
              const y = 220 + Math.sin(angleRad) * radiusPx - 21;

              const isSelected = selectedItem?.id === item.id;
              const isDimmed = isAnyHoveredOrLocked && !isSelected;

              return (
                <div
                  key={item.id || idx}
                  className={`orbit-node ${isSelected ? "is-active" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  onMouseEnter={() => handleAvatarHover(item)}
                  onMouseLeave={handleAvatarLeave}
                  onClick={() => handleAvatarClick(item)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAvatarClick(item);
                    }
                  }}
                  role="button"
                  aria-label={`View testimonial by ${item.author_name}`}
                >
                  <div className="orbit-node-face">
                    <div className="orbit-avatar-btn">
                      <img
                        src={
                          item.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author_name)}`
                        }
                        alt={item.author_name}
                      />
                    </div>

                    {/* HORIZONTALLY EXPANDING REVIEW POPOVER CARD */}
                    {isSelected && (
                      <div className={`orbit-popover-card ${y < 220 ? "pos-below" : "pos-above"}`}>
                        {isLocked && (
                          <button
                            type="button"
                            className="orbit-popover-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLocked(false);
                              setActiveTestimonial(null);
                            }}
                            aria-label="Close popover"
                          >
                            ✕
                          </button>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          <img
                            src={
                              item.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author_name)}`
                            }
                            alt={item.author_name}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "9999px",
                              border: `2px solid ${colors.accent}`,
                              objectFit: "cover",
                            }}
                          />
                          <div style={{ overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: colors.text,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.author_name}
                              </span>
                              <VerifiedBadge id={item.id} />
                            </div>
                            {item.author_role && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: colors.role,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.author_role}
                              </div>
                            )}
                          </div>
                        </div>

                        {showRatings && (item.rating ?? 5) > 0 && (
                          <div style={{ marginBottom: "8px" }}>
                            <Stars rating={item.rating ?? 5} colors={colors} size={14} />
                          </div>
                        )}

                        {/* FULL COMPLETE REVIEW TEXT */}
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.5,
                            fontWeight: 500,
                            color: colors.text,
                            margin: 0,
                            fontStyle: "normal",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {item.display_body ?? item.body_original}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE LAYOUT (Collapsed Orbit to Horizontal Scroll Container) */}
        <div className="orbit-mobile-scroll">
          {/* Centered Earth Circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: solidCardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <span style={{ fontSize: "16px" }}>🌍</span>
            <span style={{ fontSize: "12px", fontWeight: 800, color: colors.text }}>
              Community
            </span>
          </div>

          <div className="orbit-mobile-cards">
            {testimonials.map((t, idx) => (
              <div key={t.id || idx} className="orbit-mobile-card">
                <div>
                  {showRatings && (t.rating ?? 5) > 0 && (
                    <div style={{ marginBottom: "8px" }}>
                      <Stars rating={t.rating ?? 5} colors={colors} size={14} />
                    </div>
                  )}

                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: colors.text, margin: 0 }}>
                    {t.display_body ?? t.body_original}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "14px",
                    paddingTop: "10px",
                    borderTop: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <img
                    src={
                      t.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.author_name)}`
                    }
                    alt={t.author_name}
                    style={{ width: "32px", height: "32px", borderRadius: "9999px" }}
                  />
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: colors.text }}>
                      {t.author_name}
                    </div>
                    {t.author_role && (
                      <div style={{ fontSize: "11px", color: colors.role }}>
                        {t.author_role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Brand Badge */}
        {showBadge && <BadgeLink colors={colors} />}
      </div>
    </div>
  );
}
