"use client";

import { useState } from "react";
import { submitTestimonial, uploadAvatar } from "./actions";
import { compressAvatar } from "@/lib/image-compress";

interface FormRow {
  id: string;
  user_id: string;
  thank_you_message: string;
  theme_color: string;
  collect_rating: boolean;
  require_consent: boolean;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Select a rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8743B]/40 rounded"
        >
          <span
            className={
              (hover || value) >= star ? "text-amber-400" : "text-[#ECE7E0]"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#ECE7E0] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20";

export default function CollectionForm({ form }: { form: FormRow }) {
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mountTime] = useState(() => Date.now());

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Photo must be under 2MB.");
      e.target.value = "";
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) =>
      setAvatarPreview(ev.target?.result as string ?? null);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Speed check: Reject submissions completed in under 2 seconds (likely automated bots)
    if (Date.now() - mountTime < 2000) {
      setSubmitted(true);
      return;
    }

    if (form.collect_rating && rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (form.require_consent && !consent) {
      setError("Please accept the consent checkbox to continue.");
      return;
    }

    setLoading(true);

    let avatarUrl: string | null = null;
    if (avatarFile) {
      try {
        // Compress the image client-side to 150x150 WebP under 15KB
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
      authorName,
      authorRole: authorRole || null,
      body,
      rating: form.collect_rating ? rating : null,
      consent,
      avatarUrl,
      website,
    });

    if (insertError) {
      setError(insertError);
      setLoading(false);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2E9E6B]/10">
          <svg
            className="h-6 w-6 text-[#2E9E6B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p
          className="text-lg font-semibold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {form.thank_you_message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot field — hidden from real users, bots tend to fill it in */}
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

      {/* Photo upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1A1A1A]">
          Your photo{" "}
          <span className="font-normal text-[#6B6B6B]">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Preview"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-[#ECE7E0]"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF8F5] ring-2 ring-[#ECE7E0]">
              <svg
                className="h-6 w-6 text-[#D9D3CB]"
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
          )}
          <label className="cursor-pointer rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#E8743B]/40">
            {avatarPreview ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          {avatarPreview && (
            <button
              type="button"
              onClick={() => {
                setAvatarFile(null);
                setAvatarPreview(null);
              }}
              className="text-xs text-[#6B6B6B] hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-[#6B6B6B]">JPEG or PNG, max 2MB</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="author_name"
          className="text-sm font-medium text-[#1A1A1A]"
        >
          Your name <span className="text-red-500">*</span>
        </label>
        <input
          id="author_name"
          type="text"
          required
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Jane Smith"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="author_role"
          className="text-sm font-medium text-[#1A1A1A]"
        >
          Your role{" "}
          <span className="font-normal text-[#6B6B6B]">(optional)</span>
        </label>
        <input
          id="author_role"
          type="text"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          placeholder="CEO at Acme Corp"
          className={inputClass}
        />
      </div>

      {form.collect_rating && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[#1A1A1A]">
            Rating <span className="text-red-500">*</span>
          </span>
          <StarRating value={rating} onChange={setRating} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium text-[#1A1A1A]">
          Your testimonial <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          required
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {form.require_consent && (
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#ECE7E0] accent-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/40"
          />
          <span className="text-sm text-[#6B6B6B]">
            I consent to having my testimonial displayed publicly.
          </span>
        </label>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor:
            !form.theme_color || form.theme_color === "#000000"
              ? "#E8743B"
              : form.theme_color,
        }}
        className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all hover:brightness-90 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8743B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit testimonial"}
      </button>
    </form>
  );
}
