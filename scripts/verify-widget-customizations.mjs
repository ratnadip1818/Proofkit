import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });

    // Test 1: Instrument Serif font + custom yellow background (#FFFDF5) + custom purple rating (#8B5CF6) + Placeholder fallback avatar
    console.log('Testing custom font + colors + placeholder avatar...');
    const url1 = 'http://localhost:3000/embed/preview?user=demo-widget&type=wall&preset=base&theme=light&accent=%232563EB&backgroundColor=%23FEF9C3&textColor=%23713F12&ratingColor=%239333EA&font=Instrument+Serif&showPhotos=true&useGravatar=true&fallbackAvatar=Placeholder';
    await page.goto(url1, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    const shot1 = path.join(ARTIFACT_DIR, 'verified-custom-font-colors-placeholder.png');
    await page.screenshot({ path: shot1 });
    console.log('Saved screenshot 1:', shot1);

    // Verify computed styles in page
    const styles1 = await page.evaluate(() => {
      const card = document.querySelector('.blovi-card');
      const star = document.querySelector('.blovi-card svg polygon');
      const p = document.querySelector('.blovi-card p');
      const avatarSvg = document.querySelector('.blovi-card svg path[d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"]');
      return {
        cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
        starFill: star ? star.getAttribute('fill') : null,
        pColor: p ? window.getComputedStyle(p).color : null,
        hasPlaceholderSvg: !!avatarSvg,
        fontFamily: p ? window.getComputedStyle(p).fontFamily : null,
      };
    });
    console.log('Computed styles 1:', JSON.stringify(styles1, null, 2));

    // Test 2: Space Grotesk font + Dark theme (#18181B) + Initials avatar + Coral rating (#F43F5E)
    console.log('Testing Space Grotesk font + Initials avatar...');
    const url2 = 'http://localhost:3000/embed/preview?user=demo-widget&type=wall&preset=base&theme=light&accent=%232563EB&backgroundColor=%23F0FDF4&textColor=%2314532D&ratingColor=%23F43F5E&font=Space+Grotesk&showPhotos=true&useGravatar=false&fallbackAvatar=Initials';
    await page.goto(url2, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    const shot2 = path.join(ARTIFACT_DIR, 'verified-space-grotesk-initials.png');
    await page.screenshot({ path: shot2 });
    console.log('Saved screenshot 2:', shot2);

    const styles2 = await page.evaluate(() => {
      const card = document.querySelector('.blovi-card');
      const star = document.querySelector('.blovi-card svg polygon');
      const p = document.querySelector('.blovi-card p');
      const initials = document.querySelector('.blovi-card [style*="user-select"]');
      return {
        cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
        starFill: star ? star.getAttribute('fill') : null,
        pColor: p ? window.getComputedStyle(p).color : null,
        initialsText: initials ? initials.textContent?.trim() : null,
        fontFamily: p ? window.getComputedStyle(p).fontFamily : null,
      };
    });
    console.log('Computed styles 2:', JSON.stringify(styles2, null, 2));

    // Test 3: Dashboard Publish Widget Studio drawer with design tab
    console.log('Testing Dashboard Publish Studio...');
    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1500));

    const shot3 = path.join(ARTIFACT_DIR, 'verified-studio-with-customizations.png');
    await page.screenshot({ path: shot3 });
    console.log('Saved screenshot 3:', shot3);

  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error('Error running verification:', e);
  process.exit(1);
});
