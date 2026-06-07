const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const h1 = await page.$('h1');
  const p = await page.$('h1 + p');
  
  if (h1 && p) {
    const h1Box = await h1.boundingBox();
    const pBox = await p.boundingBox();
    console.log('H1 Box:', JSON.stringify(h1Box, null, 2));
    console.log('P Box:', JSON.stringify(pBox, null, 2));
    
    await h1.screenshot({ path: 'audit_tools/h1_debug.png' });
    await p.screenshot({ path: 'audit_tools/p_debug.png' });
  }
  
  await browser.close();
})();
