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
}

export function OrbitLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: OrbitLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
  }, [activeTestimonial, isLocked]);

  // Keyboard Navigation: Escape to unlock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveTestimonial(null);
        setIsLocked(false);
        setHoveredId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAvatarHover = useCallback(
    (t: Testimonial) => {
      if (!isLocked) {
        setActiveTestimonial(t);
        setHoveredId(t.id);
      }
    },
    [isLocked]
  );

  const handleAvatarLeave = useCallback(() => {
    if (!isLocked) {
      setActiveTestimonial(null);
      setHoveredId(null);
    }
  }, [isLocked]);

  const handleAvatarClick = useCallback(
    (t: Testimonial) => {
      if (isLocked && activeTestimonial?.id === t.id) {
        setIsLocked(false);
        setActiveTestimonial(null);
        setHoveredId(null);
      } else {
        setIsLocked(true);
        setActiveTestimonial(t);
        setHoveredId(t.id);
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

  // Displayed selected item (active or first as fallback)
  const selectedItem = activeTestimonial;
  const isAnyHoveredOrLocked = !!selectedItem || isLocked;

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        color: colors.text,
        padding: "32px 16px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes orbitSpinCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes orbitSpinCCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
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
          0%, 100% { box-shadow: 0 0 20px ${colors.accent}20; }
          50% { box-shadow: 0 0 35px ${colors.accent}45; }
        }

        .orbit-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .orbit-canvas {
          position: relative;
          width: 520px;
          height: 520px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .orbit-canvas { display: none; }
          .orbit-mobile-scroll { display: flex !important; }
        }

        .orbit-center-logo {
          position: absolute;
          z-index: 10;
          width: 88px;
          height: 88px;
          border-radius: 9999px;
          background: ${colors.cardBg};
          border: 2px solid ${colors.accent}40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: logoGlow 4s infinite ease-in-out;
          transition: transform 0.3s ease;
        }

        .orbit-center-logo:hover {
          transform: scale(1.05);
        }

        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 9999px;
          transform-origin: center center;
          pointer-events: none;
        }

        .orbit-ring-inner {
          width: 260px;
          height: 260px;
          animation: orbitSpinCW 25s linear infinite;
        }

        .orbit-ring-outer {
          width: 440px;
          height: 440px;
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
          transform-origin: center center;
          transition: opacity 0.3s ease;
        }

        .orbit-ring-inner .orbit-node-face {
          animation: counterSpinCW 25s linear infinite;
        }

        .orbit-ring-outer .orbit-node-face {
          animation: counterSpinCCW 40s linear infinite;
        }

        .orbit-paused .orbit-node-face {
          animation-play-state: paused !important;
        }

        .orbit-avatar-btn {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          border: 2px solid ${colors.cardBg};
          background: ${colors.cardBg};
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, border-color 0.3s ease;
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
          transform: scale(1.4);
          border-color: ${colors.accent};
          box-shadow: 0 8px 24px ${colors.accent}50;
        }

        .orbit-node.is-dimmed {
          opacity: 0.35;
        }

        .orbit-name-tag {
          position: absolute;
          left: 50%;
          bottom: -26px;
          transform: translateX(-50%);
          white-space: nowrap;
          background: ${colors.cardBg};
          color: ${colors.text};
          border: 1px solid ${colors.cardBorder};
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          pointer-events: none;
          animation: fadeInTag 0.2s ease forwards;
        }

        @keyframes fadeInTag {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Quote Panel */
        .orbit-quote-panel {
          width: 100%;
          max-width: 680px;
          margin-top: 24px;
          background: ${colors.cardBg};
          border: 1px solid ${colors.cardBorder};
          border-radius: 20px;
          padding: 24px 28px;
          box-sizing: border-box;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
          position: relative;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .orbit-quote-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: ${colors.cardBorder}40;
          color: ${colors.text};
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          transition: background 0.2s ease;
        }

        .orbit-quote-close:hover {
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
          gap: 16px;
          overflow-x: auto;
          width: 100%;
          padding: 12px 4px 20px 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .orbit-mobile-card {
          flex: 0 0 280px;
          scroll-snap-align: center;
          background: ${colors.cardBg};
          border: 1px solid ${colors.cardBorder};
          border-radius: 18px;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `}</style>

      <div className={`orbit-wrapper ${isAnyHoveredOrLocked ? "orbit-paused" : ""}`}>
        {/* DESKTOP CANVAS */}
        <div className="orbit-canvas">
          {/* Gravitational Center Logo */}
          <div className="orbit-center-logo">
            <span style={{ fontSize: "18px" }}>🪐</span>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "-0.01em", color: colors.text }}>
              Blovi
            </span>
          </div>

          {/* Inner Ring (5-6 Avatars, Clockwise) */}
          <div className="orbit-ring orbit-ring-inner">
            {innerRing.map((item, idx) => {
              const count = innerRing.length;
              const angleDeg = (360 / count) * idx;
              const radiusPx = 130; // 260px diameter
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * radiusPx + 130 - 21; // center offset
              const y = Math.sin(angleRad) * radiusPx + 130 - 21;

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
                    {isSelected && (
                      <div className="orbit-name-tag">{item.author_name}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outer Ring (Remaining Avatars, Counter-Clockwise) */}
          <div className="orbit-ring orbit-ring-outer">
            {outerRing.map((item, idx) => {
              const count = outerRing.length;
              const angleDeg = (360 / count) * idx + 30; // 30 deg offset for visual stagger
              const radiusPx = 220; // 440px diameter
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.cos(angleRad) * radiusPx + 220 - 21;
              const y = Math.sin(angleRad) * radiusPx + 220 - 21;

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
                    {isSelected && (
                      <div className="orbit-name-tag">{item.author_name}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE LAYOUT (Collapsed Orbit to Horizontal Scroll Container) */}
        <div className="orbit-mobile-scroll">
          {/* Centered Anchor Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <span>🪐</span>
            <span style={{ fontSize: "12px", fontWeight: 800, color: colors.text }}>
              Blovi Community
            </span>
          </div>

          <div className="orbit-mobile-cards">
            {testimonials.map((t, idx) => (
              <div key={t.id || idx} className="orbit-mobile-card">
                <div>
                  {showRatings && (t.rating ?? 5) > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <Stars rating={t.rating ?? 5} colors={colors} size={14} />
                    </div>
                  )}

                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: colors.text, margin: 0 }}>
                    “{t.display_body ?? t.body_original}”
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "16px",
                    paddingTop: "12px",
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

        {/* QUOTE PANEL BELOW ORBIT */}
        {selectedItem ? (
          <div className="orbit-quote-panel">
            {isLocked && (
              <button
                type="button"
                className="orbit-quote-close"
                onClick={() => {
                  setIsLocked(false);
                  setActiveTestimonial(null);
                  setHoveredId(null);
                }}
                aria-label="Close quote panel"
              >
                ✕
              </button>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <img
                src={
                  selectedItem.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedItem.author_name)}`
                }
                alt={selectedItem.author_name}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "9999px",
                  border: `2px solid ${colors.accent}`,
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: colors.text }}>
                    {selectedItem.author_name}
                  </span>
                  <VerifiedBadge id={selectedItem.id} />
                </div>

                {selectedItem.author_role && (
                  <div style={{ fontSize: "13px", color: colors.role, marginTop: "2px" }}>
                    {selectedItem.author_role}
                  </div>
                )}
              </div>
            </div>

            {showRatings && (selectedItem.rating ?? 5) > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <Stars rating={selectedItem.rating ?? 5} colors={colors} size={16} />
              </div>
            )}

            <blockquote
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                fontWeight: 500,
                color: colors.text,
                margin: 0,
                fontStyle: "normal",
              }}
            >
              “{selectedItem.display_body ?? selectedItem.body_original}”
            </blockquote>
          </div>
        ) : (
          <div
            style={{
              marginTop: "24px",
              fontSize: "13px",
              fontWeight: 600,
              color: colors.role,
              textAlign: "center",
            }}
          >
            Hover or click on any customer avatar to explore their story 🪐
          </div>
        )}

        {/* Footer Brand Badge */}
        {showBadge && <BadgeLink colors={colors} />}
      </div>
    </div>
  );
}
