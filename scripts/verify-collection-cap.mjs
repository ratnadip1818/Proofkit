/** Verify free plan caps at 3 testimonials total (form page + lifetime bypass). */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let failures = 0;
const check = (l, ok, d = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${l}${d ? ` — ${d}` : ""}`);
  if (!ok) failures++;
};

let userId = null;
try {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: `blovi-cap-test-${randomUUID().slice(0, 8)}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;
  await supabase.from("profiles").upsert({ id: userId, is_lifetime: false });
  const slug = `cap-test-${randomUUID().slice(0, 6)}`;
  await supabase.from("forms").insert({ user_id: userId, slug });

  const formUrl = `http://localhost:3000/c/${slug}`;

  // under the cap: form renders
  let html = await (await fetch(formUrl)).text();
  check("free with 0 testimonials: form open", html.includes("Submit testimonial"));

  // fill to the cap
  for (let i = 0; i < 3; i++) {
    await supabase.from("testimonials").insert({
      user_id: userId,
      author_name: `Cap ${i}`,
      body_original: "x",
      display_body: "x",
      status: "pending",
      source: "form",
      consent: true,
    });
  }

  html = await (await fetch(formUrl)).text();
  check(
    "free at 3 testimonials: form closed",
    html.includes("isn't accepting new testimonials") && !html.includes("Submit testimonial")
  );

  // lifetime reopens it
  await supabase.from("profiles").update({ is_lifetime: true }).eq("id", userId);
  html = await (await fetch(formUrl)).text();
  check("lifetime at 3: form open again", html.includes("Submit testimonial"));
} catch (e) {
  failures++;
  console.error("ERROR:", e.message ?? e);
} finally {
  if (userId) {
    await supabase.from("testimonials").delete().eq("user_id", userId);
    await supabase.from("forms").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.admin.deleteUser(userId);
    console.log("cleanup: test user deleted");
  }
}
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
