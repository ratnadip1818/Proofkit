import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingFlow from "./onboarding-flow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If already onboarded, skip to dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.full_name) redirect("/dashboard");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blovi.space";

  return <OnboardingFlow siteUrl={siteUrl} />;
}
