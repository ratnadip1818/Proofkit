"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function approveTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ status: "approved" })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function hideTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ status: "hidden" })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export type CreateFormState = { error: string | null; done: boolean };

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

  if (error) return { error: error.message, done: false };

  revalidatePath("/dashboard");
  return { error: null, done: true };
}
