import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectionForm from "./collection-form";

interface FormRow {
  id: string;
  user_id: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  collect_rating: boolean;
  require_consent: boolean;
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: form } = await supabase
    .from("forms")
    .select(
      "id, user_id, headline, prompt, thank_you_message, collect_rating, require_consent"
    )
    .eq("slug", slug)
    .single();

  if (!form) notFound();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 md:px-10 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          <h1
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {form.headline}
          </h1>
          <p className="mt-2 text-[#6B6B6B]">{form.prompt}</p>
          <div className="mt-8">
            <CollectionForm form={form as FormRow} />
          </div>
        </div>
      </div>
    </div>
  );
}
