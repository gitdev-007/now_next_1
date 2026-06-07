const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const tailwindLoaded = await page.evaluate(() => {
    return typeof window.tailwind !== 'undefined';
  });
  console.log('Tailwind Object exists:', tailwindLoaded);

  const styleTags = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('style')).map(s => s.innerText.substring(0, 100));
  });
  console.log('Style Tags (first 100 chars):', styleTags);

  await browser.close();
})();
