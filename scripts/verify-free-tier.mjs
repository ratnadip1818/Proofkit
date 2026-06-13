/**
 * E2E test of free-tier limits against the local dev server:
 *  - free user with 5 approved testimonials -> embed shows exactly 3
 *  - "Showing 3 of 5" upgrade hint present
 *  - ?type=carousel coerced to wall for free users
 *  - after is_lifetime=true -> all 5 show, carousel honored, no hint
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const NAMES = ["Alpha One", "Bravo Two", "Charlie Three", "Delta Four", "Echo Five"];
let userId = null;

try {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: `blovi-freetier-test-${randomUUID().slice(0, 8)}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;
  await supabase.from("profiles").upsert({ id: userId, is_lifetime: false });

  // 5 approved testimonials, oldest first so "most recent" = last three
  for (let i = 0; i < NAMES.length; i++) {
    const { error: insErr } = await supabase.from("testimonials").insert({
      user_id: userId,
      author_name: NAMES[i],
      body_original: `Great product, says ${NAMES[i]}.`,
      display_body: `Great product, says ${NAMES[i]}.`,
      rating: 5,
      status: "approved",
      source: "csv",
      consent: true,
      created_at: new Date(Date.now() - (NAMES.length - i) * 60000).toISOString(),
    });
    if (insErr) throw insErr;
  }

  const embedUrl = `http://localhost:3000/embed/${userId}`;

  // free: wall capped at 3 most recent
  let html = await (await fetch(embedUrl)).text();
  let shown = NAMES.filter((n) => html.includes(n));
  check("free wall shows exactly 3", shown.length === 3, `shown: ${shown.join(", ")}`);
  check(
    "the 3 are the most recent",
    shown.includes("Echo Five") && shown.includes("Delta Four") && shown.includes("Charlie Three")
  );
  check("upgrade hint present", html.includes("upgrade for unlimited"), "");

  // free: carousel request coerced to wall (carousel renders nav arrows)
  html = await (await fetch(`${embedUrl}?type=carousel`)).text();
  check(
    "free ?type=carousel coerced to wall",
    !html.includes("Previous testimonial"),
    html.includes("Previous testimonial") ? "carousel arrows rendered" : "no carousel UI"
  );

  // lifetime: everything unlocked
  await supabase.from("profiles").update({ is_lifetime: true }).eq("id", userId);
  html = await (await fetch(embedUrl)).text();
  shown = NAMES.filter((n) => html.includes(n));
  check("lifetime wall shows all 5", shown.length === 5, `shown ${shown.length}`);
  check("no upgrade hint for lifetime", !html.includes("upgrade for unlimited"));

  html = await (await fetch(`${embedUrl}?type=carousel`)).text();
  check("lifetime carousel honored", html.includes("Previous testimonial"));
} catch (err) {
  failures++;
  console.error("ERROR:", err.message ?? err);
} finally {
  if (userId) {
    await supabase.from("testimonials").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    const { error } = await supabase.auth.admin.deleteUser(userId);
    console.log(error ? `cleanup failed: ${error.message}` : "cleanup: test user deleted");
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
