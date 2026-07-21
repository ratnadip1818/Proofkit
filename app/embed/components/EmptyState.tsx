import React from "react";
import type { ThemeColors } from "../theme/types";

export function EmptyState({ colors }: { colors: ThemeColors }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        borderRadius: "16px",
        border: `1px dashed ${colors.cardBorder || "rgba(0,0,0,0.12)"}`,
        background: colors.cardBg || "#ffffff",
        color: colors.text || "#374151",
        maxWidth: "440px",
        margin: "40px auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: colors.accent ? `${colors.accent}15` : "#EFF6FF",
          color: colors.accent || "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          fontWeight: 700,
          fontSize: "20px",
        }}
      >
        💬
      </div>
      <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 600 }}>
        No approved reviews yet
      </h4>
      <p style={{ margin: 0, fontSize: "13px", opacity: 0.75, lineHeight: 1.5 }}>
        Approve customer reviews in your Inbox or share your collection link to start displaying social proof!
      </p>
    </div>
  );
}
