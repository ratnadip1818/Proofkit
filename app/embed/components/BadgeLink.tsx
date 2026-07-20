import type { ThemeColors } from "../theme/types";
import { RADIUS_PX } from "../theme/tokens";

export function BadgeLink({ colors }: { colors: ThemeColors }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <a
        href="https://www.blovi.space"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12px",
          color: colors.badgeText,
          textDecoration: "none",
          border: `1px solid ${colors.badgeBorder}`,
          borderRadius: `${RADIUS_PX.full}px`,
          padding: "4px 12px",
          background: colors.badgeBg,
        }}
      >
        ⚡ Powered by Blovi
      </a>
    </div>
  );
}
