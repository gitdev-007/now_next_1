const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:8000';
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

const viewports = [375, 768, 1440];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const screenshotDir = path.join(__dirname, 'screenshots_hero_fix');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  for (const p of pages) {
    console.log(`Verifying: ${p.name}`);
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${baseURL}${p.path}`, { waitUntil: 'networkidle' });
      
      const fileName = `${p.name}_w${width}_after.png`;
      await page.screenshot({ path: path.join(screenshotDir, fileName), fullPage: false });
    }
  }

  await browser.close();
  console.log('Verification screenshots complete.');
})();
