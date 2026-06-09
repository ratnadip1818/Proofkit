import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsPanel from "./settings-panel";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <SettingsPanel
          email={user.email ?? ""}
          fullName={profile?.full_name ?? ""}
        />
      </div>
    </div>
  );
}
