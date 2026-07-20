"use client";

import type { Testimonial } from "../constants";
import { FONT, SHADOWS, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme, SingleQuoteLayout as SingleQuoteLayoutType } from "../types/widget";
import {
  Stars,
  Avatar,
  EmptyState,
  BadgeLink,
  VerifiedBadge,
} from "../components";

export interface SingleQuoteLayoutProps {
  testimonial: Testimonial | null;
  testimonials?: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  layout?: SingleQuoteLayoutType;
}

export function SingleQuoteLayout({
  testimonial,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  layout = "card",
}: SingleQuoteLayoutProps) {
  const { colors, radius: radiusPx } = buildStyle(theme, accent, radius);

  if (!testimonial) {
    return (
      <div style={{ fontFamily: FONT, padding: "16px", background: colors.pageBg }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const text = testimonial.display_body ?? testimonial.body_original;
  const isShort = text.length < 120;

  if (layout === "minimal") {
    const fontSize = isShort ? "22px" : "18px";
    return (
      <div
        style={{
          fontFamily: FONT,
          padding: "36px 24px",
          background: colors.pageBg,
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: colors.accent,
              opacity: 0.08,
              display: "block",
              marginBottom: "16px",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ margin: "0 auto" }}
            >
              <path d="M11.1 14.1H8.3c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3zM20.1 14.1h-2.8c-.2-1.7.5-3.3 2-3.9V8c-2.9.8-4.7 3.4-4.3 6.6.3 2.6 2.3 4.4 4.9 4.4h.2c1.7 0 3.1-1.4 3.1-3.1v-.8c0-1.7-1.4-3-3.1-3z" />
            </svg>
          </span>
          <p
            style={{
              fontSize,
              lineHeight: "1.7",
              color: colors.text,
              fontWeight: 500,
              margin: "0 0 24px 0",
              fontStyle: isShort ? "italic" : "normal",
            }}
          >
            {text}
          </p>
          {showRatings && testimonial.rating !== null && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <Stars rating={testimonial.rating} colors={colors} />
            </div>
          )}
          <div style={{ width: "48px", height: "1px", background: colors.cardBorder, margin: "0 auto 20px auto" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <Avatar name={testimonial.author_name} avatarUrl={testimonial.avatar_url} colors={colors} size={44} source={testimonial.source} />
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "15px",
                  color: colors.name,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                {testimonial.author_name}
                <VerifiedBadge id={testimonial.id} />
              </p>
              {testimonial.author_role && (
                <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: colors.role }}>
                  {testimonial.author_role}
                </p>
              )}
            </div>
          </div>
        </div>
        {showBadge && <BadgeLink colors={colors} />}
      </div>
    );
  }

  // "card" layout
  const fontSize = isShort ? "20px" : "18px";
  return (
    <div
      style={{
        fontFamily: FONT,
        padding: "32px 24px",
        background: colors.pageBg,
        textAlign: "center",
      }}
    >
      <div
        className="blovi-card"
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: `${radiusPx}px`,
          padding: "36px 32px",
          boxShadow: colors.cardBg === "#ffffff" ? SHADOWS.cardLight : SHADOWS.cardDark,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
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
        <p
          style={{
            fontSize,
            lineHeight: "1.75",
            color: colors.text,
            fontWeight: 500,
            margin: "12px 0 20px 0",
            fontStyle: isShort ? "italic" : "normal",
          }}
        >
          {text}
        </p>
        {showRatings && testimonial.rating !== null && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Stars rating={testimonial.rating} colors={colors} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
          <Avatar name={testimonial.author_name} avatarUrl={testimonial.avatar_url} colors={colors} size={38} source={testimonial.source} />
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "14.5px",
                color: colors.name,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "4px",
              }}
            >
              {testimonial.author_name}
              <VerifiedBadge id={testimonial.id} />
            </p>
            {testimonial.author_role && (
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: colors.role }}>
                {testimonial.author_role}
              </p>
            )}
          </div>
        </div>
      </div>
      {showBadge && <BadgeLink colors={colors} />}
    </div>
  );
}
