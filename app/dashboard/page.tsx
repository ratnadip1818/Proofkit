import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateFormButton from "./create-form-button";
import EmbedCode from "./embed-code";
import CopyLinkButton from "./copy-link-button";
import StatsCards from "./stats-cards";
import FreePlanBanner from "./free-plan-banner";
import RecentFeed from "./recent-feed";
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
    supabase
      .from("testimonials")
      .select("id, status, rating, display_body, author_name, author_role, avatar_url, created_at")
      .eq("user_id", user.id),
    supabase
      .from("profiles")
      .select("is_lifetime, created_at, full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const formUrl = form ? `${APP_URL}/c/${form.slug}` : null;
  const isLifetime = profile?.is_lifetime ?? false;
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] ?? null;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen relative overflow-hidden pb-16">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(232,116,59,0.035)_0%,transparent_70%)] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[-100px] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(46,158,107,0.015)_0%,transparent_70%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        {/* Overhauled Welcome Hero Banner Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDFB] via-white to-[#FAF8F5] -z-10" />
          <div className="absolute right-0 bottom-0 h-40 w-40 bg-[radial-gradient(circle_at_bottom_right,rgba(232,116,59,0.05),transparent_80%)] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h1
                className="text-3xl font-black tracking-tight text-[#1A1A1A] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {firstName ? `Welcome back, ${firstName} ✨` : "Welcome back ✨"}
              </h1>
              <p className="mt-2 text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
                Here is a real-time snapshot of your customer reviews and collection form. Keep collecting social proof to drive conversions.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 shrink-0">
              {formUrl && (
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#ECE7E0] bg-white px-4 py-2.5 text-xs font-bold text-[#1A1A1A] shadow-sm transition-all hover:bg-[#FAF8F5] active:scale-98"
                >
                  <ExternalLink size={13} className="text-[#6B6B6B]" />
                  View Live Form
                </a>
              )}
              <Link
                href="/dashboard/testimonials"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#E8743B] active:scale-98"
              >
                View Testimonials
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {!isLifetime && <FreePlanBanner email={user.email} />}

        {/* Stats */}
        <StatsCards testimonials={testimonials ?? []} />

        {/* Collection form + embed widget */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:items-stretch">
          <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Collection form
              </h2>
              <p className="mt-2 text-sm text-[#6B6B6B]">
                Share this custom link to collect ratings and feedback from your customers.
              </p>
            </div>

            {form && formUrl ? (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-4 py-3 font-mono text-xs text-[#1A1A1A] transition-colors hover:bg-white focus:outline-none"
                  >
                    <ExternalLink size={12} className="shrink-0 text-[#6B6B6B]" />
                    <span className="truncate">{formUrl}</span>
                  </a>
                  <CopyLinkButton url={formUrl} />
                </div>
              </div>
            ) : (
              <div className="mt-6 flex-1 flex flex-col justify-end">
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
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-[#ECE7E0] bg-white p-6 min-h-[160px]">
                <p className="text-center text-sm text-[#6B6B6B]">
                  Create a collection form first to get your embed snippet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent reviews feed */}
        <div className="mt-8">
          <RecentFeed
            testimonials={testimonials ?? []}
            formUrl={formUrl}
          />
        </div>

      </div>
    </div>
  );
}
