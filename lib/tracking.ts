import { createAdminClient } from "./supabase/admin";

export interface WidgetAnalytics {
  views_count?: number;
  views_this_month?: number;
  month?: string; // e.g. "2026-10"
  detected_domains?: string[];
  last_view_at?: string;
}

export interface WorkspaceTrackingStats {
  widgetViewsThisMonth: number | null;
  totalWidgetViews: number | null;
  formViews: number | null;
  hasTrackingData: boolean;
  detectedDomains: string[];
  widgetsStatus: Record<
    "wall" | "carousel" | "marquee" | "single",
    {
      name: string;
      domain: string | null;
      views: number;
      installed: boolean;
    }
  >;
}

function cleanReferrerDomain(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer.startsWith("http") ? referrer : `https://${referrer}`);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    // Ignore internal app domains and local development
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".localhost") ||
      host === "blovi.space" ||
      host.endsWith(".blovi.space") ||
      host.includes("vercel.app")
    ) {
      return null;
    }
    return host;
  } catch {
    return null;
  }
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Record a view for an embedded widget on an external site.
 * Privacy-friendly: only counts views and stores external referrer hostname.
 */
export async function logWidgetView(
  userId: string,
  widgetType: "wall" | "carousel" | "marquee" | "single" = "wall",
  referrer?: string | null
): Promise<void> {
  if (!userId) return;
  try {
    const supabase = createAdminClient();
    const currentMonth = getCurrentMonth();
    const domain = cleanReferrerDomain(referrer);

    // Look for existing widget of this type for this user
    const { data: existingWidget } = await supabase
      .from("widgets")
      .select("id, settings")
      .eq("user_id", userId)
      .eq("widget_type", widgetType)
      .maybeSingle();

    if (existingWidget) {
      const currentSettings = (existingWidget.settings as Record<string, any>) || {};
      const currentAnalytics = (currentSettings.analytics as WidgetAnalytics) || {};

      const isSameMonth = currentAnalytics.month === currentMonth;
      const newMonthViews = (isSameMonth ? (currentAnalytics.views_this_month || 0) : 0) + 1;
      const newTotalViews = (currentAnalytics.views_count || 0) + 1;

      const existingDomains = Array.isArray(currentAnalytics.detected_domains)
        ? currentAnalytics.detected_domains
        : [];
      const updatedDomains = domain && !existingDomains.includes(domain)
        ? [...existingDomains, domain]
        : existingDomains;

      const updatedSettings = {
        ...currentSettings,
        analytics: {
          views_count: newTotalViews,
          views_this_month: newMonthViews,
          month: currentMonth,
          detected_domains: updatedDomains,
          last_view_at: new Date().toISOString(),
        },
      };

      await supabase
        .from("widgets")
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingWidget.id);
    } else {
      // Create widget record
      const widgetTitles: Record<string, string> = {
        wall: "Wall of Love",
        carousel: "Carousel",
        marquee: "Marquee",
        single: "Single Quote",
      };

      await supabase.from("widgets").insert({
        user_id: userId,
        widget_type: widgetType,
        name: widgetTitles[widgetType] || "Widget",
        is_published: true,
        settings: {
          analytics: {
            views_count: 1,
            views_this_month: 1,
            month: currentMonth,
            detected_domains: domain ? [domain] : [],
            last_view_at: new Date().toISOString(),
          },
        },
      });
    }
  } catch (err) {
    console.error("Non-fatal tracking error in logWidgetView:", err);
  }
}

/**
 * Record a view when a visitor lands on the public collection page.
 */
export async function logFormView(
  userId: string,
  formId: string,
  referrer?: string | null
): Promise<void> {
  if (!userId || !formId) return;
  try {
    const supabase = createAdminClient();
    const currentMonth = getCurrentMonth();
    const domain = cleanReferrerDomain(referrer);

    const { data: form } = await supabase
      .from("forms")
      .select("id, custom_css")
      .eq("id", formId)
      .maybeSingle();

    if (!form) return;

    let meta: Record<string, any> = {};
    const css = form.custom_css || "";
    const match = css.match(/\/\* __BLOVI_ANALYTICS__=([\s\S]*?) \*\//);
    if (match && match[1]) {
      try {
        meta = JSON.parse(match[1]);
      } catch {}
    }

    const isSameMonth = meta.month === currentMonth;
    const viewsThisMonth = (isSameMonth ? (meta.views_this_month || 0) : 0) + 1;
    const totalViews = (meta.views_count || 0) + 1;

    const existingDomains: string[] = Array.isArray(meta.detected_domains)
      ? meta.detected_domains
      : [];
    const updatedDomains = domain && !existingDomains.includes(domain)
      ? [...existingDomains, domain]
      : existingDomains;

    const newMeta = {
      views_count: totalViews,
      views_this_month: viewsThisMonth,
      month: currentMonth,
      detected_domains: updatedDomains,
      last_view_at: new Date().toISOString(),
    };

    let updatedCss = css;
    const serialized = `/* __BLOVI_ANALYTICS__=${JSON.stringify(newMeta)} */`;
    if (match) {
      updatedCss = css.replace(/\/\* __BLOVI_ANALYTICS__=[\s\S]*? \*\//, serialized);
    } else {
      updatedCss = css ? `${css}\n${serialized}` : serialized;
    }

    await supabase
      .from("forms")
      .update({ custom_css: updatedCss })
      .eq("id", formId);
  } catch (err) {
    console.error("Non-fatal tracking error in logFormView:", err);
  }
}

/**
 * Get tracking statistics for the dashboard.
 * If no tracking data exists, returns null values so the UI displays "—".
 */
export async function getWorkspaceStats(userId: string): Promise<WorkspaceTrackingStats> {
  const supabase = createAdminClient();
  const currentMonth = getCurrentMonth();

  const [{ data: widgets }, { data: forms }] = await Promise.all([
    supabase
      .from("widgets")
      .select("id, widget_type, name, settings")
      .eq("user_id", userId),
    supabase
      .from("forms")
      .select("id, custom_css")
      .eq("user_id", userId),
  ]);

  let totalWidgetViews = 0;
  let widgetViewsThisMonth = 0;
  let hasWidgetTracking = false;
  const allDetectedDomains = new Set<string>();

  const widgetMap: Record<
    "wall" | "carousel" | "marquee" | "single",
    { name: string; domain: string | null; views: number; installed: boolean }
  > = {
    wall: { name: "Wall of Love", domain: null, views: 0, installed: false },
    carousel: { name: "Carousel", domain: null, views: 0, installed: false },
    marquee: { name: "Marquee", domain: null, views: 0, installed: false },
    single: { name: "Single Quote", domain: null, views: 0, installed: false },
  };

  if (widgets && widgets.length > 0) {
    for (const w of widgets) {
      const type = w.widget_type as "wall" | "carousel" | "marquee" | "single";
      const settings = (w.settings as Record<string, any>) || {};
      const analytics = (settings.analytics as WidgetAnalytics) || {};

      if (analytics.views_count && analytics.views_count > 0) {
        hasWidgetTracking = true;
        totalWidgetViews += analytics.views_count;
        if (analytics.month === currentMonth && analytics.views_this_month) {
          widgetViewsThisMonth += analytics.views_this_month;
        }

        const domains = analytics.detected_domains || [];
        domains.forEach((d) => allDetectedDomains.add(d));

        if (widgetMap[type]) {
          widgetMap[type].views = analytics.views_count;
          widgetMap[type].domain = domains[0] || null;
          widgetMap[type].installed = domains.length > 0 || analytics.views_count > 0;
        }
      }
    }
  }

  // Parse form views
  let formViews: number | null = null;
  let hasFormTracking = false;
  if (forms && forms.length > 0) {
    for (const f of forms) {
      const match = (f.custom_css || "").match(/\/\* __BLOVI_ANALYTICS__=([\s\S]*?) \*\//);
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1]);
          if (typeof parsed.views_count === "number" && parsed.views_count > 0) {
            hasFormTracking = true;
            formViews = (formViews || 0) + parsed.views_count;
          }
        } catch {}
      }
    }
  }

  const hasTrackingData = hasWidgetTracking || hasFormTracking;

  return {
    widgetViewsThisMonth: hasWidgetTracking ? widgetViewsThisMonth : null,
    totalWidgetViews: hasWidgetTracking ? totalWidgetViews : null,
    formViews: hasFormTracking ? formViews : null,
    hasTrackingData,
    detectedDomains: Array.from(allDetectedDomains),
    widgetsStatus: widgetMap,
  };
}
