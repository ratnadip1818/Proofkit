import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsPanel from "./settings-panel";

export const metadata = {
  title: "Workspace Settings — Blovi",
  description: "Configure business brand profiles, custom domain aliases, and account credentials.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user profile and billing tiers
  let profile = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, is_lifetime, plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profileData) {
    profile = profileData;
  }

  // Fetch campaign forms configuration
  const { data: form } = await supabase
    .from("forms")
    .select("id, slug, headline, custom_domain, theme_color")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const planTier = profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free");
  const isPaid = planTier === "pro" || planTier === "business";

  return (
    <div className="max-w-[960px] mx-auto p-6 md:p-12">
      <SettingsPanel
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        isLifetime={isPaid}
        form={form}
      />
    </div>
  );
}
