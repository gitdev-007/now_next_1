const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8001/test_tailwind.html', { waitUntil: 'networkidle' });
  
  const div = await page.$('div');
  if (div) {
    const style = await page.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, color: s.color };
    }, div);
    console.log('Test Page Styles:', JSON.stringify(style, null, 2));
  }
  
  const styleTags = await page.evaluate(() => document.querySelectorAll('style').length);
  console.log('Style tags count:', styleTags);

  await browser.close();
})();
