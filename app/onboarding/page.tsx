import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingFlow from "./onboarding-flow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check profile full_name and is_lifetime status
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_lifetime")
    .eq("id", user.id)
    .maybeSingle();

  // If already onboarded, ensure lifetime access is granted and skip to dashboard
  if (profile?.full_name) {
    if (!profile?.is_lifetime) {
      const { grantUserAccess } = await import("@/lib/access-code");
      await grantUserAccess(user.id);
    }
    redirect("/dashboard");
  }

  return (
    <OnboardingFlow
      email={user.email}
      initialName={profile?.full_name ?? ""}
      initialIsActivated={true}
    />
  );
}
