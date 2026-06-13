"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Copy,
  Check,
  MessageSquare,
  Clock,
  CheckCircle,
  EyeOff,
  Plus,
  X,
  Tag,
} from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
  improveTestimonial,
  acceptImprovement,
  revertImprovement,
  updateTestimonialTags,
} from "./actions";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import PaddleCheckout from "@/components/PaddleCheckout";

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  body_improved: string | null;
  display_body: string | null;
  is_ai_improved: boolean;
  show_edited_badge: boolean;
  rating: number | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
  avatar_url: string | null;
  tags: string[] | null;
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

const STATUS_ICON: Record<Exclude<Tab, "all">, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle,
  hidden: EyeOff,
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
        className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[#ECE7E0]"
      />
    );
  }
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-base font-bold text-[#E8743B]"
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
  isLifetime = true,
  email,
}: {
  testimonials: Testimonial[];
  formUrl?: string | null;
  isLifetime?: boolean;
  email?: string;
}) {
  const router = useRouter();
  const [items, setItems]           = useState<Testimonial[]>(testimonials);
  const [activeTab, setActiveTab]   = useState<Tab>("all");
  const [pendingId, setPendingId]   = useState<string | null>(null);
  const [searchQuery, setSearch]    = useState("");
  const [improvingId, setImprovingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<
    Record<string, { original: string; improved: string }>
  >({});
  const [improveErrors, setImproveErrors] = useState<Record<string, string>>({});

  const [activeTagInputId, setActiveTagInputId] = useState<string | null>(null);
  const [newTagText, setNewTagText] = useState("");

  async function handleRemoveTag(testimonialId: string, tagToRemove: string) {
    const testimonial = items.find((x) => x.id === testimonialId);
    if (!testimonial) return;

    const currentTags = testimonial.tags || [];
    const updatedTags = currentTags.filter((tg) => tg !== tagToRemove);

    // Optimistically update local state
    setItems((prev) =>
      prev.map((x) =>
        x.id === testimonialId ? { ...x, tags: updatedTags } : x
      )
    );

    const res = await updateTestimonialTags(testimonialId, updatedTags);
    if (res.error) {
      // Revert if error
      setItems((prev) =>
        prev.map((x) =>
          x.id === testimonialId ? { ...x, tags: currentTags } : x
        )
      );
    } else {
      router.refresh();
    }
  }

  async function handleSaveTag(testimonialId: string) {
    setActiveTagInputId(null);
    const tag = newTagText.trim().toLowerCase();
    if (!tag) return;

    const testimonial = items.find((x) => x.id === testimonialId);
    if (!testimonial) return;

    const currentTags = testimonial.tags || [];
    if (currentTags.includes(tag)) return;

    const updatedTags = [...currentTags, tag];

    // Optimistically update local state
    setItems((prev) =>
      prev.map((x) =>
        x.id === testimonialId ? { ...x, tags: updatedTags } : x
      )
    );

    const res = await updateTestimonialTags(testimonialId, updatedTags);
    if (res.error) {
      // Revert if error
      setItems((prev) =>
        prev.map((x) =>
          x.id === testimonialId ? { ...x, tags: currentTags } : x
        )
      );
    } else {
      router.refresh();
    }
  }

  // Keep local items in sync with fresh server data after router.refresh()
  useEffect(() => {
    setItems(testimonials);
  }, [testimonials]);

  const counts: Record<Tab, number> = {
    all:      items.length,
    pending:  items.filter((t) => t.status === "pending").length,
    approved: items.filter((t) => t.status === "approved").length,
    hidden:   items.filter((t) => t.status === "hidden").length,
  };

  const q = searchQuery.trim().toLowerCase();

  const filtered = items
    .filter((t) => activeTab === "all" || t.status === activeTab)
    .filter(
      (t) =>
        !q ||
        t.author_name.toLowerCase().includes(q) ||
        t.body_original.toLowerCase().includes(q)
    );

  // Optimistically update local state for instant feedback, then sync with server
  async function runAction(
    id: string,
    optimisticUpdate: (prev: Testimonial[]) => Testimonial[],
    action: () => Promise<void>
  ) {
    setPendingId(id);
    setItems(optimisticUpdate);
    try {
      await action();
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleImprove(id: string) {
    setImprovingId(id);
    setImproveErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    const result = await improveTestimonial(id);
    if (result.error !== undefined) {
      setImproveErrors((prev) => ({ ...prev, [id]: result.error }));
    } else {
      setImprovements((prev) => ({
        ...prev,
        [id]: { original: result.original, improved: result.improved },
      }));
      setItems((prev) =>
        prev.map((x) =>
          x.id === id
            ? { ...x, is_ai_improved: true, body_improved: result.improved }
            : x
        )
      );
    }
    setImprovingId(null);
  }

  async function handleAccept(id: string) {
    const improvement = improvements[id];
    if (!improvement) return;
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, display_body: improvement.improved, show_edited_badge: true }
          : x
      )
    );
    setImprovements((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await acceptImprovement(id);
    router.refresh();
  }

  async function handleRevert(id: string) {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, display_body: x.body_original, show_edited_badge: false }
          : x
      )
    );
    setImprovements((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await revertImprovement(id);
    router.refresh();
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
            <MessageSquare size={20} className="text-[#E8743B]" />
          </div>
          <p className="text-sm font-semibold text-[#1A1A1A]">No testimonials yet</p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Share your collection form link to get started.
          </p>
          {formUrl && (
            <div className="mt-5 flex justify-center">
              <CopyButton url={formUrl} />
            </div>
          )}
        </div>
      );
    }

    const COPY: Record<Exclude<Tab, "all">, string> = {
      pending:  "New submissions will appear here.",
      approved: "Approve testimonials to display them on your site.",
      hidden:   "Hidden testimonials won't show on your widget.",
    };

    const Icon = STATUS_ICON[activeTab];

    return (
      <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F5]">
          <Icon size={20} className="text-[#6B6B6B]" />
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A]">
          No {activeTab} testimonials yet
        </p>
        <p className="mt-1 text-sm text-[#6B6B6B]">{COPY[activeTab]}</p>
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
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[#FAF8F5] text-[#6B6B6B]"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((t, i) => {
            const isLoading = pendingId === t.id;
            const badge     = STATUS_BADGE[t.status];

            return (
              <BlurFade key={t.id} delay={Math.min(i, 8) * 0.05}>
              <div
                className="group rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#D9D3CB] hover:shadow-md"
                style={{ opacity: isLoading ? 0.55 : 1 }}
              >
                {/* Card header */}
                <div className="flex items-start gap-4">
                  <Avatar name={t.author_name} avatarUrl={t.avatar_url} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-[#1A1A1A]">
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

                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-[#3f3f46]">
                      {t.display_body ?? t.body_original}
                    </p>
                    {t.show_edited_badge && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-[#FFF4EE] px-2.5 py-0.5 text-xs font-medium text-[#E8743B]">
                        edited for clarity
                      </span>
                    )}

                    {/* Tags inline manager */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {(t.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] border border-[#ECE7E0] pl-2.5 pr-1.5 py-0.5 text-xs font-medium text-[#6B6B6B]"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t.id, tag)}
                            className="rounded-full p-0.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                            title={`Remove tag ${tag}`}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      
                      {activeTagInputId === t.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveTag(t.id);
                          }}
                          className="inline-flex items-center"
                        >
                          <input
                            type="text"
                            placeholder="new tag..."
                            value={newTagText}
                            onChange={(e) => setNewTagText(e.target.value)}
                            onBlur={() => handleSaveTag(t.id)}
                            autoFocus
                            className="rounded-full px-2.5 py-0.5 text-xs border border-[#E8743B] bg-white outline-none w-20 text-[#1A1A1A]"
                          />
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTagInputId(t.id);
                            setNewTagText("");
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#ECE7E0] px-2.5 py-0.5 text-xs font-medium text-[#9CA3AF] hover:border-[#E8743B] hover:text-[#E8743B] transition-colors"
                        >
                          <Plus size={10} />
                          tag
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ECE7E0] pt-4">
                  {t.status !== "approved" && (
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        runAction(
                          t.id,
                          (prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, status: "approved" } : x
                            ),
                          () => approveTestimonial(t.id)
                        )
                      }
                      className="rounded-full bg-[#E8743B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CF5F2C] hover:scale-105 hover:shadow active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {t.status !== "hidden" && (
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        runAction(
                          t.id,
                          (prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, status: "hidden" } : x
                            ),
                          () => hideTestimonial(t.id)
                        )
                      }
                      className="rounded-full border border-[#ECE7E0] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-medium text-[#6B6B6B] transition-all duration-200 hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                  {isLifetime ? (
                    <ShimmerButton
                      disabled={isLoading || improvingId === t.id}
                      onClick={() => handleImprove(t.id)}
                      title="AI fixes grammar only — never changes meaning"
                      shimmerColor="rgba(232,116,59,0.35)"
                      className="rounded-full border border-[#E8743B] px-3.5 py-1.5 text-xs font-semibold text-[#E8743B] transition-all duration-200 hover:bg-[#FFF4EE] hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {improvingId === t.id ? "Improving…" : "✨ Improve"}
                    </ShimmerButton>
                  ) : (
                    <PaddleCheckout
                      email={email}
                      className="flex items-center gap-1.5 rounded-full border border-[#E8743B]/50 px-3.5 py-1.5 text-xs font-semibold text-[#E8743B] transition-all duration-200 hover:bg-[#FFF4EE] hover:scale-105 active:scale-95"
                    >
                      ✨ Improve
                      <span className="rounded-full bg-[#E8743B]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                        Pro
                      </span>
                    </PaddleCheckout>
                  )}
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      // Two-step confirm: first click arms, second click deletes
                      if (confirmDeleteId !== t.id) {
                        setConfirmDeleteId(t.id);
                        setTimeout(
                          () =>
                            setConfirmDeleteId((cur) =>
                              cur === t.id ? null : cur
                            ),
                          3000
                        );
                        return;
                      }
                      setConfirmDeleteId(null);
                      runAction(
                        t.id,
                        (prev) => prev.filter((x) => x.id !== t.id),
                        () => deleteTestimonial(t.id)
                      );
                    }}
                    className={`ml-auto rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                      confirmDeleteId === t.id
                        ? "bg-red-500 font-semibold text-white hover:bg-red-600"
                        : "border border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50"
                    }`}
                  >
                    {confirmDeleteId === t.id ? "Confirm delete?" : "Delete"}
                  </button>
                </div>

                {improveErrors[t.id] && (
                  <p className="mt-3 text-xs text-red-500">{improveErrors[t.id]}</p>
                )}

                {improvements[t.id] && (
                  <div className="mt-4 border-t border-[#ECE7E0] pt-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-[#FAF8F5] p-3">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">
                          Original
                        </p>
                        <p className="text-sm leading-relaxed text-[#3f3f46]">
                          {improvements[t.id].original}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#FFF4EE] p-3">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#E8743B]">
                          Improved ✨
                        </p>
                        <p className="text-sm leading-relaxed text-[#1A1A1A]">
                          {improvements[t.id].improved}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAccept(t.id)}
                        className="rounded-lg bg-[#E8743B] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#CF5F2C]"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRevert(t.id)}
                        className="rounded-lg border border-[#ECE7E0] px-3 py-1.5 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                      >
                        Revert
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </BlurFade>
            );
          })
        )}
      </div>
    </div>
  );
}
