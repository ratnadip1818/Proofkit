import type { ComponentType } from "react";
import type { WidgetType, WidgetLayoutProps } from "../types/widget";
import { WallLayout, type WallLayoutProps } from "./WallLayout";
import { CarouselLayout, type CarouselLayoutProps } from "./CarouselLayout";
import { MarqueeLayout, type MarqueeLayoutProps } from "./MarqueeLayout";
import { SingleQuoteLayout, type SingleQuoteLayoutProps } from "./SingleQuoteLayout";
import { SpotlightLayout, type SpotlightLayoutProps } from "./SpotlightLayout";
import { ConversationLayout, type ConversationLayoutProps } from "./ConversationLayout";
import { BentoLayout } from "./BentoLayout";
import { OrbitLayout } from "./OrbitLayout";

export interface LayoutCapabilities {
  supportsTagFiltering: boolean;
  supportsPagination: boolean;
  supportsAutoplay: boolean;
  supportsMultipleItems: boolean;
}

export interface LayoutDefinition<P extends WidgetLayoutProps = WidgetLayoutProps> {
  id: WidgetType;
  name: string;
  component: ComponentType<P>;
  capabilities: LayoutCapabilities;
}

export const layoutRegistry: Record<WidgetType, LayoutDefinition<any>> = {
  wall: {
    id: "wall",
    name: "Wall of Love",
    component: WallLayout,
    capabilities: {
      supportsTagFiltering: true,
      supportsPagination: true,
      supportsAutoplay: false,
      supportsMultipleItems: true,
    },
  },
  carousel: {
    id: "carousel",
    name: "Carousel Slider",
    component: CarouselLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: false,
      supportsAutoplay: true,
      supportsMultipleItems: true,
    },
  },
  marquee: {
    id: "marquee",
    name: "Infinite Marquee",
    component: MarqueeLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: false,
      supportsAutoplay: true,
      supportsMultipleItems: true,
    },
  },
  single: {
    id: "single",
    name: "Single Quote",
    component: SingleQuoteLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: false,
      supportsAutoplay: false,
      supportsMultipleItems: false,
    },
  },
  spotlight: {
    id: "spotlight",
    name: "Editorial Spotlight",
    component: SpotlightLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: true,
      supportsAutoplay: false,
      supportsMultipleItems: true,
    },
  },
  conversation: {
    id: "conversation",
    name: "Interactive Conversation",
    component: ConversationLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: true,
      supportsAutoplay: true,
      supportsMultipleItems: true,
    },
  },
  bento: {
    id: "bento",
    name: "Bento Social Grid",
    component: BentoLayout,
    capabilities: {
      supportsTagFiltering: true,
      supportsPagination: false,
      supportsAutoplay: false,
      supportsMultipleItems: true,
    },
  },
  orbit: {
    id: "orbit",
    name: "Orbit Social Cosmos",
    component: OrbitLayout,
    capabilities: {
      supportsTagFiltering: false,
      supportsPagination: false,
      supportsAutoplay: true,
      supportsMultipleItems: true,
    },
  },
};

/** Get layout definition by WidgetType from registry */
export function getLayoutDefinition(type: WidgetType): LayoutDefinition {
  return layoutRegistry[type] || layoutRegistry.wall;
}
