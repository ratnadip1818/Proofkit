/**
 * E2E test of the auth → onboarding → dashboard wiring using a disposable
 * account against the local dev server:
 *
 *  1. login with a fresh (un-onboarded) account -> must land on /onboarding
 *  2. direct visit to /dashboard               -> must bounce to /onboarding
 *  3. after full_name is saved                  -> /dashboard must stay put
 *  4. /onboarding once onboarded                -> must bounce to /dashboard
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import puppeteer from "puppeteer-core";
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

const email = `blovi-flow-test-${randomUUID().slice(0, 8)}@example.com`;
const password = `Tt1!${randomUUID()}`;

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

let userId = null;
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});

try {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. fresh account logs in -> onboarding
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle2" });
  await page.type("#email", email);
  await page.type("#password", password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
  // client push to /dashboard then server redirect to /onboarding may chain;
  // poll because dev-server compiles routes on first hit
  let landed = false;
  for (let i = 0; i < 20 && !landed; i++) {
    await new Promise((r) => setTimeout(r, 500));
    landed = page.url().includes("/onboarding");
  }
  check("fresh login lands on /onboarding", landed, page.url());

  // 2. direct /dashboard visit bounces back
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle2" });
  check("direct /dashboard bounces to /onboarding", page.url().includes("/onboarding"), page.url());

  // 3. once onboarded, /dashboard stays
  await supabase.from("profiles").upsert({ id: userId, full_name: "Flow Test" });
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle2" });
  check("onboarded /dashboard stays", page.url().endsWith("/dashboard"), page.url());

  // 4. /onboarding redirects forward once complete
  await page.goto("http://localhost:3000/onboarding", { waitUntil: "networkidle2" });
  check("onboarded /onboarding forwards to /dashboard", page.url().endsWith("/dashboard"), page.url());
} catch (err) {
  failures++;
  console.error("ERROR:", err.message ?? err);
} finally {
  await browser.close();
  if (userId) {
    await supabase.from("profiles").delete().eq("id", userId);
    const { error } = await supabase.auth.admin.deleteUser(userId);
    console.log(error ? `cleanup failed: ${error.message}` : "cleanup: test user deleted");
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
