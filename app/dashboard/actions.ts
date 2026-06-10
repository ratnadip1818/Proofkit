"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  revalidatePath("/dashboard/testimonials");
}

export async function hideTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ status: "hidden" })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
}

export async function updateTestimonial(
  id: string,
  newText: string
): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ body_original: newText, display_body: newText })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
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
  revalidatePath("/dashboard/forms");
  return { error: null, done: true };
}

export async function deleteForm(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("forms")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard/forms");
  revalidatePath("/dashboard");
}

export interface UpdateFormInput {
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_rating: boolean;
  require_consent: boolean;
}

export async function updateForm(
  formId: string,
  data: UpdateFormInput
): Promise<{ error: string | null }> {
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("forms")
    .update(data)
    .eq("id", formId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/forms");
  revalidatePath(`/dashboard/forms/${formId}`);
  revalidatePath(`/dashboard/forms/${formId}/edit`);

  return { error: error?.message ?? null };
}

export async function updateProfile(
  fullName: string
): Promise<{ error: string | null }> {
  const { user } = await getAuthenticatedClient();
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/dashboard/settings");
  return { error: error?.message ?? null };
}

export async function deleteAccount(): Promise<never> {
  const { supabase, user } = await getAuthenticatedClient();
  const admin = createAdminClient();

  await supabase.from("testimonials").delete().eq("user_id", user.id);
  await supabase.from("forms").delete().eq("user_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);
  await admin.auth.admin.deleteUser(user.id);
  await supabase.auth.signOut();

  redirect("/");
}
