# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> my-itinerary page loads and displays empty state
- Location: tests\booking-flow.spec.js:319:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href="hotels.html"]')
Expected: visible
Error: strict mode violation: locator('a[href="hotels.html"]') resolved to 4 elements:
    1) <a href="hotels.html" class="navbar-link ">Hotels</a> aka getByRole('link', { name: 'Hotels' }).first()
    2) <a href="hotels.html" class="navbar-mobile-link ">Hotels</a> aka getByLabel('Navigation', { exact: true }).getByRole('link', { name: 'Hotels' })
    3) <a href="hotels.html" class="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow">Hotels</a> aka locator('#workspace-empty').getByRole('link', { name: 'Hotels' })
    4) <a href="hotels.html" class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline">Airport Hotels</a> aka getByRole('link', { name: 'Airport Hotels' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href="hotels.html"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - navigation "Main Navigation" [ref=e3]:
    - generic [ref=e5]:
      - link "LayoverX home" [ref=e6] [cursor=pointer]:
        - /url: index.html
        - img [ref=e8]
        - generic [ref=e10]: LayoverX
      - generic [ref=e11]:
        - link "Hotels" [ref=e12] [cursor=pointer]:
          - /url: hotels.html
        - link "Restaurants" [ref=e13] [cursor=pointer]:
          - /url: restaurants.html
        - link "Spa" [ref=e14] [cursor=pointer]:
          - /url: spa-wellness.html
        - link "Gaming" [ref=e15] [cursor=pointer]:
          - /url: gaming-entertainment.html
        - link "Tours" [ref=e16] [cursor=pointer]:
          - /url: experiences.html
        - link "Transfers" [ref=e17] [cursor=pointer]:
          - /url: airport-transfers.html
        - separator
        - link "Trip Details" [ref=e18] [cursor=pointer]:
          - /url: trip-details.html
        - link "My Itinerary" [ref=e19] [cursor=pointer]:
          - /url: my-itinerary.html
      - generic [ref=e20]:
        - button "View trip summary" [ref=e21] [cursor=pointer]: "✏️ Trip Details: BOM (6.5h, 2 Guests)"
        - link "Plan My Layover" [ref=e22] [cursor=pointer]:
          - /url: plan-my-layover.html
        - generic [ref=e23]:
          - link "Log in" [ref=e24] [cursor=pointer]:
            - /url: "#login"
          - link "Sign up" [ref=e25] [cursor=pointer]:
            - /url: "#signup"
    - dialog "Navigation" [ref=e26]:
      - link "LayoverX home" [ref=e28] [cursor=pointer]:
        - /url: index.html
        - img [ref=e30]
        - generic [ref=e32]: LayoverX
      - generic [ref=e33]:
        - 'button "✏️ Trip Details: BOM (6.5h, 2 Guests)" [ref=e34] [cursor=pointer]'
        - navigation [ref=e35]:
          - link "Hotels" [ref=e36] [cursor=pointer]:
            - /url: hotels.html
          - link "Restaurants" [ref=e37] [cursor=pointer]:
            - /url: restaurants.html
          - link "Spa & Wellness" [ref=e38] [cursor=pointer]:
            - /url: spa-wellness.html
          - link "Gaming & Fun" [ref=e39] [cursor=pointer]:
            - /url: gaming-entertainment.html
          - link "Tours" [ref=e40] [cursor=pointer]:
            - /url: experiences.html
          - link "Transfers" [ref=e41] [cursor=pointer]:
            - /url: airport-transfers.html
          - link "How It Works" [ref=e42] [cursor=pointer]:
            - /url: how-it-works.html
          - link "Contact" [ref=e43] [cursor=pointer]:
            - /url: contact.html
          - link "My Itinerary" [ref=e44] [cursor=pointer]:
            - /url: my-itinerary.html
          - link "Trip Details" [ref=e45] [cursor=pointer]:
            - /url: trip-details.html
      - generic [ref=e46]:
        - link "Plan My Layover" [ref=e47] [cursor=pointer]:
          - /url: plan-my-layover.html
        - generic [ref=e48]:
          - link "Log in" [ref=e49] [cursor=pointer]:
            - /url: "#login"
          - link "Sign up" [ref=e50] [cursor=pointer]:
            - /url: "#signup"
  - main [ref=e51]:
    - generic [ref=e54]:
      - navigation "Breadcrumb" [ref=e55]:
        - link "Home" [ref=e56] [cursor=pointer]:
          - /url: index.html
        - img [ref=e57]
        - generic [ref=e59]: Itinerary Workspace
      - heading "Stopover Planner & Workspace" [level=1] [ref=e60]
      - paragraph [ref=e61]: Build and refine your layover timeline. Check real-time exit timings, calculate prices, and apply AI co-pilot improvements.
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - heading "Timings & Exit Window" [level=2] [ref=e69]
              - paragraph [ref=e70]: "Immigration exit & transfer buffer: 3.5h"
            - button "✏️ Modify Trip Timings" [ref=e71] [cursor=pointer]
          - generic [ref=e72]:
            - generic [ref=e73]:
              - generic [ref=e74]:
                - generic [ref=e75]: Total Layover
                - strong [ref=e76]: 6.5 Hours
              - generic [ref=e77]:
                - generic [ref=e78]: Used Hours
                - strong [ref=e79]: 0.0h
              - generic [ref=e80]:
                - generic [ref=e81]: Remaining Window
                - strong [ref=e82]: 3.0h
            - generic [ref=e85]:
              - generic [ref=e86]: 🛫 Landing
              - generic [ref=e87]: Buffer (Immigration/Transit)
              - generic [ref=e88]: 🛬 Takeoff
        - generic [ref=e89]:
          - generic [ref=e90]:
            - heading "Timeline Sequence" [level=3] [ref=e91]
            - generic [ref=e92]: 0 items
          - generic [ref=e93]:
            - generic [ref=e94]: ✈️
            - heading "Your Stopover Schedule is Empty" [level=3] [ref=e95]
            - paragraph [ref=e96]: Choose transit hotels, fine dining, quick massages, and tours to custom build your stopover.
            - generic [ref=e97]:
              - link "Hotels" [ref=e98] [cursor=pointer]:
                - /url: hotels.html
              - link "Restaurants" [ref=e99] [cursor=pointer]:
                - /url: restaurants.html
              - link "Tours" [ref=e100] [cursor=pointer]:
                - /url: experiences.html
              - button "🔮 Ask AI Co-pilot" [ref=e101] [cursor=pointer]
      - generic [ref=e102]:
        - generic [ref=e103]:
          - heading "Draft Itineraries" [level=3] [ref=e104]
          - generic [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]: Saved Drafts
              - combobox "Saved Drafts" [ref=e108] [cursor=pointer]:
                - option "-- Load Saved Draft --" [selected]
            - generic [ref=e109]:
              - button "💾 Save Draft" [ref=e110] [cursor=pointer]
              - button "👯 Duplicate" [ref=e111] [cursor=pointer]
        - generic [ref=e112]:
          - generic [ref=e114]:
            - generic [ref=e115]: 🔮
            - heading "AI Stopover Co-Pilot" [level=3] [ref=e116]
          - paragraph [ref=e117]: Need an optimized plan? The co-pilot reads your layover window to auto-select recommendations.
          - generic [ref=e118]:
            - button "✨ Generate New Plan" [ref=e119] [cursor=pointer]
            - button "🚀 Fill Safely With AI" [ref=e120] [cursor=pointer]
        - generic [ref=e121]:
          - heading "Pricing Breakdown" [level=3] [ref=e122]
          - list [ref=e123]:
            - listitem [ref=e124]: No items selected
          - separator [ref=e125]
          - generic [ref=e126]:
            - generic [ref=e127]: Total Price
            - generic [ref=e128]: ₹0
          - button "Proceed to Checkout →" [disabled]
  - contentinfo "Site footer" [ref=e129]:
    - generic [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - link "LayoverX" [ref=e133] [cursor=pointer]:
            - /url: index.html
            - img [ref=e135]
            - generic [ref=e137]: LayoverX
          - paragraph [ref=e138]: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
          - generic [ref=e139]:
            - link "LayoverX on Facebook" [ref=e140] [cursor=pointer]:
              - /url: "#"
              - img [ref=e141]
            - link "LayoverX on Twitter" [ref=e143] [cursor=pointer]:
              - /url: "#"
              - img [ref=e144]
            - link "LayoverX on Instagram" [ref=e146] [cursor=pointer]:
              - /url: "#"
              - img [ref=e147]
          - list [ref=e149]:
            - listitem [ref=e150]:
              - img [ref=e151]
              - link "hello@layoverx.com" [ref=e153] [cursor=pointer]:
                - /url: mailto:hello@layoverx.com
            - listitem [ref=e154]:
              - img [ref=e155]
              - link "+91 22 1234 5678" [ref=e157] [cursor=pointer]:
                - /url: tel:+912212345678
            - listitem [ref=e158]:
              - img [ref=e159]
              - generic [ref=e162]:
                - text: Andheri East, Near CSMIA
                - text: Terminal 2, Mumbai 400099
        - generic [ref=e163]:
          - heading "Hotels" [level=3] [ref=e164]
          - list [ref=e165]:
            - listitem [ref=e166]:
              - link "Airport Hotels" [ref=e167] [cursor=pointer]:
                - /url: hotels.html
            - listitem [ref=e168]:
              - link "Day-Use Rooms" [ref=e169] [cursor=pointer]:
                - /url: hotels.html#day-use
            - listitem [ref=e170]:
              - link "Transit Hotels" [ref=e171] [cursor=pointer]:
                - /url: hotels.html#transit
            - listitem [ref=e172]:
              - link "Luxury Stays" [ref=e173] [cursor=pointer]:
                - /url: hotels.html#luxury
            - listitem [ref=e174]:
              - link "Budget Hotels" [ref=e175] [cursor=pointer]:
                - /url: hotels.html#budget
        - generic [ref=e176]:
          - heading "Restaurants" [level=3] [ref=e177]
          - list [ref=e178]:
            - listitem [ref=e179]:
              - link "Restaurants & Dining" [ref=e180] [cursor=pointer]:
                - /url: restaurants.html
            - listitem [ref=e181]:
              - link "Fine Dining" [ref=e182] [cursor=pointer]:
                - /url: restaurants.html#fine-dining
            - listitem [ref=e183]:
              - link "Local Cuisine" [ref=e184] [cursor=pointer]:
                - /url: restaurants.html#local
            - listitem [ref=e185]:
              - link "Quick Bites" [ref=e186] [cursor=pointer]:
                - /url: restaurants.html#quick
            - listitem [ref=e187]:
              - link "Airport Lounges" [ref=e188] [cursor=pointer]:
                - /url: restaurants.html#lounge
        - generic [ref=e189]:
          - heading "Experiences" [level=3] [ref=e190]
          - list [ref=e191]:
            - listitem [ref=e192]:
              - link "Tours & Experiences" [ref=e193] [cursor=pointer]:
                - /url: experiences.html
            - listitem [ref=e194]:
              - link "City Tours" [ref=e195] [cursor=pointer]:
                - /url: experiences.html#city-tours
            - listitem [ref=e196]:
              - link "Cultural Walks" [ref=e197] [cursor=pointer]:
                - /url: experiences.html#cultural
            - listitem [ref=e198]:
              - link "Airport Transfers" [ref=e199] [cursor=pointer]:
                - /url: airport-transfers.html
            - listitem [ref=e200]:
              - link "Private Cabs" [ref=e201] [cursor=pointer]:
                - /url: airport-transfers.html#private
        - generic [ref=e202]:
          - heading "Company" [level=3] [ref=e203]
          - list [ref=e204]:
            - listitem [ref=e205]:
              - link "How It Works" [ref=e206] [cursor=pointer]:
                - /url: how-it-works.html
            - listitem [ref=e207]:
              - link "Contact Us" [ref=e208] [cursor=pointer]:
                - /url: contact.html
            - listitem [ref=e209]:
              - link "Partner With Us" [ref=e210] [cursor=pointer]:
                - /url: contact.html#partner
            - listitem [ref=e211]:
              - link "FAQs" [ref=e212] [cursor=pointer]:
                - /url: how-it-works.html#faq
            - listitem [ref=e213]:
              - link "Help Center" [ref=e214] [cursor=pointer]:
                - /url: help-center.html
        - generic [ref=e215]:
          - heading "Legal" [level=3] [ref=e216]
          - list [ref=e217]:
            - listitem [ref=e218]:
              - link "Privacy Policy" [ref=e219] [cursor=pointer]:
                - /url: privacy.html
            - listitem [ref=e220]:
              - link "Terms of Service" [ref=e221] [cursor=pointer]:
                - /url: terms.html
            - listitem [ref=e222]:
              - link "Cookie Policy" [ref=e223] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e225]:
        - paragraph [ref=e226]: © 2026 LayoverX. All rights reserved.
        - paragraph [ref=e227]: Mumbai, India — Dedicated to transit travelers worldwide.
        - generic [ref=e228]:
          - link "Privacy" [ref=e229] [cursor=pointer]:
            - /url: privacy.html
          - link "Terms" [ref=e230] [cursor=pointer]:
            - /url: terms.html
          - link "Cookies" [ref=e231] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  229 |   });
  230 | 
  231 |   test('form inputs have associated labels', async ({ page }) => {
  232 |     await page.goto('/checkout.html');
  233 |     await page.waitForLoadState('networkidle');
  234 |     
  235 |     const inputs = page.locator('input[id]');
  236 |     const count = await inputs.count();
  237 |     
  238 |     for (let i = 0; i < count; i++) {
  239 |       const input = inputs.nth(i);
  240 |       const id = await input.getAttribute('id');
  241 |       if (!id) continue;
  242 |       
  243 |       // Check if there's a label with for attribute
  244 |       const label = page.locator(`label[for="${id}"]`);
  245 |       const hasLabel = await label.count() > 0;
  246 |       
  247 |       // If no explicit label, check for aria-label
  248 |       if (!hasLabel) {
  249 |         const ariaLabel = await input.getAttribute('aria-label');
  250 |         const ariaLabelledby = await input.getAttribute('aria-labelledby');
  251 |         expect(ariaLabel || ariaLabelledby).toBeTruthy();
  252 |       }
  253 |     }
  254 |   });
  255 | 
  256 |   test('payment tabs switch correctly', async ({ page }) => {
  257 |     await page.goto('/payment-selection.html');
  258 |     await page.waitForLoadState('networkidle');
  259 |     
  260 |     // Click UPI tab
  261 |     await page.click('#tab-upi');
  262 |     
  263 |     // UPI content should be visible
  264 |     const upiContent = page.locator('#payment-content-upi');
  265 |     await expect(upiContent).not.toHaveClass(/hidden/);
  266 |     
  267 |     // Card content should be hidden
  268 |     const cardContent = page.locator('#payment-content-card');
  269 |     await expect(cardContent).toHaveClass(/hidden/);
  270 |     
  271 |     // Click PayPal tab
  272 |     await page.click('#tab-paypal');
  273 |     
  274 |     const paypalContent = page.locator('#payment-content-paypal');
  275 |     await expect(paypalContent).not.toHaveClass(/hidden/);
  276 |   });
  277 | 
  278 |   test('mobile responsive layout works', async ({ page }) => {
  279 |     // Test at mobile width
  280 |     await page.setViewportSize({ width: 375, height: 667 });
  281 |     
  282 |     await page.goto('/booking-review.html');
  283 |     await page.waitForLoadState('networkidle');
  284 |     
  285 |     // On mobile, the progress stepper should still be visible
  286 |     const stepper = page.locator('.booking-stepper');
  287 |     await expect(stepper).toBeVisible();
  288 |     
  289 |     // Summary panel should be below main content (not side by side)
  290 |     const summaryPanel = page.locator('.booking-summary-panel');
  291 |     // Just check it's visible (responsive positioning handled by CSS)
  292 |     await expect(summaryPanel).toBeVisible();
  293 |   });
  294 | 
  295 |   test('required field indicators visible', async ({ page }) => {
  296 |     await page.goto('/checkout.html');
  297 |     await page.waitForLoadState('networkidle');
  298 |     
  299 |     // Check for required asterisk indicators
  300 |     const requiredMarkers = page.locator('text=*');
  301 |     const count = await requiredMarkers.count();
  302 |     expect(count).toBeGreaterThan(0);
  303 |   });
  304 | 
  305 |   test('booking confirmation page displays booking details', async ({ page }) => {
  306 |     // Set up a completed trip in localStorage
  307 |     await page.goto('/booking-confirmation.html?bookingId=TEST-123');
  308 |     await page.waitForLoadState('networkidle');
  309 |     
  310 |     // Check that success message is visible
  311 |     const successIcon = page.locator('[role="status"]');
  312 |     await expect(successIcon).toBeVisible();
  313 |     
  314 |     // Check that booking ID is displayed
  315 |     const bookingIdEl = page.locator('#confirm-booking-id');
  316 |     await expect(bookingIdEl).toBeVisible();
  317 |   });
  318 | 
  319 |   test('my-itinerary page loads and displays empty state', async ({ page }) => {
  320 |     await page.goto('/my-itinerary.html');
  321 |     await page.waitForLoadState('networkidle');
  322 |     
  323 |     // Check empty state is visible
  324 |     const emptyState = page.locator('#workspace-empty');
  325 |     await expect(emptyState).toBeVisible();
  326 |     
  327 |     // Check that CTA buttons are present
  328 |     const hotelsLink = page.locator('a[href="hotels.html"]');
> 329 |     await expect(hotelsLink).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  330 |   });
  331 | 
  332 |   test('plan-my-layover page loads correctly', async ({ page }) => {
  333 |     await page.goto('/plan-my-layover.html');
  334 |     await page.waitForLoadState('networkidle');
  335 |     
  336 |     // Check form is present
  337 |     const form = page.locator('#planner-form');
  338 |     await expect(form).toBeVisible();
  339 |     
  340 |     // Check all 5 service selection cards are present
  341 |     const selectionCards = page.locator('.select-card');
  342 |     const count = await selectionCards.count();
  343 |     expect(count).toBeGreaterThan(0);
  344 |   });
  345 | 
  346 |   test('service-selection cards are selectable', async ({ page }) => {
  347 |     await page.goto('/plan-my-layover.html');
  348 |     await page.waitForLoadState('networkidle');
  349 |     
  350 |     // Click on a transfer option
  351 |     const transferOption = page.locator('input[name="plan-cab"]').first();
  352 |     await transferOption.click();
  353 |     
  354 |     // It should be checked
  355 |     await expect(transferOption).toBeChecked();
  356 |   });
  357 | 
  358 |   test('hotels page has proper listing structure', async ({ page }) => {
  359 |     await page.goto('/hotels.html');
  360 |     await page.waitForLoadState('networkidle');
  361 |     
  362 |     // Check page title
  363 |     await expect(page).toHaveTitle(/Hotel/);
  364 |     
  365 |     // Check hotel cards are present
  366 |     const hotelCards = page.locator('.hotel-card');
  367 |     const count = await hotelCards.count();
  368 |     expect(count).toBeGreaterThan(0);
  369 |   });
  370 | 
  371 |   test('restaurants page loads correctly', async ({ page }) => {
  372 |     await page.goto('/restaurants.html');
  373 |     await page.waitForLoadState('networkidle');
  374 |     
  375 |     await expect(page).toHaveTitle(/Restaurant/);
  376 |     
  377 |     const restaurantCards = page.locator('.restaurant-card, . dining-card, [class*="restaurant"]');
  378 |     const count = await restaurantCards.count();
  379 |     // Just check the page loaded (cards may or may not be present depending on data)
  380 |     expect(count).toBeGreaterThanOrEqual(0);
  381 |   });
  382 | 
  383 |   test('experiences page loads correctly', async ({ page }) => {
  384 |     await page.goto('/experiences.html');
  385 |     await page.waitForLoadState('networkidle');
  386 |     
  387 |     await expect(page).toHaveTitle(/Experience/);
  388 |   });
  389 | 
  390 |   test('airport-transfers page loads correctly', async ({ page }) => {
  391 |     await page.goto('/airport-transfers.html');
  392 |     await page.waitForLoadState('networkidle');
  393 | 
  394 |     await expect(page).toHaveTitle(/Transfer/);
  395 |   });
  396 | 
  397 |   test('no horizontal overflow on any page', async ({ page }) => {
  398 |     const pages = [
  399 |       '/booking-review.html',
  400 |       '/checkout.html',
  401 |       '/payment-selection.html',
  402 |       '/booking-confirmation.html'
  403 |     ];
  404 | 
  405 |     for (const url of pages) {
  406 |       await page.goto(url);
  407 |       await page.waitForLoadState('networkidle');
  408 | 
  409 |       const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  410 |       const windowWidth = await page.evaluate(() => window.innerWidth);
  411 | 
  412 |       expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  413 |     }
  414 |   });
  415 | });
  416 | 
  417 | /**
  418 |  * Dashboard Layout Tests (Sprint 18)
  419 |  * Verifies all 10 dashboard pages use the unified account-layout pattern
  420 |  */
  421 | test.describe('Dashboard Layout Standardization (Sprint 18)', () => {
  422 | 
  423 |   test.beforeEach(async ({ page }) => {
  424 |     await page.goto('/');
  425 |     await page.evaluate(() => localStorage.clear());
  426 |   });
  427 | 
  428 |   const accountPages = [
  429 |     { url: '/my-profile.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'My Profile' },
```