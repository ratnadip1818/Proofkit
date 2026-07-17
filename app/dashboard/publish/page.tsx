import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WidgetBuilder from "./widget-builder";

export default async function WidgetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  const planTier = profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free");
  const isPaid = planTier === "pro" || planTier === "business";

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select(
      "id, author_name, author_role, body_original, display_body, rating, created_at, avatar_url, tags"
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen lg:min-h-0 lg:h-[calc(100vh-48px)] lg:overflow-hidden flex flex-col">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10 py-6 md:py-8 flex-1 flex flex-col min-h-0">
        <div className="mb-6 shrink-0">
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

        <div className="flex-1 flex flex-col min-h-0">
          <WidgetBuilder
            userId={user.id}
            isLifetime={isPaid}
            email={user.email}
            testimonials={testimonials ?? []}
          />
        </div>
      </div>
    </div>
  );
}
