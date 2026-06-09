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
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-xl border border-zinc-200 bg-white px-8 py-10 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {form.headline}
          </h1>
          <p className="mt-2 text-zinc-600">{form.prompt}</p>
          <div className="mt-8">
            <CollectionForm form={form as FormRow} />
          </div>
        </div>
      </div>
    </div>
  );
}
