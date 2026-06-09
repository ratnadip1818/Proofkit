"use client";

import { useState } from "react";
import { submitTestimonial } from "./actions";

interface FormRow {
  id: string;
  user_id: string;
  thank_you_message: string;
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
          <span className={(hover || value) >= star ? "text-amber-400" : "text-[#ECE7E0]"}>
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
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (form.collect_rating && rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (form.require_consent && !consent) {
      setError("Please accept the consent checkbox to continue.");
      return;
    }

    setLoading(true);

    const { error: insertError } = await submitTestimonial({
      formId: form.id,
      userId: form.user_id,
      authorName,
      authorRole: authorRole || null,
      body,
      rating: form.collect_rating ? rating : null,
      consent,
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
          {form.thank_you_message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="author_name" className="text-sm font-medium text-[#1A1A1A]">
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
        <label htmlFor="author_role" className="text-sm font-medium text-[#1A1A1A]">
          Your role <span className="font-normal text-[#6B6B6B]">(optional)</span>
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
            className="mt-0.5 h-4 w-4 rounded border-[#ECE7E0] accent-[#E8743B]"
          />
          <span className="text-sm text-[#6B6B6B]">
            I consent to having my testimonial displayed publicly.
          </span>
        </label>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#E8743B] py-3 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit testimonial"}
      </button>
    </form>
  );
}
