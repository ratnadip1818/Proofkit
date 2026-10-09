import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("public/widgets");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function hideOverlays(page) {
  await page.evaluate(() => {
    // Hide cookie banner, Next.js portal / toast / badge
    document.querySelectorAll('*').forEach((el) => {
      const text = el.innerText || '';
      if (text.includes('Cookie Preferences')) {
        el.remove();
      }
    });
    const portals = document.querySelectorAll('nextjs-portal, [data-nextjs-toast]');
    portals.forEach(p => p.remove());
    // In case Next.js badge is in a custom element
    const customElements = document.querySelectorAll('nextjs-portal');
    customElements.forEach(e => e.remove());
  });
}

async function capture() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("cookie-consent", "accepted");
  });

  // 1. CAPTURE WALL OF LOVE (Clean 2 rows of masonry cards)
  console.log("Capturing Wall of Love...");
  await page.setViewport({ width: 1040, height: 580, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/embed/preview?type=wall&accent=%232563EB&badge=false&max=6", {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1200));
  await hideOverlays(page);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "wall-of-love.png"),
    clip: { x: 20, y: 15, width: 1000, height: 490 },
  });
  console.log("Wall of Love captured.");

  // 2. CAPTURE ORBIT SOCIAL COSMOS (Centered 440x440 canvas)
  console.log("Capturing Orbit Social Cosmos...");
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/embed/preview?type=orbit&accent=%232563EB&badge=false", {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1500));
  await hideOverlays(page);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "orbit-cosmos.png"),
    clip: { x: 180, y: 75, width: 440, height: 440 },
  });
  console.log("Orbit Social Cosmos captured.");

  // 3. CAPTURE CARD SPOTLIGHT (Clean floating spotlight card)
  console.log("Capturing Card Spotlight...");
  await page.setViewport({ width: 700, height: 350, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/embed/preview?type=stack&accent=%232563EB&badge=false", {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1200));
  await hideOverlays(page);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "card-spotlight.png"),
    clip: { x: 100, y: 10, width: 500, height: 160 },
  });
  console.log("Card Spotlight captured.");

  await browser.close();
  console.log("All 3 widget screenshots captured with high precision!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
