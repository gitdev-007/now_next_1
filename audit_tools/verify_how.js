const { chromium } = require('playwright');
const { injectAxe } = require('axe-playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/how-it-works.html', { waitUntil: 'networkidle' });
  await injectAxe(page);
  const results = await page.evaluate(() => {
    return new Promise(resolve => {
      window.axe.run((err, results) => {
        resolve(results);
      });
    });
  });
  
  console.log('Violations Count:', results.violations.length);
  results.violations.forEach(v => {
    console.log(`- ${v.id} (${v.impact})`);
  });

  await browser.close();
})();
