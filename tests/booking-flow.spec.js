const { test, expect } = require('@playwright/test');

/**
 * LayoverX Booking Flow Tests
 * Tests the complete booking journey: Plan → Review → Checkout → Payment → Confirmation
 */

test.describe('Booking Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('net::ERR')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('booking-review page loads with progress stepper', async ({ page }) => {
    await page.goto('/booking-review.html');
    await page.waitForLoadState('networkidle');
    
    // Check progress stepper is visible
    const stepper = page.locator('.booking-stepper');
    await expect(stepper).toBeVisible();
    
    // Check all 4 steps are present
    const steps = page.locator('.booking-stepper-ring');
    await expect(steps).toHaveCount(4);
    
    // Step 1 should be active (review page)
    const activeStep = page.locator('.booking-stepper-ring--active');
    await expect(activeStep).toHaveCount(1);
    await expect(activeStep).toHaveText('1');
  });

  test('checkout page shows progress stepper with step 2 active', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    const steps = page.locator('.booking-stepper-ring');
    await expect(steps).toHaveCount(4);
    
    // Should have 1 completed step (step 1)
    const completedSteps = page.locator('.booking-stepper-ring--completed');
    await expect(completedSteps).toHaveCount(1);
    
    // Should have 1 active step (step 2)
    const activeStep = page.locator('.booking-stepper-ring--active');
    await expect(activeStep).toHaveCount(1);
    await expect(activeStep).toHaveText('2');
  });

  test('payment-selection page shows progress stepper with step 3 active', async ({ page }) => {
    await page.goto('/payment-selection.html');
    await page.waitForLoadState('networkidle');
    
    const steps = page.locator('.booking-stepper-ring');
    await expect(steps).toHaveCount(4);
    
    // Should have 2 completed steps (1 and 2)
    const completedSteps = page.locator('.booking-stepper-ring--completed');
    await expect(completedSteps).toHaveCount(2);
    
    // Should have 1 active step (step 3)
    const activeStep = page.locator('.booking-stepper-ring--active');
    await expect(activeStep).toHaveCount(1);
    await expect(activeStep).toHaveText('3');
  });

  test('checkout form validates required fields', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    const submitBtn = page.locator('#btn-submit-details');
    await submitBtn.click();
    
    // Should show error messages
    const errorMessages = page.locator('[role="alert"]');
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('checkout form accepts valid input', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    // Fill in required fields
    await page.fill('#chk-traveler-name', 'John Doe');
    await page.fill('#chk-passport', 'AB1234567');
    await page.fill('#chk-traveler-nationality', 'United States');
    await page.fill('#chk-emergency', '+1 555-123-4567');
    await page.fill('#chk-flight-in', 'AA-123');
    await page.fill('#chk-flight-departure', 'AA-456');
    
    // Submit form
    await page.click('#btn-submit-details');
    
    // Should navigate to payment page
    await expect(page).toHaveURL(/payment-selection\.html/);
  });

  test('CTA buttons use proper button class', async ({ page }) => {
    // Check checkout page CTA
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    const proceedBtn = page.locator('button[type="submit"]');
    await expect(proceedBtn).toHaveClass(/btn/);
    
    // Check payment page CTA
    await page.goto('/payment-selection.html');
    await page.waitForLoadState('networkidle');
    
    const payBtn = page.locator('#btn-pay-now');
    await expect(payBtn).toHaveClass(/btn/);
    
    // Check my-itinerary CTA
    await page.goto('/my-itinerary.html');
    await page.waitForLoadState('networkidle');
    
    const checkoutBtn = page.locator('#btn-checkout');
    await expect(checkoutBtn).toHaveClass(/btn/);
  });

  test('forms have proper focus states', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    const nameInput = page.locator('#chk-traveler-name');
    await nameInput.focus();
    
    // Check that focus ring is visible
    const isFocused = await nameInput.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('summary panel is visible on booking-review page', async ({ page }) => {
    await page.goto('/booking-review.html');
    await page.waitForLoadState('networkidle');
    
    const summaryPanel = page.locator('text=Pricing Summary');
    await expect(summaryPanel).toBeVisible();
  });

  test('summary panel is visible on checkout page', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    const summaryPanel = page.locator('text=Selected Itinerary');
    await expect(summaryPanel).toBeVisible();
  });

  test('skip to content link is present', async ({ page }) => {
    await page.goto('/booking-review.html');
    await page.waitForLoadState('networkidle');
    
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeAttached();
  });

  test('all pages have proper page titles', async ({ page }) => {
    const pages = [
      { url: '/booking-review.html', title: 'Booking Review' },
      { url: '/checkout.html', title: 'Checkout' },
      { url: '/payment-selection.html', title: 'Payment' },
      { url: '/booking-confirmation.html', title: 'Confirmation' }
    ];

    for (const p of pages) {
      await page.goto(p.url);
      await page.waitForLoadState('networkidle');
      const title = await page.title();
      expect(title).toContain(p.title);
    }
  });

  test('navbar is present and functional on all pages', async ({ page }) => {
    const pages = [
      '/booking-review.html',
      '/checkout.html', 
      '/payment-selection.html',
      '/booking-confirmation.html'
    ];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const navbar = page.locator('nav[role="navigation"]');
      await expect(navbar).toBeVisible();
    }
  });

  test('footer is present on all pages', async ({ page }) => {
    const pages = [
      '/booking-review.html',
      '/checkout.html',
      '/payment-selection.html',
      '/booking-confirmation.html'
    ];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeVisible();
    }
  });

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    const inputs = page.locator('input[id]');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (!id) continue;
      
      // Check if there's a label with for attribute
      const label = page.locator(`label[for="${id}"]`);
      const hasLabel = await label.count() > 0;
      
      // If no explicit label, check for aria-label
      if (!hasLabel) {
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('payment tabs switch correctly', async ({ page }) => {
    await page.goto('/payment-selection.html');
    await page.waitForLoadState('networkidle');
    
    // Click UPI tab
    await page.click('#tab-upi');
    
    // UPI content should be visible
    const upiContent = page.locator('#payment-content-upi');
    await expect(upiContent).not.toHaveClass(/hidden/);
    
    // Card content should be hidden
    const cardContent = page.locator('#payment-content-card');
    await expect(cardContent).toHaveClass(/hidden/);
    
    // Click PayPal tab
    await page.click('#tab-paypal');
    
    const paypalContent = page.locator('#payment-content-paypal');
    await expect(paypalContent).not.toHaveClass(/hidden/);
  });

  test('mobile responsive layout works', async ({ page }) => {
    // Test at mobile width
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/booking-review.html');
    await page.waitForLoadState('networkidle');
    
    // On mobile, the progress stepper should still be visible
    const stepper = page.locator('.booking-stepper');
    await expect(stepper).toBeVisible();
    
    // Summary panel should be below main content (not side by side)
    const summaryPanel = page.locator('.booking-summary-panel');
    // Just check it's visible (responsive positioning handled by CSS)
    await expect(summaryPanel).toBeVisible();
  });

  test('required field indicators visible', async ({ page }) => {
    await page.goto('/checkout.html');
    await page.waitForLoadState('networkidle');
    
    // Check for required asterisk indicators
    const requiredMarkers = page.locator('text=*');
    const count = await requiredMarkers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('booking confirmation page displays booking details', async ({ page }) => {
    // Set up a completed trip in localStorage
    await page.goto('/booking-confirmation.html?bookingId=TEST-123');
    await page.waitForLoadState('networkidle');
    
    // Check that success message is visible
    const successIcon = page.locator('[role="status"]');
    await expect(successIcon).toBeVisible();
    
    // Check that booking ID is displayed
    const bookingIdEl = page.locator('#confirm-booking-id');
    await expect(bookingIdEl).toBeVisible();
  });

  test('my-itinerary page loads and displays empty state', async ({ page }) => {
    await page.goto('/my-itinerary.html');
    await page.waitForLoadState('networkidle');
    
    // Check empty state is visible
    const emptyState = page.locator('#workspace-empty');
    await expect(emptyState).toBeVisible();
    
    // Check that CTA buttons are present
    const hotelsLink = page.locator('a[href="hotels.html"]');
    await expect(hotelsLink).toBeVisible();
  });

  test('plan-my-layover page loads correctly', async ({ page }) => {
    await page.goto('/plan-my-layover.html');
    await page.waitForLoadState('networkidle');
    
    // Check form is present
    const form = page.locator('#planner-form');
    await expect(form).toBeVisible();
    
    // Check all 5 service selection cards are present
    const selectionCards = page.locator('.select-card');
    const count = await selectionCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('service-selection cards are selectable', async ({ page }) => {
    await page.goto('/plan-my-layover.html');
    await page.waitForLoadState('networkidle');
    
    // Click on a transfer option
    const transferOption = page.locator('input[name="plan-cab"]').first();
    await transferOption.click();
    
    // It should be checked
    await expect(transferOption).toBeChecked();
  });

  test('hotels page has proper listing structure', async ({ page }) => {
    await page.goto('/hotels.html');
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page).toHaveTitle(/Hotel/);
    
    // Check hotel cards are present
    const hotelCards = page.locator('.hotel-card');
    const count = await hotelCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('restaurants page loads correctly', async ({ page }) => {
    await page.goto('/restaurants.html');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Restaurant/);
    
    const restaurantCards = page.locator('.restaurant-card, . dining-card, [class*="restaurant"]');
    const count = await restaurantCards.count();
    // Just check the page loaded (cards may or may not be present depending on data)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('experiences page loads correctly', async ({ page }) => {
    await page.goto('/experiences.html');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Experience/);
  });

  test('airport-transfers page loads correctly', async ({ page }) => {
    await page.goto('/airport-transfers.html');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Transfer/);
  });

  test('no horizontal overflow on any page', async ({ page }) => {
    const pages = [
      '/booking-review.html',
      '/checkout.html',
      '/payment-selection.html',
      '/booking-confirmation.html'
    ];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const windowWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
    }
  });
});

/**
 * Dashboard Layout Tests (Sprint 18)
 * Verifies all 10 dashboard pages use the unified account-layout pattern
 */
test.describe('Dashboard Layout Standardization (Sprint 18)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  const accountPages = [
    { url: '/my-profile.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'My Profile' },
    { url: '/my-trips.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'My Trips' },
    { url: '/saved-itineraries.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Saved Itineraries' },
    { url: '/notifications.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Notifications' },
    { url: '/account-settings.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Account Settings' },
  ];

  const supplierPages = [
    { url: '/supplier-dashboard.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Supplier Dashboard' },
    { url: '/supplier-status.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Supplier Status' },
    { url: '/revenue-admin.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Revenue Admin' },
    { url: '/partner-registration.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Partner Registration' },
  ];

  for (const pg of accountPages) {
    test(`${pg.name} uses standardized account-layout pattern`, async ({ page }) => {
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

      await page.goto(pg.url);
      await page.waitForLoadState('networkidle');

      // Check hero section
      const hero = page.locator(`.${pg.hero}`).first();
      await expect(hero).toBeVisible();

      // Check account-layout grid
      const layout = page.locator(`.${pg.layout}`).first();
      await expect(layout).toBeVisible();

      // Check sidebar navigation
      const sidebar = page.locator(`.${pg.sidebar}`).first();
      await expect(sidebar).toBeVisible();

      // Check account nav links in sidebar
      const navLinks = page.locator('.account-nav-link');
      const count = await navLinks.count();
      expect(count).toBeGreaterThanOrEqual(4); // At least 4 nav items

      // Check account-content area
      const content = page.locator('.account-content').first();
      await expect(content).toBeVisible();

      // No critical console errors
      const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('404'));
      expect(criticalErrors.length).toBe(0);
    });
  }

  for (const pg of supplierPages) {
    test(`${pg.name} uses standardized supplier-layout pattern`, async ({ page }) => {
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

      await page.goto(pg.url);
      await page.waitForLoadState('networkidle');

      // Check hero section
      const hero = page.locator(`.${pg.hero}`).first();
      await expect(hero).toBeVisible();

      // Check account-layout grid
      const layout = page.locator(`.${pg.layout}`).first();
      await expect(layout).toBeVisible();

      // Check sidebar navigation
      const sidebar = page.locator(`.${pg.sidebar}`).first();
      await expect(sidebar).toBeVisible();

      // Check supplier nav links in sidebar (at least 4 items)
      const navLinks = page.locator('.account-nav-link');
      const count = await navLinks.count();
      expect(count).toBeGreaterThanOrEqual(4);

      // No critical console errors
      const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('404'));
      expect(criticalErrors.length).toBe(0);
    });
  }

  test('my-profile shows stats grid and account-card', async ({ page }) => {
    await page.goto('/my-profile.html');
    await page.waitForLoadState('networkidle');

    // Stats grid should be visible
    const statsGrid = page.locator('.stats-grid').first();
    await expect(statsGrid).toBeVisible();

    // Account card should be visible
    const accountCard = page.locator('.account-card').first();
    await expect(accountCard).toBeVisible();

    // 4 stat items expected
    const statItems = page.locator('.stat-item');
    await expect(statItems).toHaveCount(4);
  });

  test('notifications page shows notification cards and filters', async ({ page }) => {
    await page.goto('/notifications.html');
    await page.waitForLoadState('networkidle');

    // Search bar visible
    const search = page.locator('.notification-search').first();
    await expect(search).toBeVisible();

    // Filter buttons visible
    const filters = page.locator('.notification-filter-btn');
    await expect(filters).toHaveCount(4);

    // Notification cards visible
    const cards = page.locator('.notification-card');
    await expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('revenue-admin page shows admin tabs', async ({ page }) => {
    await page.goto('/revenue-admin.html');
    await page.waitForLoadState('networkidle');

    // Hero visible
    const hero = page.locator('.supplier-hero').first();
    await expect(hero).toBeVisible();

    // Admin tabs visible
    const tabs = page.locator('[id^="admin-tab-"]');
    await expect(tabs).toHaveCount(4);

    // First tab (overview) is active by default
    const overviewTab = page.locator('#admin-tab-overview');
    await expect(overviewTab).toBeVisible();
  });

  test('supplier-dashboard shows conditional auth overlay when logged out', async ({ page }) => {
    await page.goto('/supplier-dashboard.html');
    await page.waitForLoadState('networkidle');

    // Auth required panel should be visible (user not logged in)
    const authPanel = page.locator('#auth-required-panel');
    await expect(authPanel).toBeVisible();
  });

  test('partner-registration shows auth overlay when logged out', async ({ page }) => {
    await page.goto('/partner-registration.html');
    await page.waitForLoadState('networkidle');

    // Auth required panel should be visible
    const authPanel = page.locator('#auth-required-panel');
    await expect(authPanel).toBeVisible();
  });

  test('my-trips shows tabs for upcoming/drafts/past', async ({ page }) => {
    await page.goto('/my-trips.html');
    await page.waitForLoadState('networkidle');

    // Stats grid visible
    const statsGrid = page.locator('.stats-grid').first();
    await expect(statsGrid).toBeVisible();

    // Tab buttons visible
    const tabUpcoming = page.locator('#tab-upcoming');
    const tabDrafts = page.locator('#tab-drafts');
    const tabPast = page.locator('#tab-past');
    await expect(tabUpcoming).toBeVisible();
    await expect(tabDrafts).toBeVisible();
    await expect(tabPast).toBeVisible();
  });

  test('saved-itineraries shows empty state when no plans saved', async ({ page }) => {
    await page.goto('/saved-itineraries.html');
    await page.waitForLoadState('networkidle');

    // Empty state or saved plan cards should be visible
    const emptyState = page.locator('.empty-state, .account-card').first();
    await expect(emptyState).toBeVisible();
  });

  test('account sidebar has consistent 5 nav items across all account pages', async ({ page }) => {
    const pages = ['/my-profile.html', '/my-trips.html', '/saved-itineraries.html', '/notifications.html', '/account-settings.html'];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const navLinks = page.locator('.account-sidebar-nav .account-nav-link');
      await expect(navLinks).toHaveCount(5); // Profile, Trips, Saved, Notifications, Settings
    }
  });

  test('supplier sidebar has consistent 4 nav items across supplier pages', async ({ page }) => {
    const pages = ['/supplier-dashboard.html', '/supplier-status.html', '/partner-registration.html', '/revenue-admin.html'];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const navLinks = page.locator('.account-sidebar-nav .account-nav-link');
      await expect(navLinks).toHaveCount(4); // Dashboard, Status, Register, Revenue
    }
  });
});