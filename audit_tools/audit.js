const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('axe-playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const baseURL = 'https://next-layoverx-1.vercel.app';
  
  const pagesToVisit = ['/index.html', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];
  const auditReport = [];

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  for (const pathName of pagesToVisit) {
    const url = `${baseURL}${pathName}`;
    console.log(`Auditing: ${url}`);
    
    const pageReport = {
      path: pathName,
      viewports: {}
    };

    for (const vp of viewports) {
      console.log(`  Viewport: ${vp.name}`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      
      try {
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Take screenshot
        const screenshotName = `${pathName.replace(/\//g, '_')}_${vp.name}.png`;
        const screenshotPath = path.join('screenshots', screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        // Basic Metadata
        const title = await page.title();
        const description = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'Missing');
        const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'Missing');
        
        // Accessibility (Axe)
        await injectAxe(page);
        let axeResults = [];
        try {
          // Get raw results instead of using checkA11y which logs to console
          const results = await page.evaluate(() => {
            return new Promise(resolve => {
              window.axe.run((err, results) => {
                resolve(results.violations);
              });
            });
          });
          axeResults = results;
        } catch (e) {
          console.warn(`    Axe check failed for ${vp.name}: ${e.message}`);
        }

        // Horizontal Scroll Check
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        // Image check
        const images = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(img => ({
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            complete: img.complete
          }));
        });
        const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0);
        const missingAlt = images.filter(img => !img.alt);

        pageReport.viewports[vp.name] = {
          screenshot: screenshotPath,
          title,
          description,
          h1,
          a11yViolationsCount: axeResults.length,
          a11yViolations: axeResults.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length })),
          consoleErrors,
          hasHorizontalScroll,
          brokenImagesCount: brokenImages.length,
          missingAltCount: missingAlt.length
        };
      } catch (e) {
        console.error(`    Failed ${vp.name}: ${e.message}`);
      }
    }
    auditReport.push(pageReport);
  }

  fs.writeFileSync('audit_report.json', JSON.stringify(auditReport, null, 2));
  console.log('---AUDIT_COMPLETE---');
  await browser.close();
})();
