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

  console.log("Creating test user for sidebar verification...");
  const email = `blovi-sidebar-test-${randomUUID().slice(0, 8)}@example.com`;
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
      full_name: "Sidebar QA Tester",
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
    await new Promise(r => setTimeout(r, 2000));

    // Verify search input exists
    console.log("Verifying search input presence...");
    const searchInput = await page.$('input[placeholder="Search..."]');
    if (!searchInput) {
      throw new Error("FAIL: Search input not found in sidebar.");
    }
    console.log("✅ Search input found!");

    // Test shortcut Cmd/Ctrl + K focuses input
    console.log("Testing shortcut keyboard focus (Ctrl+K)...");
    await page.keyboard.down("Control");
    await page.keyboard.press("k");
    await page.keyboard.up("Control");
    await new Promise(r => setTimeout(r, 500));

    const activeElementTag = await page.evaluate(() => document.activeElement.tagName.toLowerCase());
    const activePlaceholder = await page.evaluate(() => document.activeElement.getAttribute("placeholder"));
    if (activeElementTag !== "input" || activePlaceholder !== "Search...") {
      throw new Error(`FAIL: Search input was not focused. Active element: <${activeElementTag} placeholder="${activePlaceholder}">`);
    }
    console.log("✅ Keyboard shortcut focus verified successfully!");

    // Test search filtering: type "Settings"
    console.log("Testing search filtering for 'Settings'...");
    await page.type('input[placeholder="Search..."]', "Settings");
    await new Promise(r => setTimeout(r, 800));

    // Verify "Settings" is visible, but others like "Overview" are hidden
    const visibleTexts = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("aside a"));
      return links
        .filter(l => l.offsetParent !== null)
        .map(l => l.textContent.trim());
    });
    console.log("Visible sidebar links during search:", visibleTexts);
    if (!visibleTexts.includes("Settings")) {
      throw new Error("FAIL: 'Settings' link should be visible when searching for it.");
    }
    if (visibleTexts.includes("Overview") || visibleTexts.includes("Forms")) {
      throw new Error("FAIL: Other navigation links should be filtered out by search.");
    }
    console.log("✅ Search filtering verified!");

    // Clear search
    console.log("Clearing search input...");
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder="Search..."]');
      if (input) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify Profile Card displays the name "Sidebar QA Tester"
    console.log("Checking profile card name...");
    const profileName = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const profileBtn = buttons.find(b => b.textContent.includes("Sidebar QA Tester"));
      return profileBtn ? profileBtn.textContent.trim() : null;
    });
    console.log("Profile text found:", profileName);
    if (!profileName || !profileName.includes("Sidebar QA Tester")) {
      throw new Error("FAIL: Profile name 'Sidebar QA Tester' not found on the trigger button.");
    }
    console.log("✅ Profile name verified!");

    // Click profile card to open dropdown
    console.log("Clicking profile trigger button...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const profileBtn = buttons.find(b => b.textContent.includes("Sidebar QA Tester"));
      profileBtn?.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Verify dropdown links (Settings, Billing, Sign out) are visible
    const dropdownLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("aside button, aside a"));
      return links.map(l => l.textContent.trim());
    });
    console.log("Sidebar elements with dropdown open:", dropdownLinks);
    if (!dropdownLinks.includes("Sign out")) {
      throw new Error("FAIL: Dropdown 'Sign out' button should be visible after clicking profile.");
    }
    console.log("✅ Profile dropdown menus and options verified successfully!");

    console.log("\n🎉 ALL E2E SIDEBAR FLOW CHECKS PASSED!");
    await browser.close();
  } catch (err) {
    console.error("\n❌ E2E SIDEBAR TEST FAILED:", err.message || err);
    failures++;
  } finally {
    if (userId) {
      console.log("Cleaning up test user data...");
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);
      console.log("Cleanup completed.");
    }
    process.exit(failures ? 1 : 0);
  }
}

runTest();
