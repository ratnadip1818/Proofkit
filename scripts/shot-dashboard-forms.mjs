import puppeteer from "puppeteer-core";

async function takeScreenshot(width, height, name) {
  console.log(`Taking screenshot for ${name} (${width}x${height})...`);
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height });

  // Login
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
  await page.type("#email", "ratnadipubale01@gmail.com");
  await page.type("#password", "TestPassword123!");
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 1000));

  // Navigate to forms page
  await page.goto("http://localhost:3000/dashboard/forms", { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 3000));

  // Take screenshot
  await page.screenshot({ path: `C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\forms-grid-${name}.png` });
  await browser.close();
  console.log(`Screenshot for ${name} saved!`);
}

async function main() {
  await takeScreenshot(1440, 900, "desktop");
  await takeScreenshot(380, 800, "mobile");
  console.log("Visual verification test completed!");
}

main();
