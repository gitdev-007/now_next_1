const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const h1 = await page.$('h1');
  if (h1) {
    const style = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        fontWeight: s.fontWeight,
        color: s.color,
        fontSize: s.fontSize
      };
    }, h1);
    console.log('H1 Computed Styles:', JSON.stringify(style, null, 2));
  }
  
  const hero = await page.$('#hero-section');
  if (hero) {
    const heroClasses = await page.evaluate(el => el.className, hero);
    console.log('Hero Classes:', heroClasses);
  }

  await browser.close();
})();
