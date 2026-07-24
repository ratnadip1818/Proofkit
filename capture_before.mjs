import puppeteer from 'puppeteer';
import path from 'path';

async function captureBeforeScreenshot() {
  const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  const baseDir = "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7";

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/embed/015f9e2d-0da2-4e90-b449-138cd2861f46?demo=1', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(baseDir, 'desktop_1440_before.png'), fullPage: true });

  await browser.close();
  console.log('BEFORE screenshot captured.');
}

captureBeforeScreenshot().catch(console.error);
