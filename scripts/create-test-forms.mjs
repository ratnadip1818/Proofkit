import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const userId = "6e037975-54db-4705-b239-28ef18f95eb8";

async function run() {
  console.log("Checking existing forms...");
  const { data: existing } = await supabase.from("forms").select("id").eq("user_id", userId);
  
  if (existing && existing.length > 0) {
    console.log(`User already has ${existing.length} forms. Creating additional ones...`);
  }

  // 1. Create a SaaS Launch feedback form (indigo color preset)
  const { data: f1, error: e1 } = await supabase.from("forms").insert({
    user_id: userId,
    slug: "saas-launch-form",
    headline: "Share your SaaS Launch feedback",
    theme_color: "#6366F1",
    collect_photo: true,
    collect_rating: true,
    require_consent: true,
  }).select("id").single();
  if (e1) console.error("Error creating form 1:", e1);
  else console.log("Form 1 created successfully, ID:", f1.id);

  // 2. Create a Consulting Service feedback form (emerald green)
  const { data: f2, error: e2 } = await supabase.from("forms").insert({
    user_id: userId,
    slug: "consulting-feedback",
    headline: "Rate our Consulting Service",
    theme_color: "#10B981",
    collect_photo: false,
    collect_rating: true,
    require_consent: false,
  }).select("id").single();
  if (e2) console.error("Error creating form 2:", e2);
  else console.log("Form 2 created successfully, ID:", f2.id);

  // 3. Link some testimonials to the forms to populate stats
  // Let's get the user's testimonials
  const { data: testimonials } = await supabase.from("testimonials").select("id").eq("user_id", userId).limit(5);
  if (testimonials && testimonials.length > 0) {
    console.log(`Found ${testimonials.length} testimonials. Linking them...`);
    // Link first 3 to form 1, next 2 to form 2
    await supabase.from("testimonials").update({ form_id: f1.id }).eq("id", testimonials[0].id);
    await supabase.from("testimonials").update({ form_id: f1.id }).eq("id", testimonials[1].id);
    await supabase.from("testimonials").update({ form_id: f1.id }).eq("id", testimonials[2].id);
    if (testimonials[3]) await supabase.from("testimonials").update({ form_id: f2.id }).eq("id", testimonials[3].id);
    if (testimonials[4]) await supabase.from("testimonials").update({ form_id: f2.id }).eq("id", testimonials[4].id);
    console.log("Testimonials linked successfully!");
  }
}

run();
