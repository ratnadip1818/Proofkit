"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
} from "./actions";

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  rating: number | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
};

type Tab = "all" | "pending" | "approved" | "hidden";

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "hidden", label: "Hidden" },
];

const STATUS_BADGE: Record<
  Testimonial["status"],
  { label: string; classes: string }
> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/25",
  },
  approved: {
    label: "Approved",
    classes: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-500/25",
  },
  hidden: {
    label: "Hidden",
    classes: "bg-[#FAF8F5] text-[#6B6B6B] ring-1 ring-inset ring-[#ECE7E0]",
  },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5 text-sm leading-none"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-amber-400" : "text-[#ECE7E0]"}>
          ★
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Testimonial["status"] }) {
  const { label, classes } = STATUS_BADGE[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
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

export default function TestimonialsPanel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const counts: Record<Tab, number> = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    hidden: testimonials.filter((t) => t.status === "hidden").length,
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

  async function runAction(id: string, action: () => Promise<void>) {
    setPendingId(id);
    try {
      await action();
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search size={16} className="text-[#6B6B6B]" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or testimonial text..."
          className="w-full rounded-lg border border-[#ECE7E0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
        />
      </div>

      {/* Pill tabs */}
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter testimonials"
      >
        {TAB_LABELS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-[#E8743B] text-white shadow-sm"
                : "border border-[#ECE7E0] bg-white text-[#6B6B6B] hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                  activeTab === key
                    ? "bg-white/25 text-white"
                    : "bg-[#FAF8F5] text-[#6B6B6B]"
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#6B6B6B]">
              {q
                ? "No testimonials match your search."
                : activeTab === "all"
                ? "No testimonials yet. Share your collection form to get started."
                : `No ${activeTab} testimonials.`}
            </p>
          </div>
        ) : (
          filtered.map((t) => {
            const isLoading = pendingId === t.id;
            return (
              <div
                key={t.id}
                className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm transition-opacity"
                style={{ opacity: isLoading ? 0.55 : 1 }}
              >
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <Avatar name={t.author_name} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1A1A1A]">
                          {t.author_name}
                        </p>
                        {t.author_role && (
                          <p className="text-sm text-[#6B6B6B]">
                            {t.author_role}
                          </p>
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
                        <StatusBadge status={t.status} />
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#3f3f46]">
                      {t.body_original}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-2 border-t border-[#ECE7E0] pt-4">
                  {t.status !== "approved" && (
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        runAction(t.id, () => approveTestimonial(t.id))
                      }
                      className="rounded-lg bg-[#2E9E6B] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#268A5C] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {t.status !== "hidden" && (
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        runAction(t.id, () => hideTestimonial(t.id))
                      }
                      className="rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    disabled={isLoading}
                    onClick={() =>
                      runAction(t.id, () => deleteTestimonial(t.id))
                    }
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
