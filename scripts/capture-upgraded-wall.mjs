import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Capturing upgraded Blovi Wall of Love widget...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // 1. Capture standalone embed preview at 1280px to compare directly with Senja
    console.log('Navigating to standalone embed preview...');
    await page.goto('http://localhost:3000/embed/preview?type=wall', {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'upgraded-blovi-wall-embed.png'),
      fullPage: true,
    });
    console.log('Captured upgraded-blovi-wall-embed.png');

    // 2. Capture in Widget Studio with Design drawer open
    console.log('Navigating to Widget Studio...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 15000 });
    try {
      await page.type('#email', 'ratnadipubale01@gmail.com');
      await page.type('#password', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});
    } catch (e) {}

    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Dismiss cookie banner if present
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Accept');
      if (btn) btn.click();
    });

    // Select Wall of Love
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find((c) => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'Upgraded Wall');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3500));

    // Capture Widget Studio with upgraded Wall of Love
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'upgraded-blovi-wall-studio.png'),
    });
    console.log('Captured upgraded-blovi-wall-studio.png');

    console.log('All verification captures completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
