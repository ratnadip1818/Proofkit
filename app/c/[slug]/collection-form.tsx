"use client";

import React, { useState, useRef } from "react";
import { submitTestimonial, uploadAvatar } from "./actions";
import { compressAvatar } from "@/lib/image-compress";

interface FormRow {
  id: string;
  user_id: string;
  headline?: string;
  prompt?: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo?: boolean;
  collect_rating: boolean;
  require_consent: boolean;
  custom_css?: string | null;
}

interface FormMetadata {
  logo_url?: string | null;
  rating_title?: string;
  rating_subtitle?: string;
  rating_cta?: string;
  review_placeholder?: string;
  review_cta?: string;
  thank_you_title?: string;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function parseFormMetadata(customCss?: string | null): FormMetadata {
  if (!customCss) return {};
  try {
    const match = customCss.match(/\/\* __BLOVI_CONFIG__=([\s\S]*?) \*\//);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch {
    // Ignore malformed JSON
  }
  return {};
}

function normalizeHexColor(input: string): string {
  if (!input) return "#2563EB";
  let val = input.trim();
  if (!val.startsWith("#")) {
    val = `#${val}`;
  }
  if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
    val = `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    return val.toUpperCase();
  }
  return "#2563EB";
}

function getContrastTextColor(hexColor: string): string {
  const normalized = normalizeHexColor(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16) || 0;
  const g = parseInt(normalized.slice(3, 5), 16) || 0;
  const b = parseInt(normalized.slice(5, 7), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? "#111827" : "#FFFFFF";
}

export default function CollectionForm({ form }: { form: FormRow }) {
  const meta = parseFormMetadata(form.custom_css);

  // Steps: 1 = Rating, 2 = Review, 3 = Thank You
  const [step, setStep] = useState<number>(form.collect_rating ? 1 : 2);

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [consent, setConsent] = useState(true);
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mountTime] = useState(() => Date.now());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPositive = !form.collect_rating || rating >= 4;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      setPhotoPreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Photo must be under 2MB.");
      e.target.value = "";
      return;
    }
    setError(null);
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Speed check: Reject submissions completed in under 2 seconds (automated bots)
    if (Date.now() - mountTime < 2000) {
      setStep(3);
      return;
    }

    if (form.collect_rating && rating === 0) {
      setError("Please select a rating.");
      setStep(1);
      return;
    }

    if (!body.trim()) {
      setError(
        isPositive
          ? "Please enter your review to continue."
          : "Please enter your feedback to continue."
      );
      return;
    }

    if (isPositive && !authorName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (isPositive && form.require_consent && !consent) {
      setError("Please accept the consent checkbox to continue.");
      return;
    }

    setLoading(true);

    let avatarUrl: string | null = null;
    if (avatarFile && isPositive) {
      try {
        const compressedBlob = await compressAvatar(avatarFile);
        const compressedFile = new File([compressedBlob], `avatar-${Date.now()}.webp`, {
          type: "image/webp",
        });

        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("userId", form.user_id);
        const { url, error: uploadErr } = await uploadAvatar(uploadData);
        if (uploadErr) {
          setError(uploadErr);
          setLoading(false);
          return;
        }
        avatarUrl = url;
      } catch (err) {
        console.error("Client-side avatar compression error:", err);
        setError("Photo upload failed. Try a smaller image, or remove it.");
        setLoading(false);
        return;
      }
    }

    const { error: insertError } = await submitTestimonial({
      formId: form.id,
      userId: form.user_id,
      authorName: authorName.trim() || (isPositive ? "Anonymous" : "Feedback User"),
      authorRole: isPositive ? authorRole.trim() || null : "Constructive Feedback",
      body,
      rating: form.collect_rating ? rating : null,
      consent: isPositive ? consent : false,
      avatarUrl: isPositive ? avatarUrl : null,
      website,
    });

    if (insertError) {
      setError(insertError);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(3);
  };

  const brandColor =
    !form.theme_color || form.theme_color === "#000000"
      ? "#2563EB"
      : normalizeHexColor(form.theme_color);
  const contrastBtnText = getContrastTextColor(brandColor);

  return (
    <main
      className="card w-full max-w-[440px] bg-white rounded-2xl border border-gray-200 p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]"
      aria-live="polite"
    >
      {/* 3-Step Progress Indicator Bar */}
      <div
        className="steps flex gap-1.5 mb-8"
        role="img"
        aria-label={`Step ${step} of 3`}
      >
        <i
          className={`flex-1 h-[3px] rounded-full transition-colors duration-250 ${
            step >= 1 ? "bg-brand-600" : "bg-gray-200"
          }`}
          style={step >= 1 ? { backgroundColor: brandColor } : undefined}
        />
        <i
          className={`flex-1 h-[3px] rounded-full transition-colors duration-250 ${
            step >= 2 ? "bg-brand-600" : "bg-gray-200"
          }`}
          style={step >= 2 ? { backgroundColor: brandColor } : undefined}
        />
        <i
          className={`flex-1 h-[3px] rounded-full transition-colors duration-250 ${
            step >= 3 ? "bg-brand-600" : "bg-gray-200"
          }`}
          style={step >= 3 ? { backgroundColor: brandColor } : undefined}
        />
      </div>

      {/* Optional Brand Logo */}
      {meta.logo_url && (
        <div className="mb-6 flex items-center">
          <img
            src={meta.logo_url}
            alt="Company Logo"
            className="max-h-9 max-w-[140px] object-contain"
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: RATING PAGE                                      */}
      {/* ======================================================== */}
      {step === 1 && (
        <section className="step animate-step-in">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-snug mb-2">
            {meta.rating_title || "How would you rate your experience with Blovi?"}
          </h1>
          <p className="sub text-sm text-gray-500 mb-6 leading-relaxed">
            {meta.rating_subtitle || "Select a rating from 1 to 5."}
          </p>

          {/* Stars */}
          <div
            className="stars flex gap-1 -mx-0.5 mb-2"
            role="group"
            aria-label="Rating"
            onMouseLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const isLit = (hoveredRating || rating) >= n;
              return (
                <button
                  key={n}
                  type="button"
                  data-n={n}
                  onClick={() => {
                    setRating(n);
                    setError(null);
                  }}
                  onMouseEnter={() => setHoveredRating(n)}
                  onFocus={() => setHoveredRating(n)}
                  className="star w-11 h-11 p-1 rounded-lg border-0 bg-transparent cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 transition-transform hover:scale-105"
                  aria-label={`${n} out of 5`}
                >
                  <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
                    <path
                      d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"
                      className={
                        isLit
                          ? "fill-star-400 stroke-star-400"
                          : "fill-none stroke-gray-300 stroke-[1.5]"
                      }
                      style={{ transition: "fill .15s, stroke .15s" }}
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Live Rating Label */}
          <p className="rlabel h-5 text-sm text-gray-500 mb-6 font-normal">
            {LABELS[hoveredRating || rating] || ""}
          </p>

          {/* Continue Button */}
          <button
            type="button"
            disabled={!rating}
            onClick={() => setStep(2)}
            style={{ backgroundColor: brandColor, color: contrastBtnText }}
            className="btn w-full h-12 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.99]"
          >
            {meta.rating_cta || "Continue"}
          </button>
        </section>
      )}

      {/* ======================================================== */}
      {/* STEP 2: REVIEW PAGE (INTRODUCE YOURSELF & BODY)          */}
      {/* ======================================================== */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="step animate-step-in">
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-snug mb-2">
            {isPositive
              ? form.headline || "Share your feedback"
              : "How can we improve?"}
          </h1>
          <p className="sub text-sm text-gray-500 mb-6 leading-relaxed">
            {isPositive
              ? form.prompt || "A few sentences about your experience help others decide."
              : "Your response goes directly to our team and is not published."}
          </p>

          {/* Testimonial field */}
          <div className="field mb-5">
            <label htmlFor="testimonial-body" className="block text-sm font-medium text-gray-900 mb-1.5">
              Your {isPositive ? "review" : "feedback"}
            </label>
            <textarea
              id="testimonial-body"
              rows={4}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                isPositive
                  ? meta.review_placeholder || "Write your review…"
                  : "Write your feedback…"
              }
              className={`w-full min-h-[128px] rounded-xl border bg-transparent p-3 text-sm text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all leading-relaxed resize-y ${
                error && !body.trim() ? "border-red-600" : "border-gray-200"
              }`}
            />
            {error && (
              <p className="err text-xs text-red-600 mt-2 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Photo upload (when positive and photo enabled) */}
          {isPositive && (form.collect_photo ?? true) && (
            <div className="photo flex items-center gap-3 mb-4">
              <div
                className="avatar w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 text-gray-400 text-sm font-medium bg-cover bg-center"
                style={photoPreview ? { backgroundImage: `url('${photoPreview}')` } : undefined}
              >
                {photoPreview ? "" : "+"}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="link text-sm font-medium text-brand-600 hover:text-brand-700 cursor-pointer"
              >
                Add photo <span className="opt text-gray-400 font-normal">(optional)</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setPhotoPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="link muted text-xs text-gray-400 hover:text-red-600 ml-auto cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          )}

          {/* 2-Column Row for Name and Role */}
          <div className="row grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div>
              <label htmlFor="author-name" className="block text-sm font-medium text-gray-900 mb-1.5">
                Full name {!isPositive && <span className="opt text-gray-400 font-normal">(optional)</span>}
              </label>
              <input
                id="author-name"
                type="text"
                autoComplete="name"
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all ${
                  error && isPositive && !authorName.trim()
                    ? "border-red-600"
                    : "border-gray-200"
                }`}
              />
            </div>
            <div>
              <label htmlFor="author-role" className="block text-sm font-medium text-gray-900 mb-1.5">
                Role / company <span className="opt text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="author-role"
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          {/* Consent checkbox */}
          {isPositive && form.require_consent && (
            <label className="consent flex items-center gap-2.5 text-sm text-gray-500 mb-6 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500/40 cursor-pointer"
              />
              <span>I allow this review to be shown publicly.</span>
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: brandColor, color: contrastBtnText }}
            className="btn w-full h-12 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-[0.99] disabled:opacity-45"
          >
            {loading ? (
              <>
                <span className="spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              isPositive ? (meta.review_cta || "Submit review") : "Send feedback"
            )}
          </button>

          {/* Back button */}
          {form.collect_rating && (
            <div className="back mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="link muted text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 3: THANK YOU PAGE                                   */}
      {/* ======================================================== */}
      {step === 3 && (
        <section className="step done animate-step-in pt-4 pb-2">
          {/* Animated SVG Checkmark Tick */}
          <svg
            className="tick w-12 h-12 mb-6 block"
            viewBox="0 0 48 48"
            aria-hidden="true"
            style={{ color: brandColor }}
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="tick-circle"
            />
            <path
              d="M15 25l6 6 12-13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tick-path"
            />
          </svg>

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-snug mb-2">
            {meta.thank_you_title || "Thank you"}
          </h1>
          <p className="sub text-sm text-gray-500 m-0 leading-relaxed">
            {form.thank_you_message ||
              `Your ${isPositive ? "review" : "feedback"} has been submitted.`}
          </p>
        </section>
      )}
    </main>
  );
}
