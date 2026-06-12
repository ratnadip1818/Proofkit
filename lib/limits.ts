import { createAdminClient } from "@/lib/supabase/admin";

/** Free-tier limits — lifetime ($49 once) removes all of them. */
// Free accounts can hold 3 testimonials TOTAL (collection + import are
// capped server-side); the widget cap is kept as a second line of defense.
export const FREE_TESTIMONIAL_LIMIT = 3;
export const FREE_WIDGET_TESTIMONIAL_LIMIT = FREE_TESTIMONIAL_LIMIT;
export const FREE_LOCKED_WIDGET_TYPES = ["carousel", "marquee", "single"] as const;

export interface UserLimits {
  isLifetime: boolean;
  /** Approved testimonials this user has (what widgets can show). */
  approvedCount: number;
  /** Max testimonials the widget displays; null = unlimited. */
  widgetLimit: number | null;
  /** Widget types that require lifetime. */
  lockedWidgetTypes: readonly string[];
}

export async function checkLimits(userId: string): Promise<UserLimits> {
  const supabase = createAdminClient();
  const [{ data: profile }, { count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "approved"),
  ]);

  const isLifetime = profile?.is_lifetime ?? false;
  return {
    isLifetime,
    approvedCount: count ?? 0,
    widgetLimit: isLifetime ? null : FREE_WIDGET_TESTIMONIAL_LIMIT,
    lockedWidgetTypes: isLifetime ? [] : FREE_LOCKED_WIDGET_TYPES,
  };
}
