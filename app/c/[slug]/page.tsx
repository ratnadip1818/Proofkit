import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CollectionForm from "./collection-form";

interface FormRow {
  id: string;
  user_id: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
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
      "id, user_id, headline, prompt, thank_you_message, theme_color, collect_rating, require_consent"
    )
    .eq("slug", slug)
    .single();

  if (!form) notFound();

  // Collection is a Pro feature — trial/expired owners get a holding page
  // instead of a working form (profiles aren't readable anonymously, so use
  // the admin client like the embed route does).
  const admin = createAdminClient();
  const { data: ownerProfile } = await admin
    .from("profiles")
    .select("is_lifetime")
    .eq("id", form.user_id)
    .maybeSingle();

  if (!ownerProfile?.is_lifetime) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-5 md:px-10 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-[#ECE7E0] bg-white p-8 text-center shadow-sm">
          <h1
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            This form isn&apos;t live yet
          </h1>
          <p className="mt-3 text-sm text-[#6B6B6B]">
            The owner of this page hasn&apos;t activated testimonial collection
            yet. Please check back later.
          </p>
          <p className="mt-6 text-xs text-[#6B6B6B]">
            Are you the owner?{" "}
            <a
              href="/dashboard/billing"
              className="font-semibold text-[#E8743B] hover:underline"
            >
              Unlock collection in your dashboard
            </a>
          </p>
        </div>
      </div>
    );
  }

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
