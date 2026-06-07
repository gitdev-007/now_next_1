const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const logo = await page.$('a.flex.items-center.gap-2'); // Logo
  const h1 = await page.$('h1');
  
  if (logo && h1) {
    const logoBox = await logo.boundingBox();
    const h1Box = await h1.boundingBox();
    console.log('Logo Box:', JSON.stringify(logoBox, null, 2));
    console.log('H1 Box:', JSON.stringify(h1Box, null, 2));
  }
  
  await browser.close();
})();
