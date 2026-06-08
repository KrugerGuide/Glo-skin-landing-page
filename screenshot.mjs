import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const label = process.argv[3] || 'glo-skin';

if (!url) {
  console.error("❌ Usage: node screenshot.mjs <url> [label]");
  process.exit(1);
}

console.log(`📸 Taking screenshot of: ${url}`);

const screenshotsDir = 'temporary screenshots';

try {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1200 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForTimeout(1200);

  const timestamp = Date.now();
  const filename = path.join(screenshotsDir, `screenshot-${timestamp}-${label}.png`);

  await page.screenshot({ path: filename, fullPage: true });
  console.log(`✅ Screenshot saved: ${filename}`);

  await browser.close();
} catch (error) {
  console.error("❌ Screenshot failed:", error.message);
}