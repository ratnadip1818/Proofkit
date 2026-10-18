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
  SpotlightLayout,
  ConversationLayout,
  BentoLayout,
  OrbitLayout,
  StackLayout,
  BadgeLayout,
  AvatarsLayout,
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
export const ConversationContent = ConversationLayout;

export interface WallRendererProps {
  type?: WidgetType;
  layout?: WallLayoutType;
  singleLayout?: "card" | "minimal";
  testimonials?: Testimonial[];
  testimonial?: Testimonial | null;
  theme?: WallTheme;
  showRatings?: boolean;
  showBadge?: boolean;
  maxCount?: number | null;
  featuredIndex?: number;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  backgroundColor?: string;
  textColor?: string;
  ratingColor?: string;
  ratingBorderColor?: string;
  highlightColor?: string;
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
  showDate?: boolean;
  cardLayout?: "top" | "bottom";
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
}

/**
 * Main Widget Renderer component.
 * Acts as an orchestrator resolving both Layout Engine and Style Preset Engine.
 */
export default function WallRenderer({
  type = "wall",
  layout = "grid",
  singleLayout = "card",
  testimonials = SAMPLE_TESTIMONIALS,
  testimonial = null,
  theme = "light",
  showRatings = true,
  showBadge = true,
  maxCount = null,
  featuredIndex = 0,
  accent,
  radius = "rounded",
  preset = "base",
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
  backgroundColor,
  textColor,
  ratingColor,
  ratingBorderColor,
  highlightColor,
  chatCustomerPrompt,
  chatFounderReply,
  showDate = true,
  cardLayout = "top",
  badgeStyle = "large",
  badgeText,
  badgeAlign = "left",
  badgeContainer = "plain",
  badgeUrl,
  ratingBoxBg,
  ratingBoxText,
  maxAvatars = 5,
  avatarSize = "md",
  avatarAlign = "left",
  avatarContainer = "plain",
  avatarText,
  showRatingNumber = false,
  avatarBorderColor,
  avatarUrl,
}: WallRendererProps) {
  const presetDef = getPresetDefinition(preset);

  if (type === "avatars") {
    return (
      <AvatarsLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
        maxAvatars={maxAvatars}
        avatarSize={avatarSize}
        avatarAlign={avatarAlign}
        avatarContainer={avatarContainer}
        avatarText={avatarText}
        showRatingNumber={showRatingNumber}
        avatarBorderColor={avatarBorderColor}
        avatarUrl={avatarUrl}
      />
    );
  }

  if (type === "badge") {
    return (
      <BadgeLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
        badgeStyle={badgeStyle}
        badgeText={badgeText}
        badgeAlign={badgeAlign}
        badgeContainer={badgeContainer}
        badgeUrl={badgeUrl}
        ratingBoxBg={ratingBoxBg}
        ratingBoxText={ratingBoxText}
      />
    );
  }

  if (type === "single") {
    const activeTestimonial = testimonial ?? testimonials[featuredIndex] ?? testimonials[0] ?? null;
    return (
      <SingleQuoteLayout
        testimonial={activeTestimonial}
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        layout={singleLayout}
        preset={presetDef.id}
        showPhotos={showPhotos}
        useGravatar={useGravatar}
        fallbackAvatar={fallbackAvatar}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
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
        showPhotos={showPhotos}
        useGravatar={useGravatar}
        fallbackAvatar={fallbackAvatar}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
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
        showPhotos={showPhotos}
        useGravatar={useGravatar}
        fallbackAvatar={fallbackAvatar}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
      />
    );
  }

  if (type === "spotlight") {
    return (
      <SpotlightLayout
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

  if (type === "conversation") {
    return (
      <ConversationLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
        chatCustomerPrompt={chatCustomerPrompt}
        chatFounderReply={chatFounderReply}
      />
    );
  }

  if (type === "bento") {
    return (
      <BentoLayout
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

  if (type === "orbit") {
    return (
      <OrbitLayout
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

  if (type === "stack") {
    return (
      <StackLayout
        testimonials={testimonials}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        accent={accent}
        radius={radius}
        preset={presetDef.id}
        showPhotos={showPhotos}
        useGravatar={useGravatar}
        fallbackAvatar={fallbackAvatar}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
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
      showPhotos={showPhotos}
      useGravatar={useGravatar}
      fallbackAvatar={fallbackAvatar}
      backgroundColor={backgroundColor}
      textColor={textColor}
      ratingColor={ratingColor}
      ratingBorderColor={ratingBorderColor}
      highlightColor={highlightColor}
      showDate={showDate}
      cardLayout={cardLayout}
    />
  );
}
