import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Fetching live Senja Wall of Love widget screenshot...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto('https://widget.senja.io/widget/04d2cfcf-1d23-4b63-b72e-451b7d023971', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture the rendered Senja widget
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'senja-live-wall-widget.png'),
      fullPage: true,
    });
    console.log('Captured senja-live-wall-widget.png');

    // Also extract DOM information about Senja cards, layout, classes, styles
    const analysis = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.senja-embed [class*="card"], .senja-embed > div > div'));
      const body = document.querySelector('.senja-embed');
      return {
        cardCount: cards.length,
        embedClass: body ? body.className : 'none',
        htmlSnippet: body ? body.innerHTML.substring(0, 3000) : 'none',
      };
    });
    console.log('Senja widget structure:', analysis);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Failed to capture Senja widget:', err);
  process.exit(1);
});
