import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Testing and capturing canvas preview without device switcher...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    try {
      await page.type('#email', 'ratnadipubale01@gmail.com');
      await page.type('#password', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
    } catch (e) {}

    // Navigate to dashboard publish
    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Dismiss cookie banner if present
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Accept');
      if (btn) btn.click();
    });

    // 1. SELECT WALL OF LOVE
    console.log('Selecting Wall of Love widget...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find((c) => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'Pure Space Wall');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3500));

    // Capture Wall of Love canvas preview (clean space, no device switcher)
    console.log('Capturing Wall of Love clean canvas...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-no-device-switcher-wall.png') });
    console.log('Captured clean-canvas-no-device-switcher-wall.png');

    // Return to templates
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Templates'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // 2. SELECT SPOTLIGHT (Toast)
    console.log('Selecting Spotlight widget...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const spotlightCard = cards.find((c) => c.textContent.includes('Spotlight') || c.textContent.includes('Toast'));
      if (spotlightCard) spotlightCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'Pure Space Spotlight');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3500));

    // Capture Spotlight canvas preview (clean space, no device switcher)
    console.log('Capturing Spotlight clean canvas...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-no-device-switcher-spotlight.png') });
    console.log('Captured clean-canvas-no-device-switcher-spotlight.png');

    console.log('All canvas screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
