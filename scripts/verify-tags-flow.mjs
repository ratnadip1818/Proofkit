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
  let testimonialId = null;
  let failures = 0;

  console.log("Creating test user...");
  const email = `blovi-tags-test-${randomUUID().slice(0, 8)}@example.com`;
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
      is_lifetime: true,
      full_name: "Tags QA Tester",
    });

    console.log("Inserting a dummy testimonial to tag...");
    const { data: testimonial, error: insertError } = await supabase
      .from("testimonials")
      .insert({
        user_id: userId,
        author_name: "Tag Tester",
        body_original: "This is a testimonial for testing tags.",
        display_body: "This is a testimonial for testing tags.",
        rating: 5,
        status: "approved",
        source: "manual",
        consent: true,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    testimonialId = testimonial.id;

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

    // Navigate to testimonials page
    console.log("Navigating to http://localhost:3000/dashboard/testimonials...");
    await page.goto("http://localhost:3000/dashboard/testimonials", { waitUntil: "networkidle0" });

    // Wait 2 seconds for client side rendering and entry animations
    await new Promise(r => setTimeout(r, 2000));

    // Click the "+ tag" button
    console.log("Clicking the '+ tag' button on the testimonial card...");
    await page.waitForSelector("button");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const tagBtn = buttons.find(b => b.textContent.toLowerCase().includes("tag") && !b.textContent.includes("Import"));
      if (tagBtn) {
        tagBtn.click();
      } else {
        throw new Error("Could not find '+ tag' button. Buttons found: " + buttons.map(b => b.textContent).join(" | "));
      }
    });

    // Wait for input to render and type tag "awesome"
    console.log("Typing tag name 'awesome'...");
    await page.waitForSelector('input[placeholder="new tag..."]');
    await page.type('input[placeholder="new tag..."]', "awesome");
    await page.keyboard.press("Enter");

    // Wait 3 seconds for database save
    console.log("Waiting for database saving...");
    await new Promise(r => setTimeout(r, 3000));

    // Verify tag exists in DB
    console.log("Verifying tags stored in the DB...");
    const { data: updatedTestimonial } = await supabase
      .from("testimonials")
      .select("tags")
      .eq("id", testimonialId)
      .single();

    console.log("Saved tags in DB:", updatedTestimonial?.tags);
    if (!updatedTestimonial?.tags || !updatedTestimonial.tags.includes("awesome")) {
      throw new Error(`FAIL: Tag 'awesome' was not saved. Found: ${JSON.stringify(updatedTestimonial?.tags)}`);
    }
    console.log("✅ Tags verified in DB!");

    // Navigate to embed page and verify filter pills
    console.log(`Navigating to embed widget: http://localhost:3000/embed/${userId}...`);
    await page.goto(`http://localhost:3000/embed/${userId}`, { waitUntil: "networkidle0" });

    console.log("Checking filter pills in widget...");
    const pills = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.map(b => b.textContent.trim());
    });

    console.log("Found pills in widget:", pills);
    if (!pills.includes("awesome") || !pills.includes("All")) {
      throw new Error(`FAIL: Filter pills not rendered. Found pills: ${JSON.stringify(pills)}`);
    }

    console.log("✅ Dynamic tag filter pills verified successfully in embed widget!");
    console.log("\n🎉 ALL E2E TAGS FLOW CHECKS PASSED!");

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
