const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8001';
  
  const pages = ['/', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];
  const viewports = [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920];
  
  const issues = [];

  for (const p of pages) {
    console.log(`Auditing responsiveness: ${p}`);
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`${baseURL}${p}`, { waitUntil: 'networkidle' });
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        const overflowElements = await page.evaluate(() => {
          const all = document.querySelectorAll('*');
          const results = [];
          for (const el of all) {
            if (el.scrollWidth > el.clientWidth) {
               results.push({
                 tag: el.tagName,
                 id: el.id,
                 classes: el.className,
                 scrollWidth: el.scrollWidth,
                 clientWidth: el.clientWidth
               });
            }
          }
          return results;
        });
        
        issues.push({ page: p, width, type: 'horizontal_scroll', elements: overflowElements });
        console.warn(`  [ISSUE] Horizontal scroll at ${width}px on ${p}`);
      }
      
      // Check for overlapping elements or clipped text (basic heuristic)
      const visibleTexts = await page.evaluate(() => {
        const texts = [];
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
          const parent = node.parentElement;
          if (!parent) continue;
          const rect = parent.getBoundingClientRect();
          if (rect.height === 0 || rect.width === 0) continue;
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          
          // Heuristic: if parent has fixed height but content is larger
          if (style.height !== 'auto' && parent.scrollHeight > parent.clientHeight + 2 && style.overflow === 'hidden') {
             texts.push({ text: node.textContent.trim(), parent: parent.tagName, classes: parent.className });
          }
        }
        return texts;
      });
      
      if (visibleTexts.length > 0) {
        issues.push({ page: p, width, type: 'clipped_text', elements: visibleTexts });
        console.warn(`  [ISSUE] Clipped text at ${width}px on ${p}`);
      }
    }
  }

  fs.writeFileSync('responsiveness_issues.json', JSON.stringify(issues, null, 2));
  await browser.close();
})();
