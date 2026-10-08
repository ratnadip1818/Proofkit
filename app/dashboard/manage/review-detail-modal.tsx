"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Star,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Copy,
  Plus,
  Sparkles,
  Tag as TagIcon,
  Clock,
} from "lucide-react";
import type { Testimonial, FormInfo } from "./manage-workspace-client";

interface ReviewDetailModalProps {
  review: Testimonial;
  allReviews: Testimonial[];
  forms: FormInfo[];
  onClose: () => void;
  onSelectReview: (id: string) => void;
  onApprove: (id: string) => Promise<void>;
  onHide: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    updated: {
      author_name?: string;
      author_role?: string | null;
      author_company?: string | null;
      display_body?: string;
      rating?: number | null;
      status?: "pending" | "approved" | "hidden";
      tags?: string[];
    }
  ) => Promise<void>;
  onUpdateTags: (id: string, tags: string[]) => Promise<void>;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    if (diffMonth < 12) return `${diffMonth} months ago`;
    return `${diffYear} years ago`;
  } catch {
    return "recently";
  }
}

function getAvatarInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ReviewDetailModal({
  review,
  allReviews,
  forms,
  onClose,
  onSelectReview,
  onApprove,
  onHide,
  onDelete,
  onUpdate,
  onUpdateTags,
}: ReviewDetailModalProps) {
  // Navigation indices for browsing reviews closely
  const currentIndex = allReviews.findIndex((r) => r.id === review.id);
  const prevReview = currentIndex > 0 ? allReviews[currentIndex - 1] : null;
  const nextReview = currentIndex < allReviews.length - 1 ? allReviews[currentIndex + 1] : null;

  // View / Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [displayVersion, setDisplayVersion] = useState<"current" | "original">("current");
  const [authorName, setAuthorName] = useState(review.author_name);
  const [authorRole, setAuthorRole] = useState(review.author_role || "");
  const [authorCompany, setAuthorCompany] = useState(review.author_company || "");
  const [reviewBody, setReviewBody] = useState(review.display_body ?? review.body_original);
  const [rating, setRating] = useState(review.rating || 5);
  const [isSaving, setIsSaving] = useState(false);

  // Tags inline popover state
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const tagPopoverRef = useRef<HTMLDivElement>(null);

  // Copy thank you notification state
  const [copiedThankYou, setCopiedThankYou] = useState(false);

  // Synchronize when the active review changes (e.g. via prev/next arrows)
  useEffect(() => {
    setAuthorName(review.author_name);
    setAuthorRole(review.author_role || "");
    setAuthorCompany(review.author_company || "");
    setReviewBody(review.display_body ?? review.body_original);
    setRating(review.rating || 5);
    setIsEditing(false);
    setDisplayVersion("current");
    setIsTagPopoverOpen(false);
    setCopiedThankYou(false);
  }, [review]);

  // Click outside listener for tags dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagPopoverRef.current && !tagPopoverRef.current.contains(event.target as Node)) {
        setIsTagPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to flick through reviews
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditing) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && prevReview) {
        onSelectReview(prevReview.id);
      } else if (e.key === "ArrowRight" && nextReview) {
        onSelectReview(nextReview.id);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, prevReview, nextReview, onClose, onSelectReview]);

  const initials = getAvatarInitials(authorName || "A");
  const matchedForm = forms.find((f) => f.id === review.form_id);
  const formHeadline = matchedForm?.headline || "Proofkit Form";

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(review.id, {
        author_name: authorName,
        author_role: authorRole || null,
        author_company: authorCompany || null,
        display_body: reviewBody,
        rating,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Tag
  const handleAddTag = async () => {
    const clean = newTagInput.trim().toLowerCase();
    if (!clean) return;
    const existing = review.tags || [];
    if (!existing.includes(clean)) {
      const nextTags = [...existing, clean];
      await onUpdateTags(review.id, nextTags);
    }
    setNewTagInput("");
    setIsTagPopoverOpen(false);
  };

  // Handle Remove Tag
  const handleRemoveTag = async (tagToRemove: string) => {
    const existing = review.tags || [];
    const nextTags = existing.filter((t) => t !== tagToRemove);
    await onUpdateTags(review.id, nextTags);
  };

  // Copy Thank You message
  const handleCopyThankYou = () => {
    const firstName = review.author_name ? review.author_name.split(" ")[0] : "there";
    const msg = `Hey ${firstName}, thank you so much for your review! It means the world to our team. Glad to have you with us!`;
    navigator.clipboard.writeText(msg);
    setCopiedThankYou(true);

    const existing = review.tags || [];
    if (!existing.includes("thanked")) {
      onUpdateTags(review.id, [...existing, "thanked"]);
    }
    setTimeout(() => setCopiedThankYou(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E3E0DB] p-5 sm:p-6 space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================================= */}
        {/* 1. MODAL HEADER: Customer Identity + Prev/Next + Status Badge + Close   */}
        {/* ======================================================================= */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E0DB]/70">
          {/* Author info */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] font-bold text-xs flex items-center justify-center border border-blue-100 shrink-0">
              {review.avatar_url ? (
                <img
                  src={review.avatar_url}
                  alt={authorName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-[#1A1A1A] truncate leading-tight">
                {authorName || "Anonymous Customer"}
              </h3>
              <p className="text-xs text-[#787774] truncate leading-tight mt-0.5">
                {authorRole || (authorCompany ? `@ ${authorCompany}` : "Customer")}
                {authorRole && authorCompany ? ` @ ${authorCompany}` : ""}
              </p>
            </div>
          </div>

          {/* Right controls: Prev / Next + Status Badge + Close */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Prev / Next buttons to browse reviews closely */}
            {allReviews.length > 1 && (
              <div className="flex items-center border border-[#E3E0DB] rounded-lg p-0.5 bg-white">
                <button
                  type="button"
                  onClick={() => prevReview && onSelectReview(prevReview.id)}
                  disabled={!prevReview}
                  className={`p-1 rounded transition-colors ${
                    prevReview
                      ? "hover:bg-[#FAF9F7] text-[#1A1A1A] cursor-pointer"
                      : "opacity-25 cursor-not-allowed text-[#787774]"
                  }`}
                  title="Previous review (←)"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-[#E3E0DB]" />
                <button
                  type="button"
                  onClick={() => nextReview && onSelectReview(nextReview.id)}
                  disabled={!nextReview}
                  className={`p-1 rounded transition-colors ${
                    nextReview
                      ? "hover:bg-[#FAF9F7] text-[#1A1A1A] cursor-pointer"
                      : "opacity-25 cursor-not-allowed text-[#787774]"
                  }`}
                  title="Next review (→)"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Status Pill in ProofKit palette */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                review.status === "approved"
                  ? "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
                  : review.status === "pending"
                  ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                  : "bg-gray-100 text-[#787774] border-gray-200"
              }`}
            >
              {review.status === "approved"
                ? "Approved"
                : review.status === "pending"
                ? "Unapproved"
                : "Archived"}
            </span>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#787774] hover:text-[#1A1A1A] hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. REVIEW METADATA LINE: 5 Stars + Collection Source & Time             */}
        {/* ======================================================================= */}
        <div className="flex items-center justify-between text-xs text-[#787774]">
          {/* 5 Amber Stars (Editable in edit mode) */}
          <div className="flex items-center space-x-1 text-[#F59E0B]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={!isEditing}
                onClick={() => isEditing && setRating(star)}
                className={isEditing ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= rating
                      ? "fill-[#F59E0B] text-[#F59E0B]"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 text-[11px]">
            <Clock className="w-3 h-3 text-[#787774]" />
            <span>{formatRelativeTime(review.created_at)}</span>
            <span>•</span>
            <span className="capitalize">{review.source || "Form"}</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. THE REVIEW STORY (Clean, Compact, Focused closely on content)        */}
        {/* ======================================================================= */}
        {isEditing ? (
          /* Inline Edit Form */
          <div className="space-y-3 p-3 bg-[#FAF9F7] rounded-xl border border-[#E3E0DB] text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#1A1A1A] block mb-1">
                Testimonial Body
              </label>
              <textarea
                rows={3}
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E3E0DB] rounded-lg text-xs text-[#1A1A1A] outline-none focus:border-[#2563EB] leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-[#787774] block mb-0.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E3E0DB] rounded-lg text-xs outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#787774] block mb-0.5">
                  Role / Company
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Founder at Acme"
                  className="w-full p-2 bg-white border border-[#E3E0DB] rounded-lg text-xs outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthorName(review.author_name);
                  setAuthorRole(review.author_role || "");
                  setAuthorCompany(review.author_company || "");
                  setReviewBody(review.display_body ?? review.body_original);
                  setRating(review.rating || 5);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#787774] hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          /* Close Inspection Box */
          <div className="space-y-3">
            {/* Prompt Headline & AI Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">
                Customer Testimonial
              </span>

              {review.body_improved && (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setDisplayVersion("original")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      displayVersion === "original"
                        ? "bg-gray-100 text-[#1A1A1A] font-semibold"
                        : "text-[#787774] hover:text-[#1A1A1A]"
                    }`}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayVersion("current")}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                      displayVersion === "current"
                        ? "bg-blue-50 text-[#2563EB] border border-blue-200"
                        : "text-[#787774] hover:text-[#1A1A1A]"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#2563EB]" />
                    <span>AI Polish</span>
                  </button>
                </div>
              )}
            </div>

            {/* Testimonial Quote Box in clean Proofkit styling */}
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-[#E3E0DB]">
              <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line font-normal">
                {displayVersion === "original"
                  ? review.body_original
                  : review.display_body ?? review.body_original}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* 4. TAGS LIST & ADD TAG INLINE POPOVER                                   */}
        {/* ======================================================================= */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(review.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white border border-[#E3E0DB] text-[11px] font-medium text-[#1A1A1A] rounded-md flex items-center space-x-1"
            >
              <TagIcon className="w-3 h-3 text-[#787774]" />
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-[#787774] hover:text-red-600 cursor-pointer ml-0.5"
                title="Remove tag"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}

          {/* Inline Add Tag Popover */}
          <div className="relative" ref={tagPopoverRef}>
            <button
              type="button"
              onClick={() => setIsTagPopoverOpen(!isTagPopoverOpen)}
              className="px-2 py-0.5 border border-dashed border-[#E3E0DB] hover:border-[#2563EB] text-[11px] font-medium text-[#787774] hover:text-[#2563EB] rounded-md flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add tag</span>
            </button>

            {isTagPopoverOpen && (
              <div className="absolute left-0 bottom-full mb-1 w-48 bg-white border border-[#E3E0DB] rounded-xl shadow-xl p-2 z-40 space-y-1.5 text-xs animate-fade-in">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Tag name..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                  }}
                  className="w-full px-2 py-1 text-xs border border-[#2563EB] rounded-lg outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="w-full py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-semibold text-xs cursor-pointer text-center"
                >
                  Apply Tag
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 5. BOTTOM ACTION BAR: Approve, Thank You, Edit, Delete                   */}
        {/* ======================================================================= */}
        <div className="pt-3 border-t border-[#E3E0DB]/70 flex items-center justify-between">
          {/* Left: Approve toggle & Thank customer */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                review.status === "approved" ? onHide(review.id) : onApprove(review.id)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1 ${
                review.status === "approved"
                  ? "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] hover:bg-emerald-100"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs"
              }`}
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>{review.status === "approved" ? "Approved" : "Approve"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyThankYou}
              className="px-3 py-1.5 bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              title="Copy personalized founder thank-you note"
            >
              {copiedThankYou ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Thank Customer</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Edit toggle & Delete */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 text-xs font-medium text-[#787774] hover:text-[#1A1A1A] hover:bg-gray-100 rounded-lg cursor-pointer flex items-center space-x-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Done" : "Edit"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Permanently delete this testimonial?")) {
                  onDelete(review.id);
                  onClose();
                }
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
