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

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const screenshotDir = path.join(__dirname, 'screenshots_local_top');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  for (const p of pages) {
    console.log(`Checking TOP: ${p.name}`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}${p.path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotDir, `${p.name}_top.png`) });
  }

  await browser.close();
})();
