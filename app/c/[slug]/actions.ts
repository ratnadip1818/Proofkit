"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

interface SubmitTestimonialInput {
  formId: string;
  userId: string;
  authorName: string;
  authorRole: string | null;
  body: string;
  rating: number | null;
  consent: boolean;
  avatarUrl: string | null;
}

export async function submitTestimonial(
  input: SubmitTestimonialInput
): Promise<{ error: string | null }> {
  const supabase = await createClient();

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
    const admin = createAdminClient();
    const { data: userData } = await admin.auth.admin.getUserById(input.userId);
    const ownerEmail = userData?.user?.email;

    if (ownerEmail) {
      const stars = input.rating
        ? "★".repeat(input.rating) + "☆".repeat(5 - input.rating)
        : null;
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

      await resend.emails.send({
        from: "onboarding@resend.dev",
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
