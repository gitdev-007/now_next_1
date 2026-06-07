const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const url = 'http://localhost:8000/airport-transfers.html';
  console.log(`Inspecting: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('section.bg-gradient-to-r');
    if (!hero) return { found: false };
    
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    const breadcrumb = hero.querySelector('nav');
    
    return {
      found: true,
      heroClasses: hero.className,
      heroBg: window.getComputedStyle(hero).backgroundColor,
      heroBackgroundImage: window.getComputedStyle(hero).backgroundImage,
      h1: {
        text: h1 ? h1.innerText : 'N/A',
        color: h1 ? window.getComputedStyle(h1).color : 'N/A',
        classes: h1 ? h1.className : 'N/A'
      },
      p: {
        color: p ? window.getComputedStyle(p).color : 'N/A',
        classes: p ? p.className : 'N/A'
      },
      breadcrumb: {
        color: breadcrumb ? window.getComputedStyle(breadcrumb).color : 'N/A'
      }
    };
  });
  
  console.log('Hero Info:', JSON.stringify(heroInfo, null, 2));
  
  if (!fs.existsSync('audit_tools/investigation')) fs.mkdirSync('audit_tools/investigation', { recursive: true });
  await page.screenshot({ path: 'audit_tools/investigation/transfers_hero_before.png' });
  
  await browser.close();
})();
