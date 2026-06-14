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

async function main() {
  let userId = null;
  let formId = null;
  let testimonialId = null;

  console.log("Creating test user for dashboard verification...");
  const email = `dashboard-test-${randomUUID().slice(0, 8)}@example.com`;
  const password = randomUUID();

  try {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = created.user.id;

    // Create profile
    await supabase.from("profiles").upsert({
      id: userId,
      is_lifetime: false, // shows the free banner
      full_name: "Jivak QA Tester",
    });

    // Create a form
    const formSlug = `test-form-${randomUUID().slice(0, 8)}`;
    const { data: form, error: formErr } = await supabase
      .from("forms")
      .insert({
        user_id: userId,
        slug: formSlug,
      })
      .select("id")
      .single();
    if (formErr) throw formErr;
    formId = form.id;

    // Create a testimonial
    const { data: testimonial, error: testErr } = await supabase
      .from("testimonials")
      .insert({
        user_id: userId,
        form_id: formId,
        rating: 5,
        body_original: "This app has saved me so much time. Super clean UI and extremely fast setup!",
        display_body: "This app has saved me so much time. Super clean UI and extremely fast setup!",
        author_name: "Sarah Jenkins",
        author_role: "Founder, SaaSFlow",
        status: "pending",
      })
      .select("id")
      .single();
    if (testErr) throw testErr;
    testimonialId = testimonial.id;

    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1440, height: 900 });

    console.log("Logging in...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('button[type="submit"]');

    console.log("Waiting for dashboard redirect...");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 4000)); // wait for animations and ticker

    console.log("Taking dashboard overview screenshot...");
    await page.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\dashboard-overview.png", fullPage: true });

    await browser.close();
    console.log("Screenshot saved!");
  } catch (err) {
    console.error("Verification failed:", err.message || err);
  } finally {
    // Cleanup
    console.log("Cleaning up database test records...");
    if (testimonialId) {
      await supabase.from("testimonials").delete().eq("id", testimonialId);
    }
    if (formId) {
      await supabase.from("forms").delete().eq("id", formId);
    }
    if (userId) {
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);
    }
    console.log("Cleanup done.");
    process.exit(0);
  }
}

main();
