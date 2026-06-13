"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_TESTIMONIAL_LIMIT } from "@/lib/limits";

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

  // AI improvement is a Pro feature — enforce server-side, not just in the UI
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_lifetime")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_lifetime) {
    return { error: "AI improvement is a Pro feature — upgrade to unlock it." };
  }

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

export interface ImportTestimonialRow {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
}

export async function importTestimonials(
  rows: ImportTestimonialRow[]
): Promise<{ error: string | null; count: number }> {
  const { supabase, user } = await getAuthenticatedClient();

  if (!rows.length) return { error: "No rows to import.", count: 0 };

  const admin = createAdminClient();

  // Free plan: 3 testimonials total
  const [{ data: profile }, { count: existing }] = await Promise.all([
    supabase.from("profiles").select("is_lifetime").eq("id", user.id).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (!profile?.is_lifetime && (existing ?? 0) + rows.length > FREE_TESTIMONIAL_LIMIT) {
    const remaining = Math.max(0, FREE_TESTIMONIAL_LIMIT - (existing ?? 0));
    return {
      error: `Free plan is limited to ${FREE_TESTIMONIAL_LIMIT} testimonials (${remaining} slot${remaining === 1 ? "" : "s"} left). Upgrade for unlimited.`,
      count: 0,
    };
  }
  const { data, error } = await admin
    .from("testimonials")
    .insert(
      rows.map((row) => ({
        user_id: user.id,
        author_name: row.author_name,
        author_role: row.author_role,
        body_original: row.body,
        display_body: row.body,
        rating: row.rating,
        status: "approved",
        source: "csv",
        consent: true,
      }))
    )
    .select("id");

  if (error) return { error: error.message, count: 0 };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard/import");

  return { error: null, count: data?.length ?? rows.length };
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

export interface ImportSingleTestimonialData {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  avatar_url: string | null;
  source: string;
}

async function downloadAndUploadAvatar(
  userId: string,
  externalUrl: string | null
): Promise<string | null> {
  if (!externalUrl) return null;
  if (externalUrl.includes("/storage/v1/object/public/avatars/")) {
    return externalUrl;
  }

  try {
    const res = await fetch(externalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`Failed to fetch avatar from ${externalUrl}: status ${res.status}`);
      return externalUrl;
    }

    const contentType = res.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) {
      console.warn(`Invalid content type from ${externalUrl}: ${contentType}`);
      return externalUrl;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length > 2 * 1024 * 1024) {
      console.warn(`Avatar from ${externalUrl} exceeds 2MB limit: ${buffer.length} bytes`);
      return externalUrl;
    }

    let ext = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";

    const admin = createAdminClient();
    const filename = `${userId}/imported-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from("avatars")
      .upload(filename, buffer, {
        contentType,
        cacheControl: "31536000",
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload fetched avatar to Supabase:", uploadError.message);
      return externalUrl;
    }

    const {
      data: { publicUrl },
    } = admin.storage.from("avatars").getPublicUrl(filename);

    return publicUrl;
  } catch (err: any) {
    console.error(`Failed to self-host avatar from ${externalUrl}:`, err.message || err);
    return externalUrl;
  }
}

export async function importSingleTestimonial(
  data: ImportSingleTestimonialData
): Promise<{ error: string | null; success: boolean }> {
  const { supabase, user } = await getAuthenticatedClient();
  const admin = createAdminClient();

  // Free plan limit check
  const [{ data: profile }, { count: existing }] = await Promise.all([
    supabase.from("profiles").select("is_lifetime").eq("id", user.id).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (!profile?.is_lifetime && (existing ?? 0) + 1 > FREE_TESTIMONIAL_LIMIT) {
    return {
      error: `Free plan is limited to ${FREE_TESTIMONIAL_LIMIT} testimonials. Upgrade for unlimited.`,
      success: false,
    };
  }

  // Self-host avatar if present
  let finalAvatarUrl = data.avatar_url;
  if (data.avatar_url && data.avatar_url.startsWith("http")) {
    finalAvatarUrl = await downloadAndUploadAvatar(user.id, data.avatar_url);
  }

  const { error } = await admin.from("testimonials").insert({
    user_id: user.id,
    author_name: data.author_name,
    author_role: data.author_role,
    body_original: data.body,
    display_body: data.body,
    rating: data.rating,
    avatar_url: finalAvatarUrl,
    status: "approved",
    source: data.source,
    consent: true,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard/import");

  return { error: null, success: true };
}

export async function updateTestimonialTags(
  id: string,
  tags: string[]
): Promise<{ error: string | null; success: boolean }> {
  const { supabase, user } = await getAuthenticatedClient();

  // Clean, trim, and format tags (lowercase, limit size)
  const cleaned = tags
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && t.length <= 30);
  const uniqueTags = Array.from(new Set(cleaned));

  const { error } = await supabase
    .from("testimonials")
    .update({ tags: uniqueTags })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard/widgets");

  return { error: null, success: true };
}

