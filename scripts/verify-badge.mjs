/** Verify "Powered by Blovi" badge removal is Pro-only, enforced server-side. */
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
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

let userId = null;
try {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: `blovi-badge-test-${randomUUID().slice(0, 8)}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;
  await supabase.from("profiles").upsert({ id: userId, is_lifetime: false });
  await supabase.from("testimonials").insert({
    user_id: userId,
    author_name: "Badge Tester",
    body_original: "Testing badge logic.",
    display_body: "Testing badge logic.",
    rating: 5,
    status: "approved",
    source: "csv",
    consent: true,
  });

  const embed = `http://localhost:3000/embed/${userId}`;
  const BADGE = "Powered by Blovi";

  let html = await (await fetch(embed)).text();
  check("free: badge shows by default", html.includes(BADGE));

  // free user tries to cheat by editing the snippet
  html = await (await fetch(`${embed}?badge=false`)).text();
  check("free: badge=false is IGNORED (cannot remove)", html.includes(BADGE));

  await supabase.from("profiles").update({ is_lifetime: true }).eq("id", userId);

  html = await (await fetch(embed)).text();
  check("pro: badge still shows by default", html.includes(BADGE));

  html = await (await fetch(`${embed}?badge=false`)).text();
  check("pro: badge=false REMOVES the badge", !html.includes(BADGE));
} catch (err) {
  failures++;
  console.error("ERROR:", err.message ?? err);
} finally {
  if (userId) {
    await supabase.from("testimonials").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.admin.deleteUser(userId);
    console.log("cleanup: test user deleted");
  }
}
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
