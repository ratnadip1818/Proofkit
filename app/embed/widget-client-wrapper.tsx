"use client";

import { useEffect, useState } from "react";
import WidgetRenderer from "./wall-renderer";
import type { WidgetType, WidgetRadius } from "./types/widget";
import type { WidgetPresetId } from "./styles/types";
import { styleRegistry } from "./styles";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "./constants";
import { FREE_WIDGET_TESTIMONIAL_LIMIT, FREE_LOCKED_WIDGET_TYPES } from "@/lib/limits";

interface WidgetConfig {
  isDemo: boolean;
  requestedType: WidgetType;
  preset: WidgetPresetId;
  theme: "light" | "dark";
  showRatings: boolean;
  maxCount: number | null;
  featuredIndex: number;
  accent: string | undefined;
  radius: WidgetRadius;
  singleLayout: "card" | "minimal";
  showBadge: boolean;
  showPhotos: boolean;
  useGravatar: boolean;
  fallbackAvatar: string;
  fontFamily: string;
  backgroundColor: string | undefined;
  textColor: string | undefined;
  ratingColor: string | undefined;
  ratingBorderColor: string | undefined;
  highlightColor: string | undefined;
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
  selectMode: "auto" | "manual";
  selectedIds?: string[];
  autoRating: string;
  showDate: boolean;
  cardLayout: "top" | "bottom";
}

export default function WidgetClientWrapper({
  testimonials,
  isLifetime,
  searchParams: rawSearchParams,
  isPreview = false,
}: {
  testimonials: Testimonial[];
  isLifetime: boolean;
  searchParams?: Record<string, string | string[] | undefined>;
  isPreview?: boolean;
}) {
  // Helper to extract param value from passed searchParams or window.location
  const getParam = (key: string): string | undefined => {
    if (rawSearchParams && rawSearchParams[key] !== undefined) {
      const val = rawSearchParams[key];
      return Array.isArray(val) ? val[0] : val;
    }
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      return sp.has(key) ? (sp.get(key) ?? "") : undefined;
    }
    return undefined;
  };

  // Client-side config states initialized to sensible defaults
  const [config, setConfig] = useState<WidgetConfig>(() => {
    const isDemo = getParam("demo") === "1";
    const spType = getParam("type");
    const rawType: WidgetType =
      spType === "carousel" || spType === "marquee" || spType === "single" || spType === "spotlight" || spType === "conversation" || spType === "bento" || spType === "orbit" || spType === "stack"
        ? spType
        : "wall";
    const requestedType: WidgetType =
      !isLifetime && (FREE_LOCKED_WIDGET_TYPES as readonly string[]).includes(rawType)
        ? "wall"
        : rawType;

    const spPreset = getParam("preset") as WidgetPresetId;
    const preset: WidgetPresetId = spPreset && styleRegistry[spPreset] ? spPreset : "base";

    const theme = getParam("theme") === "dark" ? "dark" : "light";
    const showRatings = getParam("ratings") !== "false";

    const spMax = getParam("max");
    const maxCount =
      spMax === "3" || spMax === "6" || spMax === "9" ? Number(spMax) : null;

    const spFeatured = getParam("featured");
    const featuredIndex = spFeatured ? Math.max(0, parseInt(spFeatured, 10) || 0) : 0;

    const accentHex = (getParam("accent") ?? "").replace(/^#/, "");
    const accent = /^[0-9a-fA-F]{6}$/.test(accentHex) ? `#${accentHex}` : undefined;

    const spRadius = getParam("radius");
    const radius: WidgetRadius =
      spRadius === "sharp" || spRadius === "pill" ? spRadius : "rounded";

    const singleLayout = getParam("layout") === "minimal" ? "minimal" : "card";
    const showBadge = !isLifetime || getParam("badge") !== "false";
    const showPhotos = getParam("showPhotos") !== "false";
    const useGravatar = getParam("useGravatar") !== "false";
    const fallbackAvatar = getParam("fallbackAvatar") || "Initials";
    const fontFamily = getParam("font") || getParam("fontFamily") || "Plus Jakarta Sans";
    const backgroundColor = getParam("backgroundColor") || getParam("cardBg") || undefined;
    const textColor = getParam("textColor") || undefined;
    const ratingColor = getParam("ratingColor") || undefined;
    const ratingBorderColor = getParam("ratingBorderColor") || undefined;
    const highlightColor = getParam("highlightColor") || undefined;

    const chatCustomerPrompt = getParam("chatCustomerPrompt") || undefined;
    const chatFounderReply = getParam("chatFounderReply") || undefined;

    const rawSelectMode = getParam("selectMode") || getParam("select_mode");
    const selectMode: "auto" | "manual" = rawSelectMode === "auto" ? "auto" : "manual";
    const rawSelectedIds = getParam("selectedIds") || getParam("selected_ids");
    const selectedIds = rawSelectedIds !== undefined
      ? (rawSelectedIds.trim() === "" ? [] : rawSelectedIds.split(",").map((s) => s.trim()).filter(Boolean))
      : undefined;
    const autoRating = getParam("autoRating") || getParam("auto_rating") || "all";
    const showDate = getParam("showDate") !== "false";
    const cardLayout = getParam("cardLayout") === "bottom" ? "bottom" : "top";

    return {
      isDemo,
      requestedType,
      preset,
      theme,
      showRatings,
      maxCount,
      featuredIndex,
      accent,
      radius,
      singleLayout,
      showBadge,
      showPhotos,
      useGravatar,
      fallbackAvatar,
      fontFamily,
      backgroundColor,
      textColor,
      ratingColor,
      ratingBorderColor,
      highlightColor,
      chatCustomerPrompt,
      chatFounderReply,
      selectMode,
      selectedIds,
      autoRating,
      showDate,
      cardLayout,
    };
  });

  const [prevIsLifetime, setPrevIsLifetime] = useState(isLifetime);
  if (isLifetime !== prevIsLifetime) {
    setPrevIsLifetime(isLifetime);
    setConfig((prev) => ({
      ...prev,
      showBadge: !isLifetime,
    }));
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Parse URL search params on client mount to handle SSR/hydration sync
    const searchParams = new URLSearchParams(window.location.search);
    const spType = searchParams.get("type");
    if (spType) {
      const rawType: WidgetType =
        spType === "carousel" || spType === "marquee" || spType === "single" || spType === "spotlight" || spType === "conversation" || spType === "bento" || spType === "orbit" || spType === "stack"
          ? spType
          : "wall";
      const requestedType: WidgetType =
        !isLifetime && (FREE_LOCKED_WIDGET_TYPES as readonly string[]).includes(rawType)
          ? "wall"
          : rawType;
      
      const spPreset = searchParams.get("preset") as WidgetPresetId;
      const preset: WidgetPresetId = spPreset && styleRegistry[spPreset] ? spPreset : "base";
      const theme = searchParams.get("theme") === "dark" ? "dark" : "light";
      const showRatings = searchParams.get("ratings") !== "false";
      const accentHex = (searchParams.get("accent") ?? "").replace(/^#/, "");
      const accent = /^[0-9a-fA-F]{6}$/.test(accentHex) ? `#${accentHex}` : undefined;
      const showPhotos = searchParams.get("showPhotos") !== "false";
      const useGravatar = searchParams.get("useGravatar") !== "false";
      const fallbackAvatar = searchParams.get("fallbackAvatar") || "Initials";
      const fontFamily = searchParams.get("font") || searchParams.get("fontFamily") || "Plus Jakarta Sans";
      const backgroundColor = searchParams.get("backgroundColor") || searchParams.get("cardBg") || undefined;
      const textColor = searchParams.get("textColor") || undefined;
      const ratingColor = searchParams.get("ratingColor") || undefined;
      const ratingBorderColor = searchParams.get("ratingBorderColor") || undefined;
      const highlightColor = searchParams.get("highlightColor") || undefined;
      const chatCustomerPrompt = searchParams.get("chatCustomerPrompt") || undefined;
      const chatFounderReply = searchParams.get("chatFounderReply") || undefined;

      const rawSelectMode = searchParams.get("selectMode") || searchParams.get("select_mode");
      const selectMode: "auto" | "manual" = rawSelectMode === "auto" ? "auto" : "manual";
      const rawSelectedIds = searchParams.has("selectedIds")
        ? (searchParams.get("selectedIds") ?? "")
        : searchParams.has("selected_ids")
          ? (searchParams.get("selected_ids") ?? "")
          : undefined;
      const selectedIds = rawSelectedIds !== undefined
        ? (rawSelectedIds.trim() === "" ? [] : rawSelectedIds.split(",").map((s) => s.trim()).filter(Boolean))
        : undefined;
      const autoRating = searchParams.get("autoRating") || searchParams.get("auto_rating") || "all";

      setConfig((prev) => ({
        ...prev,
        requestedType,
        preset,
        theme,
        showRatings,
        accent,
        showPhotos,
        useGravatar,
        fallbackAvatar,
        fontFamily,
        backgroundColor,
        textColor,
        ratingColor,
        ratingBorderColor,
        highlightColor,
        chatCustomerPrompt,
        chatFounderReply,
        selectMode,
        selectedIds,
        autoRating,
      }));
    }

    const isPreviewRoute =
      isPreview ||
      (typeof window !== "undefined" &&
        window.location.pathname.startsWith("/embed/preview"));

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "proofkit-config-update") {
        return;
      }

      // a) Reject if not the preview route (ignore entirely on production embed)
      if (!isPreviewRoute) {
        return;
      }

      // c) Reject if source is not window.parent
      if (!event.source || event.source !== window.parent || window.parent === window) {
        return;
      }

      // b) Reject if origin does not match dashboard origin
      let dashboardOrigin = "";
      try {
        if (process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN) {
          dashboardOrigin = new URL(process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN).origin;
        } else if (process.env.NEXT_PUBLIC_SITE_URL) {
          dashboardOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
        } else {
          dashboardOrigin = window.location.origin;
        }
      } catch (e) {
        dashboardOrigin = window.location.origin;
      }

      if (event.origin !== dashboardOrigin) {
        return;
      }

      if (event.data.config && typeof event.data.config === "object") {
        setConfig((prev) => ({
          ...prev,
          ...event.data.config,
        }));
      }
    };

    window.addEventListener("message", handleMessage);

    // Notify parent window that the preview widget wrapper is mounted and ready to receive updates
    window.parent.postMessage({ type: "proofkit-preview-ready" }, "*");
    window.parent.postMessage({ type: "proofkit-ready" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Use config values
  const {
    isDemo,
    requestedType,
    preset,
    theme,
    showRatings,
    maxCount,
    featuredIndex,
    accent,
    radius,
    singleLayout,
    showBadge,
    showPhotos,
    useGravatar,
    fallbackAvatar,
    fontFamily,
    backgroundColor,
    textColor,
    ratingColor,
    ratingBorderColor,
    highlightColor,
    chatCustomerPrompt,
    chatFounderReply,
    selectMode,
    selectedIds,
    autoRating,
  } = config;

  // Use requested layout type (Spotlight, Wall, etc.)
  const type: WidgetType = requestedType;

  // 1. Initial testimonial pool (fall back to SAMPLE_TESTIMONIALS if demo or empty)
  const basePool: Testimonial[] = (isDemo || testimonials.length === 0)
    ? SAMPLE_TESTIMONIALS
    : testimonials;

  // 2. Filter & Order based on selection mode
  let filteredList: Testimonial[] = basePool;

  if (selectMode === "manual" && selectedIds !== undefined) {
    if (selectedIds.length === 0) {
      filteredList = [];
    } else {
      const idMap = new Map<string, Testimonial>();
      basePool.forEach((t) => {
        if (t.id) idMap.set(t.id, t);
      });
      const ordered: Testimonial[] = [];
      for (const id of selectedIds) {
        const item = idMap.get(id);
        if (item) ordered.push(item);
      }
      filteredList = ordered;
    }
  } else if (selectMode === "auto") {
    if (autoRating === "5") {
      filteredList = basePool.filter((t) => (t.rating || 0) === 5);
    } else if (autoRating === "4") {
      filteredList = basePool.filter((t) => (t.rating || 0) >= 4);
    } else if (autoRating === "3") {
      filteredList = basePool.filter((t) => (t.rating || 0) >= 3);
    }
    // "all" keeps all basePool testimonials
  }

  const capped = !isDemo && !isLifetime && filteredList.length > FREE_WIDGET_TESTIMONIAL_LIMIT;
  const list = isLifetime
    ? filteredList
    : filteredList.slice(0, FREE_WIDGET_TESTIMONIAL_LIMIT);

  const layout = "grid";

  return (
    <div
      id="proofkit-widget-wrapper"
      style={{
        width: "100%",
        overflow: "hidden",
        fontFamily: `'${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      }}
    >
      <style>{`
        #proofkit-widget-wrapper, #proofkit-widget-wrapper * {
          font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `}</style>
      <WidgetRenderer
        type={type}
        preset={preset}
        testimonials={list}
        testimonial={list[featuredIndex] ?? list[0] ?? null}
        layout={layout}
        singleLayout={singleLayout}
        theme={theme}
        showRatings={showRatings}
        showBadge={showBadge}
        maxCount={maxCount}
        accent={accent}
        radius={radius}
        showPhotos={showPhotos}
        useGravatar={useGravatar}
        fallbackAvatar={fallbackAvatar}
        backgroundColor={backgroundColor}
        textColor={textColor}
        ratingColor={ratingColor}
        ratingBorderColor={ratingBorderColor}
        highlightColor={highlightColor}
        chatCustomerPrompt={chatCustomerPrompt}
        chatFounderReply={chatFounderReply}
        showDate={config.showDate}
        cardLayout={config.cardLayout}
      />

      {capped && type !== "stack" && type !== "single" && (
        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <a
            href="https://www.blovi.space/pricing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: theme === "dark" ? "#a1a1aa" : "#9ca3af",
              textDecoration: "none",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Showing {FREE_WIDGET_TESTIMONIAL_LIMIT} of {testimonials.length} — upgrade for unlimited
          </a>
        </div>
      )}

      {/* Hidden container for testimonials data to safely pass to the parent page schema builder */}
      <div
        id="proofkit-schema-data"
        style={{ display: "none" }}
        data-testimonials={JSON.stringify(
          list.map((t) => ({
            author_name: t.author_name,
            body: t.display_body ?? t.body_original,
            rating: t.rating,
            created_at: t.created_at,
          }))
        )}
      />

      {/* Post height and schema data to parent */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let lastWidth = window.innerWidth;
            function sendHeight() {
              const el = document.getElementById("proofkit-widget-wrapper");
              const height = el ? el.offsetHeight : document.body.scrollHeight;
              window.parent.postMessage(
                { type: "proofkit-resize", height: height },
                "*"
              );
              window.parent.postMessage(
                { type: "proofkit-ready" },
                "*"
              );
            }
            window.addEventListener("load", () => {
              sendHeight();
              try {
                const dataEl = document.getElementById("proofkit-schema-data");
                if (dataEl) {
                  const testimonials = JSON.parse(dataEl.getAttribute("data-testimonials"));
                  window.parent.postMessage({ type: "proofkit-schema", testimonials }, "*");
                }
              } catch (e) {
                console.error("Failed to send schema testimonials", e);
              }
            });
            window.addEventListener("resize", () => {
              if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                sendHeight();
              }
            });
            if (document.fonts) document.fonts.ready.then(sendHeight);

            // Forward wheel events to the parent window for smooth scrolling
            window.addEventListener("wheel", (e) => {
              window.parent.postMessage(
                {
                  type: "proofkit-wheel",
                  deltaX: e.deltaX,
                  deltaY: e.deltaY,
                  deltaMode: e.deltaMode
                },
                "*"
              );
            }, { passive: true });
          `,
        }}
      />
    </div>
  );
}
