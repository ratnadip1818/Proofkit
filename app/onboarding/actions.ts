"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function saveProfileName(
  fullName: string
): Promise<{ error: string | null }> {
  const { user } = await getUser();
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function saveHasCustomers(
  hasCustomers: boolean
): Promise<{ error: string | null }> {
  const { user } = await getUser();
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    has_customers: hasCustomers,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function getOrCreateForm(): Promise<{
  slug: string | null;
  error: string | null;
}> {
  const { supabase, user } = await getUser();

  const { data: existing } = await supabase
    .from("forms")
    .select("slug")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing?.slug) return { slug: existing.slug, error: null };

  const prefix = (user.email ?? "form")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  const slug = `${prefix}-${suffix}`;

  const { error } = await supabase
    .from("forms")
    .insert({ user_id: user.id, slug });

  if (error) return { slug: null, error: error.message };
  return { slug, error: null };
}
