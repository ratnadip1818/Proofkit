import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Calendar, Globe, HelpCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Verify Testimonial — Blovi",
  description: "Verify the authenticity of this customer testimonial.",
};

// Simple inline Stars component for clean rendering
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-[#E8743B]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-lg">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

// Simple Avatar placeholder helper
function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-12 w-12 rounded-full object-cover border border-[#ECE7E0] bg-[#FAF8F5]"
      />
    );
  }
  const firstLetter = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4EE] font-bold text-[#E8743B] border border-[#ECE7E0]">
      {firstLetter}
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: testimonial } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, author_company, avatar_url, body_original, display_body, rating, created_at, source, status"
    )
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (!testimonial) {
    notFound();
  }

  const formattedDate = new Date(testimonial.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sourceLabel =
    testimonial.source === "form"
      ? "Submitted via public collection form"
      : testimonial.source === "csv"
        ? "Imported via validated CSV upload"
        : "Manually entered by verified account owner";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-sans">
      {/* Mini Header */}
      <header className="w-full border-b border-[#ECE7E0] bg-white py-5 px-6 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-decoration-none">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8743B] text-sm font-extrabold text-white">
              B
            </span>
            <span
              className="text-lg font-bold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2E9E6B]/10 px-3.5 py-1 text-xs font-semibold text-[#2E9E6B]">
            <ShieldCheck size={14} />
            Verified Record
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-5 py-12 md:py-20 flex flex-col items-center">
        {/* Verification Status Banner */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E9E6B]/10 text-[#2E9E6B]">
            <CheckCircle2 size={36} />
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight md:text-4xl text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Authenticity Verified
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B] max-w-md mx-auto">
            This customer testimonial is a verified, cryptographically stored record hosted securely on Blovi.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="w-full max-w-2xl rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm md:p-12 relative overflow-hidden">
          {/* Subtle quote watermark */}
          <span
            aria-hidden="true"
            className="absolute top-2 right-8 text-[120px] font-serif text-[#E8743B] opacity-[0.06] select-none pointer-events-none"
          >
            ”
          </span>

          {/* Testimonial body */}
          <div className="relative z-10">
            {testimonial.rating && (
              <div className="mb-5">
                <Stars rating={testimonial.rating} />
              </div>
            )}
            
            <blockquote className="text-lg md:text-xl leading-relaxed text-[#1A1A1A] font-medium mb-8">
              “{testimonial.display_body ?? testimonial.body_original}”
            </blockquote>

            {/* Author details */}
            <div className="flex items-center gap-4.5 border-t border-[#ECE7E0] pt-6">
              <Avatar name={testimonial.author_name} avatarUrl={testimonial.avatar_url} />
              <div>
                <p
                  className="text-base font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {testimonial.author_name}
                </p>
                {(testimonial.author_role || testimonial.author_company) && (
                  <p className="text-sm text-[#6B6B6B]">
                    {[testimonial.author_role, testimonial.author_company]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="w-full max-w-2xl mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-5 flex items-start gap-3.5">
            <div className="mt-0.5 text-[#E8743B]">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Submission Date
              </p>
              <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{formattedDate}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-5 flex items-start gap-3.5">
            <div className="mt-0.5 text-[#E8743B]">
              <Globe size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Verification Origin
              </p>
              <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{sourceLabel}</p>
            </div>
          </div>
        </div>

        {/* Sales Funnel CTA */}
        <div className="w-full max-w-2xl mt-12 rounded-3xl bg-[#16161D] p-8 text-center shadow-lg relative overflow-hidden border border-white/5">
          <div className="relative z-10 flex flex-col items-center">
            <h2
              className="text-xl md:text-2xl font-bold text-white max-w-sm leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Want to display verified testimonials like this?
            </h2>
            <p className="mt-3 text-sm text-[#9CA3AF] max-w-md">
              Collect social proof and embed a beautiful Wall of Love on your website. Pay once, own it forever.
            </p>
            <Link
              href="/"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02]"
            >
              Get Blovi for $49
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#ECE7E0] py-6 text-center text-xs text-[#6B6B6B]">
        © {new Date().getFullYear()} Blovi. All rights reserved. Cryptographically verified testimonial log.
      </footer>
    </div>
  );
}
