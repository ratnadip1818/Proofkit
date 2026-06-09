import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateFormButton from "./create-form-button";
import EmbedCode from "./embed-code";
import TestimonialsPanel, { type Testimonial } from "./testimonials-panel";
import CopyLinkButton from "./copy-link-button";
import {
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  EyeOff,
} from "lucide-react";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://proofkit-three.vercel.app";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: testimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, rating, status, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const formUrl = form ? `${APP_URL}/c/${form.slug}` : null;
  const all = (testimonials ?? []) as Testimonial[];

  const stats = [
    { label: "Total", count: all.length, icon: MessageSquare },
    {
      label: "Pending",
      count: all.filter((t) => t.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Approved",
      count: all.filter((t) => t.status === "approved").length,
      icon: CheckCircle,
    },
    {
      label: "Hidden",
      count: all.filter((t) => t.status === "hidden").length,
      icon: EyeOff,
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Manage your testimonials and collection form.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, count, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B6B6B]">
                  {label}
                </span>
                <Icon size={16} className="text-[#D9D3CB]" />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#E8743B]">
                {count}
              </p>
            </div>
          ))}
        </div>

        {/* Collection form + embed */}
        <div
          id="collection-form"
          className="mb-10 grid gap-5 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Collection form
            </h2>

            {form && formUrl ? (
              <div className="mt-4">
                <p className="text-sm text-[#6B6B6B]">
                  Share this link to collect testimonials.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2 font-mono text-xs text-[#1A1A1A] transition-colors hover:bg-white truncate"
                  >
                    <ExternalLink
                      size={12}
                      className="shrink-0 text-[#6B6B6B]"
                    />
                    <span className="truncate">/c/{form.slug}</span>
                  </a>
                  <CopyLinkButton url={formUrl} />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-[#6B6B6B]">
                  No collection form yet. Create one to start gathering
                  testimonials.
                </p>
                <div className="mt-4">
                  <CreateFormButton />
                </div>
              </div>
            )}
          </div>

          <div id="embed">
            {form ? (
              <EmbedCode userId={user.id} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#ECE7E0] bg-white p-6">
                <p className="text-center text-sm text-[#6B6B6B]">
                  Create a collection form first to get your embed snippet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div id="testimonials">
          <h2
            className="mb-5 text-lg font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Testimonials
          </h2>
          <TestimonialsPanel testimonials={all} />
        </div>
      </div>
    </div>
  );
}
