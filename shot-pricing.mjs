import puppeteer from "puppeteer-core";

async function main() {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 1080 });

  console.log("Navigating to homepage...");
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle2" });

  console.log("Scrolling to pricing section...");
  await p.evaluate(() => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView();
  });

  console.log("Waiting 2.5s for scroll reveals and layout rendering...");
  await new Promise((r) => setTimeout(r, 2500));

  console.log("Taking pricing section screenshot...");
  const el = await p.$("#pricing");
  if (el) {
    await el.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\pricing-section.png" });
  } else {
    await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\pricing-fallback.png" });
  }

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
