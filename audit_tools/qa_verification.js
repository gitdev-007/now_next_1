const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\Dev Tinker\\.gemini\\antigravity-ide\\brain\\ce74cb2a-d480-4432-92ad-0dcbb4134f51';

async function run() {
  console.log('Starting automated LayoverX QA audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Helper to wait and log console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE CONSOLE ERROR: ${msg.text()}`);
    }
  });

  // Step 1: Search Form Persistence
  console.log('--- Step 1: Search Form Persistence ---');
  await page.goto('http://localhost:8000/index.html');
  await page.waitForLoadState('networkidle');

  // Select values programmatically
  await page.selectOption('#search-location', 'bandra');
  await page.evaluate(() => {
    const arr = document.querySelector('#search-arrival');
    arr.value = '2026-06-10T12:00';
    arr.dispatchEvent(new Event('input', { bubbles: true }));

    const dep = document.querySelector('#search-departure');
    dep.value = '2026-06-10T20:00';
    dep.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.selectOption('#search-travelers', '3');

  // Wait a moment for duration calculations
  await page.waitForTimeout(500);

  const durationText = await page.innerText('#layover-duration');
  console.log(`Computed duration displayed: ${durationText}`);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'homepage_inputs.png') });
  console.log('Took homepage_inputs.png');

  // Submit form
  await page.click('#search-btn');
  await page.waitForLoadState('networkidle');
  console.log(`Current page URL after search submit: ${page.url()}`);

  // Check inputs on planner page
  const planLocation = await page.inputValue('#plan-location');
  const planArrival = await page.inputValue('#plan-arrival');
  const planDeparture = await page.inputValue('#plan-departure');
  const planTravelers = await page.inputValue('#plan-travelers');

  console.log(`Planner Inputs: Location=${planLocation}, Arrival=${planArrival}, Departure=${planDeparture}, Travelers=${planTravelers}`);

  if (planLocation === 'bandra' && planArrival === '2026-06-10T12:00' && planDeparture === '2026-06-10T20:00' && planTravelers === '3') {
    console.log('✓ SUCCESS: Form inputs correctly populated on planner page!');
  } else {
    console.error('✗ FAILURE: Planner form inputs mismatch!');
  }

  // Refresh page and check persistence
  console.log('Refreshing planner page...');
  await page.reload();
  await page.waitForLoadState('networkidle');

  const refLocation = await page.inputValue('#plan-location');
  const refArrival = await page.inputValue('#plan-arrival');
  if (refLocation === 'bandra' && refArrival === '2026-06-10T12:00') {
    console.log('✓ SUCCESS: Inputs survived page reload persistence!');
  } else {
    console.error('✗ FAILURE: Inputs did not persist on page reload!');
  }

  // Step 2: Interactive Timeline & Editing
  console.log('--- Step 2: Interactive Itinerary Builder ---');
  // Check checkboxes
  await page.check('#chk-hotel-2');
  await page.check('#chk-dining-2');
  await page.check('#chk-activity-1');
  await page.waitForTimeout(500);

  // Check timeline content
  const timelineText = await page.innerText('#timeline-list');
  console.log('Timeline Items Rendered:\n' + timelineText);

  const totalCost = await page.innerText('#total-cost');
  console.log(`Total estimated cost for 3 guests: ${totalCost}`);

  // Test Duration adjustment
  console.log('Adjusting hotel duration to 3 hours...');
  await page.selectOption('#timeline-list div:has-text("JW Marriott Mumbai Sahar") select', '3');
  await page.waitForTimeout(500);

  // Test Reorder swap (Move Hotel down or move Peshawri up)
  console.log('Testing reorder controls (moving hotel item down)...');
  await page.click('#timeline-list div:has-text("JW Marriott Mumbai Sahar") button[title="Move Down"]');
  await page.waitForTimeout(500);

  // Test Deletion
  console.log('Testing item deletion (removing Peshawri dining)...');
  await page.click('#timeline-list div:has-text("Peshawri") button[title="Remove Item"]');
  await page.waitForTimeout(500);

  const isDiningChecked = await page.isChecked('#chk-dining-2');
  console.log(`Is Peshawri dining checkbox checked after removal? ${isDiningChecked}`);
  if (!isDiningChecked) {
    console.log('✓ SUCCESS: Checkbox correctly synchronized and unchecked!');
  } else {
    console.error('✗ FAILURE: Checkbox stayed checked!');
  }

  // Test Limit Exceeded Warning
  console.log('Exceeding safe layover exit window hours...');
  // Check Hotel again and change its duration to 12h
  await page.check('#chk-hotel-2');
  await page.selectOption('#timeline-list div:has-text("JW Marriott Mumbai Sahar") select', '12');
  await page.waitForTimeout(500);

  const warningVisible = await page.isVisible('#timeline-warning');
  if (warningVisible) {
    const warningText = await page.innerText('#timeline-warning');
    console.log(`✓ SUCCESS: Timeline warning displayed: ${warningText}`);
  } else {
    console.error('✗ FAILURE: Warning banner not visible!');
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'planner_timeline_and_warning.png') });
  console.log('Took planner_timeline_and_warning.png');

  // Step 3: Modal Close Events
  console.log('--- Step 3: Modal Close Event Handlers ---');
  await page.goto('http://localhost:8000/index.html');
  await page.waitForLoadState('networkidle');

  // Open login
  await page.click('.auth-guest a:has-text("Login")');
  await page.waitForTimeout(300);
  let isLoginVisible = await page.isVisible('#modal-login');
  console.log(`Is Login modal open? ${isLoginVisible}`);

  // Test close via X
  console.log('Closing login modal via X...');
  await page.click('#modal-login .modal-close');
  await page.waitForTimeout(300);
  isLoginVisible = await page.isVisible('#modal-login');
  console.log(`Is Login modal visible after X click? ${isLoginVisible}`);

  // Open and test close via overlay background click
  await page.click('.auth-guest a:has-text("Login")');
  await page.waitForTimeout(300);
  console.log('Closing login modal via background overlay click...');
  await page.click('#modal-login', { position: { x: 5, y: 5 } }); // click edge of overlay
  await page.waitForTimeout(300);
  isLoginVisible = await page.isVisible('#modal-login');
  console.log(`Is Login modal visible after overlay click? ${isLoginVisible}`);

  // Open and test close via Esc key
  await page.click('.auth-guest a:has-text("Login")');
  await page.waitForTimeout(300);
  console.log('Closing login modal via Escape key...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  isLoginVisible = await page.isVisible('#modal-login');
  console.log(`Is Login modal visible after Escape press? ${isLoginVisible}`);

  // Step 4: Redesigned Heroes verification (1280px width)
  console.log('--- Step 4: Redesigned Hero Sections (1280px) ---');
  
  const pagesToTest = ['hotels.html', 'restaurants.html', 'spa-wellness.html', 'gaming-entertainment.html', 'experiences.html', 'airport-transfers.html'];
  for (const pageName of pagesToTest) {
    await page.goto(`http://localhost:8000/${pageName}`);
    await page.waitForLoadState('networkidle');
    console.log(`Verifying hero section on ${pageName}...`);
    
    // Check if the split columns display correctly
    const gridCols = await page.evaluate(() => {
      const hero = document.querySelector('section.relative');
      if (!hero) return null;
      const grid = hero.querySelector('.grid');
      if (!grid) return null;
      return window.getComputedStyle(grid).gridTemplateColumns;
    });
    console.log(`Grid columns computed style for ${pageName}: ${gridCols}`);

    if (pageName === 'experiences.html') {
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'experiences_page.png') });
      console.log('Took experiences_page.png');
    }
    if (pageName === 'airport-transfers.html') {
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'transfers_page.png') });
      console.log('Took transfers_page.png');
    }
  }

  // Step 5: Responsive Check on experiences.html
  console.log('--- Step 5: Responsive Audits on experiences.html ---');
  await page.goto('http://localhost:8000/experiences.html');
  await page.waitForLoadState('networkidle');

  // Tablet: 768px wide
  console.log('Resizing to tablet width (768px)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'experiences_tablet.png') });
  console.log('Took experiences_tablet.png');

  // Mobile: 390px wide
  console.log('Resizing to mobile width (390px)...');
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'experiences_mobile.png') });
  console.log('Took experiences_mobile.png');

  // Step 6: Pricing & Revenue Admin Dashboard Verification
  console.log('--- Step 6: Pricing & Revenue Admin Dashboard ---');
  await page.goto('http://localhost:8000/revenue-admin.html');
  await page.waitForLoadState('networkidle');

  // Verify dashboard page loaded
  const adminHeader = await page.innerText('h1');
  console.log(`Admin page header: ${adminHeader}`);
  if (adminHeader.includes('Revenue') && adminHeader.includes('Pricing')) {
    console.log('✓ SUCCESS: Revenue Admin page loaded successfully!');
  } else {
    console.error('✗ FAILURE: Revenue Admin page failed to load!');
  }

  // Click Pricing Rules & Yield Tab to make override slider visible
  console.log('Switching to Pricing tab...');
  await page.click('#admin-tab-pricing');
  await page.waitForTimeout(300);

  // Adjust override slider to +20% and save
  console.log('Adjusting manual override pricing slider to +20%...');
  await page.evaluate(() => {
    const slider = document.querySelector('#override-slider');
    if (slider) {
      slider.value = 20;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.click('button:has-text("Apply Global Override Slider")');
  await page.waitForTimeout(500);

  // Navigate to verify override is saved in localStorage
  const localOverride = await page.evaluate(() => {
    const settings = JSON.parse(localStorage.getItem('layoverx_pricing_settings'));
    return settings ? settings.manualOverridePercent : null;
  });
  console.log(`Verified manual override stored in localStorage: ${localOverride}%`);
  if (parseInt(localOverride) === 20) {
    console.log('✓ SUCCESS: Dynamic override successfully written to localStorage database!');
  } else {
    console.error('✗ FAILURE: Override was not saved!');
  }

  // Reset override to 0% so standard pricing is restored
  console.log('Resetting override slider back to 0%...');
  await page.evaluate(() => {
    const slider = document.querySelector('#override-slider');
    if (slider) {
      slider.value = 0;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await page.click('button:has-text("Apply Global Override Slider")');
  await page.waitForTimeout(500);

  await browser.close();
  console.log('LayoverX QA audit complete!');
}

run().catch(err => {
  console.error('Error during QA execution:', err);
  process.exit(1);
});
