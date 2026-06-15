import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImportPanel from "./import-panel";

export default async function ImportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-16">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10 py-10">
        <div className="mb-10 text-center md:text-left">
          <h1
            className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Import Testimonials
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Import testimonials from Twitter/X, Product Hunt, or bulk import via CSV.
          </p>
        </div>

        <ImportPanel />
      </div>
    </div>
  );
}
