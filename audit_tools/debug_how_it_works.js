const { chromium } = require('playwright');
const { injectAxe } = require('axe-playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/how-it-works.html', { waitUntil: 'networkidle' });
  await injectAxe(page);
  const results = await page.evaluate(() => new Promise(resolve => window.axe.run(resolve)));
  
  if (results.violations) {
    results.violations.forEach(v => {
      console.log(`Violation: ${v.id} (${v.impact})`);
      v.nodes.forEach(n => {
        console.log(`  - Node: ${n.html}`);
        console.log(`    Summary: ${n.failureSummary}`);
      });
    });
  }

  await browser.close();
})();
