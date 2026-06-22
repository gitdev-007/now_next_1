const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const pages = [
    'index.html', 'hotels.html', 'restaurants.html', 'spa-wellness.html',
    'gaming-entertainment.html', 'experiences.html', 'airport-transfers.html',
    'how-it-works.html', 'contact.html', 'faq.html', 'help-center.html',
    'plan-my-layover.html', 'my-itinerary.html', 'checkout.html',
    'booking-review.html', 'payment-selection.html', 'booking-confirmation.html',
    'my-trips.html', 'my-profile.html', 'account-settings.html',
    'saved-itineraries.html', 'trip-details.html', 'service-details.html',
    'partner-registration.html', 'supplier-dashboard.html', 'supplier-status.html',
    'revenue-admin.html', 'notifications.html', 'privacy.html', 'terms.html'
  ];
  const errors = [];
  
  for (const pageName of pages) {
    const page = await browser.newPage();
    const pageErrors = [];
    const resourceErrors = [];
    
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('response', response => {
      if (response.status() >= 400) {
        const url = response.url().replace('http://localhost:8001/', '');
        resourceErrors.push('HTTP ' + response.status() + ': ' + url);
      }
    });
    
    try {
      await page.goto('http://localhost:8001/' + pageName, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(500);
    } catch (e) {
      errors.push({ page: pageName, issues: ['PAGE LOAD FAILED: ' + e.message] });
      await page.close();
      continue;
    }
    
    const issues = [];
    if (pageErrors.length > 0) issues.push('JS Errors: ' + pageErrors.join('; '));
    if (resourceErrors.length > 0) issues.push('Broken resources: ' + resourceErrors.slice(0,10).join(' | '));
    
    // Get page info
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const title = document.title;
      const hasMain = !!document.querySelector('main');
      const hasNav = !!document.querySelector('nav');
      const hasFooter = !!document.querySelector('footer');
      const images = Array.from(document.images).map(i => ({
        src: i.src.replace('http://localhost:8001/', ''),
        naturalWidth: i.naturalWidth,
        naturalHeight: i.naturalHeight,
        complete: i.complete
      }));
      const brokenImgs = images.filter(i => !i.complete || i.naturalWidth === 0);
      return { h1: h1 ? h1.textContent : null, title, hasMain, hasNav, hasFooter, brokenImages: brokenImgs.length > 0 ? brokenImgs.map(i => i.src) : [] };
    });
    
    if (!info.hasMain) issues.push('Missing <main> element');
    if (!info.hasNav) issues.push('Missing <nav>/navbar');
    if (!info.hasFooter) issues.push('Missing <footer>');
    if (info.brokenImages && info.brokenImages.length > 0) issues.push('Broken images: ' + info.brokenImages.join(', '));
    if (!info.h1) issues.push('Missing H1 heading');
    
    if (issues.length > 0) {
      errors.push({ page: pageName, title: info.title, issues });
      console.log('ISSUES FOUND: ' + pageName);
      issues.forEach(i => console.log('  - ' + i));
    } else {
      console.log('OK: ' + pageName + ' (' + (info.h1 || '').substring(0,40) + ')');
    }
    
    await page.close();
  }
  
  if (errors.length === 0) {
    console.log('\n✓ All 30 pages clean! No issues found.');
  } else {
    console.log('\n=== SUMMARY: ' + errors.length + ' pages have issues ===');
  }
  await browser.close();
})();
