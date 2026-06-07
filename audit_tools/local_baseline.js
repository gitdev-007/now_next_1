const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:8001';
const pages = [
  { name: 'home', path: '/' },
  { name: 'hotels', path: '/hotels.html' },
  { name: 'restaurants', path: '/restaurants.html' },
  { name: 'experiences', path: '/experiences.html' },
  { name: 'transfers', path: '/airport-transfers.html' },
  { name: 'how-it-works', path: '/how-it-works.html' },
  { name: 'contact', path: '/contact.html' },
  { name: 'planner', path: '/plan-my-layover.html' }
];

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const screenshotDir = path.join(__dirname, 'screenshots_local');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  for (const p of pages) {
    console.log(`Processing page: ${p.name}`);
    for (const vp of viewports) {
      console.log(`  Viewport: ${vp.name}`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${baseURL}${p.path}`, { waitUntil: 'networkidle' });
      
      const fileName = `${p.name}_${vp.name}.png`;
      await page.screenshot({ path: path.join(screenshotDir, fileName), fullPage: true });
    }
  }

  await browser.close();
  console.log('Local baseline screenshots captured in screenshots_local/');
})();
