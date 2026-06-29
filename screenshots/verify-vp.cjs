const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const filePath = path.resolve('C:/Users/Dev Tinker/Desktop/now_next/frontend/index.html');
  const url = 'file:///' + filePath.replace(/\\/g, '/');

  const viewports = [
    { name: '320', width: 320, height: 568 },
    { name: '375', width: 375, height: 812 },
    { name: '390', width: 390, height: 844 },
    { name: '480', width: 480, height: 800 },
    { name: '768', width: 768, height: 1024 },
    { name: '1024', width: 1024, height: 768 },
    { name: '1280', width: 1280, height: 800 },
    { name: '1440', width: 1440, height: 900 },
    { name: '1920', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });

    const metrics = await page.evaluate(() => {
      const section = document.getElementById('value-proposition');
      const grid = section.querySelector('.vp-grid');
      const heading = section.querySelector('.vp-heading');
      const subtitle = section.querySelector('.vp-subtitle');
      const cards = section.querySelectorAll('.vp-card');
      const icons = section.querySelectorAll('.vp-card-icon');
      const gridStyle = getComputedStyle(grid);
      const sectionStyle = getComputedStyle(section);

      // Card heights
      const cardHeights = Array.from(cards).map(c => c.getBoundingClientRect().height);

      // Grid columns (count columns based on first card position)
      const firstTop = cards[0].getBoundingClientRect().top;
      const columns = Array.from(cards).filter(c => Math.abs(c.getBoundingClientRect().top - firstTop) < 5).length;

      // Overflow check
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const overflow = docW > winW;

      return {
        sectionWidth: section.getBoundingClientRect().width.toFixed(0),
        gridCols: columns,
        gridGap: gridStyle.gap,
        gridDisplay: gridStyle.display,
        headingFontSize: getComputedStyle(heading).fontSize,
        subtitleFontSize: getComputedStyle(subtitle).fontSize,
        cardCount: cards.length,
        iconCount: icons.length,
        iconSize: icons[0] ? `${getComputedStyle(icons[0]).width} x ${getComputedStyle(icons[0]).height}` : 'N/A',
        iconBorderRadius: icons[0] ? getComputedStyle(icons[0]).borderRadius : 'N/A',
        cardHeightsMin: Math.min(...cardHeights).toFixed(0),
        cardHeightsMax: Math.max(...cardHeights).toFixed(0),
        cardHeightsEqual: Math.max(...cardHeights) - Math.min(...cardHeights) < 5,
        cardBorderRadius: getComputedStyle(cards[0]).borderRadius,
        cardPadding: getComputedStyle(cards[0]).padding,
        overflow: overflow,
        docScrollWidth: docW,
        winWidth: winW,
      };
    });

    console.log(`[${vp.width}px]`, JSON.stringify(metrics, null, 2));
    await context.close();
  }

  await browser.close();
})();