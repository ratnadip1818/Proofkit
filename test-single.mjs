import puppeteer from "puppeteer-core";

async function main() {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  
  const p = await b.newPage();
  
  // 1. Screenshot the "card" single quote layout
  await p.setViewport({ width: 800, height: 450 });
  console.log("Navigating to single widget (card)...");
  await p.goto("http://localhost:3000/embed/6e037975-54db-4705-b239-28ef18f95eb8?type=single&layout=card&demo=1", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\single-card-preview.png" });

  // 2. Screenshot the "minimal" single quote layout
  console.log("Navigating to single widget (minimal)...");
  await p.goto("http://localhost:3000/embed/6e037975-54db-4705-b239-28ef18f95eb8?type=single&layout=minimal&demo=1", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\single-minimal-preview.png" });

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
