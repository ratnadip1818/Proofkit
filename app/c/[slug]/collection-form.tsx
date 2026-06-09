"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
          className="text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
        >
          <span
            className={
              (hover || value) >= star ? "text-amber-400" : "text-zinc-200"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

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
    const supabase = createClient();

    const { error: insertError } = await supabase.from("testimonials").insert({
      user_id: form.user_id,
      form_id: form.id,
      author_name: authorName,
      author_role: authorRole || null,
      body_original: body,
      display_body: body,
      rating: form.collect_rating ? rating : null,
      consent,
      status: "pending",
      source: "form",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-zinc-900">
          {form.thank_you_message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="author_name"
          className="text-sm font-medium text-zinc-700"
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
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="author_role"
          className="text-sm font-medium text-zinc-700"
        >
          Your role{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <input
          id="author_role"
          type="text"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          placeholder="CEO at Acme Corp"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      {form.collect_rating && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700">
            Rating <span className="text-red-500">*</span>
          </span>
          <StarRating value={rating} onChange={setRating} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium text-zinc-700">
          Your testimonial <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          required
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience…"
          className="resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      {form.require_consent && (
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-zinc-900"
          />
          <span className="text-sm text-zinc-600">
            I consent to having my testimonial displayed publicly.
          </span>
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit testimonial"}
      </button>
    </form>
  );
}
