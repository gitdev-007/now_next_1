const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const filePath = path.resolve('C:/Users/Dev Tinker/Desktop/now_next/frontend/index.html');
  const url = 'file:///' + filePath.replace(/\\/g, '/');

  const viewports = [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 480, height: 800 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });

    const metrics = await page.evaluate(() => {
      const section = document.getElementById('how-it-works');
      const grid = section.querySelector('.hiw-timeline');
      const heading = section.querySelector('.hiw-heading');
      const subtitle = section.querySelector('.hiw-subtitle');
      const steps = section.querySelectorAll('.hiw-step');
      const icons = section.querySelectorAll('.hiw-step-icon');
      const connector = section.querySelector('.hiw-connector');
      const gridStyle = getComputedStyle(grid);

      const firstTop = steps[0].getBoundingClientRect().top;
      const columns = Array.from(steps).filter(s => Math.abs(s.getBoundingClientRect().top - firstTop) < 5).length;
      const stepHeights = Array.from(steps).map(s => s.getBoundingClientRect().height);
      const iconSize = icons[0] ? `${getComputedStyle(icons[0]).width} x ${getComputedStyle(icons[0]).height}` : 'N/A';

      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      return {
        gridCols: columns,
        gridGap: gridStyle.gap,
        headingFontSize: getComputedStyle(heading).fontSize,
        subtitleFontSize: getComputedStyle(subtitle).fontSize,
        stepCount: steps.length,
        iconCount: icons.length,
        iconSize: iconSize,
        stepHeightsMin: Math.min(...stepHeights).toFixed(0),
        stepHeightsMax: Math.max(...stepHeights).toFixed(0),
        stepHeightsEqual: Math.max(...stepHeights) - Math.min(...stepHeights) < 5,
        stepBorderRadius: getComputedStyle(steps[0]).borderRadius,
        stepPadding: getComputedStyle(steps[0]).padding,
        connectorVisible: connector ? getComputedStyle(connector).display !== 'none' : false,
        overflow: docW > winW,
      };
    });

    console.log(`[${vp.width}px]`, JSON.stringify(metrics));
    await context.close();
  }

  await browser.close();
})();