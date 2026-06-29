/**
 * Sprint 19 - Performance Audit Script
 * Runs Lighthouse-style audits using Playwright
 */

const { chromium } = require('playwright');

const pages = [
  { url: '/', name: 'Homepage' },
  { url: '/hotels.html', name: 'Hotels' },
  { url: '/restaurants.html', name: 'Restaurants' },
  { url: '/experiences.html', name: 'Experiences' },
  { url: '/airport-transfers.html', name: 'Airport Transfers' },
  { url: '/plan-my-layover.html', name: 'Plan My Layover' },
  { url: '/booking-review.html', name: 'Booking Review' },
  { url: '/checkout.html', name: 'Checkout' },
  { url: '/payment-selection.html', name: 'Payment Selection' },
  { url: '/booking-confirmation.html', name: 'Booking Confirmation' },
  { url: '/my-profile.html', name: 'My Profile' },
  { url: '/my-trips.html', name: 'My Trips' },
  { url: '/notifications.html', name: 'Notifications' },
  { url: '/account-settings.html', name: 'Account Settings' },
  { url: '/supplier-dashboard.html', name: 'Supplier Dashboard' },
  { url: '/revenue-admin.html', name: 'Revenue Admin' },
];

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const pg of pages) {
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const failedResources = [];
    const warnings = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        failedResources.push({ url: response.url(), status: response.status() });
      }
    });

    // Measure navigation timing
    const navigationTiming = await page.goto(`http://localhost:8000${pg.url}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    }).then(() =>
      page.evaluate(() => {
        const [nav] = performance.getEntriesByType('navigation');
        return {
          ttfb: nav ? nav.responseStart - nav.requestStart : 0,
          domLoad: nav ? nav.domContentLoadedEventEnd - nav.requestStart : 0,
          pageLoad: nav ? nav.loadEventEnd - nav.requestStart : 0,
          domInteractive: nav ? nav.domInteractive : 0,
        };
      })
    ).catch(() => null);

    // Check LCP element
    const lcpInfo = await page.evaluate(() => {
      return new Promise(resolve => {
        if ('PerformanceObserver' in window) {
          try {
            let lcp;
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              lcp = entries[entries.length - 1];
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            setTimeout(() => {
              observer.disconnect();
              resolve(lcp ? { element: lcp.element?.tagName || 'unknown', size: lcp.size, time: lcp.startTime } : null);
            }, 2000);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });

    // Check CLS
    const cls = await page.evaluate(() => {
      let clsValue = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}
      return clsValue;
    });

    // Check for images missing lazy loading
    const imagesInfo = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const missingLazy = imgs.filter(img => !img.loading && !img.src?.includes('data:')).map(img => ({
        src: img.src?.substring(0, 80),
        hasWidth: !!img.width,
        hasHeight: !!img.height,
      }));
      const missingDimensions = imgs.filter(img => !img.width || !img.height).map(img => img.src?.substring(0, 80));
      return { total: imgs.length, missingLazy, missingDimensions };
    });

    // Check viewport overflow
    const viewportInfo = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        hasOverflowX: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    // Get page title and meta info
    const seoInfo = await page.evaluate(() => {
      const metaDesc = document.querySelector('meta[name="description"]');
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const canonical = document.querySelector('link[rel="canonical"]');
      const twitter = document.querySelector('meta[name="twitter:card"]');
      const h1 = document.querySelector('h1')?.textContent?.trim();
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()).slice(0, 5);
      return {
        title: document.title,
        metaDesc: metaDesc?.content,
        metaKeywords: metaKeywords?.content,
        ogTitle: ogTitle?.content,
        ogDesc: ogDesc?.content,
        ogImage: ogImage?.content,
        canonical: canonical?.href,
        twitter: twitter?.content,
        h1,
        h2s,
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
      };
    });

    // Accessibility quick check
    const accessibilityInfo = await page.evaluate(() => {
      const skipLink = document.querySelector('a[href="#main-content"], a[href="#content"]');
      const mainLandmark = document.querySelector('main, [role="main"]');
      const navLandmark = document.querySelector('nav, [role="navigation"]');
      const footerLandmark = document.querySelector('footer, [role="contentinfo"]');
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a[href]'));
      const images = Array.from(document.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter(img => !img.alt && !img.getAttribute('role'));
      const inputs = Array.from(document.querySelectorAll('input'));
      const inputsWithoutLabels = inputs.filter(input => {
        const id = input.id;
        if (id && document.querySelector(`label[for="${id}"]`)) return false;
        if (input.getAttribute('aria-label')) return false;
        if (input.getAttribute('aria-labelledby')) return false;
        if (input.closest('label')) return false;
        return true;
      });
      return {
        hasSkipLink: !!skipLink,
        hasMainLandmark: !!mainLandmark,
        hasNavLandmark: !!navLandmark,
        hasFooterLandmark: !!footerLandmark,
        buttonsTotal: buttons.length,
        linksTotal: links.length,
        imagesTotal: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        inputsWithoutLabels: inputsWithoutLabels.length,
        inputsTotal: inputs.length,
      };
    });

    await context.close();

    results.push({
      page: pg.name,
      url: pg.url,
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      navigationTiming,
      lcpInfo,
      cls: cls || 0,
      imagesInfo,
      viewportInfo,
      seoInfo,
      accessibilityInfo,
      errors,
      failedResources,
    });
  }

  await browser.close();

  // Print summary
  console.log('\n========== PERFORMANCE AUDIT RESULTS ==========\n');
  for (const r of results) {
    console.log(`\n--- ${r.page} (${r.url}) ---`);
    console.log(`  Status: ${r.status}`);
    if (r.navigationTiming) {
      console.log(`  TTFB: ${r.navigationTiming.ttfb}ms`);
      console.log(`  DOM Content Loaded: ${r.navigationTiming.domLoad}ms`);
      console.log(`  Page Load: ${r.navigationTiming.pageLoad}ms`);
    }
    if (r.lcpInfo) {
      console.log(`  LCP Element: ${r.lcpInfo.element}, Size: ${r.lcpInfo.size}, Time: ${r.lcpInfo.time?.toFixed(2)}ms`);
    }
    if (r.cls !== undefined) {
      console.log(`  CLS: ${r.cls.toFixed(4)}`);
    }
    if (r.imagesInfo) {
      console.log(`  Images: ${r.imagesInfo.total} total, ${r.imagesInfo.missingLazy.length} missing lazy-load, ${r.imagesInfo.missingDimensions.length} missing dimensions`);
    }
    if (r.viewportInfo) {
      console.log(`  Viewport: ${r.viewportInfo.innerWidth}x${r.viewportInfo.innerHeight}, Overflow X: ${r.viewportInfo.hasOverflowX}`);
    }
    if (r.seoInfo) {
      console.log(`  Title: "${r.seoInfo.title?.substring(0, 60)}"`);
      console.log(`  Meta Desc: ${r.seoInfo.metaDesc ? 'YES' : 'MISSING'}`);
      console.log(`  OG Tags: ${r.seoInfo.ogTitle && r.seoInfo.ogDesc ? 'YES' : 'INCOMPLETE'}`);
      console.log(`  Canonical: ${r.seoInfo.canonical || 'MISSING'}`);
      console.log(`  H1: "${r.seoInfo.h1?.substring(0, 40)}"`);
    }
    if (r.accessibilityInfo) {
      console.log(`  Accessibility:`);
      console.log(`    Skip Link: ${r.accessibilityInfo.hasSkipLink ? 'YES' : 'MISSING'}`);
      console.log(`    Main/Nav/Footer landmarks: ${r.accessibilityInfo.hasMainLandmark}/${r.accessibilityInfo.hasNavLandmark}/${r.accessibilityInfo.hasFooterLandmark}`);
      console.log(`    Images without alt: ${r.accessibilityInfo.imagesWithoutAlt}`);
      console.log(`    Inputs without labels: ${r.accessibilityInfo.inputsWithoutLabels}/${r.accessibilityInfo.inputsTotal}`);
    }
    if (r.errors.length > 0) {
      console.log(`  ERRORS (${r.errors.length}):`);
      r.errors.slice(0, 3).forEach(e => console.log(`    - ${e.substring(0, 120)}`));
    }
    if (r.failedResources.length > 0) {
      console.log(`  FAILED RESOURCES (${r.failedResources.length}):`);
      r.failedResources.slice(0, 5).forEach(f => console.log(`    - ${f.status} ${f.url.substring(0, 80)}`));
    }
  }

  // Save to file
  const fs = require('fs');
  fs.writeFileSync('test-results/performance-audit.json', JSON.stringify(results, null, 2));
  console.log('\n\nFull results saved to test-results/performance-audit.json');
})();