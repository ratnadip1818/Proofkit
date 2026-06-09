import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateFormButton from "./create-form-button";
import EmbedCode from "./embed-code";
import TestimonialsPanel, { type Testimonial } from "./testimonials-panel";
import CopyLinkButton from "./copy-link-button";
import { ExternalLink } from "lucide-react";

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

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
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

      {/* Top cards row */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Collection form card */}
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2
            className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]"
          >
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
                  <ExternalLink size={12} className="shrink-0 text-[#6B6B6B]" />
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

        {/* Embed code card */}
        {form ? (
          <EmbedCode userId={user.id} />
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[#ECE7E0] bg-white p-6">
            <p className="text-center text-sm text-[#6B6B6B]">
              Create a collection form first to get your embed snippet.
            </p>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="mt-10">
        <h2
          className="mb-5 text-lg font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Testimonials
        </h2>
        <TestimonialsPanel
          testimonials={(testimonials ?? []) as Testimonial[]}
        />
      </div>
    </div>
  );
}
