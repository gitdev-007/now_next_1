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
      if (navbar) navbar.style.display = 'none';
      const el = document.elementFromPoint(140, 40); 
      const bg = window.getComputedStyle(el).backgroundColor;
      const backgroundImage = window.getComputedStyle(el).backgroundImage;
      if (navbar) navbar.style.display = 'block';
      return { path: location.pathname, bg, backgroundImage, el: el.tagName + (el.id ? '#'+el.id : '') + (el.className ? '.'+el.className.split(' ').join('.') : '') };
    });
    console.log(JSON.stringify(data));
  }
  await browser.close();
})();
