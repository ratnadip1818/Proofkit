"use client";

import { useEffect } from "react";
import type { Testimonial } from "../constants";
import { FONT, SHADOWS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars } from "../components";
import { sendWidgetHeight } from "../utils";

export interface RibbonLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

function RibbonCard({
  t,
  colors,
  radiusPx,
  showRatings,
}: {
  t: Testimonial;
  colors: ReturnType<typeof buildStyle>["colors"];
  radiusPx: number;
  showRatings: boolean;
}) {
  const quote = (t.display_body ?? t.body_original ?? "").slice(0, 80);
  const initials = ((t.author_name ?? "A").trim().split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2)).toUpperCase();

  return (
    <div
      className="proofkit-ribbon-card"
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: Math.max(radiusPx, 40),
        padding: "10px 16px",
        flexShrink: 0,
        boxShadow: colors.cardBg === "#ffffff" ? SHADOWS.cardLight : SHADOWS.cardDark,
        cursor: "default",
        userSelect: "none",
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      {/* Avatar */}
      {t.avatar_url ? (
        <img
          src={t.avatar_url}
          alt={t.author_name}
          width={32}
          height={32}
          loading="lazy"
          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: colors.avatarBg,
            color: colors.avatarText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        {showRatings && t.rating && (
          <Stars rating={t.rating} colors={colors} size={10} marginBottom={3} />
        )}
        <div
          style={{
            fontSize: 12,
            color: colors.text,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 200,
          }}
        >
          {quote}{quote.length < (t.display_body ?? t.body_original ?? "").length ? "…" : ""}
        </div>
        <div style={{ fontSize: 11, color: colors.role, marginTop: 2, fontWeight: 600 }}>
          — {t.author_name}
          {t.author_role ? <span style={{ fontWeight: 400 }}>, {t.author_role}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function RibbonLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
}: RibbonLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = setTimeout(sendWidgetHeight, 350);
    return () => clearTimeout(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  // Pad each row to 16 items minimum for seamless loop
  const pad = (arr: Testimonial[], minLen = 16) => {
    let out = [...arr];
    while (out.length < minLen) out = [...out, ...arr];
    return [...out, ...out]; // double for infinite scroll
  };

  const rowA = pad(testimonials);
  const rowB = pad([...testimonials].reverse());

  const rowADuration = Math.max(20, testimonials.length * 5);
  const rowBDuration = Math.max(24, testimonials.length * 6);

  const cardW = 260;
  const gap = 12;
  const singleSetW = Math.ceil(rowA.length / 2) * (cardW + gap);

  return (
    <div
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        padding: "20px 0",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes proofkit-ribbon-ltr {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-${singleSetW}px, 0, 0); }
        }
        @keyframes proofkit-ribbon-rtl {
          from { transform: translate3d(-${singleSetW}px, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .proofkit-ribbon-track-ltr {
          display: flex;
          gap: ${gap}px;
          width: max-content;
          animation: proofkit-ribbon-ltr ${rowADuration}s linear infinite;
          will-change: transform;
        }
        .proofkit-ribbon-track-rtl {
          display: flex;
          gap: ${gap}px;
          width: max-content;
          animation: proofkit-ribbon-rtl ${rowBDuration}s linear infinite;
          will-change: transform;
        }
        .proofkit-ribbon-track-ltr:hover,
        .proofkit-ribbon-track-rtl:hover {
          animation-play-state: paused;
        }
        .proofkit-ribbon-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .proofkit-ribbon-card:hover {
          transform: translateY(-3px);
          box-shadow: ${colors.cardBg === "#ffffff" ? SHADOWS.cardHoverLight : SHADOWS.cardHoverDark} !important;
          border-color: ${colors.accent} !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .proofkit-ribbon-track-ltr,
          .proofkit-ribbon-track-rtl { animation: none; }
        }
      `}</style>

      {/* Row 1 — left to right */}
      <div style={{ overflow: "hidden", marginBottom: 10, WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)" } as React.CSSProperties}>
        <div className="proofkit-ribbon-track-ltr">
          {rowA.map((t, i) => (
            <RibbonCard key={`a-${i}`} t={t} colors={colors} radiusPx={radiusPx} showRatings={showRatings} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div style={{ overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)" } as React.CSSProperties}>
        <div className="proofkit-ribbon-track-rtl">
          {rowB.map((t, i) => (
            <RibbonCard key={`b-${i}`} t={t} colors={colors} radiusPx={radiusPx} showRatings={showRatings} />
          ))}
        </div>
      </div>

      {showBadge && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
