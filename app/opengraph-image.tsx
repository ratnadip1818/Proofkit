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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z"
                fill="white"
              />
              <path
                d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z"
                fill="white"
              />
            </svg>
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
          $49 lifetime deal — no subscription
        </div>
      </div>
    ),
    size
  );
}
