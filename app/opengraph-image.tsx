import { ImageResponse } from "next/og";

export const alt =
  "Blovi — Collect testimonials, polish them with AI, embed a Wall of Love. $49 once.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16161D",
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,116,59,0.28) 0%, rgba(22,22,29,0) 65%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#E8743B",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <div style={{ color: "white", fontSize: 44, fontWeight: 700 }}>
            Blovi
          </div>
        </div>

        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 920,
            letterSpacing: "-0.02em",
          }}
        >
          Collect testimonials.
        </div>
        <div
          style={{
            display: "flex",
            color: "#E8743B",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Pay once. Keep them forever.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 44,
            background: "rgba(232,116,59,0.12)",
            border: "1px solid rgba(232,116,59,0.45)",
            borderRadius: 999,
            padding: "14px 32px",
            color: "#E8743B",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          ✦ $49 lifetime deal — no subscription
        </div>
      </div>
    ),
    size
  );
}
