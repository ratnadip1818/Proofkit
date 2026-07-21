"use client";

import React, { useState, useRef } from "react";
import { Star, Camera, Lock, CheckCircle } from "lucide-react";
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
}

export default function CollectionForm({ form }: { form: FormRow }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mountTime] = useState(() => Date.now());

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const brandColor = !form.theme_color || form.theme_color === "#000000" ? "#2563EB" : form.theme_color;

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 max-w-lg w-full text-center space-y-5 animate-scale-in">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-xs"
          style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
        >
          <CheckCircle className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Thank you!</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
            {form.thank_you_message || "Your experience has been securely submitted."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 max-w-lg w-full">
      {/* Header */}
      <div className="text-center mb-6 space-y-1">
        <h2 className="text-[20px] font-semibold text-gray-900">
          {form.headline || "Share your experience"}
        </h2>
        {form.prompt && (
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {form.prompt}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field — hidden from real users */}
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

        {/* Star Rating */}
        {form.collect_rating && (
          <div className="flex justify-center">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial */}
        <textarea
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you love? How has it helped you?"
          className="w-full resize-y rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Name + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Full name"
            className="h-11 rounded-lg border border-gray-200 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            placeholder="Role / Company (optional)"
            className="h-11 rounded-lg border border-gray-200 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Photo Upload */}
        {(form.collect_photo ?? true) && (
          <div className="flex items-center gap-3 pt-1">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 flex-shrink-0 rounded-full border border-dashed border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Add a photo</span> (optional)
              </span>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setPhotoPreview(null);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}

        {/* Consent Checkbox */}
        {form.require_consent && (
          <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>I give permission to use this testimonial on your website and marketing materials.</span>
          </label>
        )}

        {/* Error message */}
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="pt-2 space-y-3 text-center">
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: brandColor }}
            className="w-full h-12 rounded-xl text-white text-base font-medium shadow-md shadow-blue-100/50 hover:brightness-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit testimonial"}
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Encrypted · GDPR ready · Never shared</span>
          </div>
        </div>
      </form>
    </div>
  );
}
