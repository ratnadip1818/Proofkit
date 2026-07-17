"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import { FREE_TESTIMONIAL_LIMIT } from "@/lib/limits";

interface SubmitTestimonialInput {
  formId: string;
  userId: string;
  authorName: string;
  authorRole: string | null;
  body: string;
  rating: number | null;
  consent: boolean;
  avatarUrl: string | null;
  website: string;
}

const MAX_SUBMISSIONS_PER_HOUR = 10;

export async function submitTestimonial(
  input: SubmitTestimonialInput
): Promise<{ error: string | null }> {
  // Honeypot: bots fill in hidden fields. Pretend to succeed without saving.
  if (input.website) {
    return { error: null };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  let ownerProfile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const [{ data: profileData, error: profileError }, { count: totalCount }] = await Promise.all([
    admin.from("profiles").select("is_lifetime, plan_tier").eq("id", input.userId).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", input.userId),
  ]);

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await admin
      .from("profiles")
      .select("is_lifetime")
      .eq("id", input.userId)
      .maybeSingle();
    if (fallbackData) {
      ownerProfile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    ownerProfile = profileData;
  }

  const isPaid = ownerProfile?.is_lifetime === true || ownerProfile?.plan_tier === "pro" || ownerProfile?.plan_tier === "business";

  if (!isPaid && (totalCount ?? 0) >= FREE_TESTIMONIAL_LIMIT) {
    return { error: "This form isn't accepting new testimonials right now." };
  }

  // Rate limit: cap submissions per form within a 1 hour window
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("form_id", input.formId)
    .gte("created_at", oneHourAgo);

  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_HOUR) {
    return {
      error: "Too many submissions for this form. Please try again later.",
    };
  }

  const { error: insertError } = await supabase.from("testimonials").insert({
    user_id: input.userId,
    form_id: input.formId,
    author_name: input.authorName,
    author_role: input.authorRole,
    body_original: input.body,
    display_body: input.body,
    rating: input.rating,
    consent: input.consent,
    avatar_url: input.avatarUrl,
    status: "pending",
    source: "form",
  });

  if (insertError) {
    return { error: insertError.message };
  }

  // Send email notification — failure must not block submission
  try {
    const { data: userData } = await admin.auth.admin.getUserById(input.userId);
    const ownerEmail = userData?.user?.email;

    if (ownerEmail) {
      const stars = input.rating
        ? "★".repeat(input.rating) + "☆".repeat(5 - input.rating)
        : null;
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

      await resend.emails.send({
        from: "Blovi <hello@blovi.space>",
        to: ownerEmail,
        subject: `New testimonial from ${input.authorName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
            <h2 style="color:#E8743B;margin-bottom:4px;">New testimonial received!</h2>
            <p style="color:#6B6B6B;margin-top:0;">Someone just submitted a testimonial via your Blovi form.</p>
            <table style="width:100%;border-collapse:collapse;margin:24px 0;">
              <tr><td style="padding:8px 0;font-weight:600;width:100px;">From</td><td>${input.authorName}</td></tr>
              ${stars ? `<tr><td style="padding:8px 0;font-weight:600;">Rating</td><td style="font-size:18px;">${stars}</td></tr>` : ""}
            </table>
            <blockquote style="border-left:3px solid #E8743B;margin:0;padding:12px 16px;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic;color:#6B6B6B;">
              ${input.body}
            </blockquote>
            <a href="${siteUrl}/dashboard" style="display:inline-block;margin-top:24px;background:#E8743B;color:white;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              View in dashboard →
            </a>
          </div>
        `,
      });
    }
  } catch {
    // Email failure is non-fatal
  }

  return { error: null };
}

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

async function isValidImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return true;

  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return true;

  return false;
}

export async function uploadAvatar(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!(file instanceof File) || typeof userId !== "string" || !userId) {
    return { url: null, error: "Invalid upload." };
  }

  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { url: null, error: "Photo must be a JPEG, PNG, or WEBP image." };
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return { url: null, error: "Photo must be under 2MB." };
  }

  if (!(await isValidImageSignature(file))) {
    return { url: null, error: "Photo must be a valid JPEG, PNG, or WEBP image." };
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { url: null, error: "Photo upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("avatars").getPublicUrl(path);

  return { url: publicUrl, error: null };
}
