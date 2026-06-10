import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ComingSoonCard from "../coming-soon-card";
import { Upload, Download, Star, X as XIcon, Rocket } from "lucide-react";

export default async function ImportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Import
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Import testimonials from other sources.
          </p>
        </div>

        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            CSV import
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Bulk-add testimonials by uploading a CSV file.
          </p>

          <div className="mt-4 rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] p-4">
            <p className="text-sm font-medium text-[#1A1A1A]">
              Expected columns
            </p>
            <code className="mt-2 block overflow-x-auto rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 font-mono text-xs text-[#1A1A1A]">
              name, role, testimonial, rating
            </code>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#A8A29E]"
            >
              <Upload size={15} />
              Upload CSV
            </button>
            <a
              href="/sample-testimonials.csv"
              download
              className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              <Download size={15} />
              Download sample CSV
            </a>
          </div>
        </div>

        <h2
          className="mb-5 mt-10 text-lg font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          More import sources
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <ComingSoonCard
            icon={Star}
            title="Import from Google Reviews"
            description="Pull in your existing Google Business reviews automatically."
          />
          <ComingSoonCard
            icon={XIcon}
            title="Import from Twitter/X"
            description="Bring in glowing mentions and replies from X."
          />
          <ComingSoonCard
            icon={Rocket}
            title="Import from Product Hunt"
            description="Import reviews from your Product Hunt launch."
          />
        </div>
      </div>
    </div>
  );
}
