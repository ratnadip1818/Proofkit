import type { ThemeColors } from "./types";
import type { WidgetRadius, WidgetStyle, WidgetTheme } from "../types/widget";

export const RADIUS_PX: Record<WidgetRadius | "full", number> = {
  sharp: 4,
  rounded: 12,
  pill: 22,
  full: 9999,
};

export const FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/** Semantic typography scale */
export const FONT_SIZE = {
  caption: "11px",
  bodySm: "12px",
  body: "14px",
  bodyLg: "16px",
  title: "18px",
  heading: "20px",
  display: "22px",
} as const;

/** Shared box shadow elevation tokens */
export const SHADOWS = {
  cardLight: "0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.02)",
  cardDark: "0 4px 20px rgba(0, 0, 0, 0.15)",
  cardHoverLight: "0 12px 30px rgba(0, 0, 0, 0.08)",
  cardHoverDark: "0 10px 30px rgba(0, 0, 0, 0.35)",
  modal: "0 20px 40px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)",
  button: "0 2px 8px rgba(0, 0, 0, 0.05)",
} as const;

/** Shared motion & transition tokens */
export const TRANSITIONS = {
  fast: "all 0.15s ease",
  normal: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  smooth: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
  hover: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  slide: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** Z-index layer tokens */
export const Z_INDEX = {
  modal: 99999,
} as const;

export const THEME: Record<WidgetTheme, ThemeColors> = {
  light: {
    pageBg: "transparent",
    cardBg: "#ffffff",
    cardBorder: "#e4e4e7",
    text: "#3f3f46",
    name: "#18181b",
    role: "#71717a",
    emptyText: "#71717a",
    badgeBg: "#ffffff",
    badgeBorder: "#e4e4e7",
    badgeText: "#71717a",
    starOn: "#f59e0b",
    starOff: "#e4e4e7",
    avatarBg: "#EFF6FF",
    avatarText: "#2563EB",
    accent: "#2563EB",
    dotInactive: "#e4e4e7",
    arrowBg: "#ffffff",
    arrowText: "#3f3f46",
  },
  dark: {
    pageBg: "transparent",
    cardBg: "#1F1F28",
    cardBorder: "#2A2A35",
    text: "#ffffff",
    name: "#ffffff",
    role: "#a1a1aa",
    emptyText: "#a1a1aa",
    badgeBg: "#1F1F28",
    badgeBorder: "#2A2A35",
    badgeText: "#a1a1aa",
    starOn: "#f59e0b",
    starOff: "#2A2A35",
    avatarBg: "#2A2A35",
    avatarText: "#ffffff",
    accent: "#2563EB",
    dotInactive: "#2A2A35",
    arrowBg: "#1F1F28",
    arrowText: "#ffffff",
  },
};

/**
 * Resolve theme colors with an optional brand accent so the widget can
 * match the host site instead of always being Blovi-orange.
 */
export function buildStyle(
  theme: WidgetTheme,
  accent?: string,
  radius: WidgetRadius = "rounded"
): WidgetStyle {
  const base = THEME[theme];
  const colors: ThemeColors = accent
    ? {
        ...base,
        accent,
        starOn: theme === "light" ? accent : base.starOn,
        avatarText: theme === "light" ? accent : base.avatarText,
        avatarBg:
          theme === "light"
            ? `color-mix(in srgb, ${accent} 12%, white)`
            : base.avatarBg,
      }
    : base;
  return { colors, radius: RADIUS_PX[radius] };
}
