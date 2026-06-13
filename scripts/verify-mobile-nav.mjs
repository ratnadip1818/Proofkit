import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1200));

await page.click('button[aria-label="Open menu"]');
await new Promise((r) => setTimeout(r, 800));

const clicked = await page.evaluate(() => {
  const closeBtn = document.querySelector('button[aria-label="Close menu"]');
  if (!closeBtn) return "no overlay";
  const overlay = closeBtn.closest("div.fixed");
  const link = [...overlay.querySelectorAll("a")].find(
    (a) => a.getAttribute("href") === "#pricing",
  );
  if (!link) return "no link";
  link.click();
  return "clicked";
});
console.log("click result:", clicked);

await new Promise((r) => setTimeout(r, 2500));
const state = await page.evaluate(() => {
  const r = document.getElementById("pricing").getBoundingClientRect();
  return {
    scrollY: Math.round(window.scrollY),
    pricingTopInViewport: Math.round(r.top),
    overlayGone: !document.querySelector('button[aria-label="Close menu"]'),
    htmlOverflow: document.documentElement.style.overflow || "(none)",
  };
});
console.log(JSON.stringify(state, null, 2));
await browser.close();
