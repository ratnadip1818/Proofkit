import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImportPanel from "./import-panel";

export const metadata = {
  title: "Import Testimonials — Blovi",
  description: "Import testimonials from Twitter/X, Product Hunt, or bulk import via CSV.",
};

export default async function ImportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-[960px] mx-auto p-6 md:p-12">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Import Testimonials
        </h1>
        <p className="mt-1 text-sm text-[#787774]">
          Import reviews from Twitter/X, Product Hunt, LinkedIn, or bulk import via CSV.
        </p>
      </div>

      <ImportPanel />
    </div>
  );
}
