import type { ThemeColors } from "./types";
import type { WidgetRadius, WidgetStyle, WidgetTheme } from "../types/widget";
import type { PresetVisualOverrides } from "../styles/types";

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
    cardBorder: "#e5e7eb",
    text: "#374151",
    name: "#111827",
    role: "#6b7280",
    emptyText: "#6b7280",
    badgeBg: "#ffffff",
    badgeBorder: "#e5e7eb",
    badgeText: "#6b7280",
    starOn: "#FBBF24",
    starOff: "#e5e7eb",
    avatarBg: "#EFF6FF",
    avatarText: "#2563EB",
    accent: "#2563EB",
    ratingBorder: "#4F46E5",
    highlight: "rgba(251, 191, 36, 0.25)",
    dotInactive: "#e5e7eb",
    arrowBg: "#ffffff",
    arrowText: "#374151",
  },
  dark: {
    pageBg: "transparent",
    cardBg: "#111827",
    cardBorder: "#1f2937",
    text: "#d1d5db",
    name: "#ffffff",
    role: "#9ca3af",
    emptyText: "#9ca3af",
    badgeBg: "#111827",
    badgeBorder: "#1f2937",
    badgeText: "#9ca3af",
    starOn: "#FBBF24",
    starOff: "#374151",
    avatarBg: "#1f2937",
    avatarText: "#ffffff",
    accent: "#3b82f6",
    ratingBorder: "#4F46E5",
    highlight: "rgba(251, 191, 36, 0.25)",
    dotInactive: "#374151",
    arrowBg: "#111827",
    arrowText: "#ffffff",
  },
};

/**
 * Single shared style builder merging base theme, preset overrides, and brand accent.
 */
export function buildStyle(
  theme: WidgetTheme,
  accent?: string,
  radius: WidgetRadius = "rounded",
  presetOverrides?: PresetVisualOverrides
): WidgetStyle {
  const base = THEME[theme];

  // 1. Merge Base Theme + Declarative Preset Overrides
  let colors: ThemeColors = presetOverrides?.colors
    ? { ...base, ...presetOverrides.colors }
    : { ...base };

  // 2. Apply Brand Accent
  if (accent) {
    colors = {
      ...colors,
      accent,
      avatarText: theme === "light" ? accent : colors.avatarText,
      avatarBg:
        theme === "light"
          ? `color-mix(in srgb, ${accent} 12%, white)`
          : colors.avatarBg,
    };
  }

  // 3. Apply custom color overrides from searchParams if present
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const textColor = params.get("textColor");
    const ratingColor = params.get("ratingColor");
    const ratingBorderColor = params.get("ratingBorderColor");
    const highlightColor = params.get("highlightColor");

    if (textColor) {
      colors = { ...colors, text: textColor, name: textColor };
    }
    if (ratingColor) {
      colors = { ...colors, starOn: ratingColor };
    }
    if (ratingBorderColor) {
      colors = { ...colors, ratingBorder: ratingBorderColor };
    }
    if (highlightColor) {
      colors = { ...colors, highlight: highlightColor };
    }
  }

  return { colors, radius: RADIUS_PX[radius] };
}
