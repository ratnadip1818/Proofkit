"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars, VerifiedBadge } from "../components";
import { sendWidgetHeight } from "../utils";

export interface BentoLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

export function BentoLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: BentoLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [activeFilter, setActiveFilter] = useState<"all" | "5star">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered testimonials list
  const filteredList = useMemo(() => {
    if (activeFilter === "5star") {
      return testimonials.filter((t) => t.rating === 5);
    }
    return testimonials;
  }, [testimonials, activeFilter]);

  // ResizeObserver for dynamic, overflow-free iframe height reporting
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      sendWidgetHeight();
    });
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, [filteredList.length, activeFilter]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg, width: "100%", boxSizing: "border-box" }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const mainHero = filteredList[0] || testimonials[0];
  const secondaryItems = filteredList.slice(1);

  // Compute aggregate rating stats
  const totalCount = testimonials.length;
  const avgRating = (
    testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / (totalCount || 1)
  ).toFixed(1);

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        color: colors.text,
        padding: "24px 16px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        .bento-wrapper {
          max-width: 1080px;
          margin: 0 auto;
        }

        .bento-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bento-filter-btn {
          background: ${theme === "dark" ? "rgba(255,255,255,0.06)" : "#F3F4F6"};
          color: ${colors.role};
          border: 1px solid ${colors.cardBorder};
          border-radius: 9999px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bento-filter-btn.active {
          background: ${colors.accent};
          color: #FFFFFF;
          border-color: ${colors.accent};
          box-shadow: 0 4px 12px ${colors.accent}40;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
        }

        .bento-card {
          background: ${colors.cardBg};
          border: 1px solid ${colors.cardBorder};
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .bento-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: ${colors.accent}60;
        }

        .bento-hero {
          grid-column: span 8;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(
            135deg,
            ${colors.cardBg} 0%,
            ${theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(37,99,235,0.03)"} 100%
          );
        }

        .bento-stats {
          grid-column: span 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: linear-gradient(
            135deg,
            ${colors.accent}0D 0%,
            ${colors.cardBg} 100%
          );
        }

        .bento-tile-medium {
          grid-column: span 6;
        }

        .bento-tile-small {
          grid-column: span 4;
        }

        @media (max-width: 860px) {
          .bento-hero { grid-column: span 12; }
          .bento-stats { grid-column: span 12; }
          .bento-tile-medium { grid-column: span 12; }
          .bento-tile-small { grid-column: span 12; }
        }

        .bento-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          background: ${colors.accent}1A;
          color: ${colors.accent};
          margin-bottom: 14px;
          width: fit-content;
        }

        .bento-avatar-stack {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .bento-avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          border: 2px solid ${colors.cardBg};
          margin-left: -10px;
          object-fit: cover;
          background: #E5E7EB;
        }

        .bento-avatar-img:first-child {
          margin-left: 0;
        }

        .bento-author-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid ${colors.cardBorder};
        }

        .bento-author-avatar {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          object-fit: cover;
          background: #E5E7EB;
          flex-shrink: 0;
        }

        .bento-author-name {
          font-size: 14px;
          font-weight: 700;
          color: ${colors.text};
          line-height: 1.2;
        }

        .bento-author-role {
          font-size: 12px;
          color: ${colors.role};
          line-height: 1.2;
          margin-top: 2px;
        }
      `}</style>

      <div className="bento-wrapper">
        {/* Bento Filter & Header Bar */}
        <div className="bento-filter-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: colors.text }}>
              Customer Stories
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "9999px",
                background: `${colors.accent}1F`,
                color: colors.accent,
              }}
            >
              {totalCount} Verified
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className={`bento-filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Reviews
            </button>
            <button
              type="button"
              className={`bento-filter-btn ${activeFilter === "5star" ? "active" : ""}`}
              onClick={() => setActiveFilter("5star")}
            >
              5 Stars Only ★
            </button>
          </div>
        </div>

        {/* Bento Main Grid */}
        <div className="bento-grid">
          {/* 1. Hero Bento Card (Spans 8 columns) */}
          <div className="bento-card bento-hero">
            <div>
              <div className="bento-badge-pill">
                <span>🚀 Flagship Story</span>
              </div>

              {showRatings && (mainHero.rating ?? 5) > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <Stars rating={mainHero.rating ?? 5} colors={colors} size={18} />
                </div>
              )}

              <blockquote
                style={{
                  fontSize: "17px",
                  lineHeight: 1.5,
                  fontWeight: 600,
                  color: colors.text,
                  margin: 0,
                  fontStyle: "normal",
                }}
              >
                “{mainHero.display_body ?? mainHero.body_original}”
              </blockquote>
            </div>

            <div className="bento-author-bar">
              {mainHero.avatar_url ? (
                <img
                  src={mainHero.avatar_url}
                  alt={mainHero.author_name}
                  className="bento-author-avatar"
                />
              ) : (
                <div
                  className="bento-author-avatar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors.accent,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {mainHero.author_name.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="bento-author-name">{mainHero.author_name}</span>
                  <VerifiedBadge id={mainHero.id} />
                </div>
                {mainHero.author_role && (
                  <div className="bento-author-role">{mainHero.author_role}</div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Stats Bento Card (Spans 4 columns) */}
          <div className="bento-card bento-stats">
            <div className="bento-avatar-stack">
              {testimonials.slice(0, 4).map((t, idx) => (
                <img
                  key={t.id || idx}
                  src={
                    t.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.author_name)}`
                  }
                  alt={t.author_name}
                  className="bento-avatar-img"
                />
              ))}
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: colors.text,
                lineHeight: 1.1,
                marginBottom: "4px",
              }}
            >
              {avgRating} <span style={{ color: colors.accent, fontSize: "24px" }}>★</span>
            </div>

            <div style={{ fontSize: "13px", fontWeight: 600, color: colors.role, marginBottom: "8px" }}>
              Average Customer Rating
            </div>

            {showRatings && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Stars rating={5} colors={colors} size={16} />
              </div>
            )}
          </div>

          {/* 3. Secondary Bento Grid Cards */}
          {secondaryItems.map((item, idx) => {
            const isMedium = idx % 3 === 0;
            const gridClass = isMedium ? "bento-tile-medium" : "bento-tile-small";

            return (
              <div key={item.id || idx} className={`bento-card ${gridClass}`}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  {showRatings && (item.rating ?? 5) > 0 && (
                    <Stars rating={item.rating ?? 5} colors={colors} size={14} />
                  )}
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: colors.text,
                    margin: 0,
                    marginBottom: "16px",
                  }}
                >
                  “{item.display_body ?? item.body_original}”
                </p>

                <div className="bento-author-bar" style={{ marginTop: "auto", paddingTop: "12px" }}>
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.author_name}
                      className="bento-author-avatar"
                      style={{ width: "34px", height: "34px" }}
                    />
                  ) : (
                    <div
                      className="bento-author-avatar"
                      style={{
                        width: "34px",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: colors.accent,
                        color: "#FFF",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      {item.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="bento-author-name" style={{ fontSize: "13px" }}>
                        {item.author_name}
                      </span>
                      <VerifiedBadge id={item.id} />
                    </div>
                    {item.author_role && (
                      <div className="bento-author-role" style={{ fontSize: "11px" }}>
                        {item.author_role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Brand Badge */}
        {showBadge && <BadgeLink colors={colors} />}
      </div>
    </div>
  );
}
