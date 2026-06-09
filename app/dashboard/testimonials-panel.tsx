"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const STATUS_STYLES: Record<Testimonial["status"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  approved: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
  hidden: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/20",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-base leading-none">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? "text-amber-400" : "text-zinc-200"}>
          ★
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Testimonial["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
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

  const counts: Record<Tab, number> = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    hidden: testimonials.filter((t) => t.status === "hidden").length,
  };

  const filtered =
    activeTab === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === activeTab);

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
      {/* Tabs */}
      <div className="flex gap-0 border-b border-zinc-200">
        {TAB_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium -mb-px transition-colors ${
              activeTab === key
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                  activeTab === key
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500">
            {activeTab === "all"
              ? "No testimonials yet. Share your collection form to get started."
              : `No ${activeTab} testimonials.`}
          </div>
        ) : (
          filtered.map((t) => {
            const isLoading = pendingId === t.id;
            return (
              <div
                key={t.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 transition-opacity"
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-medium text-zinc-900">
                        {t.author_name}
                      </span>
                      {t.author_role && (
                        <span className="text-sm text-zinc-500">
                          {t.author_role}
                        </span>
                      )}
                    </div>
                    {t.rating !== null && (
                      <div className="mt-1.5">
                        <Stars rating={t.rating} />
                      </div>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      {t.body_original}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusBadge status={t.status} />
                    <span className="text-xs text-zinc-400">
                      {formatDate(t.created_at)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
                  {t.status !== "approved" && (
                    <button
                      disabled={isLoading}
                      onClick={() =>
                        runAction(t.id, () => approveTestimonial(t.id))
                      }
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    disabled={isLoading}
                    onClick={() =>
                      runAction(t.id, () => deleteTestimonial(t.id))
                    }
                    className="ml-auto rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
