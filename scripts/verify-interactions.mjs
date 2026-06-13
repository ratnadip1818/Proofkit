import puppeteer from "puppeteer-core";

const URL = "http://localhost:3000";
const OUT = "scripts/shots";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});

const errors = [];

// --- Desktop: AI polish section + footer bottom ---
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`desktop pageerror: ${e.message}`));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle2" });

  await page.evaluate(() => {
    document.querySelector(".polish-stage")?.scrollIntoView({ block: "center" });
  });
  await new Promise((r) => setTimeout(r, 4500)); // let the scramble finish
  await page.screenshot({ path: `${OUT}/check-ai-polish.png` });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${OUT}/check-footer.png` });

  // FAQ accordion
  await page.evaluate(() => {
    document.getElementById("faq")?.scrollIntoView();
    window.scrollBy(0, -80);
  });
  await new Promise((r) => setTimeout(r, 1200));
  const buttons = await page.$$("#faq button");
  if (buttons[0]) await buttons[0].click();
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT}/check-faq-open.png` });
  await page.close();
}

// --- Mobile: hamburger menu ---
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.click('button[aria-label="Open menu"]');
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/check-mobile-menu.png` });

  // Tap "Pricing" link and confirm we land at the pricing section
  await page.evaluate(() => {
    const links = [...document.querySelectorAll("a")];
    links.find((a) => a.getAttribute("href") === "#pricing" && a.closest(".fixed"))?.click();
  });
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: `${OUT}/check-mobile-pricing.png` });
  await page.close();
}

await browser.close();
console.log(errors.length ? errors.join("\n") : "No page errors during interactions.");
