import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Testing and capturing clean Senja-style canvas preview...');
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
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Accept');
      if (btn) btn.click();
    });

    // 1. SELECT SPOTLIGHT (Toast / Floating Corner)
    console.log('Selecting Spotlight widget...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const spotlightCard = cards.find(c => c.textContent.includes('Spotlight') || c.textContent.includes('Toast'));
      if (spotlightCard) spotlightCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'My Clean Spotlight');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3500));

    // Capture Spotlight in floating mode (matching Senja's reference screenshot)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-spotlight-floating.png') });
    console.log('Captured clean-canvas-spotlight-floating.png');

    // Switch to inline card mode for Spotlight
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Inline card');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-spotlight-inline.png') });
    console.log('Captured clean-canvas-spotlight-inline.png');

    // Return to templates and test Wall of Love
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Templates'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Wall of Love
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find(c => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'My Clean Wall of Love');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3500));

    // Capture Wall of Love Desktop
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-wall-desktop.png') });
    console.log('Captured clean-canvas-wall-desktop.png');

    // Switch to Mobile Viewport
    await page.evaluate(() => {
      const mobileBtn = document.querySelector('button[title="Mobile View"]');
      if (mobileBtn) mobileBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-canvas-wall-mobile.png') });
    console.log('Captured clean-canvas-wall-mobile.png');

    console.log('All verification captures completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
