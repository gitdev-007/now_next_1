const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { fileURLToPath } = require('url');

// Simple static file server
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'frontend', req.url === '/' ? 'index.html' : req.url);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp'
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
  res.end(fs.readFileSync(filePath));
});

server.listen(9876, async () => {
  console.log('Server running on http://localhost:9876');
  
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ];
  
  const outputDir = path.join(__dirname, 'hero-inspection');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    
    await page.goto('http://localhost:9876/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Scroll to hero
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Screenshot
    await page.screenshot({ 
      path: path.join(outputDir, `hero-${vp.name}.png`),
      fullPage: false
    });
    
    // Get computed styles
    const heroStyles = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const title = hero?.querySelector('.hero-title');
      const subtitle = hero?.querySelector('.hero-subtitle');
      const primaryBtn = hero?.querySelector('.hero-btn-primary');
      const secondaryBtn = hero?.querySelector('.hero-btn-secondary');
      const searchSection = document.getElementById('search');
      
      return {
        hero: hero ? {
          height: window.getComputedStyle(hero).height,
          minHeight: window.getComputedStyle(hero).minHeight,
          background: window.getComputedStyle(hero).background,
          paddingTop: window.getComputedStyle(hero).paddingTop,
          paddingBottom: window.getComputedStyle(hero).paddingBottom
        } : null,
        title: title ? {
          fontSize: window.getComputedStyle(title).fontSize,
          fontWeight: window.getComputedStyle(title).fontWeight,
          lineHeight: window.getComputedStyle(title).lineHeight,
          letterSpacing: window.getComputedStyle(title).letterSpacing,
          maxWidth: window.getComputedStyle(title).maxWidth,
          color: window.getComputedStyle(title).color
        } : null,
        subtitle: subtitle ? {
          fontSize: window.getComputedStyle(subtitle).fontSize,
          fontWeight: window.getComputedStyle(subtitle).fontWeight,
          lineHeight: window.getComputedStyle(subtitle).lineHeight,
          color: window.getComputedStyle(subtitle).color,
          maxWidth: window.getComputedStyle(subtitle).maxWidth
        } : null,
        primaryBtn: primaryBtn ? {
          height: window.getComputedStyle(primaryBtn).height,
          padding: window.getComputedStyle(primaryBtn).padding,
          borderRadius: window.getComputedStyle(primaryBtn).borderRadius,
          fontSize: window.getComputedStyle(primaryBtn).fontSize,
          fontWeight: window.getComputedStyle(primaryBtn).fontWeight,
          background: window.getComputedStyle(primaryBtn).background,
          boxShadow: window.getComputedStyle(primaryBtn).boxShadow
        } : null,
        secondaryBtn: secondaryBtn ? {
          height: window.getComputedStyle(secondaryBtn).height,
          padding: window.getComputedStyle(secondaryBtn).padding,
          borderRadius: window.getComputedStyle(secondaryBtn).borderRadius,
          fontSize: window.getComputedStyle(secondaryBtn).fontSize,
          fontWeight: window.getComputedStyle(secondaryBtn).fontWeight,
          background: window.getComputedStyle(secondaryBtn).background,
          border: window.getComputedStyle(secondaryBtn).border
        } : null,
        searchSection: searchSection ? {
          display: window.getComputedStyle(searchSection).display,
          marginTop: window.getComputedStyle(searchSection).marginTop,
          padding: window.getComputedStyle(searchSection).padding
        } : null
      };
    });
    
    console.log(`\n=== ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ===`);
    console.log(JSON.stringify(heroStyles, null, 2));
    
    await context.close();
  }
  
  await browser.close();
  server.close();
  console.log('\nInspection complete. Screenshots saved to hero-inspection/');
  process.exit(0);
});