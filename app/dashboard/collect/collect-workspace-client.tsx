"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Share2,
  Sliders,
  Sparkles,
  Type,
  Palette,
  Download,
  Send,
  MessageSquare
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
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${isSm ? "h-4 w-8" : "h-6 w-11"}`}
    >
      <span
        className={`inline-block bg-white rounded-full transition-transform shadow-sm ${
          isSm ? "h-3 w-3" : "h-5 w-5"
        }`}
        style={{
          transform: checked
            ? `translateX(${isSm ? "14px" : "22px"})`
            : "translateX(2px)",
        }}
      />
    </button>
  );
}

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

  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [tab, setTab] = useState<"design" | "share">("design");
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  // Local interactive preview states
  const [testRating, setTestRating] = useState(5);
  const [testContent, setTestContent] = useState("");
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Share & QR code states
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);

  const shareUrl = form.custom_domain
    ? `https://${form.custom_domain}`
    : `${appUrl}/c/${form.slug}`;

  // Background Auto-Sync effect
  useEffect(() => {
    setSavingStatus("saving");
    const timer = setTimeout(async () => {
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
        setSavingStatus("saved");
      } catch (err) {
        console.error("Failed auto-syncing form:", err);
        setSavingStatus("idle");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    headline,
    prompt,
    thankYouMessage,
    themeColor,
    collectPhoto,
    collectRating,
    requireConsent,
    selectedFont,
    selectedBg,
    form.id,
  ]);

  // Generate QR Code for Share Tab
  useEffect(() => {
    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(shareUrl, {
          width: 300,
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const emailInviteText = `Hi there!

We'd love to hear your feedback on your recent experience with us. It takes less than 60 seconds to leave a review:

👉 ${shareUrl}

Thank you so much for your support!`;

  const handleCopyEmailText = () => {
    navigator.clipboard.writeText(emailInviteText);
    setCopiedEmailText(true);
    setTimeout(() => setCopiedEmailText(false), 2000);
  };

  const activeFontFamily = FONTS.find((f) => f.id === selectedFont)?.family || "var(--font-sans)";
  const activeBgPreset = BACKGROUND_PRESETS.find((b) => b.id === selectedBg) || BACKGROUND_PRESETS[0];

  return (
    <div className="flex min-h-screen bg-[#F5F4F1] font-sans text-gray-900 overflow-hidden relative">
      {/* LEFT PANEL */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 shadow-sm z-10">
        <div className="px-6 pt-6 shrink-0">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTab("design")}
                className={`text-xs font-semibold cursor-pointer pb-3 -mb-[13px] transition-all border-b-2 ${
                  tab === "design"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                1. Form Design
              </button>
              <Share2 size={14} className="text-gray-300" />
              <button
                type="button"
                onClick={() => setTab("share")}
                className={`text-xs font-medium cursor-pointer pb-3 -mb-[13px] transition-all border-b-2 ${
                  tab === "share"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                2. Share & Invites
              </button>
            </div>

            {/* Auto Sync Status Badge */}
            <div className="text-[10px] font-bold uppercase tracking-wider">
              {savingStatus === "saving" && <span className="text-blue-600 animate-pulse">Saving...</span>}
              {savingStatus === "saved" && <span className="text-emerald-600">✓ Saved</span>}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === "design" ? (
            <>
              {/* Headline Copy */}
              <section className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Form Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 text-gray-900 bg-white shadow-xs font-medium"
                  placeholder="e.g. Share your experience with us"
                />
              </section>

              {/* Prompt Description */}
              <section className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Prompt Description</label>
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 text-gray-900 resize-none leading-relaxed bg-white shadow-xs font-medium"
                  placeholder="e.g. Would you recommend our product?"
                />
              </section>

              {/* Thank You Message */}
              <section className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 block">Thank You Message</label>
                <textarea
                  rows={2}
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 text-gray-900 resize-none leading-relaxed bg-white shadow-xs font-medium"
                  placeholder="e.g. Thank you for your feedback!"
                />
              </section>

              <hr className="border-gray-100" />

              {/* Brand Accent Color */}
              <section className="space-y-2">
                <label className="text-xs font-bold text-gray-900 block">Button Brand Accent Color</label>
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
              </section>

              <hr className="border-gray-100" />

              {/* Form Collection Toggles */}
              <section className="space-y-4">
                <div className="font-semibold text-xs text-gray-400 uppercase tracking-wider">Field Controls</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">Collect Star Rating</span>
                  <Switch checked={collectRating} onChange={setCollectRating} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">Collect Customer Photo</span>
                  <Switch checked={collectPhoto} onChange={setCollectPhoto} />
                </div>

                <div className="flex items-center justify-between pb-6">
                  <span className="text-xs font-medium text-gray-900">Require Consent Checkbox</span>
                  <Switch checked={requireConsent} onChange={setRequireConsent} />
                </div>
              </section>
            </>
          ) : (
            /* TAB 2: SHARE & INVITES */
            <div className="space-y-6">
              {/* Direct Link */}
              <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Direct Share Link</span>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Open Live Form</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </section>

              {/* QR Code */}
              <section className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4 shadow-xs">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Collection QR Code" className="w-24 h-24 rounded-lg border border-gray-200 shadow-xs shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                )}
                <div>
                  <span className="font-bold text-xs text-gray-900 block">Printable QR Code</span>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Download this QR code for print packaging, receipts, or table stands.
                  </p>
                  {qrCodeDataUrl && (
                    <a
                      href={qrCodeDataUrl}
                      download={`blovi-qr-${form.slug}.png`}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      <Download size={12} />
                      Download QR Code
                    </a>
                  )}
                </div>
              </section>

              {/* Pre-written Customer Email Template */}
              <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">Email Invite Template</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmailText}
                    className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedEmailText ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedEmailText ? "Copied Email" : "Copy Template"}</span>
                  </button>
                </div>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {emailInviteText}
                </pre>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: LIVE INTERACTIVE PREVIEW */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Viewport Header */}
        <div className="px-10 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-xs">
            <Sparkles size={14} className="text-amber-500 fill-amber-500" />
            Live Form Preview
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                deviceMode === "mobile"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Smartphone size={14} />
              Mobile Phone
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                deviceMode === "desktop"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Monitor size={14} />
              Desktop View
            </button>
          </div>
        </div>

        {/* Live Canvas Viewport */}
        <div className="flex-1 w-full h-full p-4 md:p-6 overflow-y-auto flex items-center justify-center">
          <div
            style={{ fontFamily: activeFontFamily }}
            className={`transition-all duration-300 rounded-3xl border p-8 space-y-6 shadow-xl ${activeBgPreset.class} ${
              deviceMode === "mobile" ? "w-full max-w-sm" : "w-full max-w-xl"
            }`}
          >
            {testSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  ✓
                </div>
                <h3 className="font-bold text-xl">Thank You!</h3>
                <p className="text-sm opacity-80 leading-relaxed max-w-xs mx-auto">
                  {thankYouMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setTestSubmitted(false)}
                  className="mt-6 text-xs font-bold underline cursor-pointer"
                  style={{ color: themeColor }}
                >
                  ← Test Form Again
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setTestSubmitted(true); }} className="space-y-5">
                <div className="space-y-2">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    B
                  </div>
                  <h2 className="font-bold text-2xl leading-tight">
                    {headline}
                  </h2>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {prompt}
                  </p>
                </div>

                {collectRating && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider block opacity-70">
                      Overall Rating
                    </label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTestRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-7 h-7 ${star <= testRating ? "fill-amber-400" : "opacity-30"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider block opacity-70">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Write your experience..."
                    className="w-full text-sm border border-gray-200/80 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider block opacity-70">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full text-sm border border-gray-200/80 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider block opacity-70">
                      Your Title / Role
                    </label>
                    <input
                      type="text"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      placeholder="Product Designer"
                      className="w-full text-sm border border-gray-200/80 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-900"
                    />
                  </div>
                </div>

                {collectPhoto && (
                  <div className="p-4 border-2 border-dashed border-gray-300/80 rounded-2xl text-center space-y-1 bg-white/50 cursor-pointer">
                    <Camera className="w-5 h-5 mx-auto text-gray-400" />
                    <span className="text-xs font-semibold block text-gray-700">Upload Photo (Optional)</span>
                  </div>
                )}

                {requireConsent && (
                  <label className="flex items-start space-x-2 text-xs opacity-75 cursor-pointer pt-1">
                    <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-blue-600" />
                    <span>I give permission to use this testimonial on your website and marketing materials.</span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
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
