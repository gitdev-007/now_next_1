const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'https://next-layoverx-1.vercel.app';
  
  const pages = ['/', '/hotels.html', '/how-it-works.html'];
  const results = [];

  for (const p of pages) {
    console.log(`Scrolling check: ${p}`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}${p}`, { waitUntil: 'networkidle' });
    
    // Top state
    const topState = await page.evaluate(() => {
      const h = document.querySelector('#navbar');
      const logo = document.querySelector('#logo-text');
      return {
        bg: window.getComputedStyle(h).backgroundColor,
        color: logo ? window.getComputedStyle(logo).color : 'N/A',
        classes: h.className
      };
    });

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500); // Wait for transition

    const scrolledState = await page.evaluate(() => {
      const h = document.querySelector('#navbar');
      const logo = document.querySelector('#logo-text');
      return {
        bg: window.getComputedStyle(h).backgroundColor,
        color: logo ? window.getComputedStyle(logo).color : 'N/A',
        classes: h.className
      };
    });

    results.push({ page: p, top: topState, scrolled: scrolledState });
    
    await page.screenshot({ path: `audit_tools/scroll_check_${p.replace(/\//g, 'home')}.png`, fullPage: false });
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
