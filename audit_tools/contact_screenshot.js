const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Dev Tinker\\.gemini\\antigravity-ide\\brain\\aa93e734-8169-4a3c-ab50-f76a5f6e8625';

async function run() {
  console.log('Starting Contact page screenshot validation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Desktop check
  console.log('Checking desktop layout (1280x800)...');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000/contact.html');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact_desktop.png'), fullPage: false });
  console.log('Saved contact_desktop.png');

  // Tablet check
  console.log('Checking tablet layout (768x1024)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact_tablet.png'), fullPage: false });
  console.log('Saved contact_tablet.png');

  // Mobile check
  console.log('Checking mobile layout (390x800)...');
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'contact_mobile.png'), fullPage: false });
  console.log('Saved contact_mobile.png');

  await browser.close();
  console.log('Screenshot validation completed!');
}

run().catch(err => {
  console.error('Error in screenshot script:', err);
  process.exit(1);
});
