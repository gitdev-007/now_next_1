const { chromium } = require('playwright');
const { injectAxe } = require('axe-playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  
  const pages = ['/index.html', '/hotels.html'];

  for (const p of pages) {
    console.log(`--- Violations for ${p} ---`);
    await page.goto(`${baseURL}${p}`, { waitUntil: 'networkidle' });
    await injectAxe(page);
    
    const results = await page.evaluate(() => {
      return new Promise(resolve => {
        window.axe.run((err, results) => {
          resolve(results.violations);
        });
      });
    });
    
    results.forEach(v => {
      console.log(`Violation: ${v.id} (${v.impact})`);
      v.nodes.forEach(n => {
        console.log(`  - Node: ${n.html}`);
        console.log(`    Summary: ${n.failureSummary}`);
      });
    });
  }

  await browser.close();
})();
