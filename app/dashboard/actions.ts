"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateFormState = { error: string | null };

export async function createForm(
  _prev: CreateFormState,
  _formData: FormData
): Promise<CreateFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const prefix = (user.email ?? "form")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  const slug = `${prefix}-${suffix}`;

  const { error } = await supabase.from("forms").insert({
    user_id: user.id,
    slug,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
