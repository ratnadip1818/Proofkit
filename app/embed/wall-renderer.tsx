"use client";

import { type Testimonial, SAMPLE_TESTIMONIALS } from "./constants";
import { THEME, RADIUS_PX, buildStyle } from "./theme/tokens";
import type { ThemeColors } from "./theme/types";
import type { WallLayout as WallLayoutType, WidgetRadius, WidgetStyle, WidgetType, WidgetTheme as WallTheme } from "./types/widget";
import type { WidgetPresetId } from "./styles/types";
import { getPresetDefinition, styleRegistry, type PresetDefinition } from "./styles";
import {
  WallLayout,
  CarouselLayout,
  MarqueeLayout,
  SingleQuoteLayout,
  getLayoutDefinition,
  layoutRegistry,
  type LayoutDefinition,
  type LayoutCapabilities,
} from "./layouts";

export type {
  Testimonial,
  ThemeColors,
  WallLayoutType as WallLayout,
  WallTheme,
  WidgetType,
  WidgetRadius,
  WidgetStyle,
  WidgetPresetId,
  PresetDefinition,
  LayoutDefinition,
  LayoutCapabilities,
};
export {
  SAMPLE_TESTIMONIALS,
  RADIUS_PX,
  buildStyle,
  THEME,
  layoutRegistry,
  getLayoutDefinition,
  styleRegistry,
  getPresetDefinition,
};

// Backward-compatible named exports delegating to isolated layout modules
export const WallContent = WallLayout;
export const CarouselContent = CarouselLayout;
export const MarqueeContent = MarqueeLayout;
export const SingleQuoteContent = SingleQuoteLayout;

/**
 * Main Widget Renderer component.
 * Acts as an orchestrator resolving both Layout Engine and Style Preset Engine.
 */
export default function WidgetRenderer({
  type = "wall",
  preset = "base",
  testimonials = [],
  testimonial = null,
  layout = "grid",
  singleLayout = "card",
  theme = "light",
  showRatings = true,
  showBadge = true,
  maxCount = null,
  accent,
  radius = "rounded",
}: {
  type?: WidgetType;
  preset?: WidgetPresetId;
  testimonials?: Testimonial[];
  testimonial?: Testimonial | null;
  layout?: WallLayoutType;
  singleLayout?: "card" | "minimal";
  theme?: WallTheme;
  showRatings?: boolean;
  showBadge?: boolean;
  maxCount?: number | null;
  accent?: string;
  radius?: WidgetRadius;
}) {
  const layoutDef = getLayoutDefinition(type);
  const presetDef = getPresetDefinition(preset);

  if (type === "single") {
    return (
      <SingleQuoteLayout
        testimonial={testimonial}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        layout={singleLayout}
        preset={presetDef.id}
        testimonials={testimonials}
      />
    );
  }

  if (type === "carousel") {
    return (
      <CarouselLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
      />
    );
  }

  if (type === "marquee") {
    return (
      <MarqueeLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
      />
    );
  }

  return (
    <WallLayout
      testimonials={testimonials}
      layout={layout}
      theme={theme}
      showRatings={showRatings}
      showBadge={showBadge}
      maxCount={maxCount}
      accent={accent}
      radius={radius}
      preset={presetDef.id}
    />
  );
}
