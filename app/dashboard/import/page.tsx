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
      <div className="w-full py-8 animate-fade-in font-sans text-ink">
        {/* Page Header */}
        <div className="pb-6 border-b border-hairline mb-8">
          <h1 className="font-display font-bold text-2xl text-ink tracking-tight flex items-center space-x-2">
            <span>Import Testimonials</span>
          </h1>
          <p className="text-ink-secondary text-xs mt-1 leading-relaxed">
            Import reviews from Twitter/X, Product Hunt, LinkedIn, or bulk import via CSV.
          </p>
        </div>

        <ImportPanel />
      </div>
    </div>
  );
}
