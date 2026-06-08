const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseURL = 'http://localhost:8000';
  
  const screenshotDir = 'audit_tools/refactor_before';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  // 1. Check Planner Sticky Behavior
  console.log('Inspecting Planner page...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/plan-my-layover.html`, { waitUntil: 'networkidle' });
  
  // Initial capture
  await page.screenshot({ path: path.join(screenshotDir, 'planner_top.png') });
  
  // Scroll and capture
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, 'planner_scrolled.png') });

  const cardPos = await page.evaluate(() => {
    const card = document.querySelector('.bg-white.rounded-2xl.border.border-gray-200.p-6.shadow-sm'); // The summary card
    const style = window.getComputedStyle(card);
    return {
        position: style.position,
        top: style.top,
        rect: card.getBoundingClientRect()
    };
  });
  console.log('Summary Card Initial Info:', JSON.stringify(cardPos, null, 2));

  // 2. Check Homepage Icons
  console.log('Inspecting Homepage Icons...');
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, 'home_icons_before.png') });

  await browser.close();
})();
