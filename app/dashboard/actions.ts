"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DAILY_AI_IMPROVEMENT_LIMIT = 50;

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

// Restricted to the AI improvement flow — free-text editing by founders is
// disabled to preserve testimonial authenticity (see improveTestimonial /
// acceptImprovement). Not exposed as a direct user action.
export async function updateTestimonial(
  id: string,
  newText: string,
  source: "ai_improvement"
): Promise<void> {
  if (source !== "ai_improvement") {
    throw new Error("updateTestimonial is restricted to the AI improvement flow.");
  }
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ body_original: newText, display_body: newText })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
}

export type ImproveTestimonialResult =
  | { error: string; original?: undefined; improved?: undefined }
  | { error?: undefined; original: string; improved: string };

export async function improveTestimonial(
  id: string
): Promise<ImproveTestimonialResult> {
  const { supabase, user } = await getAuthenticatedClient();

  const { data: testimonial, error: fetchError } = await supabase
    .from("testimonials")
    .select("body_original")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !testimonial) {
    return { error: "Testimonial not found." };
  }

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_ai_improved", true)
    .gte("updated_at", todayStart.toISOString());

  if (!countError && (count ?? 0) >= DAILY_AI_IMPROVEMENT_LIMIT) {
    return {
      error: `Daily AI improvement limit reached (${DAILY_AI_IMPROVEMENT_LIMIT}/day). Try again tomorrow.`,
    };
  }

  const body_original = testimonial.body_original as string;

  let improved: string;
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a testimonial editor. Polish this testimonial for grammar, clarity and conciseness while preserving the customer's voice, meaning and specific details. Never add facts. Return ONLY the improved text, nothing else: ${body_original}`,
        },
      ],
    });

    const block = message.content[0];
    improved = block?.type === "text" ? block.text.trim() : "";
    if (!improved) throw new Error("Empty response from AI");
  } catch {
    return { error: "AI improvement failed. Please try again." };
  }

  const { error: updateError } = await supabase
    .from("testimonials")
    .update({ body_improved: improved, is_ai_improved: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: "Failed to save the improved testimonial." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");

  return { original: body_original, improved };
}

export async function acceptImprovement(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();

  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("body_improved")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!testimonial?.body_improved) return;

  await supabase
    .from("testimonials")
    .update({
      display_body: testimonial.body_improved,
      show_edited_badge: true,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
}

export async function revertImprovement(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();

  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("body_original")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!testimonial) return;

  await supabase
    .from("testimonials")
    .update({
      display_body: testimonial.body_original,
      show_edited_badge: false,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
}

// TODO: Add ANTHROPIC_API_KEY to Vercel environment variables at vercel.com/project/settings/environment-variables

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
