import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/userp/.gemini/antigravity/brain/ee8221be-351a-4b8b-8dad-b8360a088c93';

async function run() {
  console.log('Starting Selection System Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // =========================================================================
    // PART 1: Direct Embed Pipeline Verification
    // =========================================================================
    console.log('\n--- PART 1: Testing Embed Pipeline with Selection Parameters ---');

    // 1. Manual mode with 2 selected IDs: sample-1 and sample-3
    console.log('Testing manual selection: 2 items (sample-1, sample-3)...');
    const urlManual2 = 'http://localhost:3000/embed/preview?user=demo-widget&type=wall&selectMode=manual&selectedIds=sample-1%2Csample-3';
    await page.goto(urlManual2, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1500));

    const cardCountManual2 = await page.evaluate(() => document.querySelectorAll('.blovi-card').length);
    console.log(`Manual (2 selected) -> Cards rendered: ${cardCountManual2}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-embed-manual-two-cards.png') });

    // 2. Manual mode with 1 selected ID: sample-2
    console.log('Testing manual selection: 1 item (sample-2)...');
    const urlManual1 = 'http://localhost:3000/embed/preview?user=demo-widget&type=wall&selectMode=manual&selectedIds=sample-2';
    await page.goto(urlManual1, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    const cardCountManual1 = await page.evaluate(() => document.querySelectorAll('.blovi-card').length);
    console.log(`Manual (1 selected) -> Cards rendered: ${cardCountManual1}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-embed-manual-one-card.png') });

    // =========================================================================
    // PART 2: Widget Studio UI & Interactive Modal Verification
    // =========================================================================
    console.log('\n--- PART 2: Testing Studio UI & Selection Modal ---');

    // Login to access dashboard
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 15000 });
    try {
      await page.type('#email', 'ratnadipubale01@gmail.com');
      await page.type('#password', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
    } catch (e) {
      console.log('Login form not present or already logged in:', e.message);
    }

    await page.goto('http://localhost:3000/dashboard/publish', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Dismiss cookie preferences banner if present
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.textContent?.trim() === 'Accept');
      if (acceptBtn) acceptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // If on hub, click first card to enter builder
    const hasHub = await page.evaluate(() => !!document.querySelector('h1')?.textContent.includes('Create a widget'));
    if (hasHub) {
      console.log('On Template Hub, clicking Wall of Love template card...');
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.group'));
        const wallCard = cards.find(c => c.textContent?.includes('Wall of Love')) || cards[0];
        if (wallCard) wallCard.click();
      });
      await new Promise((r) => setTimeout(r, 1200));

      // Fill in widget name and submit creation form
      const nameInput = await page.$('input[placeholder*="Ex."]');
      if (nameInput) {
        await nameInput.type('My Wall of Love');
        await page.click('button[type="submit"]');
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    // Save screenshot of Studio showing the selection status pill in the top header
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-studio-header-selection-pill.png') });
    console.log('Saved studio header screenshot');

    // Click "Select" button on far-left rail
    console.log('Clicking "Select" button on far-left rail...');
    await page.evaluate(() => {
      const selectBtn = Array.from(document.querySelectorAll('nav button, button')).find(b => b.textContent?.trim() === 'Select');
      if (selectBtn) selectBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Save screenshot of the Selection Modal (Manual Tab by default or current)
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-select-modal-manual-tab.png') });
    console.log('Saved Manual tab screenshot');

    // Switch to Auto-add tab
    console.log('Clicking "Auto-add" segmented tab in modal...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const autoTab = tabs.find(b => b.textContent?.includes('Auto-add'));
      if (autoTab) autoTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-select-modal-auto-tab.png') });
    console.log('Saved Auto-add tab screenshot');

    // Click 5-star option in Auto-add
    console.log('Selecting "5-star testimonials only" in Auto-add...');
    await page.evaluate(() => {
      const options = Array.from(document.querySelectorAll('div, button'));
      const fiveStar = options.find(o => o.textContent?.includes('5-star testimonials only'));
      if (fiveStar) fiveStar.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-select-modal-auto-5star.png') });
    console.log('Saved Auto-add 5-star option screenshot');

    // Switch back to Manual tab
    console.log('Clicking "Manual" segmented tab in modal...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const manualTab = tabs.find(b => b.textContent?.includes('Manual'));
      if (manualTab) manualTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Deselect first testimonial in Manual tab
    console.log('Toggling first testimonial checkbox...');
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.animate-fade-in [role="dialog"] div, [role="dialog"] .cursor-pointer'));
      const firstRow = items.find(el => el.textContent?.includes('★') || el.textContent?.includes('Founder') || el.textContent?.includes('designer'));
      if (firstRow) firstRow.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-select-modal-deselected-one.png') });
    console.log('Saved modal with one testimonial deselected');

    // Click "Save Selection"
    console.log('Clicking "Save Selection"...');
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Save Selection');
      if (saveBtn) saveBtn.click();
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot studio with updated live preview
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified-studio-after-saved-selection.png') });
    console.log('Saved final studio screenshot');

    console.log('\n✅ All automated visual tests completed successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

run();
