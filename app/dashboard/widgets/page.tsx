import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WidgetsPage() {
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
            Widgets
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Customize and embed testimonial widgets on your site.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-[#1A1A1A]">Coming soon</p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Widget customization is on its way.
          </p>
        </div>
      </div>
    </div>
  );
}
