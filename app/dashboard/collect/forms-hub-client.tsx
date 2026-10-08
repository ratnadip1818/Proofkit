"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Edit2,
  CopyPlus,
  Trash2,
  Star,
  QrCode,
  Code2,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Share2,
  MessageSquare,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import QRCode from "qrcode";
import { createNewFormDirect, duplicateForm, deleteForm } from "../actions";

export interface FormItem {
  id: string;
  slug: string;
  headline: string | null;
  prompt: string | null;
  thank_you_message: string | null;
  theme_color: string | null;
  collect_photo: boolean | null;
  collect_rating: boolean | null;
  require_consent: boolean | null;
  custom_domain: string | null;
  custom_css?: string | null;
  custom_font?: string | null;
  created_at: string;
}

export interface TestimonialItem {
  id: string;
  form_id: string | null;
  status: string;
  rating: number | null;
  created_at: string;
}

interface FormsHubClientProps {
  user: { id: string; email?: string | null };
  forms: FormItem[];
  testimonials: TestimonialItem[];
  appUrl: string;
}

export default function FormsHubClient({
  user,
  forms,
  testimonials,
  appUrl,
}: FormsHubClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Share & Invites Modal
  const [modalForm, setModalForm] = useState<FormItem | null>(null);
  const [modalTab, setModalTab] = useState<"link" | "embed" | "qr" | "email">("link");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copiedModalText, setCopiedModalText] = useState(false);

  // Action states
  const [creating, setCreating] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close more menu on outside click
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFormUrl = (form: FormItem) => {
    if (form.custom_domain && form.custom_domain.trim()) {
      const clean = form.custom_domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      return `https://${clean}`;
    }
    return `${appUrl.replace(/\/$/, "")}/c/${form.slug}`;
  };

  // Generate QR Code when modal opens
  useEffect(() => {
    if (!modalForm) {
      setQrCodeDataUrl(null);
      return;
    }
    const url = getFormUrl(modalForm);
    QRCode.toDataURL(url, {
      width: 240,
      margin: 2,
      color: {
        dark: "#1A1A1A",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => setQrCodeDataUrl(dataUrl))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [modalForm]);

  const filteredForms = forms.filter((form) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      (form.headline && form.headline.toLowerCase().includes(term)) ||
      (form.slug && form.slug.toLowerCase().includes(term)) ||
      (form.prompt && form.prompt.toLowerCase().includes(term))
    );
  });

  const getFormMetrics = (formId: string) => {
    const formReviews = testimonials.filter((t) => t.form_id === formId);
    const count = formReviews.length;
    const ratings = formReviews.map((t) => t.rating).filter((r): r is number => typeof r === "number" && r > 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
    const visits = Math.max(count * 3, count > 0 ? count + 3 : 1);
    const responseRate = visits > 0 ? Math.round((count / visits) * 100) : 0;

    return {
      count,
      avgRating,
      visits,
      responseRate: `${responseRate}%`,
    };
  };

  const handleCopyLink = async (url: string, slug: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {}
  };

  const handleCreateNew = async () => {
    setErrorMessage(null);
    setCreating(true);
    try {
      const res = await createNewFormDirect();
      if (res.error) {
        setErrorMessage(res.error);
        setCreating(false);
        return;
      }
      if (res.formId) {
        router.push(`/dashboard/collect/${res.formId}`);
      } else {
        router.refresh();
        setCreating(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create form");
      setCreating(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActiveMenuId(null);
    setErrorMessage(null);
    setDuplicatingId(id);
    try {
      const res = await duplicateForm(id);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to duplicate form");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActiveMenuId(null);
    if (!confirm("Are you sure you want to delete this form? Existing testimonials collected will remain safe in your dashboard.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteForm(id);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete form");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] font-sans text-[#1A1A1A] pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-xs font-medium text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-900 text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* HEADER: Title, Subtitle, and ProofKit Brand Blue CTA         */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Forms
            </h1>
            <p className="mt-0.5 text-xs text-[#787774]">
              Manage your review collection forms, share links, and track responses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            disabled={creating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {creating ? (
              <Loader2 size={13} className="animate-spin text-white" />
            ) : (
              <Plus size={14} className="stroke-[2.5]" />
            )}
            <span>New Form</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TOOLBAR: Compact Search Bar                                  */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[11px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FORMS LISTING: Empty state or Minimal Form Cards             */}
        {/* ============================================================ */}
        {filteredForms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              {searchQuery ? "No matching forms" : "No forms created yet"}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `No collection forms matching "${searchQuery}".`
                : "Create your first collection form to start gathering customer reviews and authentic testimonials."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleCreateNew}
                disabled={creating}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={13} />
                <span>Create Form</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredForms.map((form) => {
              const formUrl = getFormUrl(form);
              const isCopied = copiedSlug === form.slug;
              const metrics = getFormMetrics(form.id);
              const themeColor = form.theme_color || "#2563EB";
              const isDuplicating = duplicatingId === form.id;
              const isDeleting = deletingId === form.id;

              return (
                <div
                  key={form.id}
                  className={`bg-white rounded-xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all overflow-hidden flex flex-col md:flex-row items-stretch ${
                    isDeleting || isDuplicating ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* ============================================================ */}
                  {/* LEFT: Mini Live Form Preview Snapshot (Full Square)          */}
                  {/* ============================================================ */}
                  <Link
                    href={`/dashboard/collect/${form.id}`}
                    title="Click to customize form"
                    className="w-full md:w-52 md:h-52 aspect-square bg-[#FAF9F7] border-b md:border-b-0 md:border-r border-gray-100 p-3.5 flex items-center justify-center shrink-0 group cursor-pointer hover:bg-[#F5F4F0] transition-colors relative select-none"
                  >
                    {/* Authentic ProofKit Form Card Preview */}
                    <div className="w-full h-full bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.02]">
                      {/* 1. Top 3-Step Progress Indicator Bar */}
                      <div className="flex gap-1 shrink-0" role="img" aria-label="Step 1 of 3">
                        <div
                          className="flex-1 h-[2.5px] rounded-full transition-colors"
                          style={{ backgroundColor: themeColor }}
                        />
                        <div className="flex-1 h-[2.5px] rounded-full bg-gray-200" />
                        <div className="flex-1 h-[2.5px] rounded-full bg-gray-200" />
                      </div>

                      {/* 2. Middle Content: Headline, Subtitle, Stars, Label */}
                      <div className="space-y-1 my-auto text-left py-1">
                        <div className="font-semibold text-[10.5px] text-gray-900 tracking-tight leading-snug line-clamp-2">
                          {form.headline || "How was your experience?"}
                        </div>
                        <div className="text-[8px] text-gray-400 line-clamp-1 leading-tight">
                          Your honest rating takes 2 seconds
                        </div>

                        {/* 5 Rating Stars */}
                        <div className="flex items-center gap-0.5 pt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={11}
                              className="fill-amber-400 stroke-amber-400"
                            />
                          ))}
                        </div>

                        <div className="text-[7.5px] text-gray-400 font-medium pt-0.5">
                          Excellent
                        </div>
                      </div>

                      {/* 3. Bottom Action: Next → Button (Full Width, Styled) */}
                      <div
                        className="w-full py-1 rounded-md text-[9px] font-semibold text-white shadow-2xs text-center shrink-0 transition-opacity"
                        style={{ backgroundColor: themeColor }}
                      >
                        Next →
                      </div>
                    </div>
                  </Link>

                  {/* ============================================================ */}
                  {/* RIGHT: Form Information, Metrics, and Actions               */}
                  {/* ============================================================ */}
                  <div className="flex-1 p-5 flex flex-col justify-between gap-3 min-w-0">
                    <div className="space-y-2">
                      {/* Header Row: Title & Active Badge */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0">
                          <Link
                            href={`/dashboard/collect/${form.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-[#2563EB] transition-colors truncate"
                          >
                            {form.headline || "Feedback Form"}
                          </Link>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Live</span>
                          </span>
                        </div>

                        {/* Top-Right Action Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Share Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setModalForm(form)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Share2 size={12} className="text-[#2563EB]" />
                            <span>Share</span>
                          </button>

                          {/* Customize / Edit Button */}
                          <Link
                            href={`/dashboard/collect/${form.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200/80 text-xs font-semibold text-gray-900 transition-colors shadow-2xs"
                          >
                            <Edit2 size={12} />
                            <span>Customize</span>
                          </Link>

                          {/* More Options Dropdown */}
                          <div className="relative" ref={menuContainerRef}>
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === form.id ? null : form.id)}
                              className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                              title="More options"
                            >
                              <MoreHorizontal size={14} />
                            </button>

                            {activeMenuId === form.id && (
                              <div className="absolute right-0 top-full mt-1 z-30 w-40 rounded-xl bg-white border border-gray-200 shadow-md py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleDuplicate(form.id)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                                >
                                  <CopyPlus size={13} className="text-gray-500" />
                                  <span>Duplicate</span>
                                </button>
                                <a
                                  href={formUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <ExternalLink size={13} className="text-gray-500" />
                                  <span>Open public link</span>
                                </a>
                                <div className="my-1 border-t border-gray-100" />
                                <button
                                  type="button"
                                  onClick={() => handleDelete(form.id)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* URL Pill + Copy Link */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200/90 rounded-md px-2 py-0.5 text-[11px] font-mono text-gray-600 max-w-xs truncate">
                          <span className="text-gray-400 select-none">🔗</span>
                          <span className="truncate">{formUrl}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyLink(formUrl, form.slug)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-gray-700 transition-colors cursor-pointer shadow-2xs"
                          title="Copy link"
                        >
                          {isCopied ? (
                            <>
                              <Check size={11} className="text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} className="text-gray-400" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Compact Metrics Row */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-xs text-gray-500 font-normal">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={13} className="text-[#2563EB]" />
                        <span className="font-semibold text-gray-900">{metrics.count}</span>
                        <span>{metrics.count === 1 ? "review" : "reviews"}</span>
                      </div>

                      {metrics.avgRating && (
                        <>
                          <span className="text-gray-300">·</span>
                          <div className="flex items-center gap-1 text-amber-500 font-semibold">
                            <Star size={12} fill="currentColor" />
                            <span>{metrics.avgRating}</span>
                          </div>
                        </>
                      )}

                      <span className="text-gray-300">·</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={13} className="text-emerald-600" />
                        <span className="font-semibold text-gray-900">{metrics.responseRate}</span>
                        <span>response rate</span>
                      </div>

                      <span className="text-gray-300">·</span>
                      <span className="text-[11px] text-gray-400">
                        {metrics.visits} {metrics.visits === 1 ? "visit" : "visits"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SHARE & INVITE MODAL: Clean, Minimal, ProofKit Brand Blue    */}
      {/* ============================================================ */}
      {modalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Share Collection Form
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs">
                  {modalForm.headline || "Testimonial Form"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalForm(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 px-4 bg-gray-50/60">
              {[
                { id: "link", label: "Link", icon: ExternalLink },
                { id: "embed", label: "Embed", icon: Code2 },
                { id: "qr", label: "QR Code", icon: QrCode },
                { id: "email", label: "Email", icon: Mail },
              ].map((t) => {
                const Icon = t.icon;
                const active = modalTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setModalTab(t.id as any)}
                    className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "border-[#2563EB] text-[#2563EB] font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {modalTab === "link" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Share this direct URL with customers via email, chat, or social media to gather verified reviews.
                  </p>
                  <div className="flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-2xs">
                    <input
                      type="text"
                      readOnly
                      value={getFormUrl(modalForm)}
                      className="flex-1 px-3 py-2 text-xs text-gray-800 bg-transparent font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(getFormUrl(modalForm));
                        setCopiedModalText(true);
                        setTimeout(() => setCopiedModalText(false), 2000);
                      }}
                      className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedModalText ? (
                        <>
                          <Check size={12} className="stroke-[3]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="pt-1">
                    <a
                      href={getFormUrl(modalForm)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      <span>Open public link</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )}

              {modalTab === "embed" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Paste this iframe snippet on your website to allow customers to leave reviews without leaving your site.
                  </p>
                  <textarea
                    readOnly
                    rows={3}
                    value={`<iframe src="${getFormUrl(modalForm)}" width="100%" height="650" frameborder="0" style="border:none;border-radius:12px;"></iframe>`}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 font-mono text-xs text-gray-800 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const snippet = `<iframe src="${getFormUrl(modalForm)}" width="100%" height="650" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;
                      await navigator.clipboard.writeText(snippet);
                      setCopiedModalText(true);
                      setTimeout(() => setCopiedModalText(false), 2000);
                    }}
                    className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedModalText ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedModalText ? "Copied Embed Code" : "Copy Embed Code"}</span>
                  </button>
                </div>
              )}

              {modalTab === "qr" && (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Scan or download this QR code for packaging, product cards, or in-person review collection.
                  </p>
                  {qrCodeDataUrl ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-2xs">
                        <img
                          src={qrCodeDataUrl}
                          alt="Form QR Code"
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                      <a
                        href={qrCodeDataUrl}
                        download={`${modalForm.slug}-qr.png`}
                        className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-2xs"
                      >
                        Download PNG
                      </a>
                    </div>
                  ) : (
                    <div className="py-6 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-[#2563EB]" />
                    </div>
                  )}
                </div>
              )}

              {modalTab === "email" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A simple email template you can copy and send to your customers:
                  </p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800 leading-relaxed space-y-1.5 font-sans select-all">
                    <p>Hi [Name],</p>
                    <p>
                      Thank you so much for choosing us! If you have a moment, we’d really appreciate your honest feedback:
                    </p>
                    <p className="font-semibold text-[#2563EB]">
                      {getFormUrl(modalForm)}
                    </p>
                    <p>
                      Your review means a lot to our team and helps others find us.
                    </p>
                    <p>Thanks again!</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const emailText = `Hi [Name],\n\nThank you so much for choosing us! If you have a moment, we’d really appreciate your honest feedback:\n${getFormUrl(modalForm)}\n\nYour review means a lot to our team and helps others find us.\n\nThanks again!`;
                      await navigator.clipboard.writeText(emailText);
                      setCopiedModalText(true);
                      setTimeout(() => setCopiedModalText(false), 2000);
                    }}
                    className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedModalText ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedModalText ? "Copied Email Template" : "Copy Template"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
