import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

// Wait for hydration (button becomes interactive), then click before the auto-timer fires
await page.waitForSelector('button[aria-label="Polish this testimonial with AI"]');
await new Promise((r) => setTimeout(r, 1200));

const before = await page.evaluate(
  () => document.querySelector('[aria-live] div p[style*="font"]')?.textContent,
);
await page.click('button[aria-label="Polish this testimonial with AI"]');
await new Promise((r) => setTimeout(r, 700)); // mid-scramble
const during = await page.evaluate(
  () => document.querySelector('[aria-live] div p[style*="font"]')?.textContent,
);
await new Promise((r) => setTimeout(r, 1800));
const after = await page.evaluate(
  () => document.querySelector('[aria-live] div p[style*="font"]')?.textContent,
);

console.log("before click:", before);
console.log("mid-scramble:", during);
console.log("after:", after);
console.log(
  "click-trigger works:",
  before?.includes("luv this app") && after?.includes("I love this app") ? "YES" : "NO",
);
await browser.close();
