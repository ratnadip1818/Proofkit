import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Capturing fully rendered studio canvas with Design drawer...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    try {
      await page.type('#email', 'ratnadipubale01@gmail.com');
      await page.type('#password', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
    } catch (e) {}

    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Accept');
      if (btn) btn.click();
    });

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group'));
      const wallCard = cards.find(c => c.textContent.includes('Wall of Love'));
      if (wallCard) wallCard.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.type('input[placeholder*="Ex."]', 'My Wall of Love');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 4000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'drawer-final-studio-canvas.png') });
    console.log('Final screenshot captured!');
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
