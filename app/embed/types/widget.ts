import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import type { WidgetPresetId } from "../styles/types";

/** Supported widget layout types */
export type WidgetType = "wall" | "carousel" | "marquee" | "single" | "spotlight" | "conversation" | "bento" | "orbit" | "stack" | "badge" | "avatars" | "quotes";

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
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
}

/** Props for the Wall of Love grid layout */
export interface WallLayoutProps extends WidgetLayoutProps {
  layout?: WallLayout;
  maxCount: number | null;
}

/** Props for the Carousel layout */
export type CarouselLayoutProps = WidgetLayoutProps;

/** Props for the Marquee layout */
export interface MarqueeLayoutProps extends WidgetLayoutProps {
  marqueeRows?: 1 | 2;
  marqueeDirection?: "left" | "right" | "opposing";
  marqueeSpeed?: "slow" | "normal" | "fast";
  marqueePauseOnHover?: boolean;
  cardLayout?: "top" | "bottom";
  cardWidth?: number;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
}

/** Props for the Spotlight layout */
export type SpotlightLayoutProps = WidgetLayoutProps;

/** Props for the Conversation layout */
export type ConversationLayoutProps = WidgetLayoutProps;

/** Props for the Single Quote layout */
export interface SingleQuoteLayoutProps extends WidgetLayoutProps {
  testimonial: Testimonial | null;
  layout?: SingleQuoteLayout;
}

/** Props for the Badge layout */
export interface BadgeLayoutProps extends WidgetLayoutProps {
  badgeStyle?: "large" | "inline";
  badgeText?: string;
  badgeAlign?: "left" | "center" | "right";
  badgeContainer?: "plain" | "pill" | "card";
  badgeUrl?: string;
  ratingBoxBg?: string;
  ratingBoxText?: string;
}

/** Props for the Avatars layout */
export interface AvatarsLayoutProps extends WidgetLayoutProps {
  maxAvatars?: number;
  avatarSize?: "sm" | "md" | "lg";
  avatarAlign?: "left" | "center" | "right";
  avatarContainer?: "plain" | "pill" | "card";
  avatarText?: string;
  showRatingNumber?: boolean;
  avatarBorderColor?: string;
  avatarUrl?: string;
}

/** Props for the Hero Quotes layout */
export interface HeroQuotesLayoutProps extends WidgetLayoutProps {
  columns?: 2 | 3;
  quotesStyle?: "editorial" | "card";
  avatarPosition?: "top" | "bottom";
  maxQuotes?: number;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
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
  showPhotos?: boolean;
  fallbackAvatar?: string;
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
  badgeStyle?: "large" | "inline";
  badgeText?: string;
  badgeAlign?: "left" | "center" | "right";
  badgeContainer?: "plain" | "pill" | "card";
  badgeUrl?: string;
  ratingBoxBg?: string;
  ratingBoxText?: string;
  maxAvatars?: number;
  avatarSize?: "sm" | "md" | "lg";
  avatarAlign?: "left" | "center" | "right";
  avatarContainer?: "plain" | "pill" | "card";
  avatarText?: string;
  showRatingNumber?: boolean;
  avatarBorderColor?: string;
  avatarUrl?: string;
  quotesColumns?: 2 | 3;
  quotesStyle?: "editorial" | "card";
  avatarPosition?: "top" | "bottom";
  maxQuotes?: number;
  marqueeRows?: 1 | 2;
  marqueeDirection?: "left" | "right" | "opposing";
  marqueeSpeed?: "slow" | "normal" | "fast";
  marqueePauseOnHover?: boolean;
  marqueeCardWidth?: number;
}
