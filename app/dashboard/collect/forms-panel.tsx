"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Trash2,
  ChevronRight,
  Settings2,
  Copy,
  Check,
  MessageSquare,
  Star,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { createForm, deleteForm } from "../actions";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type FormRow = {
  id: string;
  slug: string;
  headline: string | null;
  created_at: string;
  theme_color?: string | null;
  collect_photo?: boolean;
  collect_rating?: boolean;
  require_consent?: boolean;
  testimonials?: { id: string; status: string }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="flex items-center gap-1 rounded-md bg-canvas px-2 py-1 text-[11px] font-bold text-ink-secondary border border-hairline hover:bg-hairline hover:text-ink transition-colors cursor-pointer"
      title="Copy form link"
    >
      {copied ? (
        <>
          <Check size={11} className="text-proof" />
          <span className="text-proof">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={11} />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}

export default function FormsPanel({ forms }: { forms: FormRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createState, createAction, createPending] = useActionState(
    createForm,
    { error: null, done: false }
  );

  useEffect(() => {
    if (createState.done) router.refresh();
  }, [createState.done, router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this form and all its testimonials? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteForm(id);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight text-ink font-display"
          >
            Forms
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Manage your testimonial collection forms.
          </p>
        </div>
        <form action={createAction}>
          {createState.error && (
            <p className="mb-2 text-xs text-red-600">{createState.error}</p>
          )}
          <button
            type="submit"
            disabled={createPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface transition-all hover:bg-accent-hover hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {createPending ? "Creating…" : "Create new form"}
          </button>
        </form>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface px-6 py-16 text-center">
          <p className="text-sm text-ink-secondary">
            No forms yet. Create your first collection form above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => {
            const formUrl = `${APP_URL}/c/${form.slug}`;
            const isDeleting = deletingId === form.id;
            const themeColor = form.theme_color || "#0B54D8";
            
            // Analytics computations
            const testimonialsList = form.testimonials || [];
            const totalCount = testimonialsList.length;
            const approvedCount = testimonialsList.filter((t) => t.status === "approved").length;
            const pendingCount = testimonialsList.filter((t) => t.status === "pending").length;

            return (
              <div
                key={form.id}
                className="relative flex flex-col justify-between rounded-2xl border border-hairline bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ 
                  opacity: isDeleting ? 0.5 : 1,
                  borderTop: `4px solid ${themeColor}`
                }}
              >
                <div>
                  {/* Card Title & Link */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-ink text-base truncate" title={form.headline || "Untitled form"}>
                        {form.headline || "Untitled form"}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-accent font-semibold truncate">
                        /c/{form.slug}
                      </p>
                    </div>
                    <a
                      href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open form"
                      className="rounded-lg border border-hairline p-1.5 text-ink-secondary transition-all hover:border-ink/20 hover:text-ink hover:bg-canvas hover:scale-105"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  {/* Copy Link Trigger */}
                  <div className="mt-3 flex items-center justify-between gap-2 border-b border-canvas pb-3">
                    <p className="text-[11px] text-ink-secondary/70 flex items-center gap-1">
                      Created {formatDate(form.created_at)}
                    </p>
                    <CopyButton url={formUrl} />
                  </div>

                  {/* Config Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {form.collect_rating !== false && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
                        <Star size={9} fill="currentColor" />
                        Rating
                      </span>
                    )}
                    {form.collect_photo !== false && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                        <Camera size={9} />
                        Photo
                      </span>
                    )}
                    {form.require_consent && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-100">
                        <ShieldCheck size={9} />
                        Consent
                      </span>
                    )}
                  </div>

                  {/* Analytics Stats */}
                  <div className="mt-4 rounded-xl bg-canvas border border-hairline p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                        <MessageSquare size={11} className="text-accent" />
                        Submissions
                      </span>
                      <span className="text-sm font-extrabold text-ink">
                        {totalCount}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t border-hairline pt-2 text-[11px]">
                      <div className="flex items-center justify-between rounded bg-surface px-2 py-1 border border-hairline">
                        <span className="text-proof font-semibold">Approved</span>
                        <span className="font-bold text-ink">{approvedCount}</span>
                      </div>
                      <div className="flex items-center justify-between rounded bg-surface px-2 py-1 border border-hairline">
                        <span className="text-amber-600 font-semibold">Pending</span>
                        <span className="font-bold text-ink">{pendingCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between gap-3">
                  <div className="flex-1 flex gap-2">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-canvas border border-hairline px-3 py-1.5 text-xs font-semibold text-ink transition-all hover:bg-hairline"
                    >
                      <span>View reviews</span>
                      <ChevronRight size={12} className="text-ink-secondary" />
                    </Link>
                    <Link
                      href={`/dashboard/forms/${form.id}/edit`}
                      className="flex items-center justify-center gap-1 rounded-lg bg-canvas border border-hairline px-3 py-1.5 text-xs font-semibold text-ink transition-all hover:bg-hairline"
                      title="Customize Form"
                    >
                      <Settings2 size={12} className="text-ink-secondary" />
                      <span>Customize</span>
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(form.id)}
                    disabled={isDeleting}
                    title="Delete form"
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
