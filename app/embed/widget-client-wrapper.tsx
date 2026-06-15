"use client";

import { useEffect, useState } from "react";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
  type WidgetType,
  type WidgetRadius,
} from "./wall-renderer";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "./constants";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "@/lib/limits";

export default function WidgetClientWrapper({
  testimonials,
  isLifetime,
}: {
  testimonials: Testimonial[];
  isLifetime: boolean;
}) {
  // Client-side config states initialized to sensible defaults
  const [config, setConfig] = useState<{
    isDemo: boolean;
    requestedType: WidgetType;
    theme: "light" | "dark";
    showRatings: boolean;
    maxCount: number | null;
    featuredIndex: number;
    accent: string | undefined;
    radius: WidgetRadius;
    singleLayout: "card" | "minimal";
    showBadge: boolean;
  }>({
    isDemo: false,
    requestedType: "wall",
    theme: "light",
    showRatings: true,
    maxCount: null,
    featuredIndex: 0,
    accent: undefined,
    radius: "rounded",
    singleLayout: "card",
    showBadge: !isLifetime,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);

    const isDemo = searchParams.get("demo") === "1";
    const spType = searchParams.get("type");
    const requestedType: WidgetType =
      spType === "carousel" || spType === "marquee" || spType === "single"
        ? spType
        : "wall";

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

    setConfig({
      isDemo,
      requestedType,
      theme,
      showRatings,
      maxCount,
      featuredIndex,
      accent,
      radius,
      singleLayout,
      showBadge,
    });
  }, [isLifetime]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    theme,
    showRatings,
    maxCount,
    featuredIndex,
    accent,
    radius,
    singleLayout,
    showBadge,
  } = config;

  // Free tier: Wall of Love only, capped at the most recent approved testimonials
  const type: WidgetType = isLifetime || isDemo ? requestedType : "wall";
  const capped = !isDemo && !isLifetime && testimonials.length > FREE_WIDGET_TESTIMONIAL_LIMIT;
  const list = isDemo
    ? SAMPLE_TESTIMONIALS
    : isLifetime
      ? testimonials
      : testimonials.slice(0, FREE_WIDGET_TESTIMONIAL_LIMIT);

  const layout = "grid";

  return (
    <div id="proofkit-widget-wrapper" style={{ width: "100%", overflow: "hidden" }}>
      {type === "carousel" ? (
        <CarouselContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
        />
      ) : type === "marquee" ? (
        <MarqueeContent
          testimonials={list}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
        />
      ) : type === "single" ? (
        <SingleQuoteContent
          testimonial={list[featuredIndex] ?? list[0] ?? null}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          accent={accent}
          radius={radius}
          layout={singleLayout}
        />
      ) : (
        <WallContent
          testimonials={list}
          layout={layout}
          theme={theme}
          showRatings={showRatings}
          showBadge={showBadge}
          maxCount={maxCount}
          accent={accent}
          radius={radius}
        />
      )}

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
