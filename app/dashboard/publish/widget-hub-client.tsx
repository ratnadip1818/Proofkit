"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Layers,
  Compass,
  Quote,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import WidgetBuilder, { type TestimonialItem } from "./widget-builder";
import type { WidgetType } from "@/app/embed/types/widget";

interface WidgetHubClientProps {
  userId: string;
  isLifetime: boolean;
  email?: string;
  fullName?: string | null;
  testimonials: TestimonialItem[];
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

export default function WidgetHubClient({
  userId,
  isLifetime,
  email,
  testimonials = [],
}: WidgetHubClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("all");
  const [currentView, setCurrentView] = useState<"hub" | "builder">("hub");
  const [activeLayout, setActiveLayout] = useState<WidgetType>("wall");
  const [activeWidgetName, setActiveWidgetName] = useState("");
  const [activePlacement, setActivePlacement] = useState("Home Page");

  // Step 2 Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<TemplateCardDef | null>(null);
  const [widgetNameInput, setWidgetNameInput] = useState("");
  const [widgetPlacementInput, setWidgetPlacementInput] = useState("Home Page");

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCreateModalOpen) {
        setIsCreateModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreateModalOpen]);

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedFilter === "all") return true;
    return tpl.category === selectedFilter;
  });

  // Step 2: Clicking card triggers the creation modal
  const handleCardClick = (tpl: TemplateCardDef) => {
    setSelectedTemplateForModal(tpl);
    setWidgetNameInput("");
    setWidgetPlacementInput("Home Page");
    setIsCreateModalOpen(true);
  };

  // Submit creation modal and enter Studio
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateForModal) return;

    const finalName = widgetNameInput.trim() || selectedTemplateForModal.title;
    setActiveLayout(selectedTemplateForModal.id);
    setActiveWidgetName(finalName);
    setActivePlacement(widgetPlacementInput);
    setIsCreateModalOpen(false);
    setCurrentView("builder");
  };

  const handleBackToHub = () => {
    setCurrentView("hub");
  };

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
          onBack={handleBackToHub}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans text-[#1A1A1A] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Create a widget
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] font-normal">
            Embed testimonials on your website without code.
          </p>
        </div>

        {/* Filter Pills using Blovi's Signature Brand Blue Palette */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
              selectedFilter === "all"
                ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
            }`}
          >
            <Code2 size={12} className={selectedFilter === "all" ? "text-[#2563EB]" : "text-[#AFAFAC]"} />
            <span>All</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("wall")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
              selectedFilter === "wall"
                ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
            }`}
          >
            Dedicated page
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("orbit")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
              selectedFilter === "orbit"
                ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
            }`}
          >
            Great for hero
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("stack")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
              selectedFilter === "stack"
                ? "bg-blue-50 text-[#2563EB] border border-blue-200/90 font-semibold shadow-xs"
                : "bg-white text-[#787774] border border-[#E3E0DB] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
            }`}
          >
            Great next to CTA
          </button>
        </div>

        {/* Symmetrical, Clean Template Grid in Blovi Design Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredTemplates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                onClick={() => handleCardClick(tpl)}
                className="group flex flex-col bg-white rounded-2xl border border-[#E3E0DB] hover:border-[#2563EB]/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Clean, Uniform Actual Preview Canvas on Blovi's Neutral Stage */}
                <div className="h-64 bg-[#F7F6F3] flex items-center justify-center p-4 border-b border-[#E3E0DB] overflow-hidden relative">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.title}
                    className="w-full h-full object-contain select-none group-hover:scale-[1.03] transition-transform duration-200"
                    loading="eager"
                  />
                </div>

                {/* Symmetrical Single-Line Card Footer */}
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

      {/* ======================================================================= */}
      {/* STEP 2 MODAL: CREATE A WIDGET (INTENT & NAMING MODAL)                    */}
      {/* ======================================================================= */}
      {isCreateModalOpen && selectedTemplateForModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-6 space-y-5 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Field 1: Name */}
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

              {/* Field 2: Placement / Destination */}
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Create widget</span>
                  <ArrowRight size={13} className="ml-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
