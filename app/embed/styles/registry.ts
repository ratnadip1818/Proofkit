import type { WidgetPresetId, PresetDefinition } from "./types";
import { basePreset } from "./base";
import { editorialPreset } from "./editorial";
import { modernPreset } from "./modern";
import { luxuryPreset } from "./luxury";
import { minimalPreset } from "./minimal";

export const styleRegistry: Record<WidgetPresetId, PresetDefinition> = {
  base: {
    id: "base",
    name: "Base",
    description: "Standard clean blovi aesthetic",
    preset: basePreset,
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Magaziny typography and high contrast",
    preset: editorialPreset,
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Sleek tech aesthetic with bold accents",
    preset: modernPreset,
  },
  luxury: {
    id: "luxury",
    name: "Luxury",
    description: "Premium dark tones and refined borders",
    preset: luxuryPreset,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Subtle borders and spacious whitespace",
    preset: minimalPreset,
  },
};

/** Get preset definition by WidgetPresetId from registry */
export function getPresetDefinition(id: WidgetPresetId = "base"): PresetDefinition {
  return styleRegistry[id] || styleRegistry.base;
}
