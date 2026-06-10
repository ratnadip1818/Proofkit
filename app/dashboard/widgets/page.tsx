import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EmbedCode from "../embed-code";
import ComingSoonCard from "../coming-soon-card";
import { Heart, GalleryHorizontal, PictureInPicture, BadgeCheck } from "lucide-react";

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
            Build and customize your testimonial widgets.
          </p>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#FFF4EE] px-4 py-2 text-sm font-medium text-[#E8743B]">
          <Heart size={14} />
          Currently using: Wall of Love (script tag)
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <EmbedCode userId={user.id} />

          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Wall of Love preview
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              This is how your approved testimonials look when embedded.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#ECE7E0] bg-[#FAF8F5]">
              <iframe
                src={`/embed/${user.id}`}
                className="h-[360px] w-full"
                title="Wall of Love preview"
              />
            </div>
          </div>
        </div>

        <h2
          className="mb-5 mt-10 text-lg font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          More widgets
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <ComingSoonCard
            icon={GalleryHorizontal}
            title="Carousel widget"
            description="An auto-rotating carousel of testimonials for your homepage."
          />
          <ComingSoonCard
            icon={PictureInPicture}
            title="Pop-up widget"
            description="Floating testimonial pop-ups that build trust as visitors browse."
          />
          <ComingSoonCard
            icon={BadgeCheck}
            title="Badge widget"
            description="A compact trust badge showing your rating and review count."
          />
        </div>
      </div>
    </div>
  );
}
