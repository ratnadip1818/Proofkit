import { createAdminClient } from "@/lib/supabase/admin";

/** Free-tier limits — Pro ($49/yr) removes all of them. */
// Free accounts can hold 3 testimonials TOTAL (collection + import are
// capped server-side); the widget cap is kept as a second line of defense.
export const FREE_TESTIMONIAL_LIMIT = 3;
export const FREE_WIDGET_TESTIMONIAL_LIMIT = FREE_TESTIMONIAL_LIMIT;
export const FREE_LOCKED_WIDGET_TYPES = ["carousel", "marquee", "single"] as const;

export type PlanTier = "free" | "pro" | "business";

export interface UserLimits {
  planTier: PlanTier;
  /** Approved testimonials this user has (what widgets can show). */
  approvedCount: number;
  /** Max testimonials the widget displays; null = unlimited. */
  widgetLimit: number | null;
  /** Widget types that require a paid plan. */
  lockedWidgetTypes: readonly string[];
}

export async function checkLimits(userId: string): Promise<UserLimits> {
  const supabase = createAdminClient();
  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  
  const [{ data: profileData, error: profileError }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("is_lifetime, plan_tier")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "approved"),
  ]);

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", userId)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  // Grandfathered lifetime users (if any) are treated as Pro
  const planTier: PlanTier =
    profile?.is_lifetime === true
      ? "pro"
      : (profile?.plan_tier as PlanTier) ?? "free";

  const isPaid = planTier === "pro" || planTier === "business";

  return {
    planTier,
    approvedCount: count ?? 0,
    widgetLimit: isPaid ? null : FREE_WIDGET_TESTIMONIAL_LIMIT,
    lockedWidgetTypes: isPaid ? [] : FREE_LOCKED_WIDGET_TYPES,
  };
}
