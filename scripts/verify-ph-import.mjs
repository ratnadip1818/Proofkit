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
  const email = `blovi-ph-import-test-${randomUUID().slice(0, 8)}@example.com`;
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
      full_name: "PH Import QA Tester",
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

    // Click on the Product Hunt Import Tab
    console.log("Switching to Product Hunt Import tab...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const phTab = buttons.find(b => b.textContent.includes("Product Hunt Import"));
      if (phTab) phTab.click();
    });

    await new Promise(r => setTimeout(r, 500));

    // Fill in the Product Hunt Import form
    console.log("Filling in Product Hunt Import form fields...");
    await page.type("#ph_profile", "@atish");
    await page.type("#ph_name", "Atish");
    await page.type("#ph_body", "Blovi is absolutely fantastic! Highly recommended.");

    // Check preview card content
    console.log("Verifying live preview card elements...");
    const previewData = await page.evaluate(() => {
      const card = document.getElementById("ph-preview-card");
      if (!card) return null;
      const img = card.querySelector("img");
      return {
        text: card.textContent,
        imgSrc: img ? img.getAttribute("src") : null
      };
    });

    console.log("Preview data found:", previewData);
    if (!previewData || !previewData.text.includes("Blovi is absolutely fantastic!")) {
      throw new Error("FAIL: Product Hunt preview text not rendered correctly.");
    }
    if (!previewData.imgSrc || !previewData.imgSrc.includes("unavatar.io/producthunt/atish")) {
      throw new Error(`FAIL: Product Hunt avatar URL resolved incorrectly. Found: ${previewData.imgSrc}`);
    }
    console.log("✅ Live preview card elements verified successfully!");

    // Click Import Testimonial
    console.log("Clicking 'Import Testimonial'...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      // find import button that is currently visible / enabled
      const importBtn = buttons.find(b => b.textContent.trim() === "Import Testimonial" && !b.disabled);
      if (importBtn) importBtn.click();
    });

    // Wait 3 seconds for database save and revalidation
    console.log("Waiting for database saving...");
    await new Promise(r => setTimeout(r, 3000));

    // Check testimonials list in db
    const { data: rows } = await supabase
      .from("testimonials")
      .select("id, author_name, body_original, rating, source, avatar_url, author_role")
      .eq("user_id", userId);

    console.log("Fetched saved testimonials from DB:", rows);

    if (!rows || rows.length === 0) {
      throw new Error("FAIL: Testimonial was not saved to the database.");
    }

    const t = rows[0];
    if (t.author_name !== "Atish" || t.body_original !== "Blovi is absolutely fantastic! Highly recommended." || t.source !== "manual" || t.rating !== 5 || !t.avatar_url.includes("supabase.co/storage")) {
      throw new Error(`FAIL: Testimonial fields mismatch: ${JSON.stringify(t)}`);
    }

    console.log("✅ Import flow saved correct database record!");
    console.log("\n🎉 ALL E2E PRODUCT HUNT IMPORT CHECKS PASSED!");

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
