import puppeteer from 'puppeteer';
import path from 'path';

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome', // Use system installed Chrome
  });
  const page = await browser.newPage();
  const baseDir = "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7";

  // 1. Desktop 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/embed/015f9e2d-0da2-4e90-b449-138cd2861f46?demo=1', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(baseDir, 'desktop_1440_after.png'), fullPage: true });

  // 2. Tablet 768px
  await page.setViewport({ width: 768, height: 900 });
  await page.screenshot({ path: path.join(baseDir, 'tablet_768_after.png'), fullPage: true });

  // 3. Mobile 390px
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(baseDir, 'mobile_390_after.png'), fullPage: true });

  // 4. Empty State
  await page.setViewport({ width: 1200, height: 600 });
  await page.goto('http://localhost:3000/embed/empty-demo?demo=1&max=0', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(baseDir, 'empty_state.png') });

  // 5. 3 Testimonials
  await page.goto('http://localhost:3000/embed/015f9e2d-0da2-4e90-b449-138cd2861f46?demo=1&max=3', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(baseDir, 'testimonials_3.png'), fullPage: true });

  // 6. 9 Testimonials
  await page.goto('http://localhost:3000/embed/015f9e2d-0da2-4e90-b449-138cd2861f46?demo=1&max=9', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(baseDir, 'testimonials_9.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots captured successfully.');
}

captureScreenshots().catch(console.error);
