import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

mkdirSync("scripts/shots", { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const errors = [];

// Desktop: messy state, auto-polish, swap to next quote
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`desktop: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`desktop console: ${m.text()}`));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2200)); // entrance done, still messy
  await page.screenshot({ path: "scripts/shots/hero2-messy.png" });
  await new Promise((r) => setTimeout(r, 3000)); // auto-polish ran (t=3.2s + 2s anim)
  await page.screenshot({ path: "scripts/shots/hero2-polished.png" });
  const textAfterAuto = await page.evaluate(
    () => document.querySelector('section [aria-live] p[style]')?.textContent ?? "",
  );
  await new Promise((r) => setTimeout(r, 4500)); // swap to quote 2, messy again
  const textAfterSwap = await page.evaluate(
    () => document.querySelector('section [aria-live] p[style]')?.textContent ?? "",
  );
  await page.screenshot({ path: "scripts/shots/hero2-quote2.png" });
  console.log("after auto-polish:", textAfterAuto);
  console.log("after swap:", textAfterSwap);

  // Click-to-polish on the new quote
  await page.click('button[aria-label="Polish this testimonial with AI"]');
  await new Promise((r) => setTimeout(r, 2400));
  const textAfterClick = await page.evaluate(
    () => document.querySelector('section [aria-live] p[style]')?.textContent ?? "",
  );
  console.log("after click:", textAfterClick);
  await page.screenshot({ path: "scripts/shots/hero2-clicked.png" });
  await page.close();
}

// Mobile: layout + no overflow
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`mobile: ${e.message}`));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: "scripts/shots/hero2-mobile-messy.png" });
  await new Promise((r) => setTimeout(r, 3200));
  await page.screenshot({ path: "scripts/shots/hero2-mobile-polished.png" });
  const overflow = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  console.log(`mobile scrollWidth=${overflow.sw} clientWidth=${overflow.cw}`);
  // marquee band under hero
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.95));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "scripts/shots/hero2-mobile-band.png" });
  await page.close();
}

await browser.close();
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "No errors.");
