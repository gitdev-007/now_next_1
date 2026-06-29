const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const filePath = path.resolve('C:/Users/Dev Tinker/Desktop/now_next/frontend/index.html');
  const url = 'file:///' + filePath.replace(/\\/g, '/');
  const screensDir = path.resolve('C:/Users/Dev Tinker/Desktop/now_next/screenshots');

  const viewports = [
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'desktop-1280', width: 1280, height: 800 },
    { name: 'tablet-1024', width: 1024, height: 768 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-480', width: 480, height: 800 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-320', width: 320, height: 568 },
  ];

  const errors = [];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`[${vp.name}] pageerror: ${e.message}`));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(`[${vp.name}] console.error: ${msg.text()}`);
    });

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    } catch (e) {
      console.log(`[${vp.name}] load error: ${e.message}`);
    }

    // Force reveal animation to complete
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    });
    await page.waitForTimeout(800);

    const section = await page.$('#value-proposition');
    if (!section) {
      console.log(`[${vp.name}] Section not found!`);
      await context.close();
      continue;
    }

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Full page screenshot for context (only first viewport)
    if (vp.name === 'desktop-1920') {
      try {
        await page.screenshot({ path: path.join(screensDir, `vp-page-desktop.png`), fullPage: false });
      } catch (e) {}
    }

    try {
      await section.screenshot({ path: path.join(screensDir, `vp-${vp.name}.png`) });
      console.log(`[${vp.name}] Screenshot captured`);
    } catch (e) {
      console.log(`[${vp.name}] Screenshot error: ${e.message}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('---ERRORS---');
  console.log(errors.length ? errors.join('\n') : 'none');
  console.log('---DONE---');
})();