"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Palette,
  Sliders,
  Check,
  Star,
  Camera,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { updateForm } from "../../../actions";

interface FormRow {
  id: string;
  slug: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo?: boolean;
  collect_rating: boolean;
  require_consent: boolean;
}

const inputClass =
  "w-full rounded-xl border border-[#ECE7E0] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#8A8A8A] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-4 focus:ring-[#E8743B]/10";

const COLOR_PRESETS = [
  { name: "Orange", hex: "#E8743B", bg: "bg-[#E8743B]" },
  { name: "Indigo", hex: "#6366F1", bg: "bg-[#6366F1]" },
  { name: "Emerald", hex: "#10B981", bg: "bg-[#10B981]" },
  { name: "Purple", hex: "#8B5CF6", bg: "bg-[#8B5CF6]" },
  { name: "Rose", hex: "#F43F5E", bg: "bg-[#F43F5E]" },
  { name: "Slate", hex: "#334155", bg: "bg-[#334155]" },
];

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#ECE7E0] bg-[#FAF8F5]/50 p-4 transition-all hover:bg-[#FAF8F5]">
      <div className="flex gap-3">
        <div className={`mt-0.5 rounded-lg p-2 ${checked ? "bg-[#E8743B]/10 text-[#E8743B]" : "bg-[#ECE7E0]/60 text-[#8A8A8A]"} transition-colors`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B] leading-relaxed">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8743B]/25 ${
          checked ? "bg-[#E8743B]" : "bg-[#ECE7E0]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function EditFormPanel({ form }: { form: FormRow }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"content" | "style" | "fields">("content");
  
  // State variables
  const [headline, setHeadline] = useState(form.headline);
  const [prompt, setPrompt] = useState(form.prompt);
  const [thankYouMessage, setThankYouMessage] = useState(form.thank_you_message);
  const [themeColor, setThemeColor] = useState(form.theme_color);
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo !== false);
  const [collectRating, setCollectRating] = useState(form.collect_rating);
  const [requireConsent, setRequireConsent] = useState(form.require_consent);
  
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    
    const { error } = await updateForm(form.id, {
      headline,
      prompt,
      thank_you_message: thankYouMessage,
      theme_color: themeColor,
      collect_photo: collectPhoto,
      collect_rating: collectRating,
      require_consent: requireConsent,
    });
    
    setSaving(false);
    if (error) {
      setSaveMsg({ text: `Error: ${error}`, isError: true });
    } else {
      setSaveMsg({ text: "All form changes saved successfully!", isError: false });
      router.refresh();
      setTimeout(() => setSaveMsg(null), 3500);
    }
  }

  return (
    <div>
      {/* Back to dashboard */}
      <div className="mb-6">
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
        >
          <ChevronLeft size={14} className="stroke-[3px]" />
          Back to forms
        </Link>
      </div>

      {/* Main Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#ECE7E0] pb-6">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A] flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Sparkles size={22} className="text-[#E8743B] fill-[#E8743B]/10" />
            Customize collection form
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Configure and polish your testimonials collection form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-300 ${
                saveMsg.isError
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {saveMsg.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              <span>{saveMsg.text}</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#CF5F2C] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? "Saving changes…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Editor Form (Left 7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Customizer tabs */}
          <div className="flex border-b border-[#ECE7E0] bg-white rounded-2xl p-1.5 shadow-sm border">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                activeTab === "content"
                  ? "bg-[#FAF8F5] text-[#1A1A1A] shadow-sm border border-[#ECE7E0]"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A] border border-transparent"
              }`}
            >
              <FileText size={14} />
              <span>1. Content</span>
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                activeTab === "style"
                  ? "bg-[#FAF8F5] text-[#1A1A1A] shadow-sm border border-[#ECE7E0]"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A] border border-transparent"
              }`}
            >
              <Palette size={14} />
              <span>2. Design</span>
            </button>
            <button
              onClick={() => setActiveTab("fields")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                activeTab === "fields"
                  ? "bg-[#FAF8F5] text-[#1A1A1A] shadow-sm border border-[#ECE7E0]"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A] border border-transparent"
              }`}
            >
              <Sliders size={14} />
              <span>3. Fields</span>
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm min-h-[380px]">
            {activeTab === "content" && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-[#ECE7E0]/60 pb-3">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Form Content</h3>
                  <p className="mt-1 text-xs text-[#6B6B6B]">Edit heading titles and descriptions of the form.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Share your experience"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-[#8A8A8A]">The primary large title at the top of the collection form.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Prompt / Question</label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="We would love to hear what you think!"
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-[11px] text-[#8A8A8A]">Ask users guiding questions (e.g. what did they love most?).</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Thank You Message</label>
                  <input
                    type="text"
                    value={thankYouMessage}
                    onChange={(e) => setThankYouMessage(e.target.value)}
                    placeholder="Thank you for your feedback!"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-[#8A8A8A]">Message displayed to users immediately after submitting feedback.</p>
                </div>
              </div>
            )}

            {activeTab === "style" && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-[#ECE7E0]/60 pb-3">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Design Themes</h3>
                  <p className="mt-1 text-xs text-[#6B6B6B]">Select colors matching your branding.</p>
                </div>
                
                {/* Preset Themes Grid */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Color Presets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {COLOR_PRESETS.map((preset) => {
                      const isActive = themeColor.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => setThemeColor(preset.hex)}
                          className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                            isActive
                              ? "border-[#1A1A1A] bg-[#FAF8F5] shadow-sm font-semibold text-[#1A1A1A]"
                              : "border-[#ECE7E0] bg-white text-[#6B6B6B] hover:border-[#1A1A1A]/30 hover:bg-[#FAF8F5]/30"
                          }`}
                        >
                          <span className={`h-4 w-4 shrink-0 rounded-full ${preset.bg} border border-black/10 flex items-center justify-center`}>
                            {isActive && <Check size={10} className="text-white" />}
                          </span>
                          <span className="text-xs">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Selector */}
                <div className="flex flex-col gap-3 border-t border-[#ECE7E0]/60 pt-5">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Custom Theme Color</label>
                  <div className="flex items-center gap-4 rounded-xl border border-[#ECE7E0] p-4 bg-[#FAF8F5]/30 max-w-sm">
                    <div className="relative h-10 w-16 overflow-hidden rounded-lg border border-[#ECE7E0] shadow-sm flex items-center justify-center">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 scale-150"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold text-[#1A1A1A]">
                        {themeColor.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#8A8A8A] mt-0.5">Click box to open palette</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fields" && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-[#ECE7E0]/60 pb-3">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Form Fields & Behavior</h3>
                  <p className="mt-1 text-xs text-[#6B6B6B]">Control form inputs and consent guidelines.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Toggle
                    checked={collectRating}
                    onChange={setCollectRating}
                    label="Collect rating"
                    description="Show a 5-star rating selector so customers can evaluate your service."
                    icon={Star}
                  />
                  <Toggle
                    checked={collectPhoto}
                    onChange={setCollectPhoto}
                    label="Collect customer photo"
                    description="Enable profile picture uploads to add authentic user avatars to testimonials."
                    icon={Camera}
                  />
                  <Toggle
                    checked={requireConsent}
                    onChange={setRequireConsent}
                    label="Require consent checkbox"
                    description="Force customers to explicitly authorize showing feedback in widgets."
                    icon={ShieldCheck}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Mockup Preview (Right 5 columns) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6B6B6B] self-start">
            Live Form Preview
          </h2>

          {/* Premium Browser Window Mockup Container */}
          <div className="w-full rounded-2xl border border-[#ECE7E0] bg-white shadow-lg overflow-hidden lg:sticky lg:top-6">
            {/* Window Title Bar */}
            <div className="flex items-center justify-between border-b border-[#ECE7E0] bg-[#FAF8F5] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] opacity-80" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F] opacity-80" />
              </div>
              <div className="rounded border border-[#ECE7E0] bg-white px-3 py-1 font-mono text-[9px] text-[#6B6B6B] max-w-[180px] truncate select-none">
                blovi.space/c/{form.slug}
              </div>
              <div className="w-12" /> {/* spacer to balance controls */}
            </div>

            {/* Inner Content Screen */}
            <div className="bg-[#FAF8F5] max-h-[500px] overflow-y-auto scrollbar-none">
              
              {/* Collection Form Preview */}
              <div className="p-6">
                <h3
                  className="text-lg font-extrabold text-[#1A1A1A] leading-snug break-words"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {headline || "Share your experience"}
                </h3>
                <p className="mt-2 text-xs text-[#6B6B6B] leading-relaxed break-words">
                  {prompt || "We would love to hear what you think!"}
                </p>

                <div className="mt-5 flex flex-col gap-4">
                  {/* Photo upload avatar circle */}
                  {collectPhoto && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#ECE7E0] bg-white p-2.5 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] ring-2 ring-[#ECE7E0] text-[#D9D3CB]">
                        <Camera size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#1A1A1A]">Profile picture</span>
                        <span className="text-[9px] text-[#6B6B6B] mt-0.5">Upload photo (optional)</span>
                      </div>
                    </div>
                  )}

                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#1A1A1A]">
                      Your name *
                    </label>
                    <div className="rounded-lg border border-[#ECE7E0] bg-white px-3 py-2.5 text-xs text-[#8A8A8A]">
                      Jane Smith
                    </div>
                  </div>

                  {/* Rating stars field */}
                  {collectRating && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-[#1A1A1A]">
                        Rating *
                      </span>
                      <div className="text-lg leading-none text-amber-400 flex gap-0.5">
                        <Star size={14} fill="currentColor" className="stroke-none" />
                        <Star size={14} fill="currentColor" className="stroke-none" />
                        <Star size={14} fill="currentColor" className="stroke-none" />
                        <Star size={14} fill="currentColor" className="stroke-none" />
                        <Star size={14} fill="currentColor" className="stroke-none" />
                      </div>
                    </div>
                  )}

                  {/* Testimonial field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#1A1A1A]">
                      Your testimonial *
                    </label>
                    <div className="rounded-lg border border-[#ECE7E0] bg-white px-3 py-3 text-xs text-[#8A8A8A] min-h-[60px] leading-relaxed">
                      Share your experience…
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  {requireConsent && (
                    <label className="flex items-start gap-2 text-[10px] text-[#6B6B6B] leading-relaxed">
                      <input
                        type="checkbox"
                        disabled
                        className="mt-0.5 h-3.5 w-3.5 rounded border-[#ECE7E0] accent-[#E8743B]"
                      />
                      <span>I consent to having my testimonial displayed publicly.</span>
                    </label>
                  )}

                  {/* Primary Submit Button matching selected theme color */}
                  <button
                    type="button"
                    disabled
                    style={{ backgroundColor: themeColor }}
                    className="w-full rounded-xl py-3 text-xs font-bold text-white shadow-sm transition-colors opacity-90 cursor-not-allowed"
                  >
                    Submit testimonial
                  </button>
                </div>
              </div>

              {/* After Submission success message */}
              <div className="border-t border-[#ECE7E0] bg-white p-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                  After submission view
                </span>
                <div className="mt-1.5 rounded-lg border border-green-100 bg-green-50/50 p-2.5 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800 font-medium leading-relaxed break-words">
                    {thankYouMessage || "Thank you for your feedback!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
