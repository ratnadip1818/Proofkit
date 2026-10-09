import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Testing and capturing Senja-clean Share view with compact embed code and brand palette...');
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

    // Select Wall of Love
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find((c) => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'Clean Share Wall');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 3000));

    // Click "Share" button in top right header
    console.log('Clicking Share button in header...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button, .border-b button, button'));
      const shareBtn = buttons.find((b) => b.textContent.trim().startsWith('Share') || b.textContent.trim() === 'Share');
      if (shareBtn) {
        shareBtn.click();
      } else {
        throw new Error('Share button not found');
      }
    });

    await new Promise((r) => setTimeout(r, 1200));

    // 1. Capture Embed tab
    console.log('Capturing compact embed tab...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-share-compact-embed.png') });
    console.log('Captured clean-share-compact-embed.png');

    // 2. Click Link tab
    console.log('Clicking Link tab...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const linkTab = tabs.find((b) => b.textContent.trim().toLowerCase().includes('link'));
      if (linkTab) linkTab.click();
    });

    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-share-compact-link.png') });
    console.log('Captured clean-share-compact-link.png');

    console.log('All captures completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
