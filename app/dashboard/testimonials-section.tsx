import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Clock, CheckCircle, EyeOff } from "lucide-react";
import TestimonialsPanel, { type Testimonial } from "./testimonials-panel";

const STAT_CONFIG = [
  { label: "Total",    icon: MessageSquare, key: "all"      },
  { label: "Pending",  icon: Clock,         key: "pending"  },
  { label: "Approved", icon: CheckCircle,   key: "approved" },
  { label: "Hidden",   icon: EyeOff,        key: "hidden"   },
] as const;

/* ── Skeleton ─────────────────────────────────────────────────── */
export function TestimonialsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Stats skeleton */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-16 rounded-md bg-[#ECE7E0]" />
              <div className="h-4 w-4 rounded bg-[#ECE7E0]" />
            </div>
            <div className="mt-3 h-8 w-10 rounded-md bg-[#ECE7E0]" />
          </div>
        ))}
      </div>

      {/* Tab pills skeleton */}
      <div className="mb-5 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-[#ECE7E0]" />
        ))}
      </div>

      {/* Card skeletons */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#ECE7E0]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-md bg-[#ECE7E0]" />
                <div className="h-3 w-24 rounded-md bg-[#ECE7E0]" />
                <div className="mt-3 space-y-1.5">
                  <div className="h-3 w-full rounded-md bg-[#ECE7E0]" />
                  <div className="h-3 w-full rounded-md bg-[#ECE7E0]" />
                  <div className="h-3 w-2/3 rounded-md bg-[#ECE7E0]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Async data component ─────────────────────────────────────── */
async function TestimonialsFeed({
  userId,
  formUrl,
}: {
  userId: string;
  formUrl: string | null;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, rating, status, created_at, avatar_url"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const all = (data ?? []) as Testimonial[];

  const counts = {
    all:      all.length,
    pending:  all.filter((t) => t.status === "pending").length,
    approved: all.filter((t) => t.status === "approved").length,
    hidden:   all.filter((t) => t.status === "hidden").length,
  };

  return (
    <>
      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CONFIG.map(({ label, icon: Icon, key }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#6B6B6B]">{label}</span>
              <Icon size={16} className="text-[#D9D3CB]" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#E8743B]">
              {counts[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Testimonials panel */}
      <div id="testimonials">
        <h2
          className="mb-5 text-lg font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Testimonials
        </h2>
        <TestimonialsPanel testimonials={all} formUrl={formUrl} />
      </div>
    </>
  );
}

/* ── Public wrapper with built-in Suspense ────────────────────── */
export default function TestimonialsSection({
  userId,
  formUrl,
}: {
  userId: string;
  formUrl: string | null;
}) {
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimonialsFeed userId={userId} formUrl={formUrl} />
    </Suspense>
  );
}
