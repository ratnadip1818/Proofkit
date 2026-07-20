import type { WidgetType } from "../types/widget";
import type { ThemeColors } from "../theme/types";

export type WidgetPresetId = "base" | "editorial" | "modern" | "luxury" | "minimal";

/** Pure declarative visual overrides a preset can provide */
export interface PresetVisualOverrides {
  fontFamily?: string;
  colors?: Partial<ThemeColors>;
  shadows?: Partial<{
    cardLight: string;
    cardDark: string;
    modal: string;
  }>;
}

export interface WidgetPreset {
  id: WidgetPresetId;
  name: string;
  description: string;
  previewImage?: string;
  recommendedLayouts?: WidgetType[];

  /** Pure declarative visual overrides */
  overrides?: PresetVisualOverrides;
}

export interface PresetDefinition {
  id: WidgetPresetId;
  name: string;
  description: string;
  preset: WidgetPreset;
}
