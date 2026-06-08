const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  
  const screenshotDir = 'audit_tools/refactor_after';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  // 1. Verify Planner Static Behavior
  console.log('Verifying Planner page...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/plan-my-layover.html`, { waitUntil: 'networkidle' });
  
  // Select items
  await page.evaluate(() => {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => { if (i < 3) cb.click(); });
  });

  const initialRect = await page.evaluate(() => {
    return document.querySelector('aside div.flex.flex-col').getBoundingClientRect();
  });

  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  
  const scrolledRect = await page.evaluate(() => {
    return document.querySelector('aside div.flex.flex-col').getBoundingClientRect();
  });

  console.log('Summary Card Rects (Initial vs Scrolled):', initialRect.top, scrolledRect.top);
  
  const isStatic = Math.abs(initialRect.top - (scrolledRect.top + 800)) < 10;
  console.log('Is card static?', isStatic);

  await page.screenshot({ path: path.join(screenshotDir, 'planner_after_scroll.png'), fullPage: true });

  // 2. Verify Homepage Icons
  console.log('Verifying Homepage Icons...');
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, 'home_icons_after.png') });

  // Check console for errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('BROWSER ERROR:', msg.text());
  });

  await browser.close();
})();
