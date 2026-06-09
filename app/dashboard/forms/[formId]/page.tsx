import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import TestimonialsPanel, { type Testimonial } from "../../testimonials-panel";
import CopyLinkButton from "../../copy-link-button";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://proofkit-three.vercel.app";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: testimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug, headline")
      .eq("id", formId)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, rating, status, created_at, avatar_url"
      )
      .eq("form_id", formId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!form) notFound();

  const formUrl = `${APP_URL}/c/${form.slug}`;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        {/* Back + header */}
        <div className="mb-8">
          <Link
            href="/dashboard/forms"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
          >
            <ChevronLeft size={16} />
            All forms
          </Link>
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {form.headline || "Untitled form"}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-3 py-1.5 font-mono text-xs text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              <ExternalLink size={12} />
              /c/{form.slug}
            </a>
            <CopyLinkButton url={formUrl} />
          </div>
        </div>

        <TestimonialsPanel
          testimonials={(testimonials ?? []) as Testimonial[]}
        />
      </div>
    </div>
  );
}
