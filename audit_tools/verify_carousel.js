const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  
  const screenshotDir = 'audit_tools/carousel_verify';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    console.log(`Verifying viewport: ${vp.name}`);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    
    // 1. Initial view
    await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_1_initial.png`) });

    if (vp.name !== 'mobile') {
      // 2. Click next
      const nextBtn = await page.$('#next-service');
      if (nextBtn && await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(800); // Wait for scroll
        await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_2_scrolled.png`) });
      }
    } else {
      // Mobile swipe simulation
      await page.mouse.move(300, 400);
      await page.mouse.down();
      await page.mouse.move(50, 400);
      await page.mouse.up();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_2_swiped.png`) });
    }
    
    // Check console logs for errors
    page.on('console', msg => {
      if (msg.type() === 'error') console.error('PAGE ERROR:', msg.text());
    });
  }

  await browser.close();
})();
