import { test, expect } from '@playwright/test';

const baseURL = 'https://next-layoverx-1.vercel.app';

test.describe('Initial Audit and Crawl', () => {
  test('Capture console errors and basic metadata for all pages', async ({ page }) => {
    const pagesToVisit = ['/'];
    const visited = new Set();
    const results = [];

    while (pagesToVisit.length > 0) {
      const path = pagesToVisit.shift();
      if (visited.has(path)) continue;
      visited.add(path);

      const url = `${baseURL}${path}`;
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      console.log(`Auditing: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle' });

        const title = await page.title();
        const description = await page.$eval('meta[name="description"]', el => el.content).catch(() => 'No description');
        const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'No H1');
        
        // Find links to other pages on the same domain
        const links = await page.$$eval('a', (as, base) => 
          as.map(a => a.getAttribute('href'))
            .filter(href => href && (href.startsWith('/') || href.startsWith(base)) && !href.includes('#'))
            .map(href => href.startsWith(base) ? href.replace(base, '') : href),
          baseURL
        );

        for (const link of links) {
          if (!visited.has(link) && !pagesToVisit.includes(link)) {
            pagesToVisit.push(link);
          }
        }

        results.push({ path, title, description, h1, consoleErrors });
      } catch (e) {
        console.error(`Failed to load ${url}: ${e.message}`);
      }
    }

    console.log('Audit Results:', JSON.stringify(results, null, 2));
  });
});
