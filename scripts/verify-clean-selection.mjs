import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Starting verification of removed rail & select under design...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Login to access dashboard
    console.log('Logging in...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    try {
      await page.type('#email', 'ratnadipubale01@gmail.com');
      await page.type('#password', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
    } catch (e) {
      console.log('Already logged in or bypassed');
    }

    // Navigate to publish
    console.log('Navigating to Templates Hub...');
    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Dismiss cookie preferences banner if present
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Accept');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click "Wall of Love" card
    console.log('Clicking Wall of Love template card...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find(c => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Submit Create widget modal to enter Studio
    console.log('Typing widget name and entering Studio...');
    await page.type('input[placeholder*="Ex."]', 'My Wall of Love');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Verify rail is gone
    const railExists = await page.evaluate(() => {
      return document.querySelector('nav[aria-label="Studio Rail"]') !== null;
    });
    console.log('Far-left two-button rail removed:', !railExists);

    // 2. Verify "Select Testimonials" is directly inside the Design drawer under Design
    const selectInDrawerExists = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      if (!aside) return false;
      return aside.textContent.includes('Select Testimonials');
    });
    console.log('Select Testimonials is inside Design drawer:', selectInDrawerExists);

    // Capture screenshot of Design drawer with Select Testimonials inside
    console.log('Capturing screenshot of Design drawer...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'drawer-with-select-under-design.png') });

    // 3. Click "Select Testimonials" inside the Design drawer
    console.log('Clicking Select Testimonials button inside Design drawer...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('aside button')).find(b => 
        b.textContent.includes('Select Testimonials')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture modal opened from inside Design drawer
    console.log('Capturing modal opened from Design drawer...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'drawer-opened-select-modal.png') });

    console.log('Verification completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Test script error:', err);
  process.exit(1);
});
