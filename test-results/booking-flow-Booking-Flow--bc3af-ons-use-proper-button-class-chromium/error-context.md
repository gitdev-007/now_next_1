# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> CTA buttons use proper button class
- Location: tests\booking-flow.spec.js:122:3

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('button[type="submit"]')
Expected pattern: /btn/
Error: strict mode violation: locator('button[type="submit"]') resolved to 4 elements:
    1) <button type="submit" id="btn-submit-details" class="btn btn-primary flex items-center gap-1 w-full sm:w-auto justify-center">…</button> aka getByRole('button', { name: 'Proceed to Payment' })
    2) <button type="submit" id="btn-login-submit" class="btn btn-primary w-full mt-2">…</button> aka locator('#btn-login-submit')
    3) <button type="submit" id="btn-signup-submit" class="btn btn-primary w-full mt-4">…</button> aka locator('#btn-signup-submit')
    4) <button type="submit" id="btn-context-submit" class="btn btn-primary w-full mt-4">…</button> aka locator('#btn-context-submit')

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('button[type="submit"]')

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
        - link "Review Stopover" [ref=e59] [cursor=pointer]:
          - /url: booking-review.html
        - img [ref=e60]
        - generic [ref=e62]: Traveler Details
      - heading "Traveler & Flight Details" [level=1] [ref=e63]
      - paragraph [ref=e64]: "Step 2 of 4: Provide flight connection details and traveler information to align airport pick-up and hotel check-in buffers."
    - navigation "Booking progress" [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]: "1"
        - generic [ref=e70]: Review
      - generic [ref=e72]:
        - generic [ref=e73]: "2"
        - generic [ref=e74]: Details
      - generic [ref=e76]:
        - generic [ref=e77]: "3"
        - generic [ref=e78]: Payment
      - generic [ref=e80]:
        - generic [ref=e81]: "4"
        - generic [ref=e82]: Confirm
    - generic [ref=e85]:
      - generic [ref=e87]:
        - generic [ref=e88]:
          - heading "👤 Traveler Details" [level=2] [ref=e89]:
            - generic [ref=e90]: 👤
            - text: Traveler Details
          - paragraph [ref=e91]: Names must match passport details exactly for terminal security exit clearance.
          - generic [ref=e92]:
            - generic [ref=e93]:
              - generic [ref=e94]: Lead Passenger Name *
              - textbox "Lead Passenger Name required" [ref=e95]:
                - /placeholder: e.g. John Doe
            - generic [ref=e96]:
              - generic [ref=e97]: Passport Number *
              - textbox "Passport Number required" [ref=e98]:
                - /placeholder: e.g. Z1234567
          - generic [ref=e99]:
            - generic [ref=e100]:
              - generic [ref=e101]: Nationality / Country *
              - textbox "Nationality / Country required" [ref=e102]:
                - /placeholder: e.g. United Kingdom
            - generic [ref=e103]:
              - generic [ref=e104]: Mobile Number (with country code) *
              - textbox "Mobile Number (with country code) required" [ref=e105]:
                - /placeholder: e.g. +44 7911 123456
        - generic [ref=e106]:
          - heading "✈️ Flight Connections" [level=2] [ref=e107]:
            - generic [ref=e108]: ✈️
            - text: Flight Connections
          - paragraph [ref=e109]: We trace landing delays in real-time to adjust chauffeur pick-ups and room slots.
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]: Incoming Flight Number *
              - textbox "Incoming Flight Number required" [ref=e113]:
                - /placeholder: e.g. BA-199
            - generic [ref=e114]:
              - generic [ref=e115]: Outgoing Flight Number *
              - textbox "Outgoing Flight Number required" [ref=e116]:
                - /placeholder: e.g. EK-501
        - generic [ref=e117]:
          - generic [ref=e118]:
            - heading "Checking out as a Guest?" [level=3] [ref=e119]
            - paragraph [ref=e120]: Create a password next to track your itinerary and get live flight delay adjustments automatically.
          - button "Create Account" [ref=e121] [cursor=pointer]
        - generic [ref=e122]:
          - link "Back to Review" [ref=e123] [cursor=pointer]:
            - /url: booking-review.html
          - button "Proceed to Payment" [ref=e124] [cursor=pointer]:
            - generic [ref=e125]: Proceed to Payment
            - img [ref=e126]
      - generic [ref=e129]:
        - heading "Selected Itinerary" [level=3] [ref=e130]
        - list [ref=e131]:
          - listitem [ref=e132]: No services in cart.
        - separator [ref=e133]
        - generic [ref=e134]:
          - generic [ref=e135]: Total Price
          - generic [ref=e136]: ₹0
        - generic [ref=e137]:
          - paragraph [ref=e138]: ✅ Free cancellation up to 3h before checking in.
          - paragraph [ref=e139]: ✅ All airport transfers are fixed price (includes driver wait time, parking and expressway tolls).
  - contentinfo "Site footer" [ref=e140]:
    - generic [ref=e141]:
      - generic [ref=e142]:
        - generic [ref=e143]:
          - link "LayoverX" [ref=e144] [cursor=pointer]:
            - /url: index.html
            - img [ref=e146]
            - generic [ref=e148]: LayoverX
          - paragraph [ref=e149]: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
          - generic [ref=e150]:
            - link "LayoverX on Facebook" [ref=e151] [cursor=pointer]:
              - /url: "#"
              - img [ref=e152]
            - link "LayoverX on Twitter" [ref=e154] [cursor=pointer]:
              - /url: "#"
              - img [ref=e155]
            - link "LayoverX on Instagram" [ref=e157] [cursor=pointer]:
              - /url: "#"
              - img [ref=e158]
          - list [ref=e160]:
            - listitem [ref=e161]:
              - img [ref=e162]
              - link "hello@layoverx.com" [ref=e164] [cursor=pointer]:
                - /url: mailto:hello@layoverx.com
            - listitem [ref=e165]:
              - img [ref=e166]
              - link "+91 22 1234 5678" [ref=e168] [cursor=pointer]:
                - /url: tel:+912212345678
            - listitem [ref=e169]:
              - img [ref=e170]
              - generic [ref=e173]:
                - text: Andheri East, Near CSMIA
                - text: Terminal 2, Mumbai 400099
        - generic [ref=e174]:
          - heading "Hotels" [level=3] [ref=e175]
          - list [ref=e176]:
            - listitem [ref=e177]:
              - link "Airport Hotels" [ref=e178] [cursor=pointer]:
                - /url: hotels.html
            - listitem [ref=e179]:
              - link "Day-Use Rooms" [ref=e180] [cursor=pointer]:
                - /url: hotels.html#day-use
            - listitem [ref=e181]:
              - link "Transit Hotels" [ref=e182] [cursor=pointer]:
                - /url: hotels.html#transit
            - listitem [ref=e183]:
              - link "Luxury Stays" [ref=e184] [cursor=pointer]:
                - /url: hotels.html#luxury
            - listitem [ref=e185]:
              - link "Budget Hotels" [ref=e186] [cursor=pointer]:
                - /url: hotels.html#budget
        - generic [ref=e187]:
          - heading "Restaurants" [level=3] [ref=e188]
          - list [ref=e189]:
            - listitem [ref=e190]:
              - link "Restaurants & Dining" [ref=e191] [cursor=pointer]:
                - /url: restaurants.html
            - listitem [ref=e192]:
              - link "Fine Dining" [ref=e193] [cursor=pointer]:
                - /url: restaurants.html#fine-dining
            - listitem [ref=e194]:
              - link "Local Cuisine" [ref=e195] [cursor=pointer]:
                - /url: restaurants.html#local
            - listitem [ref=e196]:
              - link "Quick Bites" [ref=e197] [cursor=pointer]:
                - /url: restaurants.html#quick
            - listitem [ref=e198]:
              - link "Airport Lounges" [ref=e199] [cursor=pointer]:
                - /url: restaurants.html#lounge
        - generic [ref=e200]:
          - heading "Experiences" [level=3] [ref=e201]
          - list [ref=e202]:
            - listitem [ref=e203]:
              - link "Tours & Experiences" [ref=e204] [cursor=pointer]:
                - /url: experiences.html
            - listitem [ref=e205]:
              - link "City Tours" [ref=e206] [cursor=pointer]:
                - /url: experiences.html#city-tours
            - listitem [ref=e207]:
              - link "Cultural Walks" [ref=e208] [cursor=pointer]:
                - /url: experiences.html#cultural
            - listitem [ref=e209]:
              - link "Airport Transfers" [ref=e210] [cursor=pointer]:
                - /url: airport-transfers.html
            - listitem [ref=e211]:
              - link "Private Cabs" [ref=e212] [cursor=pointer]:
                - /url: airport-transfers.html#private
        - generic [ref=e213]:
          - heading "Company" [level=3] [ref=e214]
          - list [ref=e215]:
            - listitem [ref=e216]:
              - link "How It Works" [ref=e217] [cursor=pointer]:
                - /url: how-it-works.html
            - listitem [ref=e218]:
              - link "Contact Us" [ref=e219] [cursor=pointer]:
                - /url: contact.html
            - listitem [ref=e220]:
              - link "Partner With Us" [ref=e221] [cursor=pointer]:
                - /url: contact.html#partner
            - listitem [ref=e222]:
              - link "FAQs" [ref=e223] [cursor=pointer]:
                - /url: how-it-works.html#faq
            - listitem [ref=e224]:
              - link "Help Center" [ref=e225] [cursor=pointer]:
                - /url: help-center.html
        - generic [ref=e226]:
          - heading "Legal" [level=3] [ref=e227]
          - list [ref=e228]:
            - listitem [ref=e229]:
              - link "Privacy Policy" [ref=e230] [cursor=pointer]:
                - /url: privacy.html
            - listitem [ref=e231]:
              - link "Terms of Service" [ref=e232] [cursor=pointer]:
                - /url: terms.html
            - listitem [ref=e233]:
              - link "Cookie Policy" [ref=e234] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e236]:
        - paragraph [ref=e237]: © 2026 LayoverX. All rights reserved.
        - paragraph [ref=e238]: Mumbai, India — Dedicated to transit travelers worldwide.
        - generic [ref=e239]:
          - link "Privacy" [ref=e240] [cursor=pointer]:
            - /url: privacy.html
          - link "Terms" [ref=e241] [cursor=pointer]:
            - /url: terms.html
          - link "Cookies" [ref=e242] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  28  |     const criticalErrors = errors.filter(e => 
  29  |       !e.includes('favicon') && 
  30  |       !e.includes('404') &&
  31  |       !e.includes('net::ERR')
  32  |     );
  33  |     
  34  |     expect(criticalErrors.length).toBe(0);
  35  |   });
  36  | 
  37  |   test('booking-review page loads with progress stepper', async ({ page }) => {
  38  |     await page.goto('/booking-review.html');
  39  |     await page.waitForLoadState('networkidle');
  40  |     
  41  |     // Check progress stepper is visible
  42  |     const stepper = page.locator('.booking-stepper');
  43  |     await expect(stepper).toBeVisible();
  44  |     
  45  |     // Check all 4 steps are present
  46  |     const steps = page.locator('.booking-stepper-ring');
  47  |     await expect(steps).toHaveCount(4);
  48  |     
  49  |     // Step 1 should be active (review page)
  50  |     const activeStep = page.locator('.booking-stepper-ring--active');
  51  |     await expect(activeStep).toHaveCount(1);
  52  |     await expect(activeStep).toHaveText('1');
  53  |   });
  54  | 
  55  |   test('checkout page shows progress stepper with step 2 active', async ({ page }) => {
  56  |     await page.goto('/checkout.html');
  57  |     await page.waitForLoadState('networkidle');
  58  |     
  59  |     const steps = page.locator('.booking-stepper-ring');
  60  |     await expect(steps).toHaveCount(4);
  61  |     
  62  |     // Should have 1 completed step (step 1)
  63  |     const completedSteps = page.locator('.booking-stepper-ring--completed');
  64  |     await expect(completedSteps).toHaveCount(1);
  65  |     
  66  |     // Should have 1 active step (step 2)
  67  |     const activeStep = page.locator('.booking-stepper-ring--active');
  68  |     await expect(activeStep).toHaveCount(1);
  69  |     await expect(activeStep).toHaveText('2');
  70  |   });
  71  | 
  72  |   test('payment-selection page shows progress stepper with step 3 active', async ({ page }) => {
  73  |     await page.goto('/payment-selection.html');
  74  |     await page.waitForLoadState('networkidle');
  75  |     
  76  |     const steps = page.locator('.booking-stepper-ring');
  77  |     await expect(steps).toHaveCount(4);
  78  |     
  79  |     // Should have 2 completed steps (1 and 2)
  80  |     const completedSteps = page.locator('.booking-stepper-ring--completed');
  81  |     await expect(completedSteps).toHaveCount(2);
  82  |     
  83  |     // Should have 1 active step (step 3)
  84  |     const activeStep = page.locator('.booking-stepper-ring--active');
  85  |     await expect(activeStep).toHaveCount(1);
  86  |     await expect(activeStep).toHaveText('3');
  87  |   });
  88  | 
  89  |   test('checkout form validates required fields', async ({ page }) => {
  90  |     await page.goto('/checkout.html');
  91  |     await page.waitForLoadState('networkidle');
  92  |     
  93  |     // Try to submit empty form
  94  |     const submitBtn = page.locator('#btn-submit-details');
  95  |     await submitBtn.click();
  96  |     
  97  |     // Should show error messages
  98  |     const errorMessages = page.locator('[role="alert"]');
  99  |     const count = await errorMessages.count();
  100 |     expect(count).toBeGreaterThan(0);
  101 |   });
  102 | 
  103 |   test('checkout form accepts valid input', async ({ page }) => {
  104 |     await page.goto('/checkout.html');
  105 |     await page.waitForLoadState('networkidle');
  106 |     
  107 |     // Fill in required fields
  108 |     await page.fill('#chk-traveler-name', 'John Doe');
  109 |     await page.fill('#chk-passport', 'AB1234567');
  110 |     await page.fill('#chk-traveler-nationality', 'United States');
  111 |     await page.fill('#chk-emergency', '+1 555-123-4567');
  112 |     await page.fill('#chk-flight-in', 'AA-123');
  113 |     await page.fill('#chk-flight-departure', 'AA-456');
  114 |     
  115 |     // Submit form
  116 |     await page.click('#btn-submit-details');
  117 |     
  118 |     // Should navigate to payment page
  119 |     await expect(page).toHaveURL(/payment-selection\.html/);
  120 |   });
  121 | 
  122 |   test('CTA buttons use proper button class', async ({ page }) => {
  123 |     // Check checkout page CTA
  124 |     await page.goto('/checkout.html');
  125 |     await page.waitForLoadState('networkidle');
  126 |     
  127 |     const proceedBtn = page.locator('button[type="submit"]');
> 128 |     await expect(proceedBtn).toHaveClass(/btn/);
      |                              ^ Error: expect(locator).toHaveClass(expected) failed
  129 |     
  130 |     // Check payment page CTA
  131 |     await page.goto('/payment-selection.html');
  132 |     await page.waitForLoadState('networkidle');
  133 |     
  134 |     const payBtn = page.locator('#btn-pay-now');
  135 |     await expect(payBtn).toHaveClass(/btn/);
  136 |     
  137 |     // Check my-itinerary CTA
  138 |     await page.goto('/my-itinerary.html');
  139 |     await page.waitForLoadState('networkidle');
  140 |     
  141 |     const checkoutBtn = page.locator('#btn-checkout');
  142 |     await expect(checkoutBtn).toHaveClass(/btn/);
  143 |   });
  144 | 
  145 |   test('forms have proper focus states', async ({ page }) => {
  146 |     await page.goto('/checkout.html');
  147 |     await page.waitForLoadState('networkidle');
  148 |     
  149 |     const nameInput = page.locator('#chk-traveler-name');
  150 |     await nameInput.focus();
  151 |     
  152 |     // Check that focus ring is visible
  153 |     const isFocused = await nameInput.evaluate(el => el === document.activeElement);
  154 |     expect(isFocused).toBe(true);
  155 |   });
  156 | 
  157 |   test('summary panel is visible on booking-review page', async ({ page }) => {
  158 |     await page.goto('/booking-review.html');
  159 |     await page.waitForLoadState('networkidle');
  160 |     
  161 |     const summaryPanel = page.locator('text=Pricing Summary');
  162 |     await expect(summaryPanel).toBeVisible();
  163 |   });
  164 | 
  165 |   test('summary panel is visible on checkout page', async ({ page }) => {
  166 |     await page.goto('/checkout.html');
  167 |     await page.waitForLoadState('networkidle');
  168 |     
  169 |     const summaryPanel = page.locator('text=Selected Itinerary');
  170 |     await expect(summaryPanel).toBeVisible();
  171 |   });
  172 | 
  173 |   test('skip to content link is present', async ({ page }) => {
  174 |     await page.goto('/booking-review.html');
  175 |     await page.waitForLoadState('networkidle');
  176 |     
  177 |     const skipLink = page.locator('a[href="#main"]');
  178 |     await expect(skipLink).toBeAttached();
  179 |   });
  180 | 
  181 |   test('all pages have proper page titles', async ({ page }) => {
  182 |     const pages = [
  183 |       { url: '/booking-review.html', title: 'Booking Review' },
  184 |       { url: '/checkout.html', title: 'Checkout' },
  185 |       { url: '/payment-selection.html', title: 'Payment' },
  186 |       { url: '/booking-confirmation.html', title: 'Confirmation' }
  187 |     ];
  188 | 
  189 |     for (const p of pages) {
  190 |       await page.goto(p.url);
  191 |       await page.waitForLoadState('networkidle');
  192 |       const title = await page.title();
  193 |       expect(title).toContain(p.title);
  194 |     }
  195 |   });
  196 | 
  197 |   test('navbar is present and functional on all pages', async ({ page }) => {
  198 |     const pages = [
  199 |       '/booking-review.html',
  200 |       '/checkout.html', 
  201 |       '/payment-selection.html',
  202 |       '/booking-confirmation.html'
  203 |     ];
  204 | 
  205 |     for (const url of pages) {
  206 |       await page.goto(url);
  207 |       await page.waitForLoadState('networkidle');
  208 |       
  209 |       const navbar = page.locator('nav[role="navigation"]');
  210 |       await expect(navbar).toBeVisible();
  211 |     }
  212 |   });
  213 | 
  214 |   test('footer is present on all pages', async ({ page }) => {
  215 |     const pages = [
  216 |       '/booking-review.html',
  217 |       '/checkout.html',
  218 |       '/payment-selection.html',
  219 |       '/booking-confirmation.html'
  220 |     ];
  221 | 
  222 |     for (const url of pages) {
  223 |       await page.goto(url);
  224 |       await page.waitForLoadState('networkidle');
  225 |       
  226 |       const footer = page.locator('footer[role="contentinfo"]');
  227 |       await expect(footer).toBeVisible();
  228 |     }
```