const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8001';
  
  const pages = ['/', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];
  
  const overlaps = [];

  for (const p of pages) {
    console.log(`Checking overlaps: ${p}`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}${p}`, { waitUntil: 'networkidle' });
    
    const pageOverlaps = await page.evaluate(() => {
      const results = [];
      const all = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button, img'));
      
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          const r1 = all[i].getBoundingClientRect();
          const r2 = all[j].getBoundingClientRect();
          
          if (r1.width === 0 || r1.height === 0 || r2.width === 0 || r2.height === 0) continue;
          
          const isOverlapping = !(r1.right < r2.left || 
                                 r1.left > r2.right || 
                                 r1.bottom < r2.top || 
                                 r1.top > r2.bottom);
                                 
          if (isOverlapping) {
            // Check if one is parent of another (nested elements overlap by definition)
            if (all[i].contains(all[j]) || all[j].contains(all[i])) continue;
            
            // Check if they are actually visible
            const s1 = window.getComputedStyle(all[i]);
            const s2 = window.getComputedStyle(all[j]);
            if (s1.display === 'none' || s1.visibility === 'hidden' || s1.opacity === '0') continue;
            if (s2.display === 'none' || s2.visibility === 'hidden' || s2.opacity === '0') continue;

            results.push({
              el1: { tag: all[i].tagName, text: all[i].innerText.substring(0, 20), classes: all[i].className },
              el2: { tag: all[j].tagName, text: all[j].innerText.substring(0, 20), classes: all[j].className }
            });
          }
        }
      }
      return results;
    });
    
    if (pageOverlaps.length > 0) {
      overlaps.push({ page: p, overlaps: pageOverlaps });
    }
  }

  fs.writeFileSync('overlap_issues.json', JSON.stringify(overlaps, null, 2));
  await browser.close();
})();
