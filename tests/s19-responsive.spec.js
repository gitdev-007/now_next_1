const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { width: 320, height: 568, name: '320x568' },
  { width: 360, height: 640, name: '360x640' },
  { width: 375, height: 667, name: '375x667' },
  { width: 390, height: 844, name: '390x844' },
  { width: 414, height: 896, name: '414x896' },
  { width: 480, height: 853, name: '480x853' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 820, height: 1180, name: '820x1180' },
  { width: 1024, height: 768, name: '1024x768' },
  { width: 1280, height: 800, name: '1280x800' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1600, height: 900, name: '1600x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
];

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'hotels', path: '/hotels.html' },
  { name: 'booking-flow', path: '/booking-review.html' },
  { name: 'dashboard', path: '/my-profile.html' },
  { name: 'supplier', path: '/supplier-dashboard.html' },
];

const MIN_TOUCH_TARGET = 44;

async function checkResponsiveIssues(page, viewport) {
  const issues = [];
  const warnings = [];

  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const windowWidth = await page.evaluate(() => window.innerWidth);
  if (bodyWidth > windowWidth) {
    issues.push({
      type: 'HORIZONTAL_OVERFLOW',
      severity: 'ERROR',
      message: `Body scrollWidth (${bodyWidth}px) > window.innerWidth (${windowWidth}px)`,
      value: bodyWidth - windowWidth,
    });
  }

  const overflowElements = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      if (el === document.body || el === document.documentElement) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && el.scrollWidth > rect.width + 1) {
        const style = window.getComputedStyle(el);
        if (style.overflow !== 'hidden' && style.overflowX !== 'hidden') {
          results.push({
            tag: el.tagName,
            id: el.id || '',
            class: el.className.substring(0, 60),
            scrollWidth: el.scrollWidth,
            clientWidth: rect.width,
            overflow: el.scrollWidth - rect.width,
          });
        }
      }
    }
    return results;
  });

  for (const el of overflowElements) {
    if (el.overflow > 5) {
      issues.push({
        type: 'ELEMENT_OVERFLOW',
        severity: el.overflow > 20 ? 'ERROR' : 'WARNING',
        message: `<${el.tag}${el.id ? `#${el.id}` : ''}> overflows by ${el.overflow.toFixed(0)}px (scrollWidth: ${el.scrollWidth}, clientWidth: ${el.clientWidth})`,
        element: el,
      });
    }
  }

  const smallButtons = await page.evaluate((minSize) => {
    const results = [];
    const buttons = document.querySelectorAll('button, a[href], input[type="submit"], input[type="button"]');
    for (const btn of buttons) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const minDim = Math.min(rect.width, rect.height);
        if (minDim < minSize && !btn.closest('.navbar') && !btn.closest('.modal')) {
          results.push({
            tag: btn.tagName,
            id: btn.id || '',
            text: btn.textContent?.trim().substring(0, 30) || '',
            width: rect.width,
            height: rect.height,
          });
        }
      }
    }
    return results;
  }, MIN_TOUCH_TARGET);

  for (const btn of smallButtons) {
    issues.push({
      type: 'SMALL_TOUCH_TARGET',
      severity: 'WARNING',
      message: `<${btn.tag}${btn.id ? `#${btn.id}` : ''}> "${btn.text}" has touch target ${btn.width.toFixed(0)}x${btn.height.toFixed(0)}px (min: ${MIN_TOUCH_TARGET}px)`,
      element: btn,
    });
  }

  const problematicGrids = await page.evaluate(() => {
    const results = [];
    const grids = document.querySelectorAll('[class*="grid"]');
    for (const grid of grids) {
      const style = window.getComputedStyle(grid);
      if (style.display === 'grid') {
        const children = Array.from(grid.children);
        const rect = grid.getBoundingClientRect();
        let overflowDetected = false;
        for (const child of children) {
          const childRect = child.getBoundingClientRect();
          if (childRect.right > rect.right + 2) {
            overflowDetected = true;
            break;
          }
        }
        if (overflowDetected) {
          results.push({
            class: grid.className.substring(0, 80),
            columns: style.gridTemplateColumns,
            overflow: true,
          });
        }
      }
    }
    return results;
  });

  for (const grid of problematicGrids) {
    issues.push({
      type: 'GRID_OVERFLOW',
      severity: 'WARNING',
      message: `Grid ${grid.class} with columns ${grid.columns} has overflowing children`,
      element: grid,
    });
  }

  return { issues, warnings };
}

for (const viewport of VIEWPORTS) {
  for (const pageInfo of PAGES) {
    test(`Responsive check: ${pageInfo.name} at ${viewport.name}`, async ({ page }) => {
      const url = `${page.url().replace(/\/[^/]*$/, '')}${pageInfo.path}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const { issues, warnings } = await checkResponsiveIssues(page, viewport);

      const criticalIssues = issues.filter(i => i.severity === 'ERROR');
      const allIssues = [...criticalIssues, ...warnings];

      if (allIssues.length > 0) {
        const issueList = allIssues.map(i => `  [${i.severity}] ${i.type}: ${i.message}`).join('\n');
        console.log(`\n${pageInfo.name} @ ${viewport.name}:\n${issueList}`);
      }

      expect(criticalIssues, `Found ${criticalIssues.length} critical responsive issues`).toHaveLength(0);
    });
  }
}

test('revenue-admin inputs without labels', async ({ page }) => {
  await page.goto('http://localhost:8000/revenue-admin.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(3000);

  const inputData = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('input, select, textarea').forEach(input => {
      const id = input.id || '';
      const type = input.type || input.tagName.toLowerCase();
      const rect = input.getBoundingClientRect();
      const isHidden = rect.width === 0 || rect.height === 0;
      const inHiddenTab = input.closest('.hidden') !== null;
      const inModal = !!input.closest('[data-modal]') || !!input.closest('.modal-overlay');
      const inTabContent = !!input.closest('[id^="admin-content-"]');

      let hasLabel = false;
      let labelInfo = 'NONE';

      if (id) {
        const labelFor = document.querySelector(`label[for="${id}"]`);
        if (labelFor) {
          hasLabel = true;
          labelInfo = 'label[for]';
        }
      }

      if (!hasLabel) {
        const parentLabel = input.closest('label');
        if (parentLabel) {
          hasLabel = true;
          labelInfo = 'parent label';
        }
      }

      if (!hasLabel) {
        const ariaLabelledby = input.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
          hasLabel = true;
          labelInfo = 'aria-labelledby';
        }
      }

      if (!hasLabel) {
        const ariaLabel = input.getAttribute('aria-label');
        if (ariaLabel) {
          hasLabel = true;
          labelInfo = 'aria-label';
        }
      }

      results.push({
        id: id || '(no id)',
        type,
        hasLabel,
        labelInfo,
        isHidden,
        inHiddenTab,
        inModal,
        inTabContent,
      });
    });
    return results;
  });

  const noLabel = inputData.filter(i => !i.hasLabel);
  const hasLabel = inputData.filter(i => i.hasLabel);
  const hiddenNoLabel = noLabel.filter(i => i.isHidden);

  console.log('\n=== REVENUE-ADMIN INPUT ACCESSIBILITY REPORT ===');
  console.log(`Total inputs in DOM: ${inputData.length}`);
  console.log(`With proper labels: ${hasLabel.length}`);
  console.log(`WITHOUT proper labels: ${noLabel.length}`);
  console.log(`(Of which are hidden/inactive: ${hiddenNoLabel.length})`);

  if (noLabel.length > 0) {
    console.log('\n--- Inputs missing labels ---');
    noLabel.forEach((input, i) => {
      let loc = '';
      if (input.inHiddenTab) loc = ' [HIDDEN TAB]';
      if (input.inModal) loc = ' [MODAL]';
      if (input.inTabContent) loc += ' [TAB CONTENT]';
      console.log(`  ${i + 1}. ${input.id || '(anonymous)'} type="${input.type}"${loc}`);
    });
  }

  const unlabeledInTabs = noLabel.filter(i => i.inHiddenTab);
  if (unlabeledInTabs.length > 0) {
    console.log(`\n--> ${unlabeledInTabs.length} unlabeled inputs are in hidden admin tabs`);
    const basePriceCount = unlabeledInTabs.filter(i => i.id === '' || i.type === 'number').length;
    const seasonalCount = unlabeledInTabs.filter(i => i.id.includes('season-')).length;
    console.log(`    (~${basePriceCount} are base price inputs, ~${seasonalCount} are seasonal inputs)`);
  }

  const basePriceInputs = noLabel.filter(i => i.id.includes('base-price') || i.id.includes('itemId') || i.id === '');
  if (basePriceInputs.length > 0) {
    console.log(`\n  --> ${basePriceInputs.length} appear to be base price editor inputs`);
  }

  const seasonalInputs = noLabel.filter(i => i.id.includes('season-'));
  if (seasonalInputs.length > 0) {
    console.log(`  --> ${seasonalInputs.length} appear to be seasonal pricing inputs`);
  }
});