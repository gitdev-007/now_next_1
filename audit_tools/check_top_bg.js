const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  const pages = ['/', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];

  for (const p of pages) {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const navbar = document.querySelector('#navbar');
      navbar.style.visibility = 'hidden'; // Hide to see what is behind
      const el = document.elementFromPoint(100, 40); // Check behind navbar
      const bg = window.getComputedStyle(el).backgroundColor;
      navbar.style.visibility = 'visible';
      return { path: location.pathname, bg, el: el.tagName + (el.id ? '#'+el.id : '') + (el.className ? '.'+el.className.split(' ').join('.') : '') };
    });
    console.log(JSON.stringify(data));
  }
  await browser.close();
})();
