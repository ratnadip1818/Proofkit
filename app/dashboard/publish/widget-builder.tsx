"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Pencil,
  Share2,
  Code2,
  Palette,
  MousePointerClick,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  X,
  ExternalLink,
  Link as LinkIcon,
  ImageIcon,
  Star,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  Heart,
  RefreshCw,
  Sparkles,
  HelpCircle,
  MoveRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { saveWidgetConfig } from "../actions";
import type { WidgetType } from "@/app/embed/types/widget";
import { SAMPLE_TESTIMONIALS } from "@/app/embed/constants";

export interface TestimonialItem {
  id?: string;
  author_name: string;
  author_role?: string | null;
  author_company?: string | null;
  body_original?: string | null;
  display_body?: string | null;
  rating?: number | null;
  avatar_url?: string | null;
  tags?: string[] | null;
  source?: string | null;
}

function Switch({
  checked,
  onChange,
  size = "default",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "default";
}) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex items-center shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/25 ${
        checked ? "bg-[#2563EB]" : "bg-[#E5E7EB]"
      } ${isSm ? "h-4 w-7" : "h-5 w-9"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
          isSm ? "h-3 w-3" : "h-4 w-4"
        }`}
        style={{
          transform: checked
            ? `translateX(${isSm ? "12px" : "16px"})`
            : "translateX(0px)",
        }}
      />
    </button>
  );
}

const WIDGET_TITLES: Record<WidgetType, string> = {
  wall: "Wall of Love",
  orbit: "Orbit Social Cosmos",
  stack: "Card Spotlight",
  carousel: "Carousel",
  marquee: "Marquee",
  single: "Single Quote",
  spotlight: "Spotlight",
  conversation: "Conversation",
  bento: "Bento Grid",
};

export default function WidgetBuilder({
  userId,
  isLifetime,
  email,
  testimonials = [],
  initialLayout = "wall",
  widgetName,
  widgetPlacement,
  onBack,
}: {
  userId: string;
  isLifetime: boolean;
  email?: string;
  testimonials: TestimonialItem[];
  initialLayout?: WidgetType;
  widgetName?: string;
  widgetPlacement?: string;
  onBack?: () => void;
}) {
  // Widget layout is strictly the one selected in Step 1
  const layout = initialLayout;

  // Viewport mode & refresh state for canvas preview
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  // Widget Name with inline editing
  const [title, setTitle] = useState(
    widgetName || WIDGET_TITLES[layout] || "Wall of Love"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Blovi Brand Defaults & Customization Settings (from Images 3, 4, 5)
  const preset = "base";
  const theme = "light";
  const [fontFamily, setFontFamily] = useState("Plus Jakarta Sans");
  const [autoScrollVertical, setAutoScrollVertical] = useState(false);
  const [showPhotos, setShowPhotos] = useState(true);
  const [useGravatar, setUseGravatar] = useState(true);
  const [fallbackAvatar, setFallbackAvatar] = useState("Placeholder");
  const [useHighlights, setUseHighlights] = useState(true);
  const [showHighlights, setShowHighlights] = useState(true);

  // Colors Customization (Images 4 & 5)
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [ratingColor, setRatingColor] = useState("#F59E0B");
  const [ratingBorderColor, setRatingBorderColor] = useState("#2563EB");
  const [textColor, setTextColor] = useState("#1A1A1A");
  const [highlightColor, setHighlightColor] = useState("#FFCD3640");
  const [showBranding, setShowBranding] = useState(true);
  const [stackEmbedMode, setStackEmbedMode] = useState<"floating" | "inline">("floating");

  // Effective testimonials pool: real testimonials if present, otherwise SAMPLE_TESTIMONIALS for live studio testing
  const effectiveTestimonials: TestimonialItem[] = useMemo(() => {
    if (testimonials && testimonials.length > 0) return testimonials;
    return SAMPLE_TESTIMONIALS.map((s) => ({
      id: s.id,
      author_name: s.author_name,
      author_role: s.author_role,
      author_company: null,
      body_original: s.body_original,
      display_body: s.display_body,
      rating: s.rating,
      avatar_url: s.avatar_url ?? null,
      tags: s.tags ?? [],
      source: "form",
    }));
  }, [testimonials]);

  // Selection Modal States
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectModeType, setSelectModeType] = useState<"auto" | "manual">("manual");
  const [autoRatingFilter, setAutoRatingFilter] = useState<string>("all");
  const [manualSelectedIds, setManualSelectedIds] = useState<string[]>(() =>
    (testimonials && testimonials.length > 0 ? testimonials : SAMPLE_TESTIMONIALS)
      .map((t) => t.id)
      .filter(Boolean) as string[]
  );

  // Filters within Manual Selection view
  const [selectSearch, setSelectSearch] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterAvatar, setFilterAvatar] = useState<string>("all");

  // Reorder Testimonials State
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [colorsExpanded, setColorsExpanded] = useState(true);
  const [orderedTestimonialIds, setOrderedTestimonialIds] = useState<string[]>(() =>
    (testimonials && testimonials.length > 0 ? testimonials : SAMPLE_TESTIMONIALS)
      .map((t) => t.id)
      .filter(Boolean) as string[]
  );

  // Auto ratings counts
  const allApprovedCount = effectiveTestimonials.length;
  const fiveStarCount = useMemo(
    () => effectiveTestimonials.filter((t) => (t.rating || 0) === 5).length,
    [effectiveTestimonials]
  );
  const fourPlusCount = useMemo(
    () => effectiveTestimonials.filter((t) => (t.rating || 0) >= 4).length,
    [effectiveTestimonials]
  );
  const matchingAutoCount = useMemo(() => {
    if (autoRatingFilter === "5") return fiveStarCount;
    if (autoRatingFilter === "4") return fourPlusCount;
    return allApprovedCount;
  }, [autoRatingFilter, fiveStarCount, fourPlusCount, allApprovedCount]);

  const moveTestimonialUp = (index: number) => {
    if (index <= 0) return;
    setOrderedTestimonialIds((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const moveTestimonialDown = (index: number) => {
    if (index >= orderedTestimonialIds.length - 1) return;
    setOrderedTestimonialIds((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const sortByHighestRating = () => {
    const sorted = [...effectiveTestimonials]
      .filter((t) => t.id && orderedTestimonialIds.includes(t.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map((t) => t.id as string);
    setOrderedTestimonialIds(sorted);
  };

  const reverseOrder = () => {
    setOrderedTestimonialIds((prev) => [...prev].reverse());
  };

  // Auto-save sync status
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Step 4 Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState<"embed" | "link" | "export">("embed");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFramer, setCopiedFramer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-sync configuration changes with debounce (guarded against demo-widget)
  useEffect(() => {
    if (!userId || userId === "demo-widget") {
      setIsSaved(true);
      setIsSaving(false);
      return;
    }
    setIsSaving(true);
    setIsSaved(false);
    const timer = setTimeout(async () => {
      try {
        await saveWidgetConfig({
          preset,
          theme,
          primary_color: primaryColor,
          text_color: textColor,
          rating_color: ratingColor,
          rating_border_color: ratingBorderColor,
          highlight_color: highlightColor,
          show_photos: showPhotos,
          use_gravatar: useGravatar,
          fallback_avatar: fallbackAvatar,
          font_family: fontFamily,
          show_branding: showBranding,
          select_mode: selectModeType,
          selected_testimonial_ids: manualSelectedIds,
          auto_rating_filter: autoRatingFilter,
        });
        setIsSaved(true);
      } catch (err) {
        console.error("Failed to save widget config:", err);
      } finally {
        setIsSaving(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    userId,
    primaryColor,
    textColor,
    ratingColor,
    ratingBorderColor,
    highlightColor,
    showPhotos,
    useGravatar,
    fallbackAvatar,
    fontFamily,
    showBranding,
    selectModeType,
    manualSelectedIds,
    autoRatingFilter,
  ]);

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

  // Filtered testimonials for manual selection modal (Image 2)
  const filteredTestimonialsForModal = useMemo(() => {
    return effectiveTestimonials.filter((t) => {
      // 1. Search Query
      if (selectSearch.trim()) {
        const q = selectSearch.toLowerCase().trim();
        const nameMatch = t.author_name.toLowerCase().includes(q);
        const roleMatch = (t.author_role || "").toLowerCase().includes(q);
        const compMatch = (t.author_company || "").toLowerCase().includes(q);
        const bodyMatch = (t.body_original || "").toLowerCase().includes(q);
        const dispMatch = (t.display_body || "").toLowerCase().includes(q);
        if (!nameMatch && !roleMatch && !compMatch && !bodyMatch && !dispMatch) return false;
      }
      // 2. Rating Filter
      if (filterRating !== "all") {
        const r = parseInt(filterRating, 10);
        if (t.rating !== r) return false;
      }
      // 3. Source Filter
      if (filterSource !== "all") {
        if ((t.source || "form").toLowerCase() !== filterSource.toLowerCase()) return false;
      }
      // 4. Avatar Filter
      if (filterAvatar === "with_photo" && (!t.avatar_url || t.avatar_url.trim() === "")) return false;
      if (filterAvatar === "no_photo" && t.avatar_url && t.avatar_url.trim() !== "") return false;

      return true;
    });
  }, [effectiveTestimonials, selectSearch, filterRating, filterSource, filterAvatar]);

  const activeOrderList = orderedTestimonialIds.filter((id) =>
    selectModeType === "manual" ? manualSelectedIds.includes(id) : true
  );
  const selectedIdsParamValue = selectModeType === "manual" ? activeOrderList.join(",") : "";
  const testimonialsKey = `${selectModeType}-${selectedIdsParamValue}-${autoRatingFilter}`;

  // Live dynamic preview URL
  const rawPreviewUrl = `/embed/preview?user=${userId || "demo-widget"}&type=${layout}&preset=${preset}&theme=${theme}&accent=${encodeURIComponent(
    primaryColor
  )}&backgroundColor=${encodeURIComponent(
    backgroundColor
  )}&textColor=${encodeURIComponent(
    textColor
  )}&ratingColor=${encodeURIComponent(
    ratingColor
  )}&ratingBorderColor=${encodeURIComponent(
    ratingBorderColor
  )}&highlightColor=${encodeURIComponent(
    highlightColor
  )}&font=${encodeURIComponent(
    fontFamily
  )}&showPhotos=${showPhotos}&useGravatar=${useGravatar}&fallbackAvatar=${encodeURIComponent(
    fallbackAvatar
  )}&showBranding=${showBranding}&selectMode=${selectModeType}&selectedIds=${encodeURIComponent(
    selectedIdsParamValue
  )}&autoRating=${encodeURIComponent(
    autoRatingFilter
  )}&max=9&desktop=1&v=${testimonialsKey}&r=${refreshKey}`;

  const publicShareUrl = `${appUrl}/embed/${userId || "demo-widget"}?type=${layout}`;

  const getEstimatedHeight = (layoutType: string, count: number): number => {
    switch (layoutType) {
      case "stack":
        return 190;
      case "orbit":
        return 540;
      case "wall":
      default:
        return count <= 3 ? 360 : 580;
    }
  };

  const getEmbedCode = () => {
    const widgetId = userId || "demo-widget";
    const estimatedHeight = getEstimatedHeight(layout, effectiveTestimonials.length);

    if (layout === "stack") {
      if (stackEmbedMode === "inline") {
        return `<!-- Blovi Spotlight: Inline Card -->
<div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; max-width: 460px; min-height: 190px;"></div>
<script 
  src="${appUrl}/widget.js" 
  data-user="${widgetId}"
  data-type="stack"
  data-preset="${preset}"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-background-color="${backgroundColor}"
  data-text-color="${textColor}"
  data-rating-color="${ratingColor}"
  data-rating-border-color="${ratingBorderColor}"
  data-highlight-color="${highlightColor}"
  data-font="${fontFamily}"
  data-show-photos="${showPhotos}"
  data-use-gravatar="${useGravatar}"
  data-fallback-avatar="${fallbackAvatar}"
  data-show-branding="${showBranding}"
  data-select-mode="${selectModeType}"
  ${selectModeType === "manual" ? `data-selected-ids="${selectedIdsParamValue}"` : `data-auto-rating="${autoRatingFilter}"`}
  async
></script>`;
      }

      return `<!-- Blovi Spotlight: Floating Corner Widget (Pinned to bottom-left) -->
<div style="position: fixed; bottom: 24px; left: 24px; z-index: 9999; max-width: 400px; width: 100%;">
  <div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; min-height: 190px;"></div>
  <script 
    src="${appUrl}/widget.js" 
    data-user="${widgetId}"
    data-type="stack"
    data-preset="${preset}"
    data-theme="${theme}"
    data-accent="${primaryColor}"
    data-background-color="${backgroundColor}"
    data-text-color="${textColor}"
    data-rating-color="${ratingColor}"
    data-rating-border-color="${ratingBorderColor}"
    data-highlight-color="${highlightColor}"
    data-font="${fontFamily}"
    data-show-photos="${showPhotos}"
    data-use-gravatar="${useGravatar}"
    data-fallback-avatar="${fallbackAvatar}"
    data-show-branding="${showBranding}"
    data-select-mode="${selectModeType}"
    ${selectModeType === "manual" ? `data-selected-ids="${selectedIdsParamValue}"` : `data-auto-rating="${autoRatingFilter}"`}
    async
  ></script>
</div>`;
    }

    return `<!-- Blovi Widget: ${layout.toUpperCase()} -->
<div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; min-height: ${estimatedHeight}px; contain: layout style paint; position: relative;"></div>
<script 
  src="${appUrl}/widget.js" 
  data-user="${widgetId}"
  data-type="${layout}"
  data-preset="${preset}"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-background-color="${backgroundColor}"
  data-text-color="${textColor}"
  data-rating-color="${ratingColor}"
  data-rating-border-color="${ratingBorderColor}"
  data-highlight-color="${highlightColor}"
  data-font="${fontFamily}"
  data-show-photos="${showPhotos}"
  data-use-gravatar="${useGravatar}"
  data-fallback-avatar="${fallbackAvatar}"
  data-show-branding="${showBranding}"
  data-select-mode="${selectModeType}"
  ${selectModeType === "manual" ? `data-selected-ids="${selectedIdsParamValue}"` : `data-auto-rating="${autoRatingFilter}"`}
  async
></script>`;
  };

  const getFramerCode = () => {
    return `${appUrl}/m/BloviWidget-${layout}.js`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyFramer = () => {
    navigator.clipboard.writeText(getFramerCode());
    setCopiedFramer(true);
    setTimeout(() => setCopiedFramer(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleManualTestimonial = (id?: string) => {
    if (!id) return;
    setManualSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const ids = filteredTestimonialsForModal.map((t) => t.id).filter(Boolean) as string[];
    setManualSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const deselectAllFiltered = () => {
    const idsToRemove = new Set(filteredTestimonialsForModal.map((t) => t.id));
    setManualSelectedIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  const colorFields = [
    { label: "Primary Color", value: primaryColor, onChange: setPrimaryColor },
    { label: "Background Color", value: backgroundColor, onChange: setBackgroundColor },
    { label: "Rating Color", value: ratingColor, onChange: setRatingColor },
    { label: "Rating Border Color", value: ratingBorderColor, onChange: setRatingBorderColor },
    { label: "Text Color", value: textColor, onChange: setTextColor },
    { label: "Highlight Color", value: highlightColor, onChange: setHighlightColor },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F6F3] font-sans text-[#1A1A1A] overflow-hidden select-none">
      {/* ======================================================================= */}
      {/* 1. TOP HEADER: Clean Blovi Identity                                     */}
      {/* ======================================================================= */}
      <header className="h-14 bg-white border-b border-[#E3E0DB] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Left Side: Back to Templates + Widget Title */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition-colors font-medium cursor-pointer py-1 px-2 rounded-lg hover:bg-[#F7F6F3]"
              title="Return to Templates Hub"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Templates</span>
            </button>
          )}

          <div className="h-4 w-px bg-[#E3E0DB]" />

          {/* Editable Widget Name */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingTitle(false);
                }}
                autoFocus
                className="text-xs font-semibold text-[#1A1A1A] bg-[#F7F6F3] px-2.5 py-1 rounded-lg border border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] w-48"
              />
              <button
                type="button"
                onClick={() => setIsEditingTitle(false)}
                className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A1A1A] hover:text-[#2563EB] group transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#F7F6F3]"
              title="Click to rename widget"
            >
              <span className="truncate max-w-[200px] sm:max-w-[280px]">{title}</span>
              <Pencil size={11} className="text-[#787774] group-hover:text-[#2563EB] transition-colors" />
            </button>
          )}

          {/* Widget Layout Badge */}
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EFECE8] text-[#787774]">
            {WIDGET_TITLES[layout]}
          </span>
        </div>

        {/* Right Side: Auto-save status + Brand Blue Share Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#787774]">
            {isSaving ? (
              <>
                <Loader2 size={12} className="animate-spin text-[#2563EB]" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Check size={13} className="text-emerald-600 stroke-[2.5]" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 size={13} className="stroke-[2.5]" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* 2. MAIN STUDIO WORKSPACE                                               */}
      {/* ======================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DESIGN DRAWER (Directly on the left, matching Senja) */}
        <aside className="w-[360px] bg-white border-r border-[#E3E0DB] flex flex-col h-full shrink-0 z-10 overflow-y-auto">
          {/* Drawer Header */}
          <div className="h-12 px-4 border-b border-[#E3E0DB] flex items-center shrink-0 bg-white sticky top-0 z-10">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Design</h2>
          </div>

          <div className="p-4 space-y-4">
            {/* TESTIMONIALS (Clean Select & Reorder under Design, matching Senja) */}
            <section className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Testimonials
              </span>
              <button
                type="button"
                onClick={() => setIsSelectModalOpen(true)}
                className="w-full h-10 px-3.5 bg-white border border-[#E3E0DB] rounded-lg hover:border-zinc-300 hover:bg-[#FAF9F7] transition-all flex items-center justify-between shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <MousePointerClick size={15} className="text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#1A1A1A]">
                    Select Testimonials
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                  {selectModeType === "auto"
                    ? `Auto (${matchingAutoCount})`
                    : `${manualSelectedIds.length} selected`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsReorderModalOpen(true)}
                className="w-full h-10 px-3.5 bg-white border border-[#E3E0DB] rounded-lg hover:border-zinc-300 hover:bg-[#FAF9F7] transition-all flex items-center justify-between shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <GripVertical size={15} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                  <span className="text-xs font-medium text-zinc-800">
                    Reorder testimonials
                  </span>
                </div>
                <ArrowRight size={13} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              </button>
            </section>

            <div className="h-px bg-[#E3E0DB]/60" />
            {/* If Spotlight: Show corner vs inline switch */}
            {layout === "stack" && (
              <>
                <section className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Layout
                  </span>
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-xs font-medium text-zinc-700 block">
                      Spotlight Placement
                    </span>
                    <div className="p-1 bg-[#F7F6F3] rounded-lg grid grid-cols-2 gap-1 border border-[#E3E0DB]">
                      <button
                        type="button"
                        onClick={() => setStackEmbedMode("floating")}
                        className={`py-1.5 px-3 text-xs rounded-md transition-all text-center cursor-pointer font-medium ${
                          stackEmbedMode === "floating"
                            ? "bg-white text-[#1A1A1A] shadow-xs font-semibold border border-[#E3E0DB]"
                            : "text-zinc-500 hover:text-[#1A1A1A]"
                        }`}
                      >
                        Floating corner
                      </button>
                      <button
                        type="button"
                        onClick={() => setStackEmbedMode("inline")}
                        className={`py-1.5 px-3 text-xs rounded-md transition-all text-center cursor-pointer font-medium ${
                          stackEmbedMode === "inline"
                            ? "bg-white text-[#1A1A1A] shadow-xs font-semibold border border-[#E3E0DB]"
                            : "text-zinc-500 hover:text-[#1A1A1A]"
                        }`}
                      >
                        Inline card
                      </button>
                    </div>
                  </div>
                </section>
                <div className="h-px bg-[#E3E0DB]/60" />
              </>
            )}

            {/* 1. CUSTOMER PHOTOS SECTION */}
            <section className="space-y-3">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Customer Photos
              </span>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Switch checked={showPhotos} onChange={setShowPhotos} />
                <span className="text-xs font-medium text-zinc-700">
                  Show Customer Photos
                </span>
              </label>

              {showPhotos && (
                <div className="space-y-3 pt-0.5">
                  <span className="text-[11px] text-zinc-500 block">
                    If customer doesn&apos;t have a photo:
                  </span>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <Switch checked={useGravatar} onChange={setUseGravatar} />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-zinc-700">
                        Use Gravatar if available
                      </span>
                      <HelpCircle size={13} className="text-zinc-400 shrink-0" />
                    </div>
                  </label>

                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-medium text-zinc-700">
                        Fallback Avatar
                      </label>
                      <HelpCircle size={13} className="text-zinc-400 shrink-0" />
                    </div>
                    <div className="relative">
                      <select
                        value={fallbackAvatar}
                        onChange={(e) => setFallbackAvatar(e.target.value)}
                        className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E3E0DB] text-xs font-medium text-zinc-800 bg-white hover:border-zinc-300 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/25 cursor-pointer appearance-none shadow-2xs"
                      >
                        <option value="Placeholder">Placeholder</option>
                        <option value="Initials">Initials</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="h-px bg-[#E3E0DB]/60" />

            {/* 2. COLORS SECTION */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Colors
                </span>
                <button
                  type="button"
                  onClick={() => setColorsExpanded(!colorsExpanded)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                  aria-label="Toggle colors"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${colorsExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {colorsExpanded && (
                <div className="space-y-3 pt-0.5">
                  {colorFields.map(({ label, value, onChange }) => {
                    const swatchColor =
                      /^#[0-9A-Fa-f]{6}$/.test(value)
                        ? value
                        : /^#[0-9A-Fa-f]{8}$/.test(value)
                        ? value.slice(0, 7)
                        : "#2563EB";

                    return (
                      <div key={label} className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700 block">
                          {label}
                        </label>
                        <div className="h-10 px-3 bg-white border border-[#E3E0DB] rounded-lg hover:border-zinc-300 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]/25 transition-all flex items-center gap-3 shadow-2xs">
                          {/* Color circle swatch */}
                          <label className="relative w-5 h-5 rounded-full ring-1 ring-black/10 shrink-0 cursor-pointer overflow-hidden block">
                            <span
                              className="absolute inset-0 rounded-full"
                              style={{ backgroundColor: swatchColor }}
                            />
                            <input
                              type="color"
                              value={swatchColor}
                              onChange={(e) => {
                                const newColor =
                                  value.length === 9 && value.startsWith("#")
                                    ? e.target.value + value.slice(7)
                                    : e.target.value;
                                onChange(newColor);
                              }}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                          </label>
                          {/* Clean text input */}
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 h-full bg-transparent text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none uppercase font-normal tracking-wide"
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="h-px bg-[#E3E0DB]/60" />

            {/* 3. TYPOGRAPHY SECTION */}
            <section className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Typography
              </span>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 block">Font</label>
                <div className="relative">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-[#E3E0DB] text-xs font-medium text-zinc-800 bg-white hover:border-zinc-300 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/25 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Instrument Serif">Instrument Serif</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-[#E3E0DB]/60" />

            {/* 4. REMOVE BLOVI BRANDING */}
            <section className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Remove Blovi Branding
              </span>

              <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                <Switch checked={showBranding} onChange={setShowBranding} />
                <span className="text-xs font-medium text-zinc-700">
                  Show Blovi Powered By
                </span>
              </label>
            </section>
          </div>
        </aside>

        {/* PANE C: CENTER CANVAS PREVIEW AREA */}
        <main
          className="flex-1 flex flex-col h-full overflow-hidden relative"
          style={{
            backgroundColor: "#F7F6F3",
            backgroundImage: "radial-gradient(#E3E0DB 1.2px, transparent 1.2px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Top Canvas Toolbar */}
          <div className="h-12 px-6 flex items-center justify-between shrink-0 z-10">
            {/* Viewport switchers */}
            <div className="flex items-center gap-1 bg-white border border-[#E3E0DB] p-1 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === "desktop"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#787774] hover:text-[#1A1A1A]"
                }`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("tablet")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === "tablet"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#787774] hover:text-[#1A1A1A]"
                }`}
                title="Tablet View"
              >
                <Tablet size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewportMode === "mobile"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#787774] hover:text-[#1A1A1A]"
                }`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>

            {/* Refresh Live Preview */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                className="p-1.5 bg-white border border-[#E3E0DB] text-[#787774] hover:text-[#1A1A1A] rounded-xl shadow-2xs transition-all cursor-pointer"
                title="Refresh preview render"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Centered Stage */}
          <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-hidden flex items-center justify-center">
            <div
              className={`h-full bg-white rounded-2xl border border-[#E3E0DB] shadow-md overflow-hidden flex flex-col transition-all duration-300 relative ${
                viewportMode === "desktop"
                  ? "w-full max-w-5xl"
                  : viewportMode === "tablet"
                  ? "w-[768px]"
                  : "w-[390px]"
              }`}
            >
              {/* Browser Chrome Header */}
              <div className="h-9 bg-[#FAF9F7] border-b border-[#E3E0DB] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="bg-white border border-[#E3E0DB] rounded-md px-3 py-0.5 text-[11px] text-[#787774] font-mono flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[#AFAFAC]">https://</span>your-website.com
                </div>
                <div className="w-12" />
              </div>

              {/* Dynamic Live Widget Preview */}
              {layout === "stack" ? (
                <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col justify-between p-6 md:p-8 bg-[#FAF9F7]">
                  {/* Simulated Content in Background */}
                  <div className="max-w-md space-y-4 pt-4 select-none pointer-events-none opacity-30">
                    <div className="h-2.5 w-24 bg-[#2563EB]/40 rounded-full" />
                    <div className="h-7 w-72 bg-[#1A1A1A]/20 rounded-lg" />
                    <div className="h-3.5 w-80 bg-[#787774]/25 rounded-md" />
                    <div className="flex gap-2.5 pt-2">
                      <div className="h-8 w-24 bg-[#2563EB]/40 rounded-lg" />
                      <div className="h-8 w-24 bg-[#E3E0DB] rounded-lg" />
                    </div>
                  </div>

                  {/* Spotlight Card Preview */}
                  <div
                    className={`${
                      stackEmbedMode === "inline"
                        ? "mx-auto w-[440px] max-w-full my-auto"
                        : "w-[400px] max-w-full"
                    }`}
                  >
                    <iframe
                      key={`preview-stack-${rawPreviewUrl}`}
                      src={rawPreviewUrl}
                      className="w-full border-none block bg-transparent"
                      style={{ height: "180px" }}
                      title="Live Render Output"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full h-full overflow-hidden bg-white">
                  <iframe
                    key={`preview-full-${rawPreviewUrl}`}
                    src={rawPreviewUrl}
                    className="w-full h-full border-none"
                    title="Live Render Output"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ======================================================================= */}
      {/* 3. TESTIMONIAL SELECTION MODAL (Lightweight, Clean, Blovi Brand UI)     */}
      {/* ======================================================================= */}
      {isSelectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl border border-[#E3E0DB] shadow-2xl w-full max-w-3xl h-[80vh] max-h-[720px] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Top Header Bar: Clean & Uncluttered */}
            <div className="h-14 px-5 border-b border-[#E3E0DB] flex items-center justify-between shrink-0 bg-white">
              {/* Left: Mode Switcher */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#1A1A1A] hidden sm:inline">Mode:</span>
                <div className="flex items-center p-0.5 bg-[#F7F6F3] rounded-xl border border-[#E3E0DB]">
                  <button
                    type="button"
                    onClick={() => setSelectModeType("auto")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectModeType === "auto"
                        ? "bg-white text-[#2563EB] shadow-xs"
                        : "text-[#787774] hover:text-[#1A1A1A]"
                    }`}
                  >
                    <RefreshCw size={12} className={selectModeType === "auto" ? "text-[#2563EB]" : "text-[#787774]"} />
                    <span>Auto-add</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectModeType("manual")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectModeType === "manual"
                        ? "bg-white text-[#2563EB] shadow-xs"
                        : "text-[#787774] hover:text-[#1A1A1A]"
                    }`}
                  >
                    <MousePointerClick size={12} className={selectModeType === "manual" ? "text-[#2563EB]" : "text-[#787774]"} />
                    <span>Manual selection</span>
                  </button>
                </div>
              </div>

              {/* Right: Close button */}
              <button
                type="button"
                onClick={() => setIsSelectModalOpen(false)}
                className="p-1.5 rounded-lg text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            {selectModeType === "auto" ? (
              /* TAB 1: AUTO-ADD CONFIGURATION - Compact, Clean, No Heaviness */
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-center items-center bg-white">
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-bold text-[#1A1A1A]">
                      Automatic Selection Rule
                    </h4>
                    <p className="text-xs text-[#787774]">
                      New approved testimonials matching this rating will automatically display in this widget.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {[
                      {
                        id: "all",
                        title: "All approved testimonials",
                        subtitle: "Include every approved review",
                        count: allApprovedCount,
                      },
                      {
                        id: "5",
                        title: "5-star testimonials only",
                        subtitle: "Showcase only top-tier 5-star reviews",
                        count: fiveStarCount,
                        stars: "★★★★★",
                      },
                      {
                        id: "4",
                        title: "4 stars and above",
                        subtitle: "Include 4 and 5 star positive reviews",
                        count: fourPlusCount,
                        stars: "★★★★☆+",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAutoRatingFilter(opt.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          autoRatingFilter === opt.id
                            ? "border-[#2563EB] bg-blue-50/20 ring-1 ring-[#2563EB]"
                            : "border-[#E3E0DB] hover:bg-[#FAF9F7] bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              autoRatingFilter === opt.id
                                ? "border-[#2563EB] bg-[#2563EB]"
                                : "border-[#D1D5DB] bg-white"
                            }`}
                          >
                            {autoRatingFilter === opt.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1A1A1A]">{opt.title}</span>
                              {opt.stars && (
                                <span className="text-[11px] text-amber-500 font-semibold">{opt.stars}</span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#787774]">{opt.subtitle}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F7F6F3] text-[#787774] border border-[#E3E0DB]">
                          {opt.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#787774] pt-1">
                    <Sparkles size={13} className="text-[#2563EB]" />
                    <span>
                      Live syncing active • <strong>{matchingAutoCount}</strong> {matchingAutoCount === 1 ? "review" : "reviews"} matching
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSelectModalOpen(false)}
                      className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Apply & Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: MANUAL SELECTION - Clean, Single-Column List Styled Like Manage Reviews */
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Horizontal Filter Toolbar */}
                <div className="p-3 sm:px-5 border-b border-[#E3E0DB] bg-[#FAF9F7] flex flex-wrap items-center gap-2 shrink-0 text-xs">
                  {/* Natural Search Input */}
                  <div className="relative flex-1 min-w-[180px]">
                    <Search size={13} className="text-[#787774] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={selectSearch}
                      onChange={(e) => setSelectSearch(e.target.value)}
                      placeholder="Search testimonials by name or keyword..."
                      className="w-full pl-8.5 pr-7 py-1.5 text-xs bg-white border border-[#E3E0DB] rounded-xl outline-none focus:border-[#2563EB] transition-colors text-[#1A1A1A] placeholder-[#787774]"
                    />
                    {selectSearch && (
                      <button
                        type="button"
                        onClick={() => setSelectSearch("")}
                        className="absolute right-2.5 top-2 text-[#787774] hover:text-[#1A1A1A] cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Star Rating Filter Pills */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[
                      { key: "all", label: "All" },
                      { key: "5", label: "5★" },
                      { key: "4", label: "4★" },
                      { key: "3", label: "3★" },
                    ].map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setFilterRating(r.key)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                          filterRating === r.key
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "border-[#E3E0DB] bg-white text-[#1A1A1A] hover:bg-[#F7F6F3]"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  {/* Platform Source Dropdown */}
                  <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-[#E3E0DB] text-xs bg-white text-[#1A1A1A] outline-none focus:border-[#2563EB] cursor-pointer shrink-0"
                  >
                    <option value="all">All Sources</option>
                    <option value="form">Form</option>
                    <option value="manual">Manual</option>
                    <option value="csv">CSV</option>
                  </select>

                  {/* Reorder Button */}
                  <button
                    type="button"
                    onClick={() => setIsReorderModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl border border-[#E3E0DB] bg-white hover:bg-[#F7F6F3] text-xs font-medium text-[#1A1A1A] flex items-center gap-1 cursor-pointer shrink-0"
                    title="Reorder testimonials"
                  >
                    <GripVertical size={13} className="text-[#787774]" />
                    <span>Reorder</span>
                  </button>

                  {/* Select All / Clear Toggle */}
                  <div className="flex items-center gap-2 pl-1 shrink-0">
                    <button
                      type="button"
                      onClick={selectAllFiltered}
                      className="text-xs text-[#2563EB] font-medium hover:underline cursor-pointer"
                    >
                      Select all
                    </button>
                    <span className="text-[#E3E0DB]">|</span>
                    <button
                      type="button"
                      onClick={deselectAllFiltered}
                      className="text-xs text-[#787774] hover:text-[#1A1A1A] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Testimonial Rows List (Single clean list matching /dashboard/manage) */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#E3E0DB]/60 bg-white">
                  {filteredTestimonialsForModal.length === 0 ? (
                    <div className="text-center py-20 space-y-2">
                      <p className="text-xs text-[#787774]">No testimonials match the selected filters.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectSearch("");
                          setFilterRating("all");
                          setFilterSource("all");
                          setFilterAvatar("all");
                        }}
                        className="text-xs text-[#2563EB] font-medium hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredTestimonialsForModal.map((t, idx) => {
                      const isSelected = t.id ? manualSelectedIds.includes(t.id) : false;
                      const initials = (t.author_name || "A")
                        .trim()
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={t.id || idx}
                          onClick={() => toggleManualTestimonial(t.id)}
                          className={`py-3.5 px-4 sm:px-6 transition-colors cursor-pointer group flex items-center justify-between gap-4 ${
                            isSelected ? "bg-blue-50/20" : "hover:bg-[#FAF9F7]"
                          }`}
                        >
                          {/* 1. Author Identity */}
                          <div className="w-44 sm:w-52 shrink-0 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100 bg-blue-50 text-[#2563EB]">
                              {t.avatar_url ? (
                                <img src={t.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-[#1A1A1A] block truncate">
                                {t.author_name || "Anonymous"}
                              </span>
                              <span className="text-[11px] text-[#787774] block truncate">
                                {t.author_role || (t.author_company ? t.author_company : "Customer")}
                              </span>
                            </div>
                          </div>

                          {/* 2. Middle: Testimonial Story & Rating Stars */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-xs text-[#374151] line-clamp-2 leading-relaxed">
                              {t.display_body || t.body_original || "No content."}
                            </p>
                            <div className="flex items-center gap-2">
                              {t.rating && (
                                <div className="flex items-center text-amber-500 text-[11px]">
                                  {"★".repeat(t.rating)}
                                </div>
                              )}
                              {t.source && (
                                <span className="text-[10px] text-[#787774] capitalize">
                                  • {t.source}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 3. Right: Custom Checkbox */}
                          <div className="shrink-0 pl-2">
                            <div
                              className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2563EB] border-[#2563EB] text-white shadow-2xs"
                                  : "border-[#D1D5DB] bg-white group-hover:border-zinc-400"
                              }`}
                            >
                              {isSelected && <Check size={11} className="stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-5 py-3 border-t border-[#E3E0DB] bg-white flex items-center justify-between shrink-0">
                  <span className="text-xs text-[#787774]">
                    <strong className="text-[#1A1A1A]">{manualSelectedIds.length}</strong> of {effectiveTestimonials.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSelectModalOpen(false)}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* REORDER TESTIMONIALS MODAL (Image 1)                                   */}
      {/* ======================================================================= */}
      {isReorderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl border border-[#E3E0DB] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E3E0DB] flex items-center justify-between shrink-0 bg-white">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#1A1A1A]">Reorder testimonials</h3>
                <p className="text-xs text-[#787774]">
                  Change the order testimonials appear inside this widget.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="p-1.5 rounded-lg text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Sort Bar */}
            <div className="px-4 py-2.5 bg-[#FAF9F7] border-b border-[#E3E0DB] flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">
                Quick actions
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={sortByHighestRating}
                  className="px-2.5 py-1 bg-white border border-[#E3E0DB] rounded-md text-[11px] font-medium text-zinc-700 hover:border-zinc-300 transition-colors cursor-pointer"
                >
                  Highest rating first
                </button>
                <button
                  type="button"
                  onClick={reverseOrder}
                  className="px-2.5 py-1 bg-white border border-[#E3E0DB] rounded-md text-[11px] font-medium text-zinc-700 hover:border-zinc-300 transition-colors cursor-pointer"
                >
                  Reverse order
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-white">
              {orderedTestimonialIds.map((id, index) => {
                const t = testimonials.find((item) => item.id === id);
                if (!t) return null;
                return (
                  <div
                    key={id}
                    className="p-3 bg-white border border-[#E3E0DB] rounded-lg flex items-center justify-between gap-3 shadow-2xs hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GripVertical size={16} className="text-zinc-400 shrink-0 cursor-grab" />
                      <span className="text-xs font-semibold text-zinc-400 w-5 shrink-0">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1A1A] truncate">
                            {t.author_name}
                          </span>
                          {t.rating && (
                            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                              <Star size={10} className="fill-amber-500 text-amber-500" />
                              {t.rating}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#787774] truncate max-w-xs">
                          {t.display_body || t.body_original}
                        </p>
                      </div>
                    </div>

                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveTestimonialUp(index)}
                        className="p-1.5 rounded-md border border-[#E3E0DB] text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={index === orderedTestimonialIds.length - 1}
                        onClick={() => moveTestimonialDown(index)}
                        className="p-1.5 rounded-md border border-[#E3E0DB] text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E3E0DB] flex items-center justify-end gap-2.5 bg-white">
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. STEP 4: "SHARE YOUR WIDGET" MODAL                                    */}
      {/* ======================================================================= */}
      {isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-2xl border border-[#E3E0DB] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E3E0DB] flex items-center justify-between shrink-0 bg-white">
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                  Share your widget
                </h2>
                <p className="text-xs text-[#787774]">
                  Embed this {WIDGET_TITLES[layout]} on your website in seconds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content: Dual Pane */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              {/* Left Sub-Nav Rail */}
              <div className="w-full sm:w-52 bg-[#F7F6F3] border-b sm:border-b-0 sm:border-r border-[#E3E0DB] p-3 space-y-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setShareTab("embed")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl font-medium transition-all text-left cursor-pointer ${
                    shareTab === "embed"
                      ? "bg-white text-[#1A1A1A] shadow-xs font-semibold border border-[#E3E0DB]"
                      : "text-[#787774] hover:text-[#1A1A1A]"
                  }`}
                >
                  <Code2 size={15} className={shareTab === "embed" ? "text-[#2563EB]" : ""} />
                  <span>Embed code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShareTab("link")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl font-medium transition-all text-left cursor-pointer ${
                    shareTab === "link"
                      ? "bg-white text-[#1A1A1A] shadow-xs font-semibold border border-[#E3E0DB]"
                      : "text-[#787774] hover:text-[#1A1A1A]"
                  }`}
                >
                  <LinkIcon size={15} className={shareTab === "link" ? "text-[#2563EB]" : ""} />
                  <span>Direct link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShareTab("export")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl font-medium transition-all text-left cursor-pointer ${
                    shareTab === "export"
                      ? "bg-white text-[#1A1A1A] shadow-xs font-semibold border border-[#E3E0DB]"
                      : "text-[#787774] hover:text-[#1A1A1A]"
                  }`}
                >
                  <ImageIcon size={15} className={shareTab === "export" ? "text-[#2563EB]" : ""} />
                  <span>Export as image</span>
                </button>
              </div>

              {/* Right Panel Body */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-white">
                {shareTab === "embed" && (
                  <>
                    {/* Primary Snippet */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                            Embed code
                          </h3>
                          <p className="text-xs text-[#787774]">
                            Paste this code snippet where you want to display the widget.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedCode ? (
                            <>
                              <Check size={12} className="stroke-[3]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-[#E3E0DB] bg-[#1A1A1A] text-zinc-200 shadow-2xs">
                        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-zinc-800 bg-zinc-900/60">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            HTML / SCRIPT
                          </span>
                        </div>
                        <pre className="p-3 text-[11px] font-mono overflow-x-auto max-h-40 scrollbar-thin select-all">
                          {getEmbedCode()}
                        </pre>
                      </div>
                    </div>

                    {/* Framer Component Snippet */}
                    <div className="space-y-2 pt-2 border-t border-[#E3E0DB]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#1A1A1A]">Using Framer?</h4>
                          <p className="text-[11px] text-[#787774]">
                            Paste this component URL on any page in Framer.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyFramer}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
                        >
                          {copiedFramer ? "Copied!" : "Copy Framer URL"}
                        </button>
                      </div>
                      <div className="bg-[#FAF9F7] border border-[#E3E0DB] rounded-lg p-2.5 flex items-center justify-between">
                        <code className="text-xs font-mono text-[#1A1A1A] truncate max-w-[420px]">
                          {getFramerCode()}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyFramer}
                          className="text-[#787774] hover:text-[#1A1A1A] p-1 cursor-pointer"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Website Builder Guides */}
                    <div className="space-y-2.5 pt-2 border-t border-[#E3E0DB]">
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Instructions</h4>
                      <p className="text-[11px] text-[#787774]">
                        Click to view instructions for different website builders:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { name: "WordPress", desc: "Custom HTML block" },
                          { name: "Webflow", desc: "Embed element" },
                          { name: "Wix", desc: "Embed HTML code" },
                          { name: "Shopify", desc: "Theme custom liquid" },
                          { name: "Carrd", desc: "Embed widget" },
                          { name: "Notion", desc: "Embed URL block" },
                        ].map((platform) => (
                          <div
                            key={platform.name}
                            className="p-2.5 rounded-xl border border-[#E3E0DB] bg-[#FAF9F7] hover:bg-white hover:border-[#2563EB]/40 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-semibold text-[#1A1A1A]">
                                {platform.name}
                              </div>
                              <div className="text-[10px] text-[#787774]">
                                {platform.desc}
                              </div>
                            </div>
                            <ExternalLink size={12} className="text-[#787774] group-hover:text-[#2563EB]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {shareTab === "link" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Direct public link
                      </h3>
                      <p className="text-xs text-[#787774]">
                        Share this live link directly with teammates or clients.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F7] border border-[#E3E0DB] rounded-xl p-3 flex items-center justify-between gap-3">
                      <input
                        type="text"
                        readOnly
                        value={publicShareUrl}
                        className="bg-transparent text-xs font-mono text-[#1A1A1A] w-full focus:outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedLink ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {shareTab === "export" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                        Export as image
                      </h3>
                      <p className="text-xs text-[#787774]">
                        Download a 2x retina screenshot of your current widget.
                      </p>
                    </div>

                    <div className="border border-[#E3E0DB] rounded-xl p-4 bg-[#FAF9F7] flex flex-col items-center gap-3 text-center">
                      <div className="w-48 h-28 rounded-lg overflow-hidden border border-[#E3E0DB] relative bg-white">
                        <Image
                          src={
                            layout === "wall"
                              ? "/widgets/wall-of-love.png"
                              : layout === "orbit"
                              ? "/widgets/orbit-cosmos.png"
                              : "/widgets/card-spotlight.png"
                          }
                          alt="Widget snapshot"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <a
                        href={
                          layout === "wall"
                            ? "/widgets/wall-of-love.png"
                            : layout === "orbit"
                            ? "/widgets/orbit-cosmos.png"
                            : "/widgets/card-spotlight.png"
                        }
                        download={`blovi-${layout}-widget.png`}
                        className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                      >
                        <ImageIcon size={13} />
                        <span>Download PNG</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
