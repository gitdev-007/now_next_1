const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to check computed styles...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:8000/airport-transfers.html');
  await page.waitForLoadState('networkidle');
  
  // Click hamburger menu to open it
  await page.click('#menu-btn');
  await page.waitForTimeout(500);
  
  // Get computed styles of mobile menu links
  const linkStyles = await page.evaluate(() => {
    const links = document.querySelectorAll('#mobile-menu a');
    return Array.from(links).map(link => {
      const computed = window.getComputedStyle(link);
      return {
        text: link.textContent.trim().split('\n')[0],
        className: link.className,
        display: computed.display,
        width: computed.width,
        height: computed.height,
        flexDirection: computed.flexDirection
      };
    });
  });
  
  console.log('Mobile menu links computed styles:');
  linkStyles.forEach((style, i) => {
    console.log(`[${i + 1}] "${style.text}": display=${style.display}, width=${style.width}, height=${style.height}, classes="${style.className}"`);
  });

  await browser.close();
})();
