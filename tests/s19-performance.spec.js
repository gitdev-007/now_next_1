/**
 * Sprint 19 - Performance Audit - Run with: npx playwright test tests/s19-performance.spec.js
 */

const { test, expect } = require('@playwright/test');

const auditPages = [
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

test.describe('Sprint 19 Performance Audit', () => {

  for (const pg of auditPages) {
    test(`${pg.name} - Performance Audit`, async ({ page }) => {
      const errors = [];
      const failedResources = [];

      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      page.on('response', response => {
        if (response.status() >= 400) {
          failedResources.push({ url: response.url(), status: response.status() });
        }
      });

      await page.goto(pg.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Get navigation timing
      const timing = await page.evaluate(() => {
        const [nav] = performance.getEntriesByType('navigation');
        return {
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
          domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.requestStart) : 0,
          pageLoad: nav ? Math.round(nav.loadEventEnd - nav.requestStart) : 0,
        };
      });

      // Get viewport info
      const viewport = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        hasOverflowX: document.documentElement.scrollWidth > window.innerWidth,
      }));

      // Get image info
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return {
          total: imgs.length,
          missingLazy: imgs.filter(img => !img.loading && !img.src?.includes('data:')).length,
          missingDimensions: imgs.filter(img => !img.width || !img.height).length,
        };
      });

      // Get SEO info
      const seo = await page.evaluate(() => ({
        title: document.title,
        metaDesc: !!document.querySelector('meta[name="description"]'),
        ogTitle: !!document.querySelector('meta[property="og:title"]'),
        ogDesc: !!document.querySelector('meta[property="og:description"]'),
        ogImage: !!document.querySelector('meta[property="og:image"]'),
        canonical: !!document.querySelector('link[rel="canonical"]'),
        twitter: !!document.querySelector('meta[name="twitter:card"]'),
        h1: document.querySelector('h1')?.textContent?.trim() || null,
        viewportMeta: !!document.querySelector('meta[name="viewport"]'),
      }));

      // Get accessibility info
      const a11y = await page.evaluate(() => ({
        hasSkipLink: !!document.querySelector('a[href="#main-content"], a[href="#content"]'),
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNav: !!document.querySelector('nav, [role="navigation"]'),
        hasFooter: !!document.querySelector('footer, [role="contentinfo"]'),
        imagesWithoutAlt: Array.from(document.querySelectorAll('img')).filter(img => !img.alt && !img.getAttribute('aria-hidden')).length,
        inputsWithoutLabel: Array.from(document.querySelectorAll('input')).filter(input => {
          if (['hidden', 'submit', 'button', 'reset', 'image'].includes(input.type)) return false;
          const id = input.id;
          if (id && document.querySelector(`label[for="${id}"]`)) return false;
          if (input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')) return false;
          if (input.closest('label')) return false;
          return true;
        }).length,
      }));

      // Log results
      console.log(`\n=== ${pg.name} ===`);
      console.log(`  Timing: TTFB=${timing.ttfb}ms DCL=${timing.domContentLoaded}ms Load=${timing.pageLoad}ms`);
      console.log(`  Viewport: ${viewport.innerWidth}px, OverflowX=${viewport.hasOverflowX}`);
      console.log(`  Images: ${images.total} total, ${images.missingLazy} missing lazy, ${images.missingDimensions} missing dims`);
      console.log(`  SEO: title="${seo.title?.substring(0,50)}" desc=${seo.metaDesc} og=${seo.ogTitle&&seo.ogDesc} canonical=${seo.canonical} h1="${seo.h1?.substring(0,30)}"`);
      console.log(`  A11y: skipLink=${a11y.hasSkipLink} main=${a11y.hasMain} nav=${a11y.hasNav} footer=${a11y.hasFooter} imgAlt=${a11y.imagesWithoutAlt} inputLabel=${a11y.inputsWithoutLabel}`);

      if (errors.length > 0) {
        console.log(`  ERRORS: ${errors.length}`);
        errors.forEach(e => console.log(`    - ${e.substring(0, 100)}`));
      }
      if (failedResources.length > 0) {
        console.log(`  FAILED: ${failedResources.length}`);
        failedResources.forEach(f => console.log(`    - ${f.status} ${f.url.substring(0, 80)}`));
      }

      // Assertions - warn but don't fail on issues
      expect(errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR')), 'Console errors found').toHaveLength(0);
    });
  }

  test('Homepage - Full Performance Metrics', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      return {
        nav: {
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          domInteractive: Math.round(nav.domInteractive - nav.requestStart),
          domComplete: Math.round(nav.domComplete - nav.requestStart),
          loadComplete: Math.round(nav.loadEventEnd - nav.requestStart),
        },
        resources: entries.length,
        resourceTypes: {
          script: entries.filter(e => e.initiatorType === 'script').length,
          link: entries.filter(e => e.initiatorType === 'link').length,
          img: entries.filter(e => e.initiatorType === 'img').length,
          fetch: entries.filter(e => e.initiatorType === 'fetch').length,
        },
        paint: paint.map(p => ({ name: p.name, startTime: Math.round(p.startTime) })),
      };
    });

    console.log('\n=== Homepage Full Metrics ===');
    console.log(`  Navigation: TTFB=${metrics.nav.ttfb}ms DOMInteractive=${metrics.nav.domInteractive}ms DOMComplete=${metrics.nav.domComplete}ms Load=${metrics.nav.loadComplete}ms`);
    console.log(`  Resources: ${metrics.resources} total`);
    console.log(`    Scripts: ${metrics.resourceTypes.script} | CSS: ${metrics.resourceTypes.link} | Images: ${metrics.resourceTypes.img} | Fetch: ${metrics.resourceTypes.fetch}`);
    console.log(`  Paint: ${JSON.stringify(metrics.paint)}`);
  });
});