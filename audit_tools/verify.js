const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('axe-playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const baseURL = 'http://localhost:8000';
  
  const pagesToVisit = ['/index.html', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];
  const auditReport = [];

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const pathName of pagesToVisit) {
    console.log(`Verifying: ${url = baseURL + pathName}`);
    
    const pageReport = { path: pathName, violations: [] };

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle' });
      await injectAxe(page);
      
      const violations = await page.evaluate(() => {
        return new Promise(resolve => {
          window.axe.run((err, results) => {
            resolve(results.violations);
          });
        });
      });
      
      if (violations.length > 0) {
        pageReport.violations.push({ viewport: vp.name, count: violations.length, items: violations.map(v => v.id) });
      }
    }
    auditReport.push(pageReport);
  }

  console.log('Verification Report:', JSON.stringify(auditReport, null, 2));
  await browser.close();
})();
