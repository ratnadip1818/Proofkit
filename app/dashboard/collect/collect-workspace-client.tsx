"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { 
  Check, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Mail, 
  Upload, 
  Star,
  Camera,
  Copy,
  QrCode,
  Share2,
  Sliders,
  Sparkles,
  Type,
  Palette
} from "lucide-react";
import { updateForm } from "../actions";

interface FormRow {
  id: string;
  slug: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo: boolean;
  collect_rating: boolean;
  require_consent: boolean;
  custom_domain: string | null;
  custom_font?: string | null;
  custom_css?: string | null;
}

interface CollectWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormRow;
  appUrl: string;
}

const ACCENT_COLORS = ["#2563EB", "#10B981", "#6366F1", "#EC4899", "#EF4444", "#1F2937"];

const FONTS = [
  { id: "Inter", label: "Inter (Clean Sans)", family: "var(--font-sans)" },
  { id: "Outfit", label: "Outfit (Modern Display)", family: "'Outfit', sans-serif" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech)", family: "'Space Grotesk', sans-serif" },
  { id: "Instrument Serif", label: "Instrument Serif (Editorial)", family: "'Instrument Serif', Georgia, serif" },
  { id: "JetBrains Mono", label: "JetBrains Mono (Developer)", family: "'JetBrains Mono', monospace" },
];

const BACKGROUND_PRESETS = [
  { id: "canvas", label: "Warm Canvas", class: "bg-[#FAF9F6] text-gray-900 border-[#ecebe6]" },
  { id: "slate", label: "Midnight Slate", class: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800" },
  { id: "sunset", label: "Sunset Glow", class: "bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-gray-900 border-amber-200" },
  { id: "ocean", label: "Ocean Emerald", class: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-gray-900 border-teal-200" },
  { id: "dusk", label: "Dusk Purple", class: "bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 text-gray-900 border-indigo-200" },
  { id: "obsidian", label: "Obsidian Dark", class: "bg-gray-950 text-white border-gray-800" },
];

export default function CollectWorkspaceClient({
  user,
  form,
  appUrl,
}: CollectWorkspaceClientProps) {
  const router = useRouter();

  // Configuration States
  const [headline, setHeadline] = useState(form.headline || "Share your experience with us");
  const [prompt, setPrompt] = useState(form.prompt || "Would you recommend our product? What's your honest feedback?");
  const [thankYouMessage, setThankYouMessage] = useState(form.thank_you_message || "Thank you for your feedback! It means the world to our team.");
  const [themeColor, setThemeColor] = useState(form.theme_color || "#2563EB");
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo ?? true);
  const [collectRating, setCollectRating] = useState(form.collect_rating ?? true);
  const [requireConsent, setRequireConsent] = useState(form.require_consent ?? true);
  const [selectedFont, setSelectedFont] = useState(form.custom_font || "Inter");
  const [selectedBg, setSelectedBg] = useState(form.custom_css || "canvas");

  // Initial values for clean/dirty state tracking
  const [initialValues, setInitialValues] = useState({
    headline: form.headline,
    prompt: form.prompt,
    thankYouMessage: form.thank_you_message,
    themeColor: form.theme_color,
    collectPhoto: form.collect_photo,
    collectRating: form.collect_rating,
    requireConsent: form.require_consent,
    customFont: form.custom_font,
    customCss: form.custom_css,
  });

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "dirty">("saved");
  const [wizardTab, setWizardTab] = useState<"design" | "share">("design");
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  // Local interactive preview states
  const [testRating, setTestRating] = useState(5);
  const [testContent, setTestContent] = useState("");
  const [testName, setTestName] = useState("");
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Share & QR code states
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = form.custom_domain
    ? `https://${form.custom_domain}`
    : `${appUrl}/c/${form.slug}`;

  // Check dirty state
  useEffect(() => {
    const isDirty =
      headline !== initialValues.headline ||
      prompt !== initialValues.prompt ||
      thankYouMessage !== initialValues.thankYouMessage ||
      themeColor !== initialValues.themeColor ||
      collectPhoto !== initialValues.collectPhoto ||
      collectRating !== initialValues.collectRating ||
      requireConsent !== initialValues.requireConsent ||
      selectedFont !== initialValues.customFont ||
      selectedBg !== initialValues.customCss;

    if (isDirty && saveStatus === "saved") {
      setSaveStatus("dirty");
    }
  }, [headline, prompt, thankYouMessage, themeColor, collectPhoto, collectRating, requireConsent, selectedFont, selectedBg, initialValues, saveStatus]);

  // Generate QR Code for Share Tab
  useEffect(() => {
    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(shareUrl, {
          width: 250,
          margin: 2,
          color: { dark: "#1E293B", light: "#FFFFFF" },
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error("QR Code Error:", err);
      }
    }
    generateQR();
  }, [shareUrl]);

  const handleSaveForm = async () => {
    setSaveStatus("saving");
    try {
      await updateForm(form.id, {
        headline,
        prompt,
        thank_you_message: thankYouMessage,
        theme_color: themeColor,
        collect_photo: collectPhoto,
        collect_rating: collectRating,
        require_consent: requireConsent,
        custom_font: selectedFont,
        custom_css: selectedBg,
      });
      setInitialValues({
        headline,
        prompt,
        thankYouMessage,
        themeColor,
        collectPhoto,
        collectRating,
        requireConsent,
        customFont: selectedFont,
        customCss: selectedBg,
      });
      setSaveStatus("saved");
      router.refresh();
    } catch (error) {
      console.error("Failed to save form settings", error);
      setSaveStatus("dirty");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const activeFontFamily = FONTS.find((f) => f.id === selectedFont)?.family || "var(--font-sans)";
  const activeBgPreset = BACKGROUND_PRESETS.find((b) => b.id === selectedBg) || BACKGROUND_PRESETS[0];

  return (
    <div className="w-full flex flex-col lg:flex-row h-[calc(100vh-56px)] animate-fade-in font-sans bg-canvas overflow-hidden select-none">
      {/* 1. LEFT PANEL: Form Builder & Advanced Branding Customizer */}
      <div className="w-full lg:w-1/2 flex flex-col h-full p-6 lg:p-8 bg-surface overflow-y-auto shrink-0 border-r border-hairline">
        {/* Header & Save Indicator */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: themeColor }}
            />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-gray-800">
              Advanced Form Customizer
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {saveStatus === "saved" && (
              <span className="flex items-center space-x-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-xs">
                <span>✓ Saved</span>
              </span>
            )}
            {saveStatus === "saving" && (
              <span className="text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Saving...
              </span>
            )}
            {saveStatus === "dirty" && (
              <button
                type="button"
                onClick={handleSaveForm}
                className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
              >
                ● Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="border-b border-[#ecebe6] mb-4" />

        {/* Tab Controls */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-5 shrink-0">
          <button
            type="button"
            onClick={() => setWizardTab("design")}
            className={`py-2 px-3 text-xs font-bold transition-all rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer ${
              wizardTab === "design"
                ? "bg-white text-gray-900 shadow-2xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Form & Branding</span>
          </button>
          <button
            type="button"
            onClick={() => setWizardTab("share")}
            className={`py-2 px-3 text-xs font-bold transition-all rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer ${
              wizardTab === "share"
                ? "bg-white text-gray-900 shadow-2xs border border-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>2. Share & Export</span>
          </button>
        </div>

        {/* Form Controls Content */}
        <div className="space-y-5 flex-1">
          {wizardTab === "design" ? (
            <div className="space-y-4">
              {/* Form Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 block">Form Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 text-gray-800 bg-white shadow-3xs"
                  placeholder="e.g. Share your experience with ProofKit"
                />
              </div>

              {/* Prompt Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 block">Prompt Description</label>
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 text-gray-800 resize-none leading-relaxed bg-white shadow-3xs"
                  placeholder="e.g. Would you recommend our product?"
                />
              </div>

              {/* Typography Font Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Typography Font Selector</span>
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setSelectedFont(font.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer flex items-center justify-between ${
                        selectedFont === font.id
                          ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span style={{ fontFamily: font.family }}>{font.label}</span>
                      {selectedFont === font.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Style & Gradient Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>Background Theme & Gradient</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedBg(preset.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        selectedBg === preset.id
                          ? "ring-2 ring-blue-600 ring-offset-1 border-blue-600 shadow-2xs"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Accent Color Swatches */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-gray-800 block">Brand Button Accent Color</label>
                <div className="flex items-center space-x-2.5">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setThemeColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                        themeColor === color ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                  />
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-2 pt-3 border-t border-[#ecebe6]">
                <label className="text-xs font-bold text-gray-800 block">Form Collection Options</label>
                
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] cursor-pointer">
                  <span className="text-xs font-medium text-gray-700">Collect Star Rating</span>
                  <input
                    type="checkbox"
                    checked={collectRating}
                    onChange={(e) => setCollectRating(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] cursor-pointer">
                  <span className="text-xs font-medium text-gray-700">Require Permission Consent</span>
                  <input
                    type="checkbox"
                    checked={requireConsent}
                    onChange={(e) => setRequireConsent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Save Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveForm}
                  disabled={saveStatus === "saving"}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{saveStatus === "saving" ? "Saving Form Settings..." : "Save Custom Branding"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* SUB-TAB B: SHARE & EXPORT WIZARD */
            <div className="space-y-5">
              <div className="bg-[#FAF9F6] border border-[#ecebe6] rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">Direct Collection Link</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Open live collection page in new tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-[#FAF9F6] border border-[#ecebe6] rounded-xl p-4 flex items-center space-x-4">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Collection QR Code" className="w-24 h-24 rounded-lg border border-gray-200 shadow-2xs" />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-200 animate-pulse" />
                )}
                <div>
                  <span className="font-bold text-xs text-gray-900 block">QR Code Generator</span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Download or print this QR code to collect customer testimonials at physical locations or flyers.
                  </p>
                  {qrCodeDataUrl && (
                    <a
                      href={qrCodeDataUrl}
                      download={`proofkit-qr-${form.slug}.png`}
                      className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-block"
                    >
                      Download QR Code Image ↓
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Live Interactive Form Canvas */}
      <div className="w-full lg:w-1/2 bg-canvas flex flex-col h-full overflow-hidden shrink-0">
        <div className="h-12 border-b border-hairline bg-surface px-6 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Live Preview Canvas ({selectedFont})</span>
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                deviceMode === "mobile" ? "bg-white shadow-2xs text-blue-600" : "text-gray-500 hover:text-gray-800"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                deviceMode === "desktop" ? "bg-white shadow-2xs text-blue-600" : "text-gray-500 hover:text-gray-800"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Display Frame with Font & Background Styling */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div
            style={{ fontFamily: activeFontFamily }}
            className={`transition-all duration-300 rounded-2xl border p-6 lg:p-8 space-y-5 shadow-md ${activeBgPreset.class} ${
              deviceMode === "mobile" ? "w-full max-w-sm" : "w-full max-w-xl"
            }`}
          >
            {testSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: themeColor }}
                >
                  ✓
                </div>
                <h3 className="font-bold text-base">Thank You!</h3>
                <p className="text-xs opacity-80 leading-relaxed max-w-xs mx-auto">
                  {thankYouMessage}
                </p>
                <button
                  onClick={() => setTestSubmitted(false)}
                  className="mt-4 text-xs font-bold underline cursor-pointer"
                  style={{ color: themeColor }}
                >
                  ← Reset Preview Form
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setTestSubmitted(true); }} className="space-y-4">
                <div className="space-y-1.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    P
                  </div>
                  <h2 className="font-bold text-lg leading-tight">
                    {headline}
                  </h2>
                  <p className="text-xs opacity-75 leading-relaxed">
                    {prompt}
                  </p>
                </div>

                {collectRating && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                      Overall Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTestRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= testRating ? "fill-amber-400" : "opacity-30"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full text-xs border border-gray-200/80 rounded-xl p-3 outline-none focus:border-blue-500 bg-white/90 text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full text-xs border border-gray-200/80 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white/90 text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
