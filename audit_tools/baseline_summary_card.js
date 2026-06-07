const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  const pagePath = '/plan-my-layover.html';
  
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];
  const screenshotDir = 'audit_tools/summary_card_baseline';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  for (const vp of viewports) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}px)`);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' });
    
    // Select items to populate the summary card
    await page.evaluate(() => {
        // Select some items
        document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => { if (i < 3) cb.click(); });
    });
    
    // Wait for dynamic updates
    await page.waitForTimeout(500);

    // Focus on the card
    const card = await page.$('.sticky');
    if (card) {
        await card.screenshot({ path: path.join(screenshotDir, `card_${vp.name}_baseline.png`) });
    }
    
    await page.screenshot({ path: path.join(screenshotDir, `full_${vp.name}_baseline.png`) });
  }

  await browser.close();
})();
