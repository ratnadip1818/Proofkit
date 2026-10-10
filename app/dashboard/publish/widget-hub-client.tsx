"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Code2,
  Layers,
  Compass,
  Quote,
  X,
  ChevronDown,
  ArrowRight,
  Plus,
  MoreVertical,
  Pencil,
  Share2,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  Sparkles,
  ArrowLeft,
  Check,
  Loader2,
  LayoutGrid,
  Edit3,
} from "lucide-react";
import WidgetBuilder, { type TestimonialItem } from "./widget-builder";
import type { WidgetType } from "@/app/embed/types/widget";
import {
  createSavedWidget,
  updateSavedWidget,
  deleteSavedWidget,
  duplicateSavedWidget,
  type SavedWidgetRecord,
} from "../actions";

interface WidgetHubClientProps {
  userId: string;
  isLifetime: boolean;
  email?: string;
  fullName?: string | null;
  testimonials: TestimonialItem[];
  savedWidgets?: SavedWidgetRecord[];
  initialTab?: string;
  initialWidgetId?: string | null;
}

type FilterCategory = "all" | "wall" | "orbit" | "stack";

interface TemplateCardDef {
  id: WidgetType;
  category: "wall" | "orbit" | "stack";
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  previewImage: string;
}

const TEMPLATES: TemplateCardDef[] = [
  {
    id: "wall",
    category: "wall",
    title: "Wall of Love",
    icon: Layers,
    previewImage: "/widgets/wall-of-love.png",
  },
  {
    id: "orbit",
    category: "orbit",
    title: "Orbit Social Cosmos",
    icon: Compass,
    previewImage: "/widgets/orbit-cosmos.png",
  },
  {
    id: "stack",
    category: "stack",
    title: "Card Spotlight",
    icon: Quote,
    previewImage: "/widgets/card-spotlight.png",
  },
];

const PLACEMENT_OPTIONS = [
  "Home Page",
  "Pricing Page",
  "Product Page",
  "Landing Page",
  "Checkout Page",
  "Booking Page",
  "Blog Post",
  "Request Demo Page",
  "Alternative/Versus Page",
  "Sign Up Page",
  "All pages",
  "Other",
];

const LAYOUT_LABELS: Record<string, string> = {
  wall: "Wall of Love",
  orbit: "Orbit Social Cosmos",
  carousel: "Orbit Social Cosmos",
  stack: "Card Spotlight",
  spotlight: "Card Spotlight",
};

function normalizeLayout(widget: SavedWidgetRecord): WidgetType {
  const settingsLayout = widget.settings?.layout;
  if (settingsLayout === "wall" || settingsLayout === "orbit" || settingsLayout === "stack") {
    return settingsLayout;
  }
  if (widget.widget_type === "spotlight" || widget.widget_type === "single") return "stack";
  if (widget.widget_type === "carousel" || widget.widget_type === "marquee") return "orbit";
  return "wall";
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "Edited recently";
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "Edited just now";
    if (diffMin < 60) return `Edited ${diffMin}m ago`;
    if (diffHours < 24) return `Edited ${diffHours}h ago`;
    if (diffDays === 1) return "Edited yesterday";
    if (diffDays < 30) return `Edited ${diffDays}d ago`;
    return `Edited ${new Date(dateString).toLocaleDateString()}`;
  } catch {
    return "Edited recently";
  }
}

export default function WidgetHubClient({
  userId,
  isLifetime,
  email,
  testimonials = [],
  savedWidgets = [],
  initialTab = "saved",
  initialWidgetId = null,
}: WidgetHubClientProps) {
  // Saved Widgets List State
  const [widgets, setWidgets] = useState<SavedWidgetRecord[]>(savedWidgets);

  // Current View: "saved" | "create" | "builder"
  const [currentView, setCurrentView] = useState<"saved" | "create" | "builder">(() => {
    if (initialWidgetId) return "builder";
    if (initialTab === "create") return "create";
    if (savedWidgets.length > 0) return "saved";
    return "create";
  });

  // Active builder item states
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(initialWidgetId);
  const [activeLayout, setActiveLayout] = useState<WidgetType>("wall");
  const [activeWidgetName, setActiveWidgetName] = useState("");
  const [activePlacement, setActivePlacement] = useState("Home Page");
  const [activeSavedSettings, setActiveSavedSettings] = useState<Record<string, any> | undefined>(undefined);

  // Template filter pills state in "create" view
  const [templateFilter, setTemplateFilter] = useState<FilterCategory>("all");

  // Saved Widgets filter dropdown state
  const [savedFilter, setSavedFilter] = useState<"all" | "wall" | "orbit" | "stack">("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Card ⋮ action menu state
  const [cardMenuOpenId, setCardMenuOpenId] = useState<string | null>(null);

  // Creation Modal States (Step 2 from template)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<TemplateCardDef | null>(null);
  const [widgetNameInput, setWidgetNameInput] = useState("");
  const [widgetPlacementInput, setWidgetPlacementInput] = useState("Home Page");
  const [isCreatingWidget, setIsCreatingWidget] = useState(false);

  // Rename Modal State
  const [renameWidget, setRenameWidget] = useState<SavedWidgetRecord | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Delete Confirm Modal State
  const [deleteConfirmWidget, setDeleteConfirmWidget] = useState<SavedWidgetRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Share Modal State (from Saved Card)
  const [shareModalWidget, setShareModalWidget] = useState<SavedWidgetRecord | null>(null);
  const [shareTab, setShareTab] = useState<"embed" | "link">("embed");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close menus on outside click / escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
      setCardMenuOpenId(null);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFilterDropdownOpen(false);
        setCardMenuOpenId(null);
        setIsCreateModalOpen(false);
        setRenameWidget(null);
        setDeleteConfirmWidget(null);
        setShareModalWidget(null);
      }
    }

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filtered Templates
  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (templateFilter === "all") return true;
    return tpl.category === templateFilter;
  });

  // Filtered Saved Widgets
  const filteredSavedWidgets = useMemo(() => {
    return widgets.filter((w) => {
      if (savedFilter === "all") return true;
      const normalized = normalizeLayout(w);
      return normalized === savedFilter;
    });
  }, [widgets, savedFilter]);

  // Open existing widget in builder
  const handleOpenWidgetInBuilder = (widget: SavedWidgetRecord) => {
    const normLayout = normalizeLayout(widget);
    setActiveWidgetId(widget.id);
    setActiveLayout(normLayout);
    setActiveWidgetName(widget.name);
    setActivePlacement(widget.settings?.placement || "Home Page");
    setActiveSavedSettings(widget.settings || {});
    setCurrentView("builder");
  };

  // Click template -> open intent/name modal
  const handleTemplateClick = (tpl: TemplateCardDef) => {
    setSelectedTemplateForModal(tpl);
    setWidgetNameInput("");
    setWidgetPlacementInput("Home Page");
    setIsCreateModalOpen(true);
  };

  // Create new widget in DB & enter Studio
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateForModal || isCreatingWidget) return;

    setIsCreatingWidget(true);
    const finalName = widgetNameInput.trim() || selectedTemplateForModal.title;
    const chosenLayout = selectedTemplateForModal.id;

    try {
      const res = await createSavedWidget({
        name: finalName,
        layout: chosenLayout as "wall" | "orbit" | "stack",
        placement: widgetPlacementInput,
      });

      if (res.error || !res.widget) {
        console.error("Failed to create widget:", res.error);
        alert("Failed to create widget: " + (res.error || "Unknown error"));
        return;
      }

      // Add to local state
      setWidgets((prev) => [res.widget!, ...prev]);
      setActiveWidgetId(res.widget.id);
      setActiveLayout(chosenLayout);
      setActiveWidgetName(finalName);
      setActivePlacement(widgetPlacementInput);
      setActiveSavedSettings(res.widget.settings || {});
      setIsCreateModalOpen(false);
      setCurrentView("builder");
    } catch (err) {
      console.error("Error creating widget:", err);
    } finally {
      setIsCreatingWidget(false);
    }
  };

  // Duplicate saved widget
  const handleDuplicate = async (e: React.MouseEvent, widget: SavedWidgetRecord) => {
    e.stopPropagation();
    setCardMenuOpenId(null);
    try {
      const res = await duplicateSavedWidget(widget.id);
      if (res.widget) {
        setWidgets((prev) => [res.widget!, ...prev]);
      }
    } catch (err) {
      console.error("Failed to duplicate widget:", err);
    }
  };

  // Prompt rename
  const handleStartRename = (e: React.MouseEvent, widget: SavedWidgetRecord) => {
    e.stopPropagation();
    setCardMenuOpenId(null);
    setRenameWidget(widget);
    setRenameInput(widget.name);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameWidget || isRenaming) return;
    const newName = renameInput.trim();
    if (!newName) return;

    setIsRenaming(true);
    try {
      const res = await updateSavedWidget(renameWidget.id, { name: newName });
      if (res.widget) {
        setWidgets((prev) =>
          prev.map((w) => (w.id === renameWidget.id ? { ...w, name: newName } : w))
        );
      }
      setRenameWidget(null);
    } catch (err) {
      console.error("Failed to rename widget:", err);
    } finally {
      setIsRenaming(false);
    }
  };

  // Confirm delete
  const handleStartDelete = (e: React.MouseEvent, widget: SavedWidgetRecord) => {
    e.stopPropagation();
    setCardMenuOpenId(null);
    setDeleteConfirmWidget(widget);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmWidget || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteSavedWidget(deleteConfirmWidget.id);
      setWidgets((prev) => prev.filter((w) => w.id !== deleteConfirmWidget.id));
      setDeleteConfirmWidget(null);
    } catch (err) {
      console.error("Failed to delete widget:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Share modal open
  const handleOpenShare = (e: React.MouseEvent, widget: SavedWidgetRecord) => {
    e.stopPropagation();
    setCardMenuOpenId(null);
    setShareModalWidget(widget);
    setShareTab("embed");
    setCopiedCode(false);
    setCopiedLink(false);
  };

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

  const getEmbedCodeForWidget = (w: SavedWidgetRecord) => {
    const layout = normalizeLayout(w);
    return `<script src="${appUrl}/widget.js" data-user="${userId}" data-type="${layout}" async></script>\n<div id="blovi-widget" data-widget-id="${userId}"></div>`;
  };

  const getShareLinkForWidget = (w: SavedWidgetRecord) => {
    const layout = normalizeLayout(w);
    return `${appUrl}/embed/preview?user=${userId}&type=${layout}`;
  };

  // Return to Saved from builder
  const handleBackToSaved = () => {
    setCurrentView("saved");
  };

  // =========================================================================
  // VIEW: BUILDER
  // =========================================================================
  if (currentView === "builder") {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col bg-[#F7F6F3]">
        <WidgetBuilder
          userId={userId}
          isLifetime={isLifetime}
          email={email}
          testimonials={testimonials}
          initialLayout={activeLayout}
          widgetName={activeWidgetName}
          widgetPlacement={activePlacement}
          widgetId={activeWidgetId || undefined}
          savedSettings={activeSavedSettings}
          onBack={handleBackToSaved}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW: CREATE (Template Picker)
  // =========================================================================
  if (currentView === "create") {
    return (
      <div className="min-h-screen bg-[#F7F6F3] font-sans text-[#1A1A1A] pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
          {/* Header with Back to Saved Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {widgets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentView("saved")}
                    className="inline-flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] font-semibold py-1 px-2.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer mr-1"
                  >
                    <ArrowLeft size={13} />
                    <span>All Widgets</span>
                  </button>
                )}
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  Create a widget
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#787774] font-normal">
                Embed testimonials on your website without code.
              </p>
            </div>

            {widgets.length > 0 && (
              <button
                type="button"
                onClick={() => setCurrentView("saved")}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3E0DB] bg-white text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                <LayoutGrid size={13} className="text-[#2563EB]" />
                <span>My Widgets ({widgets.length})</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setTemplateFilter("all")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                templateFilter === "all"
                  ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                  : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              }`}
            >
              <Code2 size={12} className={templateFilter === "all" ? "text-[#2563EB]" : "text-[#AFAFAC]"} />
              <span>All</span>
            </button>

            <button
              type="button"
              onClick={() => setTemplateFilter("wall")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                templateFilter === "wall"
                  ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                  : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              }`}
            >
              Dedicated page
            </button>

            <button
              type="button"
              onClick={() => setTemplateFilter("orbit")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                templateFilter === "orbit"
                  ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                  : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              }`}
            >
              Great for hero
            </button>

            <button
              type="button"
              onClick={() => setTemplateFilter("stack")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                templateFilter === "stack"
                  ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                  : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              }`}
            >
              Great next to CTA
            </button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredTemplates.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateClick(tpl)}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E3E0DB] hover:border-[#2563EB]/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <div className="h-64 bg-[#F7F6F3] flex items-center justify-center p-4 border-b border-[#E3E0DB] overflow-hidden relative">
                    <img
                      src={tpl.previewImage}
                      alt={tpl.title}
                      className="w-full h-full object-contain select-none group-hover:scale-[1.03] transition-transform duration-200"
                      loading="eager"
                    />
                  </div>
                  <div className="px-4.5 py-3.5 flex items-center justify-between bg-white">
                    <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#2563EB] transition-colors">
                      {tpl.title}
                    </span>
                    <Icon size={14} className="text-[#AFAFAC] group-hover:text-[#2563EB] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CREATE MODAL */}
        {isCreateModalOpen && selectedTemplateForModal && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1A1A1A]">
                    Create a widget
                  </h3>
                  <p className="text-xs text-[#787774] mt-0.5">
                    Name this widget so you can find it later in Saved
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-[#787774] hover:text-[#1A1A1A] hover:bg-gray-100 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A]">
                    Name*
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={widgetNameInput}
                    onChange={(e) => setWidgetNameInput(e.target.value)}
                    placeholder={`Ex. ${selectedTemplateForModal.title} - Home Page`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3E0DB] text-xs text-[#1A1A1A] placeholder:text-[#AFAFAC] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A]">
                    Where do you plan to embed this widget?
                  </label>
                  <div className="relative">
                    <select
                      value={widgetPlacementInput}
                      onChange={(e) => setWidgetPlacementInput(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-[#E3E0DB] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all bg-white cursor-pointer pr-9"
                    >
                      {PLACEMENT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] pointer-events-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isCreatingWidget}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingWidget ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create widget</span>
                        <ArrowRight size={13} className="ml-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: SAVED (Senja-style Saved Widgets Grid)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans text-[#1A1A1A] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Header with Blovi Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Widgets
            </h1>
            <p className="text-xs sm:text-sm text-[#787774] font-normal">
              Embed and manage your social proof widgets across your websites.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter Dropdown: All Widgets ⌵ */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterDropdownOpen(!isFilterDropdownOpen);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E3E0DB] bg-white text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                <span>
                  {savedFilter === "all"
                    ? "All Widgets"
                    : savedFilter === "wall"
                    ? "Wall of Love"
                    : savedFilter === "orbit"
                    ? "Orbit Cosmos"
                    : "Card Spotlight"}
                </span>
                <ChevronDown size={13} className="text-[#787774]" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-[#E3E0DB] py-1 z-30 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setSavedFilter("all");
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      savedFilter === "all" ? "text-[#2563EB] font-bold bg-blue-50/50" : "text-[#1A1A1A]"
                    }`}
                  >
                    <span>All Widgets</span>
                    {savedFilter === "all" && <Check size={13} className="text-[#2563EB]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedFilter("wall");
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      savedFilter === "wall" ? "text-[#2563EB] font-bold bg-blue-50/50" : "text-[#1A1A1A]"
                    }`}
                  >
                    <span>Wall of Love</span>
                    {savedFilter === "wall" && <Check size={13} className="text-[#2563EB]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedFilter("orbit");
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      savedFilter === "orbit" ? "text-[#2563EB] font-bold bg-blue-50/50" : "text-[#1A1A1A]"
                    }`}
                  >
                    <span>Orbit Cosmos</span>
                    {savedFilter === "orbit" && <Check size={13} className="text-[#2563EB]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedFilter("stack");
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      savedFilter === "stack" ? "text-[#2563EB] font-bold bg-blue-50/50" : "text-[#1A1A1A]"
                    }`}
                  >
                    <span>Card Spotlight</span>
                    {savedFilter === "stack" && <Check size={13} className="text-[#2563EB]" />}
                  </button>
                </div>
              )}
            </div>

            {/* + New widget Button */}
            <button
              type="button"
              onClick={() => setCurrentView("create")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>New widget</span>
            </button>
          </div>
        </div>

        {/* 3-Column Saved Widgets Grid */}
        {filteredSavedWidgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredSavedWidgets.map((widget) => {
              const normLayout = normalizeLayout(widget);
              const layoutTitle = LAYOUT_LABELS[normLayout] || "Widget";
              const timeAgo = formatTimeAgo(widget.updated_at);
              const analytics = (widget.settings?.analytics as Record<string, any>) || {};
              const viewsCount = analytics.views_count || 0;
              const engagements = Math.round(viewsCount * 0.2);
              const rate = viewsCount > 0 ? ((engagements / viewsCount) * 100).toFixed(1) : "0.0";
              const isMenuOpen = cardMenuOpenId === widget.id;

              return (
                <div
                  key={widget.id}
                  onClick={() => handleOpenWidgetInBuilder(widget)}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E3E0DB] hover:border-[#2563EB]/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer relative"
                >
                  {/* Top: Crisp Thumbnail Preview Canvas */}
                  <div className="h-48 bg-[#F7F6F3] rounded-t-2xl flex items-center justify-center p-3 border-b border-[#E3E0DB] overflow-hidden relative group-hover:bg-[#F2F1ED] transition-colors">
                    <img
                      src={
                        normLayout === "wall"
                          ? "/widgets/wall-of-love.png"
                          : normLayout === "orbit"
                          ? "/widgets/orbit-cosmos.png"
                          : "/widgets/card-spotlight.png"
                      }
                      alt={widget.name}
                      className="w-full h-full object-contain select-none group-hover:scale-[1.03] transition-transform duration-200"
                      loading="eager"
                    />

                    {/* Hover Overlay with Edit Widget Button */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-white text-[#1A1A1A] font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[#E3E0DB]">
                        <Pencil size={11} className="text-[#2563EB]" />
                        <span>Edit Widget</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Card Metadata & Actions matching Senja */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-white rounded-b-2xl space-y-3 relative">
                    {/* Row 1: Green Dot + Name + Badge + ⋮ Menu */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                          title="Active"
                        />
                        <h3 className="text-sm font-bold text-[#1A1A1A] truncate group-hover:text-[#2563EB] transition-colors">
                          {widget.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFECE8] text-[#787774]">
                          Widget
                        </span>

                        {/* ⋮ Menu Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCardMenuOpenId(isMenuOpen ? null : widget.id);
                            }}
                            className="p-1 rounded-lg text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors cursor-pointer"
                            aria-label="Widget options"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Action Menu Dropdown */}
                          {isMenuOpen && (
                            <div
                              className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-[#E3E0DB] py-1.5 z-50 animate-fade-in"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleOpenWidgetInBuilder(widget)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Pencil size={12} className="text-[#787774]" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleOpenShare(e, widget)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Share2 size={12} className="text-[#787774]" />
                                <span>Share &amp; Embed</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleStartRename(e, widget)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit3 size={12} className="text-[#787774]" />
                                <span>Rename</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDuplicate(e, widget)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Copy size={12} className="text-[#787774]" />
                                <span>Duplicate</span>
                              </button>

                              <div className="border-t border-[#E3E0DB] my-1" />

                              <button
                                type="button"
                                onClick={(e) => handleStartDelete(e, widget)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 size={12} className="text-red-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Layout Tag • Timestamp */}
                    <div className="flex items-center gap-1.5 text-xs text-[#787774]">
                      <span className="font-medium text-[#52514F]">{layoutTitle}</span>
                      <span className="text-[#AFAFAC]">•</span>
                      <span>{timeAgo}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#E3E0DB]/80 pt-2.5">
                      {/* Row 3: Analytics Row (Views, Engagements, Rate) */}
                      <div className="flex items-center justify-between text-[11px] text-[#787774] font-medium">
                        <div className="flex items-center gap-1" title="Total Views">
                          <Eye size={12} className="text-[#AFAFAC]" />
                          <span>{viewsCount}</span>
                        </div>

                        <div className="flex items-center gap-1" title="Engagements">
                          <Sparkles size={12} className="text-[#AFAFAC]" />
                          <span>{engagements}</span>
                        </div>

                        <div className="flex items-center gap-1" title="Engagement Rate">
                          <span className="text-[10px] font-bold text-[#AFAFAC]">%</span>
                          <span>{rate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E3E0DB] p-12 text-center space-y-4 max-w-lg mx-auto mt-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto shadow-2xs">
              <LayoutGrid size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1A1A1A]">
                {savedFilter === "all" ? "No widgets created yet" : "No matching widgets"}
              </h3>
              <p className="text-xs text-[#787774] max-w-sm mx-auto">
                {savedFilter === "all"
                  ? "Choose a template to create and customize your first social proof widget."
                  : "Try switching back to 'All Widgets' to view all your widgets."}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentView("create")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Create your first widget</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* QUICK SHARE MODAL (Triggered directly from Card)                        */}
      {/* ======================================================================= */}
      {shareModalWidget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShareModalWidget(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E0DB]">
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A]">
                  Share {shareModalWidget.name}
                </h3>
                <p className="text-xs text-[#787774]">
                  Embed on your website or share direct link
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareModalWidget(null)}
                className="text-[#787774] hover:text-[#1A1A1A] p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#E3E0DB] gap-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => setShareTab("embed")}
                className={`pb-2.5 transition-colors cursor-pointer relative ${
                  shareTab === "embed"
                    ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB] -mb-px"
                    : "text-[#787774] hover:text-[#1A1A1A]"
                }`}
              >
                Embed Code
              </button>
              <button
                type="button"
                onClick={() => setShareTab("link")}
                className={`pb-2.5 transition-colors cursor-pointer relative ${
                  shareTab === "link"
                    ? "text-[#2563EB] font-bold border-b-2 border-[#2563EB] -mb-px"
                    : "text-[#787774] hover:text-[#1A1A1A]"
                }`}
              >
                Share Link
              </button>
            </div>

            {shareTab === "embed" ? (
              <div className="space-y-3">
                <div className="bg-[#FAF9F7] border border-[#E3E0DB] rounded-xl p-3 font-mono text-[11px] text-[#1A1A1A] break-all leading-relaxed max-h-32 overflow-y-auto">
                  {getEmbedCodeForWidget(shareModalWidget)}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getEmbedCodeForWidget(shareModalWidget));
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? "Copied code!" : "Copy embed code"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#FAF9F7] border border-[#E3E0DB] rounded-xl p-3 font-mono text-[11px] text-[#1A1A1A] break-all leading-relaxed">
                  {getShareLinkForWidget(shareModalWidget)}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getShareLinkForWidget(shareModalWidget));
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? "Copied link!" : "Copy link"}</span>
                  </button>
                  <a
                    href={getShareLinkForWidget(shareModalWidget)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-[#E3E0DB] hover:bg-gray-50 text-[#787774] hover:text-[#1A1A1A] transition-colors flex items-center justify-center"
                    title="Open link in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* RENAME MODAL                                                            */}
      {/* ======================================================================= */}
      {renameWidget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setRenameWidget(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm text-[#1A1A1A]">Rename widget</h3>
            <form onSubmit={handleSaveRename} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E3E0DB] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 bg-white"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameWidget(null)}
                  className="px-3 py-1.5 rounded-xl border border-[#E3E0DB] text-xs font-semibold text-[#787774] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRenaming}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isRenaming ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                               */}
      {/* ======================================================================= */}
      {deleteConfirmWidget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDeleteConfirmWidget(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1A1A1A]">Delete widget</h3>
              <p className="text-xs text-[#787774]">
                Are you sure you want to delete &ldquo;{deleteConfirmWidget.name}&rdquo;? Any active embeds using this widget will stop loading.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmWidget(null)}
                className="px-3 py-1.5 rounded-xl border border-[#E3E0DB] text-xs font-semibold text-[#787774] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete widget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
