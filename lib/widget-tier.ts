import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_WIDGET_TESTIMONIAL_LIMIT, FREE_LOCKED_WIDGET_TYPES } from "@/lib/limits";

export interface WidgetOwnerPlan {
  is_lifetime?: boolean | null;
  plan_tier?: string | null;
}

export interface WidgetTierConfig {
  showBadge?: boolean;
  type?: string;
  preset?: string;
  max?: number | null;
  maxCount?: number | null;
  [key: string]: any;
}

export interface ApplyTierLimitsParams<T = any> {
  plan?: WidgetOwnerPlan | null;
  testimonials: T[];
  config?: WidgetTierConfig;
}

export interface ApplyTierLimitsResult<T = any> {
  testimonials: T[];
  config: WidgetTierConfig;
  isPaid: boolean;
}

/**
 * Checks whether the widget owner plan qualifies for paid/unlimited features.
 * Grandfathered lifetime users and pro/business plan tiers are treated as paid.
 */
export function isPlanPaid(plan?: WidgetOwnerPlan | null): boolean {
  if (!plan) return false;
  if (plan.is_lifetime === true) return true;
  const tier = (plan.plan_tier || "").toLowerCase();
  return tier === "pro" || tier === "business";
}

/**
 * Server-side source of truth for tier limits.
 * Enforces testimonial count caps and badge visibility rules.
 *
 * Paid accounts:
 * - Testimonials are unlimited (returned unchanged).
 * - "Powered by Blovi" badge can be toggled by config.
 *
 * Free accounts:
 * - Testimonials are strictly capped to FREE_WIDGET_TESTIMONIAL_LIMIT (10).
 * - "Powered by Blovi" badge is forced to true.
 * - Any query params or client config attempting to raise the cap or unlock
 *   paid layouts/presets are ignored/clamped.
 */
export function applyTierLimits<T = any>({
  plan,
  testimonials,
  config = {},
}: ApplyTierLimitsParams<T>): ApplyTierLimitsResult<T> {
  const isPaid = isPlanPaid(plan);
  const safeConfig: WidgetTierConfig = { ...config };

  if (isPaid) {
    return {
      testimonials,
      config: safeConfig,
      isPaid: true,
    };
  }

  // Free Tier enforcement
  const safeTestimonials = testimonials.slice(0, FREE_WIDGET_TESTIMONIAL_LIMIT);

  // Badge must be visible on free plan
  safeConfig.showBadge = true;

  // Clamp any attempted client-side max/maxCount overrides
  if (typeof safeConfig.max === "number" && safeConfig.max > FREE_WIDGET_TESTIMONIAL_LIMIT) {
    safeConfig.max = FREE_WIDGET_TESTIMONIAL_LIMIT;
  }
  if (typeof safeConfig.maxCount === "number" && safeConfig.maxCount > FREE_WIDGET_TESTIMONIAL_LIMIT) {
    safeConfig.maxCount = FREE_WIDGET_TESTIMONIAL_LIMIT;
  }

  // Revert any locked layout types or presets
  if (
    safeConfig.type &&
    (FREE_LOCKED_WIDGET_TYPES as readonly string[]).includes(safeConfig.type)
  ) {
    safeConfig.type = "wall";
  }

  return {
    testimonials: safeTestimonials,
    config: safeConfig,
    isPaid: false,
  };
}

/**
 * Fetches the owner's plan for a widgetId using the Supabase admin client.
 * Handles schema backwards-compatibility if plan_tier column is missing.
 */
export async function getWidgetOwnerPlan(widgetId: string): Promise<WidgetOwnerPlan> {
  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier")
    .eq("id", widgetId)
    .maybeSingle();

  if (error && (error.message?.includes("plan_tier") || error.code === "42703")) {
    const { data: fallback } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", widgetId)
      .maybeSingle();
    return {
      is_lifetime: fallback?.is_lifetime ?? false,
      plan_tier: fallback?.is_lifetime ? "pro" : "free",
    };
  }

  return {
    is_lifetime: profile?.is_lifetime ?? false,
    plan_tier: profile?.plan_tier ?? (profile?.is_lifetime ? "pro" : "free"),
  };
}
