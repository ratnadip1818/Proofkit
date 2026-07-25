"use client";

import { useEffect, useState } from "react";
import WidgetRenderer from "./wall-renderer";
import type { WidgetType, WidgetRadius } from "./types/widget";
import type { WidgetPresetId } from "./styles/types";
import { styleRegistry } from "./styles";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "./constants";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "@/lib/limits";

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
  fallbackAvatar: string;
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
}

export default function WidgetClientWrapper({
  testimonials,
  isLifetime,
}: {
  testimonials: Testimonial[];
  isLifetime: boolean;
}) {
  // Client-side config states initialized to sensible defaults
  const [config, setConfig] = useState<WidgetConfig>(() => {
    const defaultState: WidgetConfig = {
      isDemo: false,
      requestedType: "wall" as WidgetType,
      preset: "base" as WidgetPresetId,
      theme: "light" as "light" | "dark",
      showRatings: true,
      maxCount: null as number | null,
      featuredIndex: 0,
      accent: undefined as string | undefined,
      radius: "rounded" as WidgetRadius,
      singleLayout: "card" as "card" | "minimal",
      showBadge: !isLifetime,
      showPhotos: true,
      fallbackAvatar: "Placeholder",
    };

    if (typeof window === "undefined") return defaultState;

    const searchParams = new URLSearchParams(window.location.search);
    const isDemo = searchParams.get("demo") === "1";
    const spType = searchParams.get("type");
    const requestedType: WidgetType =
      spType === "carousel" || spType === "marquee" || spType === "single" || spType === "spotlight" || spType === "conversation" || spType === "bento" || spType === "orbit"
        ? spType
        : "wall";

    const spPreset = searchParams.get("preset") as WidgetPresetId;
    const preset: WidgetPresetId = spPreset && styleRegistry[spPreset] ? spPreset : "base";

    const theme = searchParams.get("theme") === "dark" ? "dark" : "light";
    const showRatings = searchParams.get("ratings") !== "false";

    const spMax = searchParams.get("max");
    const maxCount =
      spMax === "3" || spMax === "6" || spMax === "9" ? Number(spMax) : null;

    const spFeatured = searchParams.get("featured");
    const featuredIndex = spFeatured ? Math.max(0, parseInt(spFeatured, 10) || 0) : 0;

    const accentHex = (searchParams.get("accent") ?? "").replace(/^#/, "");
    const accent = /^[0-9a-fA-F]{6}$/.test(accentHex) ? `#${accentHex}` : undefined;

    const spRadius = searchParams.get("radius");
    const radius: WidgetRadius =
      spRadius === "sharp" || spRadius === "pill" ? spRadius : "rounded";

    const singleLayout = searchParams.get("layout") === "minimal" ? "minimal" : "card";
    const showBadge = !isLifetime || searchParams.get("badge") !== "false";
    const showPhotos = searchParams.get("showPhotos") !== "false";
    const fallbackAvatar = searchParams.get("fallbackAvatar") || "Placeholder";

    const chatCustomerPrompt = searchParams.get("chatCustomerPrompt") || undefined;
    const chatFounderReply = searchParams.get("chatFounderReply") || undefined;

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
      fallbackAvatar,
      chatCustomerPrompt,
      chatFounderReply,
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
      const requestedType: WidgetType =
        spType === "carousel" || spType === "marquee" || spType === "single" || spType === "spotlight" || spType === "conversation" || spType === "bento" || spType === "orbit"
          ? spType
          : "wall";
      
      const spPreset = searchParams.get("preset") as WidgetPresetId;
      const preset: WidgetPresetId = spPreset && styleRegistry[spPreset] ? spPreset : "base";
      const theme = searchParams.get("theme") === "dark" ? "dark" : "light";
      const showRatings = searchParams.get("ratings") !== "false";
      const accentHex = (searchParams.get("accent") ?? "").replace(/^#/, "");
      const accent = /^[0-9a-fA-F]{6}$/.test(accentHex) ? `#${accentHex}` : undefined;
      const chatCustomerPrompt = searchParams.get("chatCustomerPrompt") || undefined;
      const chatFounderReply = searchParams.get("chatFounderReply") || undefined;

      setConfig((prev) => ({
        ...prev,
        requestedType,
        preset,
        theme,
        showRatings,
        accent,
        chatCustomerPrompt,
        chatFounderReply,
      }));
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "proofkit-config-update") {
        setConfig((prev) => ({
          ...prev,
          ...event.data.config,
        }));
      }
    };

    window.addEventListener("message", handleMessage);

    // Notify parent window that the preview widget wrapper is mounted and ready to receive updates
    window.parent.postMessage({ type: "proofkit-preview-ready" }, "*");

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
    fallbackAvatar,
    chatCustomerPrompt,
    chatFounderReply,
  } = config;

  // Use requested layout type (Spotlight, Wall, etc.)
  const type: WidgetType = requestedType;
  const capped = !isDemo && !isLifetime && testimonials.length > FREE_WIDGET_TESTIMONIAL_LIMIT;
  const list = isDemo
    ? SAMPLE_TESTIMONIALS
    : isLifetime
      ? testimonials
      : testimonials.slice(0, FREE_WIDGET_TESTIMONIAL_LIMIT);

  const layout = "grid";

  return (
    <div id="proofkit-widget-wrapper" style={{ width: "100%", overflow: "hidden" }}>
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
        fallbackAvatar={fallbackAvatar}
        chatCustomerPrompt={chatCustomerPrompt}
        chatFounderReply={chatFounderReply}
      />

      {capped && (
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
