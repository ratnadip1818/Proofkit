"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { updateForm } from "../../../actions";

interface FormRow {
  id: string;
  slug: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_rating: boolean;
  require_consent: boolean;
}

const inputClass =
  "w-full rounded-lg border border-[#ECE7E0] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
        <p className="text-xs text-[#6B6B6B]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#E8743B]" : "bg-[#ECE7E0]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function EditFormPanel({ form }: { form: FormRow }) {
  const router = useRouter();
  const [headline, setHeadline] = useState(form.headline);
  const [prompt, setPrompt] = useState(form.prompt);
  const [thankYouMessage, setThankYouMessage] = useState(
    form.thank_you_message
  );
  const [themeColor, setThemeColor] = useState(form.theme_color);
  const [collectRating, setCollectRating] = useState(form.collect_rating);
  const [requireConsent, setRequireConsent] = useState(form.require_consent);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const { error } = await updateForm(form.id, {
      headline,
      prompt,
      thank_you_message: thankYouMessage,
      theme_color: themeColor,
      collect_rating: collectRating,
      require_consent: requireConsent,
    });
    setSaving(false);
    if (error) {
      setSaveMsg(`Error: ${error}`);
    } else {
      setSaveMsg("Saved!");
      router.refresh();
      setTimeout(() => setSaveMsg(null), 2500);
    }
  }

  return (
    <div>
      {/* Back + header */}
      <div className="mb-8">
        <Link
          href="/dashboard/forms"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
        >
          <ChevronLeft size={16} />
          Back to forms
        </Link>
        <h1
          className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Customize your form
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Edit how your collection form looks and behaves.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit form */}
        <form
          onSubmit={handleSave}
          className="flex h-fit flex-col gap-5 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Share your experience"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="We would love to hear what you think!"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Thank you message
            </label>
            <input
              type="text"
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              placeholder="Thank you for your feedback!"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Theme color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-[#ECE7E0] bg-white p-1"
              />
              <span className="font-mono text-sm text-[#6B6B6B]">
                {themeColor}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#ECE7E0] pt-4">
            <Toggle
              checked={collectRating}
              onChange={setCollectRating}
              label="Collect rating"
              description="Show a star rating field on your form"
            />
            <Toggle
              checked={requireConsent}
              onChange={setRequireConsent}
              label="Require consent"
              description="Show a consent checkbox before submission"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#E8743B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saveMsg && (
              <p
                className={`text-sm ${
                  saveMsg.startsWith("Error")
                    ? "text-red-600"
                    : "text-[#2E9E6B]"
                }`}
              >
                {saveMsg}
              </p>
            )}
          </div>
        </form>

        {/* Live preview */}
        <div className="h-fit rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Preview
          </h2>
          <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6">
            <h3
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {headline || "Share your experience"}
            </h3>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              {prompt || "We would love to hear what you think!"}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-2 ring-[#ECE7E0]">
                  <svg
                    className="h-5 w-5 text-[#D9D3CB]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-[#6B6B6B]">
                  Photo upload (optional)
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#1A1A1A]">
                  Your name
                </label>
                <div className="rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 text-xs text-[#6B6B6B]">
                  Jane Smith
                </div>
              </div>

              {collectRating && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-[#1A1A1A]">
                    Rating
                  </span>
                  <div className="text-xl leading-none text-amber-400">
                    ★★★★★
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#1A1A1A]">
                  Your testimonial
                </label>
                <div className="rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 text-xs text-[#6B6B6B]">
                  Share your experience…
                </div>
              </div>

              {requireConsent && (
                <label className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <input
                    type="checkbox"
                    disabled
                    className="h-3.5 w-3.5 rounded border-[#ECE7E0] accent-[#E8743B]"
                  />
                  I consent to having my testimonial displayed publicly.
                </label>
              )}

              <button
                type="button"
                disabled
                style={{ backgroundColor: themeColor }}
                className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
              >
                Submit testimonial
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-[#ECE7E0] bg-[#FAF8F5] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              After submission
            </p>
            <p className="mt-2 text-sm text-[#1A1A1A]">
              {thankYouMessage || "Thank you for your feedback!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
