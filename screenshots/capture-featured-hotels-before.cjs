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
    } catch (e) {}

    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    });
    await page.waitForTimeout(800);

    // Capture the experiences section (where hotels currently are)
    const section = await page.$('#experiences');
    if (section) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      try {
        await section.screenshot({ path: path.join(screensDir, `featured-hotels-before-${vp.name}.png`) });
        console.log(`[${vp.name}] Before screenshot captured`);
      } catch (e) {
        console.log(`[${vp.name}] Screenshot error: ${e.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('---ERRORS---');
  console.log(errors.length ? errors.join('\n') : 'none');
  console.log('---DONE---');
})();