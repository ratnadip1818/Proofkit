import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createForm } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: form } = await supabase
    .from("forms")
    .select("id, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="flex flex-1 flex-col px-4 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Signed in as {user.email}</p>

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
              <form action={createForm} className="mt-4">
                <button
                  type="submit"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                >
                  Create your collection form
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-md border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-500">
          No testimonials yet
        </div>
      </div>
    </div>
  );
}
