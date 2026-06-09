"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Trash2, ChevronRight } from "lucide-react";
import { createForm, deleteForm } from "../actions";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://proofkit-three.vercel.app";

type FormRow = {
  id: string;
  slug: string;
  headline: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Forms
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
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
            className="rounded-lg bg-[#E8743B] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createPending ? "Creating…" : "Create new form"}
          </button>
        </form>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#6B6B6B]">
            No forms yet. Create your first collection form above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map((form) => {
            const formUrl = `${APP_URL}/c/${form.slug}`;
            const isDeleting = deletingId === form.id;
            return (
              <div
                key={form.id}
                className="rounded-2xl border border-[#ECE7E0] bg-white p-5 shadow-sm transition-opacity"
                style={{ opacity: isDeleting ? 0.5 : 1 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#1A1A1A]">
                      {form.headline || "Untitled form"}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-[#6B6B6B]">
                      /c/{form.slug}
                    </p>
                    <p className="mt-1 text-xs text-[#6B6B6B]">
                      Created {formatDate(form.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open form"
                      className="rounded-lg border border-[#ECE7E0] p-2 text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      onClick={() => handleDelete(form.id)}
                      disabled={isDeleting}
                      title="Delete form"
                      className="rounded-lg border border-red-200 p-2 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#ECE7E0] pt-3">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="flex items-center justify-between rounded-lg bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F0EBE3]"
                  >
                    <span>View testimonials</span>
                    <ChevronRight size={16} className="text-[#6B6B6B]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
