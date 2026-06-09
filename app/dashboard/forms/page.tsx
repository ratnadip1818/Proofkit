import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FormsPanel from "./forms-panel";

export default async function FormsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: forms } = await supabase
    .from("forms")
    .select("id, slug, headline, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <FormsPanel forms={forms ?? []} />
      </div>
    </div>
  );
}
