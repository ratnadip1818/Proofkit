import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateFormButton from "./create-form-button";
import EmbedCode from "./embed-code";
import TestimonialsPanel, { type Testimonial } from "./testimonials-panel";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: form }, { data: testimonials }] = await Promise.all([
    supabase
      .from("forms")
      .select("id, slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("testimonials")
      .select(
        "id, author_name, author_role, body_original, rating, status, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-1 flex-col px-4 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Signed in as {user.email}</p>

        {/* Collection form */}
        <div className="mt-8">
          {form ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-6">
              <h2 className="text-base font-medium text-zinc-900">
                Your collection form
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Share this link to start collecting testimonials.
              </p>
              <a
                href={`/c/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                /c/{form.slug}
              </a>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No collection form yet. Create one to start collecting
                testimonials.
              </p>
              <div className="mt-4">
                <CreateFormButton />
              </div>
            </div>
          )}
        </div>

        {/* Embed code */}
        {form && (
          <div className="mt-6">
            <EmbedCode userId={user.id} />
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Testimonials</h2>
          <div className="mt-4">
            <TestimonialsPanel
              testimonials={(testimonials ?? []) as Testimonial[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
