/**
 * E2E test (local dev server):
 *  1. collection form submits WITH a photo (the reported bug)
 *  2. uploaded avatar is publicly reachable and appears in the embed
 *  3. embed honors accent + radius params, and rejects bad accents
 *  4. widget.js carries the new auto-theme / lazy-mount logic
 */
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import puppeteer from "puppeteer-core";
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
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// tiny valid 1x1 PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",
  "base64"
);
writeFileSync("scripts/tmp-avatar.png", PNG);

let userId = null;
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});

try {
  // disposable user + form
  const { data: created, error } = await supabase.auth.admin.createUser({
    email: `blovi-widget-test-${randomUUID().slice(0, 8)}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;
  await supabase.from("profiles").upsert({ id: userId, is_lifetime: false, full_name: "Widget Test" });
  const slug = `widget-test-${randomUUID().slice(0, 6)}`;
  const { error: formErr } = await supabase.from("forms").insert({ user_id: userId, slug });
  if (formErr) throw formErr;

  // 1. submit the collection form WITH a photo
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`http://localhost:3000/c/${slug}`, { waitUntil: "networkidle2" });

  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile("scripts/tmp-avatar.png");
  await page.type("#author_name", "Photo Person");
  await page.type("#author_role", "QA Bot");
  await page.click('div[role="group"][aria-label="Select a rating"] button:nth-child(5)');
  await page.type("#body", "Submitted with a photo to verify the upload fix works end to end.");
  await page.click('button[type="submit"]');

  // thank-you state appears on success; the old bug left it stuck on "Submitting…"
  let submitted = false;
  for (let i = 0; i < 30 && !submitted; i++) {
    await new Promise((r) => setTimeout(r, 500));
    submitted = await page.evaluate(() => /thank/i.test(document.body.innerText));
  }
  check("form with photo submits (thank-you shown)", submitted);
  await page.close();

  const { data: rows } = await supabase
    .from("testimonials")
    .select("id, avatar_url, author_name")
    .eq("user_id", userId);
  const row = rows?.[0];
  check("testimonial row created", !!row, row ? row.author_name : "no row");
  check("avatar_url saved", !!row?.avatar_url, row?.avatar_url ?? "null");

  if (row?.avatar_url) {
    const r = await fetch(row.avatar_url);
    check("avatar publicly reachable", r.status === 200, `status ${r.status}`);
  }

  // approve it so the embed shows it
  await supabase.from("testimonials").update({ status: "approved" }).eq("id", row.id);

  // 2 + 3. embed: avatar img, accent, radius
  const embed = `http://localhost:3000/embed/${userId}`;
  let html = await (await fetch(`${embed}?accent=7C3AED&radius=sharp`)).text();
  check("embed renders uploaded avatar <img>", html.includes(row.avatar_url));
  check("embed honors accent param", html.includes("#7C3AED"));
  check("embed honors radius param", html.includes("border-radius:4px"));
  check("hover style injected", html.includes("blovi-card:hover"));

  // The raw param appears in React's serialized router state — what matters
  // is that it never reaches a style attribute and the default accent is used
  html = await (await fetch(`${embed}?accent=javascript:alert(1)`)).text();
  check(
    "malicious accent never reaches styles (default used)",
    !/style="[^"]*javascript/i.test(html) && html.includes("#E8743B")
  );

  // 4. widget.js loader features
  const js = await (await fetch("http://localhost:3000/widget.js")).text();
  check("widget.js: auto-theme", js.includes("resolveTheme"));
  check("widget.js: lazy mount", js.includes("IntersectionObserver"));
  check("widget.js: accent+radius passthrough", js.includes('"accent"') && js.includes('"radius"'));

  check("no page errors during form test", pageErrors.length === 0, pageErrors.join("; "));
} catch (err) {
  failures++;
  console.error("ERROR:", err.message ?? err);
} finally {
  await browser.close();
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
