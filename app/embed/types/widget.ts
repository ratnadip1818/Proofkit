import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import type { WidgetPresetId } from "../styles/types";

/** Supported widget layout types */
export type WidgetType = "wall" | "carousel" | "marquee" | "single";

/** Border radius variants */
export type WidgetRadius = "sharp" | "rounded" | "pill";

/** Theme mode options */
export type WidgetTheme = "light" | "dark";

/** Sub-layout modes for Wall of Love */
export type WallLayout = "grid";

/** Sub-layout modes for Single Quote */
export type SingleQuoteLayout = "card" | "minimal";

/**
 * Resolved widget style object passed down to layouts and cards.
 */
export interface WidgetStyle {
  colors: ThemeColors;
  radius: number;
}

/**
 * Common base interface for all widget layout components.
 * Every widget layout must accept at least these props.
 */
export interface WidgetLayoutProps {
  testimonials: Testimonial[];
  theme: WidgetTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
}

/** Props for the Wall of Love grid layout */
export interface WallLayoutProps extends WidgetLayoutProps {
  layout?: WallLayout;
  maxCount: number | null;
}

/** Props for the Carousel layout */
export type CarouselLayoutProps = WidgetLayoutProps;

/** Props for the Marquee layout */
export type MarqueeLayoutProps = WidgetLayoutProps;

/** Props for the Single Quote layout */
export interface SingleQuoteLayoutProps extends WidgetLayoutProps {
  testimonial: Testimonial | null;
  layout?: SingleQuoteLayout;
}

/** Overall configuration passed into client wrapper */
export interface WidgetConfig {
  isDemo: boolean;
  requestedType: WidgetType;
  theme: WidgetTheme;
  showRatings: boolean;
  maxCount: number | null;
  featuredIndex: number;
  accent: string | undefined;
  radius: WidgetRadius;
  singleLayout: SingleQuoteLayout;
  showBadge: boolean;
  preset?: WidgetPresetId;
}
