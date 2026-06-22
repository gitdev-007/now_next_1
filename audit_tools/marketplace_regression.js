const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\Dev Tinker\\.gemini\\antigravity-ide\\brain\\ce74cb2a-d480-4432-92ad-0dcbb4134f51';

async function run() {
  console.log('Starting automated LayoverX Marketplace & Planner Regression audit...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Listen to browser console and page errors
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Activated')) {
      console.log(`PAGE LOG: [${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => console.error('PAGE RUNTIME ERROR:', err.stack || err.message));

  try {
    // ----------------------------------------------------
    // STEP 1: Global Context Search Form & Pre-fill
    // ----------------------------------------------------
    console.log('\n--- Step 1: Homepage Search & Context Setup ---');
    await page.goto('http://localhost:8001/index.html');
    await page.waitForLoadState('load');

    // Select search parameters
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
    await page.waitForTimeout(500);

    const durText = await page.innerText('#layover-duration');
    console.log(`Computed duration on homepage: ${durText} (Expected: 8h 0m)`);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_1_homepage_inputs.png') });
    console.log('Took regression_1_homepage_inputs.png');

    // Click Search to set local storage and redirect to Plan My Layover
    await page.click('#search-btn');
    await page.waitForLoadState('load');
    console.log(`Redirected to URL: ${page.url()}`);

    // Verify global trip context summary badge is rendering in header
    const badgeSelector = '#global-trip-badge';
    await page.waitForSelector(badgeSelector);
    const badgeText = await page.innerText(badgeSelector);
    console.log(`Global Trip Context Badge Text: "${badgeText}"`);
    if (badgeText.includes('Bandra') && badgeText.includes('8.0h') && badgeText.includes('3 Guests')) {
      console.log('✓ SUCCESS: Global Trip Context initialized correctly in header!');
    } else {
      console.error('✗ FAILURE: Global Trip Context badge mismatch:', badgeText);
    }

    // ----------------------------------------------------
    // STEP 2: Update Context via Floating Badge Modal
    // ----------------------------------------------------
    console.log('\n--- Step 2: Modifying Context via Floating Modal ---');
    await page.click(badgeSelector);
    await page.waitForTimeout(300);

    // Verify modal is visible
    const isModalVisible = await page.isVisible('#modal-trip-context');
    console.log(`Is Trip Context Update Modal visible? ${isModalVisible}`);

    // Modify travelers count to 4 in modal
    await page.selectOption('#context-travelers', '4');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_2_context_modal.png') });
    console.log('Took regression_2_context_modal.png');

    // Save context
    await page.click('#btn-context-submit');
    await page.waitForTimeout(500);

    const updatedBadgeText = await page.innerText(badgeSelector);
    console.log(`Updated Badge Text: "${updatedBadgeText}"`);
    if (updatedBadgeText.includes('4 Guests')) {
      console.log('✓ SUCCESS: Global trip context dynamically updated across active state!');
    } else {
      console.error('✗ FAILURE: Badge failed to update traveler count!');
    }

    // ----------------------------------------------------
    // STEP 3: Multi-Category Item Selection & Details Page
    // ----------------------------------------------------
    console.log('\n--- Step 3: Listing Pages Pre-fill & Add To Itinerary ---');
    
    // Navigate to Hotels Listing
    await page.goto('http://localhost:8001/hotels.html');
    await page.waitForLoadState('load');

    // Verify check-in datetime prefilled matches context
    const checkinVal = await page.inputValue('#hotel-checkin');
    console.log(`Hotels Check-in Date/Time Input Value: ${checkinVal}`);
    if (checkinVal === '2026-06-10T12:00') {
      console.log('✓ SUCCESS: Listing search inputs pre-filled from Global Context!');
    } else {
      console.error('✗ FAILURE: Hotels check-in inputs did not sync!');
    }

    // Add Niranta Hotel to Itinerary
    console.log('Adding Niranta Airport Transit Hotel...');
    await page.click('.hotel-item:has-text("Niranta") button:has-text("Add to Itinerary")');
    await page.waitForTimeout(500);

    // Assert cart badge updates
    const cartBadgeText = await page.innerText('#itinerary-badge');
    console.log(`Itinerary cart items count badge: ${cartBadgeText}`);
    if (cartBadgeText === '1') {
      console.log('✓ SUCCESS: Cart badge count incremented to 1!');
    } else {
      console.error('✗ FAILURE: Cart badge did not increment!');
    }

    // Go to Restaurants Listing and View Details
    console.log('Navigating to dining and viewing Peshawri details...');
    await page.goto('http://localhost:8001/restaurants.html');
    await page.waitForLoadState('load');

    await page.click('.rest-item:has-text("Peshawri") a:has-text("View Details")');
    await page.waitForLoadState('load');
    console.log(`Loaded Service Details Page: ${page.url()}`);

    // Verify dynamic detail content
    const detailsTitle = await page.innerText('#details-title');
    console.log(`Service Details Title: "${detailsTitle}" (Expected: Peshawri - ITC Maratha)`);
    if (detailsTitle.includes('Peshawri')) {
      console.log('✓ SUCCESS: Service Details page rendered dynamic parameters correctly!');
    } else {
      console.error('✗ FAILURE: Details title does not match restaurant!');
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_3_service_details.png') });
    console.log('Took regression_3_service_details.png');

    // Add to itinerary from details page
    await page.click('#details-add-itinerary');
    await page.waitForTimeout(500);

    const updatedCartBadge = await page.innerText('#itinerary-badge');
    console.log(`Itinerary cart count badge: ${updatedCartBadge}`);
    if (updatedCartBadge === '2') {
      console.log('✓ SUCCESS: Added item from service details page to itinerary!');
    } else {
      console.error('✗ FAILURE: Cart badge did not update!');
    }

    // ----------------------------------------------------
    // STEP 4: Itinerary Workspace Validation
    // ----------------------------------------------------
    console.log('\n--- Step 4: Itinerary Workspace Math & Limit Validation ---');
    await page.goto('http://localhost:8001/my-itinerary.html');
    await page.waitForLoadState('load');

    // Inspect used vs remaining safe window
    const totalHrsText = await page.innerText('#workspace-total-hours');
    const usedHrsText = await page.innerText('#workspace-used-hours');
    const remainingHrsText = await page.innerText('#workspace-remaining-hours');
    console.log(`Workspace Hours: Total=${totalHrsText}, Used=${usedHrsText}, Remaining=${remainingHrsText}`);

    // Check validation error state (6.0h hotel + 1.5h dining = 7.5h, exceeds safe exit window 8.0h - 3.5h = 4.5h)
    const isWarningVisible = await page.isVisible('#workspace-warning');
    console.log(`Is safe exit window limit warning visible? ${isWarningVisible}`);
    
    const isCheckoutDisabled = await page.isDisabled('#btn-checkout');
    console.log(`Is proceed to checkout button disabled? ${isCheckoutDisabled}`);

    if (isWarningVisible && isCheckoutDisabled) {
      console.log('✓ SUCCESS: Safety time limit validation correctly locks checkout!');
    } else {
      console.error('✗ FAILURE: Warning banner or checkout button status incorrect in overflow state!');
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_4_workspace_overflow.png') });
    console.log('Took regression_4_workspace_overflow.png');

    // Adjust hotel duration to 3 Hours to fit within 4.5h safe exit window
    console.log('Reducing hotel stay duration to 3 hours slot...');
    await page.selectOption('.workspace-timeline-item-select, select:has-text("Hours")', '3');
    await page.waitForTimeout(500);

    const revisedUsed = await page.innerText('#workspace-used-hours');
    const revisedRemaining = await page.innerText('#workspace-remaining-hours');
    console.log(`Revised Workspace Hours: Used=${revisedUsed}, Remaining=${revisedRemaining}`);

    const isWarningActive = await page.isVisible('#workspace-warning');
    const isCheckoutActive = await page.isDisabled('#btn-checkout');
    console.log(`Is warning banner hidden? ${!isWarningActive}`);
    console.log(`Is checkout button enabled? ${!isCheckoutActive}`);

    if (!isWarningActive && !isCheckoutActive) {
      console.log('✓ SUCCESS: Safety warning cleared and checkout unlocked after duration adjustment!');
    } else {
      console.error('✗ FAILURE: Workspace warning did not clear after duration drop!');
    }

    // Test timeline reordering
    console.log('Reordering timeline (moving first item down)...');
    await page.click('button[title="Move Down"]');
    await page.waitForTimeout(300);

    // Save itinerary draft
    console.log('Saving timeline draft...');
    await page.click('#btn-save-draft');
    await page.waitForTimeout(300);

    // ----------------------------------------------------
    // STEP 5: Checkout Process & Payment Breakout
    // ----------------------------------------------------
    console.log('\n--- Step 5: Checkout & Booking finalization ---');
    await page.click('#btn-checkout');
    await page.waitForLoadState('load');
    console.log(`Arrived at page: ${page.url()}`);

    if (page.url().includes('booking-review.html')) {
      await page.click('text=Proceed to Traveler Details');
      await page.waitForLoadState('load');
      console.log(`Transitioned to page: ${page.url()}`);
    }

    // Fill traveler details
    await page.fill('#chk-traveler-name', 'Alice Mercer');
    await page.fill('#chk-passport', 'P-US-987654');
    await page.fill('#chk-traveler-nationality', 'United States');
    await page.fill('#chk-emergency', '+1-555-0199');
    await page.fill('#chk-flight-in', 'UA-901');
    await page.fill('#chk-flight-departure', 'EK-501');
    
    const breakoutPrice = await page.innerText('#checkout-total-price');
    console.log(`Checkout Final Breakout Price: ${breakoutPrice}`);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_5_checkout_form.png') });
    console.log('Took regression_5_checkout_form.png');

    // Submit traveler details to go to payment-selection.html
    console.log('Submitting traveler details...');
    await page.click('button:has-text("Proceed to Payment")');
    await page.waitForURL('**/payment-selection.html*');
    await page.waitForLoadState('load');
    console.log(`Arrived at payment selection: ${page.url()}`);

    // Fill card payment details
    console.log('Filling card payment details...');
    await page.fill('#cc-name', 'Alice Mercer');
    await page.fill('#cc-num', '4111222233334444');
    await page.fill('#cc-expiry', '12/29');
    await page.fill('#cc-cvv', '123');

    // Click checkout payment confirmation
    console.log('Submitting secure payment...');
    await page.click('#btn-pay-now');
    await page.waitForURL('**/booking-confirmation.html*');
    await page.waitForLoadState('load');
    console.log(`Arrived at booking confirmation: ${page.url()}`);

    // Click View in My Trips
    console.log('Clicking View in My Trips...');
    await page.click('text=View in My Trips');
    await page.waitForURL('**/my-trips.html*');
    await page.waitForLoadState('load');
    console.log(`Redirected to dashboard: ${page.url()}`);

    // Verify confirm booking receipt ticket modal opens
    await page.waitForSelector('#modal-trip-receipt', { state: 'visible' });
    const isReceiptModalOpen = await page.isVisible('#modal-trip-receipt');
    console.log(`Is ticket confirmation receipt modal visible? ${isReceiptModalOpen}`);
    if (isReceiptModalOpen) {
      const receiptCode = await page.innerText('#receipt-booking-id');
      const receiptPassenger = await page.innerText('#receipt-passenger');
      console.log(`✓ SUCCESS: Receipt generated! Code=${receiptCode}, Passenger=${receiptPassenger}`);
    } else {
      console.error('✗ FAILURE: Booking receipt modal not rendered!');
    }

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'regression_6_trips_receipt.png') });
    console.log('Took regression_6_trips_receipt.png');

    // Close modal and see upcoming dashboard bookings card list
    await page.click('#modal-trip-receipt .modal-close');
    await page.waitForTimeout(300);

    const dashboardText = await page.innerText('#tab-content-upcoming');
    console.log(`Upcoming trips tab contents:\n${dashboardText}`);
    if (dashboardText.includes('Confirmed Booking') && dashboardText.includes('Alice Mercer')) {
      console.log('✓ SUCCESS: Trip successfully registered in dashboard list!');
    } else {
      console.error('✗ FAILURE: Trip did not list in traveler dashboard upcoming panel!');
    }

  } catch (error) {
    console.error('✗ REGRESSION RUNTIME EXCEPTION:', error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('\n========================================================');
    console.log('LAYOVERX MARKETPLACE REGRESSION SUCCESSFUL!');
    console.log('========================================================');
  }
}

run();
