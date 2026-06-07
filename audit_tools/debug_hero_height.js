const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const hero = await page.$('#hero-section');
  if (hero) {
    const box = await hero.boundingBox();
    console.log('Hero Box:', JSON.stringify(box, null, 2));
    const style = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        height: s.height,
        minHeight: s.minHeight,
        display: s.display,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent
      };
    }, hero);
    console.log('Hero Styles:', JSON.stringify(style, null, 2));
  }
  
  await browser.close();
})();
