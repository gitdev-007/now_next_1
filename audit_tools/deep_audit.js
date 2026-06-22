const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Check responsive layout on key pages
  const pages = [
    'index.html', 'hotels.html', 'restaurants.html', 'spa-wellness.html',
    'gaming-entertainment.html', 'experiences.html', 'airport-transfers.html',
    'plan-my-layover.html', 'my-itinerary.html', 'checkout.html',
    'booking-review.html', 'booking-confirmation.html',
    'my-trips.html', 'my-profile.html', 'account-settings.html',
    'partner-registration.html', 'supplier-dashboard.html',
    'revenue-admin.html', 'notifications.html', 'contact.html',
    'how-it-works.html', 'faq.html', 'help-center.html', 'privacy.html', 'terms.html'
  ];

  const issues = [];

  for (const pageName of pages) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:8001/' + pageName, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(500);
    } catch(e) {
      issues.push({ page: pageName, viewport: '1280', error: 'Load failed' });
      await context.close();
      continue;
    }

    // Check for horizontal overflow (common responsive bug)
    const overflowX = await page.evaluate(() => {
      const body = document.body;
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = window.innerWidth;
      const overflowEls = [];
      if (docWidth > viewWidth + 5) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewWidth + 2 && rect.width < 2000) {
            overflowEls.push(el.tagName + (el.className ? '.' + el.className.substring(0,30) : '') + ' right=' + Math.round(rect.right));
            if (overflowEls.length >= 5) break;
          }
        }
      }
      return { overflow: docWidth > viewWidth + 5, elements: overflowEls };
    });

    if (overflowX.overflow) {
      issues.push({ page: pageName, viewport: '1280', error: 'Horizontal overflow', detail: overflowX.elements });
    }

    // Check for sticky nav covering content
    const navOverlap = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (!nav) return false;
      const navRect = nav.getBoundingClientRect();
      const main = document.querySelector('main');
      if (!main) return false;
      const mainRect = main.getBoundingClientRect();
      return navRect.bottom > mainRect.top + 5;
    });

    if (navOverlap) {
      issues.push({ page: pageName, viewport: '1280', error: 'Nav overlaps main content' });
    }

    // Check for empty/placeholder images
    const imgIssues = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0 || !i.src || i.src === window.location.href);
      return broken.map(i => (i.getAttribute('src') || 'empty') + ' alt="' + (i.alt || '') + '"');
    });
    if (imgIssues.length > 0) {
      issues.push({ page: pageName, viewport: '1280', error: 'Broken/missing images', detail: imgIssues });
    }

    // Check viewport meta
    const hasViewport = await page.evaluate(() => {
      const m = document.querySelector('meta[name="viewport"]');
      return m && m.getAttribute('content') && m.getAttribute('content').includes('width=device-width');
    });
    if (!hasViewport) {
      issues.push({ page: pageName, viewport: '1280', error: 'Missing responsive viewport meta' });
    }

    await context.close();
  }

  // Now check mobile (390px) on key pages
  for (const pageName of ['index.html', 'hotels.html', 'plan-my-layover.html', 'my-itinerary.html', 'checkout.html']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:8001/' + pageName, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(500);
    } catch(e) {
      await context.close();
      continue;
    }

    const overflowX = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = window.innerWidth;
      const overflowEls = [];
      if (docWidth > viewWidth + 5) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewWidth + 2 && rect.width < viewWidth + 100) {
            overflowEls.push(el.tagName + '.' + (el.className || '').substring(0,25));
            if (overflowEls.length >= 5) break;
          }
        }
      }
      return { overflow: docWidth > viewWidth + 5, elements: overflowEls };
    });

    if (overflowX.overflow) {
      issues.push({ page: pageName, viewport: '390', error: 'Mobile overflow', detail: overflowX.elements });
    }

    await context.close();
  }

  // Check internal links
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:8001/index.html', { waitUntil: 'load', timeout: 10000 });
  
  const internalLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links
      .map(l => l.getAttribute('href'))
      .filter(h => h && !h.startsWith('#') && !h.startsWith('http') && !h.startsWith('tel:') && !h.startsWith('mailto:'));
  });

  const uniqueLinks = [...new Set(internalLinks)];
  const brokenLinks = [];

  for (const link of uniqueLinks.slice(0, 50)) {
    try {
      // Normalize: handle query params
      const url = link.split('?')[0].split('#')[0];
      if (!url || url === '') continue;
      
      const resp = await page.goto('http://localhost:8001/' + url, { waitUntil: 'load', timeout: 5000 });
      if (resp && resp.status() >= 400) {
        brokenLinks.push(link + ' -> ' + resp.status());
      }
    } catch(e) {
      brokenLinks.push(link + ' -> ' + e.message.substring(0, 50));
    }
  }

  if (brokenLinks.length > 0) {
    issues.push({ page: 'SITE-WIDE', viewport: 'all', error: 'Broken internal links', detail: brokenLinks });
  }
  
  await context.close();
  await browser.close();

  console.log(JSON.stringify(issues, null, 2));
  if (issues.length === 0) console.log('No issues found across all checks.');
  else console.log('\n' + issues.length + ' issue(s) found.');
})();
