import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditFormPanel from "./edit-form-panel";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: form } = await supabase
    .from("forms")
    .select(
      "id, slug, headline, prompt, thank_you_message, theme_color, collect_rating, require_consent"
    )
    .eq("id", formId)
    .eq("user_id", user.id)
    .single();

  if (!form) notFound();

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <EditFormPanel form={form} />
      </div>
    </div>
  );
}
