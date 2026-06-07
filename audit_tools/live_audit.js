const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseURL = 'https://next-layoverx-1.vercel.app';
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

const viewports = [320, 375, 390, 768, 1024, 1440, 1920];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const screenshotDir = path.join(__dirname, 'screenshots_live_before');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  const logs = [];

  for (const p of pages) {
    console.log(`Auditing LIVE: ${p.name}`);
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      try {
        await page.goto(`${baseURL}${p.path}`, { waitUntil: 'networkidle' });
        
        // Check header visibility
        const headerData = await page.evaluate(() => {
          const header = document.querySelector('#navbar');
          if (!header) return { found: false };
          const rect = header.getBoundingClientRect();
          const style = window.getComputedStyle(header);
          const logo = document.querySelector('#logo-text');
          const logoStyle = logo ? window.getComputedStyle(logo) : {};
          return {
            found: true,
            visible: rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
            backgroundColor: style.backgroundColor,
            color: logoStyle.color,
            opacity: style.opacity,
            zIndex: style.zIndex,
            rect
          };
        });

        const fileName = `${p.name}_w${width}.png`;
        await page.screenshot({ path: path.join(screenshotDir, fileName), fullPage: true });

        logs.push({
          page: p.name,
          width,
          header: headerData,
          errors: consoleErrors
        });

      } catch (e) {
        console.error(`  Failed ${p.name} at ${width}: ${e.message}`);
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, 'live_audit_before.json'), JSON.stringify(logs, null, 2));
  await browser.close();
  console.log('Live audit before changes complete.');
})();
