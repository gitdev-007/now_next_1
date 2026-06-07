const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8001/', { waitUntil: 'networkidle' });
  
  const navbar = await page.$('#navbar');
  if (navbar) {
    await navbar.screenshot({ path: 'audit_tools/navbar_debug.png' });
    
    const links = await page.$$('.nav-link');
    const linkData = [];
    for (const link of links) {
      const box = await link.boundingBox();
      const text = await link.innerText();
      linkData.push({ text, box });
    }
    console.log('Navbar Link Boxes:', JSON.stringify(linkData, null, 2));
  }
  
  await browser.close();
})();
