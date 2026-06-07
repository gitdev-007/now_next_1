const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'https://next-layoverx-1.vercel.app';
  
  const pages = ['/index.html', '/hotels.html', '/restaurants.html', '/experiences.html', '/airport-transfers.html', '/how-it-works.html', '/contact.html', '/plan-my-layover.html'];
  const broken = [];

  for (const p of pages) {
    console.log(`Checking images on ${p}...`);
    await page.goto(`${baseURL}${p}`, { waitUntil: 'networkidle' });
    
    const pageBroken = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
    });
    
    if (pageBroken.length > 0) {
      broken.push({ page: p, urls: pageBroken });
    }
  }

  console.log('Broken Images:', JSON.stringify(broken, null, 2));
  await browser.close();
})();
