import React from "react";
import type { ThemeColors } from "../theme/types";

export function BadgeLink({ colors }: { colors: ThemeColors }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "24px",
        marginBottom: "8px",
        width: "100%",
      }}
    >
      <a
        href="https://www.blovi.space"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "12px",
          fontWeight: 600,
          color: colors.badgeText || "#4B5563",
          textDecoration: "none",
          border: `1px solid ${colors.badgeBorder || "#E5E7EB"}`,
          borderRadius: "9999px",
          padding: "6px 14px",
          background: colors.badgeBg || "#ffffff",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        {/* Blovi Logo Icon Badge */}
        <span
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#2563EB",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
          }}
        >
          👍
        </span>

        {/* Badge Label */}
        <span>Collect testimonials with Blovi</span>

        {/* External Arrow Icon ↗ */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.75, marginLeft: "1px" }}
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  );
}
