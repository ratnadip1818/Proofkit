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
  FileText
} from "lucide-react";
import { updateForm } from "../actions";
import {
  PageContainer,
  SectionCard,
  SectionHeader,
  StatusBadge,
  Button,
  Input,
  Textarea,
  Switch,
} from "../ui-components";

const TwitterIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: "block" }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
}

interface CollectWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormRow;
  appUrl: string;
}

const COLOR_PRESETS = [
  { name: "Orange", hex: "#E8743B" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Rose", hex: "#F43F5E" },
  { name: "Slate", hex: "#334155" },
];

export default function CollectWorkspaceClient({
  user,
  form,
  appUrl,
}: CollectWorkspaceClientProps) {
  const router = useRouter();

  // Configuration States (LEFT Pane)
  const [headline, setHeadline] = useState(form.headline);
  const [prompt, setPrompt] = useState(form.prompt);
  const [thankYouMessage, setThankYouMessage] = useState(form.thank_you_message);
  const [themeColor, setThemeColor] = useState(form.theme_color);
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo);
  const [collectRating, setCollectRating] = useState(form.collect_rating);
  const [requireConsent, setRequireConsent] = useState(form.require_consent);

  // Initial values to compute clean/dirty states
  const [initialValues, setInitialValues] = useState({
    headline: form.headline,
    prompt: form.prompt,
    thankYouMessage: form.thank_you_message,
    themeColor: form.theme_color,
    collectPhoto: form.collect_photo,
    collectRating: form.collect_rating,
    requireConsent: form.require_consent,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preview Mode (CENTER Pane)
  const [previewMode, setPreviewMode] = useState<"phone" | "desktop">("phone");
  const [previewRating, setPreviewRating] = useState(5);
  const [previewText, setPreviewText] = useState("");
  const [previewName, setPreviewName] = useState("");

  // Distribution states (RIGHT Pane)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const shareUrl = form.custom_domain
    ? `https://${form.custom_domain}`
    : `${appUrl}/c/${form.slug}`;

  // Check if configuration has been mutated (dirty)
  const isDirty = 
    headline !== initialValues.headline ||
    prompt !== initialValues.prompt ||
    thankYouMessage !== initialValues.thankYouMessage ||
    themeColor !== initialValues.themeColor ||
    collectPhoto !== initialValues.collectPhoto ||
    collectRating !== initialValues.collectRating ||
    requireConsent !== initialValues.requireConsent;

  // Generate QR Code locally
  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, { width: 140, margin: 1 })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [shareUrl]);

  // Handle saving configurations
  const handleSave = async () => {
    setSaving(true);
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
    if (!error) {
      setSaveSuccess(true);
      setInitialValues({
        headline,
        prompt,
        thankYouMessage,
        themeColor,
        collectPhoto,
        collectRating,
        requireConsent,
      });
      setTimeout(() => setSaveSuccess(false), 2000);
      router.refresh();
    }
  };

  // Copy invitation email draft
  const handleCopyInvite = () => {
    const text = `Subject: Quick question about your experience with ${headline}

Hi [Name],

I hope you're doing well!

We recently completed our project/service, and I would love to hear your honest feedback. If you have 30 seconds, could you leave a quick review here?

${shareUrl}

Your support means the world to our business.

Best,
[Your Name]`;
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Copy collection URL link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <PageContainer
      title="Collect Workspace"
      subtitle="Configure, preview, and share your review collection campaign."
    >
      {/* Three Column Split Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none">
        
        {/* 1. LEFT COLUMN: Configuration Pane (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6 lg:order-1 order-2">
          <SectionCard className="space-y-5">
            <SectionHeader
              title="Form Configuration"
              icon={<FileText size={15} />}
            />

            <div className="space-y-4">
              <Input
                label="Form Title"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Leave a review"
              />

              <Textarea
                label="Prompt Description"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell us what you think..."
              />

              <Input
                label="Success Message"
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                placeholder="Thank you for your feedback!"
              />

              {/* Accent Color picker */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A] mb-1.5">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setThemeColor(preset.hex)}
                      type="button"
                      className="h-5 w-5 rounded-full border border-black/10 transition-transform active:scale-95"
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded border-0"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-20 rounded-lg border border-[#ECE7E0] px-2 py-0.5 text-xs text-[#1A1A1A] uppercase focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="border-t border-[#ECE7E0]/60 pt-4 space-y-4">
                <Switch
                  label="Collect Photo"
                  description="Allow avatars upload"
                  checked={collectPhoto}
                  onChange={setCollectPhoto}
                />
                <Switch
                  label="Collect Star Rating"
                  description="Show 5-star selector"
                  checked={collectRating}
                  onChange={setCollectRating}
                />
                <Switch
                  label="Consent Checkbox"
                  description="Explicit publish permission"
                  checked={requireConsent}
                  onChange={setRequireConsent}
                />
              </div>
            </div>
          </SectionCard>

          {/* State-Aware Save Changes Button */}
          <Button
            className="w-full py-3"
            variant="primary"
            onClick={handleSave}
            disabled={saving || !isDirty}
            loading={saving}
          >
            {saveSuccess ? "Saved ✓" : isDirty ? "Save Changes" : "Saved ✓"}
          </Button>
        </div>

        {/* 2. CENTER COLUMN: Visual Interactive Preview (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4 lg:order-2 order-1 w-full min-w-0">
          
          {/* Viewport Toggler */}
          <div className="flex items-center gap-1 bg-[#ECE7E0]/60 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setPreviewMode("phone")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                previewMode === "phone" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              <Smartphone size={13} />
              Phone
            </button>
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                previewMode === "desktop" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              <Monitor size={13} />
              Desktop
            </button>
          </div>

          {/* Device Previews Wrapper Container */}
          <div className="w-full flex justify-center items-start min-h-[560px] bg-[#FAF8F5] border border-[#ECE7E0] rounded-3xl p-6 relative overflow-hidden transition-product duration-card ease-product min-w-0">
            
            {/* Phone Device Bezel Frame */}
            {previewMode === "phone" ? (
              <div className="w-[290px] h-[525px] rounded-[36px] border-[8px] border-[#1A1A1A] bg-white shadow-xl overflow-y-auto px-4 py-6 scrollbar-hide select-none transition-product duration-card ease-product">
                <div className="flex flex-col gap-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold" style={{ backgroundColor: themeColor }}>
                    {headline.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                    {headline}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {prompt}
                  </p>

                  {/* Interactive ratings */}
                  {collectRating && (
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPreviewRating(i + 1)}
                          className="text-[#ECE7E0] hover:scale-110 active:scale-95 transition-transform"
                          style={{ color: i < previewRating ? themeColor : "#ECE7E0" }}
                          type="button"
                        >
                          <Star size={20} fill={i < previewRating ? themeColor : "none"} strokeWidth={2} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Testimonial text inputs */}
                  <div className="text-left space-y-3">
                    <textarea
                      rows={3}
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Share your experience with us..."
                      className="w-full rounded-xl border border-[#ECE7E0] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={previewName}
                      onChange={(e) => setPreviewName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[#ECE7E0] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
                    />

                    {collectPhoto && (
                      <div className="flex items-center gap-2 border border-dashed border-[#ECE7E0] rounded-xl p-2.5 text-center justify-center text-[10px] text-[#6B6B6B]">
                        <Camera size={14} className="text-[#6B6B6B]" />
                        <span>Add Profile Photo (optional)</span>
                      </div>
                    )}

                    {requireConsent && (
                      <label className="flex items-start gap-1.5 text-[10px] text-[#6B6B6B] leading-snug cursor-pointer select-none">
                        <input type="checkbox" defaultChecked className="mt-0.5" />
                        <span>I authorize publishing this testimonial on widgets.</span>
                      </label>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl py-2.5 text-xs font-semibold text-white transition-all shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[720px] rounded-2xl border border-[#ECE7E0] bg-white shadow-lg overflow-hidden flex flex-col transition-product duration-card ease-product">
                <div className="bg-[#FAF8F5] border-b border-[#ECE7E0] px-4 py-2 flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </div>

                <div className="p-8 md:p-12 flex flex-col gap-6 text-center max-w-[480px] mx-auto w-full">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white font-extrabold text-lg" style={{ backgroundColor: themeColor }}>
                    {headline.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                    {headline}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {prompt}
                  </p>

                  {/* Ratings */}
                  {collectRating && (
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPreviewRating(i + 1)}
                          className="text-[#ECE7E0] hover:scale-110 active:scale-95 transition-transform"
                          style={{ color: i < previewRating ? themeColor : "#ECE7E0" }}
                          type="button"
                        >
                          <Star size={24} fill={i < previewRating ? themeColor : "none"} strokeWidth={2} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-left space-y-4">
                    <textarea
                      rows={3}
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Share your experience with us..."
                      className="w-full rounded-xl border border-[#ECE7E0] px-4 py-2.5 text-xs text-[#1A1A1A] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={previewName}
                      onChange={(e) => setPreviewName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[#ECE7E0] px-4 py-2.5 text-xs text-[#1A1A1A] focus:outline-none"
                    />

                    {collectPhoto && (
                      <div className="flex items-center gap-2 border border-dashed border-[#ECE7E0] rounded-xl p-3 text-center justify-center text-[10px] text-[#6B6B6B]">
                        <Camera size={14} className="text-[#6B6B6B]" />
                        <span>Add Profile Photo (optional)</span>
                      </div>
                    )}

                    {requireConsent && (
                      <label className="flex items-start gap-2 text-xs text-[#6B6B6B] leading-snug cursor-pointer select-none">
                        <input type="checkbox" defaultChecked className="mt-0.5" />
                        <span>I authorize publishing this testimonial on widgets.</span>
                      </label>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl py-3 text-xs font-semibold text-white transition-all shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 3. RIGHT COLUMN: Distribute & Campaign launch (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6 lg:order-3 order-3">
          
          {/* Share links */}
          <SectionCard className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Share Page</h3>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 text-xs text-[#6B6B6B] select-all cursor-text focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="rounded-xl border border-[#ECE7E0] bg-white p-2.5 hover:bg-[#FAF8F5] transition-all text-[#1A1A1A]"
                title="Copy Link"
              >
                {copiedLink ? <Check size={14} className="text-green-600" /> : <Mail size={14} />}
              </button>
            </div>

            {/* Custom domain badges status under the QR code */}
            {form.custom_domain ? (
              <div className="flex flex-col gap-1 rounded-xl bg-green-50/50 border border-green-200/30 p-3 text-xs font-semibold text-green-800">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E6B]"></span>
                  <span>Custom Domain Active</span>
                </div>
                <span className="text-[10px] text-green-700 font-mono truncate">{form.custom_domain}</span>
              </div>
            ) : (
              <Link
                href="/dashboard/settings"
                className="block text-center rounded-xl border border-dashed border-[#ECE7E0] p-3 text-[10px] font-bold text-[#E8743B] bg-[#FAF8F5]/30 hover:bg-[#FFF4EE]/25 transition-all"
              >
                Connect Custom Domain →
              </Link>
            )}

            {/* QR code canvas rendering */}
            <div className="flex flex-col items-center justify-center border border-[#ECE7E0] rounded-2xl p-4 bg-white shadow-xs">
              <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-2">QR Code Link</span>
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Review Form QR Code"
                  className="h-28 w-28 object-contain"
                />
              ) : (
                <div className="h-28 w-28 rounded bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                  Generating...
                </div>
              )}
            </div>

            <Button
              className="w-full py-2.5"
              variant="secondary"
              icon={<ExternalLink size={12} />}
              onClick={() => window.open(shareUrl, "_blank")}
            >
              Test Form (Preview)
            </Button>
          </SectionCard>

          {/* Invitation Template */}
          <SectionCard className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Invite Customers</h3>
            <p className="text-[10px] text-[#6B6B6B] leading-relaxed">Copy a high-converting draft to request customer feedback.</p>
            <Button
              className="w-full py-2.5"
              variant="secondary"
              onClick={handleCopyInvite}
            >
              {copiedInvite ? "Copied ✓" : "Copy Template"}
            </Button>
          </SectionCard>

          {/* Praise Importers */}
          <SectionCard className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Import Reviews</h3>
            <p className="text-[10px] text-[#6B6B6B] leading-relaxed">Import praise directly from external networks:</p>

            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/dashboard/import"
                className="flex items-center justify-between border border-[#ECE7E0] rounded-xl p-3 bg-white hover:border-[#E8743B]/40 hover:bg-[#FAF8F5]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Upload size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-[#1A1A1A]">Upload CSV</span>
                </div>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full uppercase">Import</span>
              </Link>

              <Link
                href="/dashboard/import"
                className="flex items-center justify-between border border-[#ECE7E0] rounded-xl p-3 bg-white hover:border-[#E8743B]/40 hover:bg-[#FAF8F5]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <TwitterIcon size={14} />
                  <span className="text-xs font-bold text-[#1A1A1A]">Sync Twitter / X</span>
                </div>
                <span className="text-[10px] text-[#E8743B] font-semibold bg-[#FFF4EE] px-2 py-0.5 rounded-full uppercase">Connect</span>
              </Link>
            </div>
          </SectionCard>

        </div>

      </div>
    </PageContainer>
  );
}
