"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil, Copy, Check } from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "./actions";

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  rating: number | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
  avatar_url: string | null;
};

type Tab = "all" | "pending" | "approved" | "hidden";

const TABS: { key: Tab; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "hidden",   label: "Hidden"   },
];

const STATUS_BADGE: Record<Tab, { label: string; cls: string }> = {
  all: { label: "", cls: "" },
  pending:  { label: "Pending",  cls: "bg-amber-50  text-amber-700  ring-1 ring-inset ring-amber-500/25"  },
  approved: { label: "Approved", cls: "bg-green-50  text-green-700  ring-1 ring-inset ring-green-500/25"  },
  hidden:   { label: "Hidden",   cls: "bg-[#FAF8F5] text-[#6B6B6B] ring-1 ring-inset ring-[#ECE7E0]"     },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 leading-none" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-amber-400" : "text-[#ECE7E0]"}>
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-sm font-bold text-[#E8743B]"
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8743B] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02]"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

export default function TestimonialsPanel({
  testimonials,
  formUrl,
}: {
  testimonials: Testimonial[];
  formUrl?: string | null;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState<Tab>("all");
  const [pendingId, setPendingId]   = useState<string | null>(null);
  const [searchQuery, setSearch]    = useState("");
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editText, setEditText]     = useState("");

  const counts: Record<Tab, number> = {
    all:      testimonials.length,
    pending:  testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    hidden:   testimonials.filter((t) => t.status === "hidden").length,
  };

  const q = searchQuery.trim().toLowerCase();

  const filtered = testimonials
    .filter((t) => activeTab === "all" || t.status === activeTab)
    .filter(
      (t) =>
        !q ||
        t.author_name.toLowerCase().includes(q) ||
        t.body_original.toLowerCase().includes(q)
    );

  async function runAction(id: string, fn: () => Promise<void>) {
    setPendingId(id);
    try {
      await fn();
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleSaveEdit(id: string) {
    const trimmed = editText.trim();
    if (!trimmed) return;
    await runAction(id, () => updateTestimonial(id, trimmed));
    setEditingId(null);
  }

  /* ── Empty state ──────────────────────────────────────────── */
  function EmptyState() {
    if (q) {
      return (
        <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-[#1A1A1A]">No results</p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            No testimonials match &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      );
    }

    if (activeTab === "all") {
      return (
        <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8743B]/10">
            <svg className="h-5 w-5 text-[#E8743B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1A1A1A]">No testimonials yet</p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Share your collection form link to start gathering feedback.
          </p>
          {formUrl && (
            <div className="mt-5 flex justify-center">
              <CopyButton url={formUrl} />
            </div>
          )}
        </div>
      );
    }

    const labels: Record<Tab, string> = {
      all:      "",
      pending:  "pending",
      approved: "approved",
      hidden:   "hidden",
    };

    return (
      <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-[#1A1A1A]">
          No {labels[activeTab]} testimonials
        </p>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          {activeTab === "pending"  && "New submissions will appear here for review."}
          {activeTab === "approved" && "Approved testimonials show on your public widget."}
          {activeTab === "hidden"   && "Hidden testimonials are removed from your widget."}
        </p>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search size={16} className="text-[#6B6B6B]" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or testimonial text…"
          className="w-full rounded-lg border border-[#ECE7E0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
        />
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Filter testimonials"
        className="mb-5 flex flex-wrap gap-2"
      >
        {TABS.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#E8743B] text-white shadow-sm"
                  : "border border-[#ECE7E0] bg-white text-[#6B6B6B] hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
              }`}
            >
              {label}
              {counts[key] > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#FAF8F5] text-[#6B6B6B]"
                  }`}
                >
                  {counts[key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((t) => {
            const isLoading = pendingId === t.id;
            const isEditing = editingId === t.id;
            const badge     = STATUS_BADGE[t.status];

            return (
              <div
                key={t.id}
                className="group rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm transition-all duration-150 hover:border-[#D9D3CB] hover:shadow-md"
                style={{ opacity: isLoading ? 0.55 : 1 }}
              >
                {/* Card header */}
                <div className="flex items-start gap-4">
                  <Avatar name={t.author_name} avatarUrl={t.avatar_url} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1A1A1A]">
                          {t.author_name}
                        </p>
                        {t.author_role && (
                          <p className="text-sm text-[#6B6B6B]">{t.author_role}</p>
                        )}
                        {t.rating !== null && (
                          <div className="mt-1.5">
                            <Stars rating={t.rating} />
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="text-xs text-[#6B6B6B]">
                          {formatDate(t.created_at)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          autoFocus
                          className="w-full resize-none rounded-lg border border-[#E8743B] px-3 py-2.5 text-sm leading-relaxed text-[#1A1A1A] outline-none ring-2 ring-[#E8743B]/20"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(t.id)}
                            disabled={isLoading || !editText.trim()}
                            className="rounded-lg bg-[#E8743B] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isLoading ? "Saving…" : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-[#ECE7E0] px-3 py-1.5 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#3f3f46]">
                        {t.body_original}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ECE7E0] pt-4">
                  {t.status !== "approved" && (
                    <button
                      disabled={isLoading}
                      onClick={() => runAction(t.id, () => approveTestimonial(t.id))}
                      className="rounded-lg bg-[#2E9E6B] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#268A5C] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {t.status !== "hidden" && (
                    <button
                      disabled={isLoading}
                      onClick={() => runAction(t.id, () => hideTestimonial(t.id))}
                      className="rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                  {!isEditing && (
                    <button
                      disabled={isLoading}
                      onClick={() => { setEditingId(t.id); setEditText(t.body_original); }}
                      className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] px-3 py-1.5 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                  )}
                  <button
                    disabled={isLoading}
                    onClick={() => runAction(t.id, () => deleteTestimonial(t.id))}
                    className="ml-auto rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
