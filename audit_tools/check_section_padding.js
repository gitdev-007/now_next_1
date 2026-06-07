const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  const pages = ['/', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];

  for (const p of pages) {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const firstSection = document.querySelector('section, header');
      if (!firstSection) return null;
      const style = window.getComputedStyle(firstSection);
      return { 
        path: location.pathname, 
        tag: firstSection.tagName,
        paddingTop: style.paddingTop,
        marginTop: style.marginTop
      };
    });
    console.log(JSON.stringify(data));
  }
  await browser.close();
})();
