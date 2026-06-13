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

async function runTest() {
  let userId = null;
  let failures = 0;

  console.log("Creating test user...");
  const email = `blovi-import-test-${randomUUID().slice(0, 8)}@example.com`;
  const password = randomUUID();

  try {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = created.user.id;

    await supabase.from("profiles").upsert({
      id: userId,
      is_lifetime: true, // give lifetime plan to test imports without restrictions
      full_name: "Import QA Tester",
    });

    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 900 });

    // Catch page logs and exceptions
    page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    page.on("pageerror", err => console.error("PAGE EXCEPTION:", err.message));

    console.log("Logging in...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await page.type("#email", email);
    await page.type("#password", password);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    console.log("Waiting for dashboard redirect...");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // Navigate to import page
    console.log("Navigating to http://localhost:3000/dashboard/import...");
    await page.goto("http://localhost:3000/dashboard/import", { waitUntil: "networkidle0" });

    // Type the tweet URL
    console.log("Pasting Twitter/X link...");
    await page.type('input[placeholder="https://x.com/username/status/123456789"]', "https://x.com/jack/status/20");

    // Click Fetch Tweet button
    console.log("Clicking 'Fetch Tweet'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const fetchBtn = buttons.find(b => b.textContent.includes("Fetch Tweet"));
      if (fetchBtn) fetchBtn.click();
    });

    // Wait 4 seconds for backend API fetch and state rendering
    console.log("Waiting for tweet details to load...");
    await new Promise(r => setTimeout(r, 4000));

    // Verify preview text is present in the DOM
    console.log("Verifying preview card content...");
    const previewBodyText = await page.evaluate(() => {
      const card = document.getElementById("twitter-preview-card");
      return card ? card.textContent : null;
    });

    console.log("Preview text found:", previewBodyText);
    if (!previewBodyText || !previewBodyText.includes("just setting up my twttr")) {
      throw new Error("FAIL: Tweet preview was not loaded correctly.");
    }
    console.log("✅ Twitter preview verified successfully!");

    // Click Import Testimonial
    console.log("Clicking 'Import Testimonial'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const importBtn = buttons.find(b => b.textContent.includes("Import Testimonial"));
      if (importBtn) importBtn.click();
    });

    // Wait 3 seconds for database save and revalidation
    console.log("Waiting for database saving and page refresh...");
    await new Promise(r => setTimeout(r, 3000));

    // Check testimonials list in db
    const { data: rows } = await supabase
      .from("testimonials")
      .select("id, author_name, body_original, rating, source, avatar_url")
      .eq("user_id", userId);

    console.log("Fetched saved testimonials from DB:", rows);

    if (!rows || rows.length === 0) {
      throw new Error("FAIL: Testimonial was not saved to the database.");
    }

    const t = rows[0];
    if (t.author_name !== "jack" || t.body_original !== "just setting up my twttr" || t.source !== "manual" || t.rating !== 5 || !t.avatar_url.includes("unavatar.io")) {
      throw new Error(`FAIL: Testimonial fields mismatch: ${JSON.stringify(t)}`);
    }

    console.log("✅ Import flow saved correct database record!");
    console.log("\n🎉 ALL E2E IMPORT FLOW CHECKS PASSED!");

    await browser.close();
  } catch (err) {
    console.error("\n❌ E2E TEST FAILED:", err.message || err);
    failures++;
  } finally {
    if (userId) {
      console.log("Cleaning up test user data...");
      await supabase.from("testimonials").delete().eq("user_id", userId);
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);
      console.log("Cleanup completed.");
    }
    process.exit(failures ? 1 : 0);
  }
}

runTest();
