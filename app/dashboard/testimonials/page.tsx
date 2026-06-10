import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestimonialsPanel, { type Testimonial } from "../testimonials-panel";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: rawTestimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, body_improved, display_body, is_ai_improved, show_edited_badge, rating, status, created_at, avatar_url"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const formUrl = form ? `${APP_URL}/c/${form.slug}` : null;
  const testimonials = (rawTestimonials ?? []) as Testimonial[];

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Review, approve, and manage testimonials submitted to your form.
          </p>
        </div>

        <TestimonialsPanel testimonials={testimonials} formUrl={formUrl} />
      </div>
    </div>
  );
}
