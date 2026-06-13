import { readFileSync } from "node:fs";
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

const email = `blovi-onb-${randomUUID().slice(0, 8)}@example.com`;
const password = `Tt1!${randomUUID()}`;
let userId = null;
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});

try {
  const { data: created, error } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  if (error) throw error;
  userId = created.user.id;

  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle2" });
  await page.type("#email", email);
  await page.type("#password", password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
  for (let i = 0; i < 20 && !page.url().includes("/onboarding"); i++)
    await new Promise((r) => setTimeout(r, 500));

  // step 1
  await page.waitForSelector('input[placeholder="Jane Smith"]');
  await page.type('input[placeholder="Jane Smith"]', "Ratna Test");
  await page.click('button[type="submit"]');
  // step 2
  await page.waitForFunction(() => document.body.innerText.includes("Nice to meet you"), { timeout: 15000 });
  await page.screenshot({ path: "scripts/shots/onb-step2.png" });
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const t = await b.evaluate((el) => el.innerText);
    if (t.includes("Yes")) { await b.click(); break; }
  }
  // step 3
  await page.waitForFunction(() => document.body.innerText.includes("Pick how you want to start"), { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "scripts/shots/onb-step3.png" });
  console.log(errs.length ? "ERRORS: " + errs.join("; ") : "No errors. Screenshots saved.");
} catch (e) {
  console.error("ERROR:", e.message ?? e);
} finally {
  await browser.close();
  if (userId) {
    await supabase.from("forms").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.admin.deleteUser(userId);
    console.log("cleanup: test user deleted");
  }
}
