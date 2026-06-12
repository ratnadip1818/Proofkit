import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateFormButton from "./create-form-button";
import EmbedCode from "./embed-code";
import CopyLinkButton from "./copy-link-button";
import StatsCards from "./stats-cards";
import FreePlanBanner from "./free-plan-banner";
import TestWidgetCard from "./test-widget-card";
import { ExternalLink, ArrowRight } from "lucide-react";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: testimonials }, { data: profile }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("testimonials").select("status").eq("user_id", user.id),
    supabase
      .from("profiles")
      .select("is_lifetime, created_at, full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const formUrl = form ? `${APP_URL}/c/${form.slug}` : null;
  const isLifetime = profile?.is_lifetime ?? false;
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] ?? null;
  const approvedCount = (testimonials ?? []).filter(
    (t) => t.status === "approved"
  ).length;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        {/* Page header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Manage your testimonials and collection form.
            </p>
          </div>
          <Link
            href="/dashboard/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8743B] transition-colors hover:text-[#CF5F2C]"
          >
            View all testimonials
            <ArrowRight size={16} />
          </Link>
        </div>

        {!isLifetime && <FreePlanBanner email={user.email} />}

        {/* Stats */}
        <StatsCards testimonials={testimonials ?? []} />

        {/* Collection form + embed */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2 font-mono text-xs text-[#1A1A1A] transition-colors hover:bg-white"
                  >
                    <ExternalLink size={12} className="shrink-0 text-[#6B6B6B]" />
                    <span className="truncate">{formUrl}</span>
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

          <div>
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

        {approvedCount === 0 && (
          <div className="mt-5">
            <TestWidgetCard userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
}
