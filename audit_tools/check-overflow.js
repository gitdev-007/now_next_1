const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to check layout overflow on multiple pages...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const pages = [
    'index.html',
    'hotels.html',
    'airport-transfers.html',
    'plan-my-layover.html'
  ];
  
  for (const p of pages) {
    console.log(`\n--- Auditing ${p} ---`);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`http://localhost:8000/${p}`);
    await page.waitForLoadState('networkidle');
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    console.log(`Viewport: 375px, Body Scroll Width: ${bodyWidth}px`);
    
    const navbarBox = await page.locator('#navbar').boundingBox();
    const menuBtnBox = await page.locator('#menu-btn').boundingBox();
    console.log('Navbar Box:', navbarBox);
    console.log('Menu Button Box:', menuBtnBox);
    
    // Find all elements causing overflow
    const overflowingElements = await page.evaluate(() => {
      const elements = [];
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
      let n;
      while (n = walk.nextNode()) {
        const rect = n.getBoundingClientRect();
        if (rect.right > 375) {
          const classNameStr = typeof n.className === 'string'
            ? n.className
            : (n.className && typeof n.className.baseVal === 'string' ? n.className.baseVal : '');
          elements.push({
            tagName: n.tagName,
            id: n.id,
            className: classNameStr,
            right: rect.right,
            width: rect.width
          });
        }
      }
      return elements;
    });
    
    console.log(`Found ${overflowingElements.length} elements exceeding the 375px viewport boundary.`);
    if (overflowingElements.length > 0) {
      console.log('Top 10 overflowing elements:');
      overflowingElements.slice(0, 10).forEach((el, index) => {
        console.log(`  [${index + 1}] ${el.tagName}${el.id ? '#' + el.id : ''} (${el.className.split(' ').slice(0, 3).join(' ')}...) - Right: ${el.right}px, Width: ${el.width}px`);
      });
    }
  }

  await browser.close();
})();
