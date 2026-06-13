import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});

const errors = [];
const viewports = [
  { name: "desktop", width: 1440, height: 900, dsf: 1 },
  { name: "mobile", width: 390, height: 844, dsf: 2, mobile: true, hasTouch: true },
];

for (const vp of viewports) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${vp.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`));

  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dsf,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.hasTouch,
  });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const bad = [];
    if (doc.scrollWidth > doc.clientWidth + 1) {
      document.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > doc.clientWidth + 8 && r.width > 40) {
          bad.push(`${el.tagName}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
        }
      });
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, bad: bad.slice(0, 12) };
  });
  console.log(`[${vp.name}] scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`);
  overflow.bad.forEach((b) => console.log(`  overflow: ${b}`));

  // Screenshot top of page
  await page.screenshot({ path: `${OUT}/${vp.name}-1-hero.png` });

  // Scroll through the page in steps, screenshotting key points
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`[${vp.name}] total page height: ${totalHeight}`);
  const stops = [0.18, 0.33, 0.48, 0.62, 0.76, 0.9];
  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(totalHeight * stops[i]));
    await new Promise((r) => setTimeout(r, 1400));
    await page.screenshot({ path: `${OUT}/${vp.name}-${i + 2}-at${Math.round(stops[i] * 100)}.png` });
  }

  await page.close();
}

await browser.close();

if (errors.length) {
  console.log("\n--- ERRORS ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nNo console or page errors.");
}
