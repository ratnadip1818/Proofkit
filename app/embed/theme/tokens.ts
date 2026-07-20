import type { ThemeColors } from "./types";
import type { WidgetRadius, WidgetStyle, WidgetTheme } from "../types/widget";

export const RADIUS_PX: Record<WidgetRadius, number> = {
  sharp: 4,
  rounded: 12,
  pill: 22,
};

export const FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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
