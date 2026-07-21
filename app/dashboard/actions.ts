"use server";

import dns from "dns";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_TESTIMONIAL_LIMIT } from "@/lib/limits";
import { sanitizeCss, sanitizeFontName } from "@/lib/security";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";

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
  revalidatePath("/dashboard/manage");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);
}

export async function hideTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .update({ status: "hidden" })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/manage");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/manage");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);
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

  const admin = createAdminClient();
  const [{ data: profile }, { count: formCount }] = await Promise.all([
    admin.from("profiles").select("plan_tier, is_lifetime").eq("id", user.id).maybeSingle(),
    admin.from("forms").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const tier = profile?.plan_tier || "free";
  const isLifetime = profile?.is_lifetime || false;

  let maxForms = 1; // Default free plan limit
  if (tier === "agency" || tier === "business") {
    maxForms = Infinity;
  } else if (tier === "pro") {
    maxForms = 10;
  } else if (tier === "starter") {
    maxForms = 3;
  }

  if ((formCount ?? 0) >= maxForms) {
    return {
      error: `You have reached the form limit for your plan (${maxForms} form${maxForms === 1 ? "" : "s"}). Please stack more AppSumo codes or upgrade to create more.`,
      done: false,
    };
  }

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
  revalidatePath("/dashboard/collect");
  return { error: null, done: true };
}

export async function deleteForm(id: string): Promise<void> {
  const { supabase, user } = await getAuthenticatedClient();
  await supabase
    .from("forms")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard/collect");
  revalidatePath("/dashboard");
}

export interface UpdateFormInput {
  headline?: string;
  prompt?: string;
  thank_you_message?: string;
  theme_color?: string;
  collect_photo?: boolean;
  collect_rating?: boolean;
  require_consent?: boolean;
  custom_css?: string | null;
  custom_font?: string | null;
  custom_domain?: string | null;
}

function cleanDomain(domain: string): string {
  return domain
    .replace(/^(https?:\/\/)?(www\.)?/, "") // remove protocol and www
    .split("/")[0]                          // remove paths
    .trim()
    .toLowerCase();
}

export async function updateForm(
  formId: string,
  data: UpdateFormInput
): Promise<{ error: string | null }> {
  const { supabase, user } = await getAuthenticatedClient();
  
  const sanitizedData = { ...data };

  // Sync custom domain with Vercel API if it changed
  if (data.custom_domain !== undefined) {
    const { data: currentForm } = await supabase
      .from("forms")
      .select("custom_domain")
      .eq("id", formId)
      .eq("user_id", user.id)
      .maybeSingle();

    const oldDomain = currentForm?.custom_domain ? cleanDomain(currentForm.custom_domain) : null;
    const newDomain = data.custom_domain ? cleanDomain(data.custom_domain) : null;

    if (oldDomain !== newDomain) {
      const isSystemSubdomain = (domain: string) => {
        const systemDomains = ["www.blovi.space", "blovi.space"];
        return systemDomains.includes(domain) || domain.endsWith(".localhost");
      };

      try {
        // Remove old custom domain from Vercel configuration
        if (oldDomain && !isSystemSubdomain(oldDomain)) {
          await removeDomainFromVercel(oldDomain);
        }

        // Add new custom domain to Vercel configuration
        if (newDomain && !isSystemSubdomain(newDomain)) {
          await addDomainToVercel(newDomain);
        }
      } catch (err: any) {
        console.error("Vercel domain sync failed:", err);
        return { error: `Failed to sync domain on Vercel: ${err.message}` };
      }
    }
    sanitizedData.custom_domain = newDomain;
  }

  if (sanitizedData.custom_css !== undefined) {
    sanitizedData.custom_css = sanitizeCss(sanitizedData.custom_css);
  }
  if (sanitizedData.custom_font !== undefined) {
    sanitizedData.custom_font = sanitizeFontName(sanitizedData.custom_font);
  }

  const { error } = await supabase
    .from("forms")
    .update(sanitizedData)
    .eq("id", formId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/collect");
  revalidatePath(`/dashboard/collect/${formId}`);
  revalidatePath(`/dashboard/collect/${formId}/edit`);

  return { error: error?.message ?? null };
}

export interface WidgetConfigInput {
  preset?: string;
  theme?: string;
  primary_color?: string;
  text_color?: string;
  rating_color?: string;
  rating_border_color?: string;
  highlight_color?: string;
  show_photos?: boolean;
  use_gravatar?: boolean;
  fallback_avatar?: string;
  font_family?: string;
  show_branding?: boolean;
}

export async function saveWidgetConfig(
  config: WidgetConfigInput
): Promise<{ error: string | null }> {
  const { supabase, user } = await getAuthenticatedClient();

  const { data: firstForm } = await supabase
    .from("forms")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (firstForm) {
    const { error } = await supabase
      .from("forms")
      .update({
        theme_color: config.primary_color,
        custom_font: config.font_family,
      })
      .eq("id", firstForm.id)
      .eq("user_id", user.id);

    if (error) console.warn("Widget config form sync notice:", error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/publish");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);

  return { error: null };
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

  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const [{ data: profileData, error: profileError }, { count: existing }] = await Promise.all([
    supabase.from("profiles").select("is_lifetime, plan_tier").eq("id", user.id).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  const isPaid = profile?.is_lifetime === true || profile?.plan_tier === "pro" || profile?.plan_tier === "business";

  if (!isPaid && (existing ?? 0) + rows.length > FREE_TESTIMONIAL_LIMIT) {
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
  revalidatePath("/dashboard/manage");
  revalidatePath("/dashboard/import");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);

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

  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const [{ data: profileData, error: profileError }, { count: existing }] = await Promise.all([
    supabase.from("profiles").select("is_lifetime, plan_tier").eq("id", user.id).maybeSingle(),
    admin
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  const isPaid = profile?.is_lifetime === true || profile?.plan_tier === "pro" || profile?.plan_tier === "business";

  if (!isPaid && (existing ?? 0) + 1 > FREE_TESTIMONIAL_LIMIT) {
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
  revalidatePath("/dashboard/manage");
  revalidatePath("/dashboard/import");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);

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
  revalidatePath("/dashboard/manage");
  revalidatePath("/dashboard/publish");
  revalidatePath("/embed/" + user.id);
  updateTag("widget-" + user.id);

  return { error: null, success: true };
}

export async function verifyDomainDNS(domain: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const cleanDomain = domain.trim().toLowerCase();
    if (!cleanDomain) return { valid: false, error: "Domain name cannot be empty." };

    // Try resolving CNAME records first (subdomains)
    try {
      const records = await dns.promises.resolveCname(cleanDomain);
      const hasCorrectCname = records.some(r => r.toLowerCase().includes("vercel-dns.com"));
      if (hasCorrectCname) {
        return { valid: true };
      }
    } catch (e) {
      // CNAME check failed or record doesn't exist (e.g. root domain)
    }

    // Try resolving A records (root domains)
    try {
      const ips = await dns.promises.resolve4(cleanDomain);
      const isVercelIp = ips.includes("76.76.21.21");
      if (isVercelIp) {
        return { valid: true };
      }
      return { 
        valid: false, 
        error: `DNS configuration is invalid. Subdomains must point to cname.vercel-dns.com (CNAME). Root domains must point to 76.76.21.21 (A record). Found IPs: ${ips.join(", ")}` 
      };
    } catch (err: any) {
      return { valid: false, error: "No CNAME or A records found for this domain. Make sure your DNS is configured." };
    }
  } catch (err: any) {
    return { valid: false, error: `Verification failed: ${err.message}` };
  }
}

export async function checkCustomDomainStatus(domain: string): Promise<{
  status: "verified" | "pending" | "failed";
  dnsRecord: { type: string; name: string; value: string };
  isSimulated: boolean;
  error: string | null;
}> {
  const VERCEL_TOKEN = process.env.VERCEL_AUTH_TOKEN;
  const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

  const isSimulated = !VERCEL_TOKEN || !PROJECT_ID;

  if (isSimulated) {
    const isValid = domain.includes(".");
    return {
      status: isValid ? "verified" : "pending",
      dnsRecord: { type: "CNAME", name: "@", value: "cname.vercel-dns.com" },
      isSimulated: true,
      error: isValid ? null : "Invalid domain syntax. Must contain a period (e.g. domain.com)."
    };
  }

  try {
    const TEAM_ID = process.env.VERCEL_TEAM_ID;
    const queryParams = TEAM_ID ? `?teamId=${TEAM_ID}` : "";
    const url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}${queryParams}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });

    if (!res.ok) {
      return {
        status: "failed",
        dnsRecord: { type: "CNAME", name: "@", value: "cname.vercel-dns.com" },
        isSimulated: false,
        error: "Domain not configured on Vercel yet."
      };
    }

    const data = await res.json();
    const verified = data.verified === true;

    return {
      status: verified ? "verified" : "pending",
      dnsRecord: {
        type: "CNAME",
        name: "@",
        value: "cname.vercel-dns.com",
      },
      isSimulated: false,
      error: verified ? null : "DNS propagation in progress. Please check again shortly."
    };
  } catch (err: any) {
    return {
      status: "failed",
      dnsRecord: { type: "CNAME", name: "@", value: "cname.vercel-dns.com" },
      isSimulated: false,
      error: err.message
    };
  }
}


