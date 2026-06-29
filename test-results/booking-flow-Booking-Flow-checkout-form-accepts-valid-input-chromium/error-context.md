# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> checkout form accepts valid input
- Location: tests\booking-flow.spec.js:103:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /payment-selection\.html/
Received string:  "http://localhost:8000/payment-selection"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:8000/payment-selection"

```

```yaml
- link "Skip to main content":
  - /url: "#main"
- navigation "Main Navigation":
  - link "LayoverX home":
    - /url: index.html
    - img
    - text: LayoverX
  - link "Hotels":
    - /url: hotels.html
  - link "Restaurants":
    - /url: restaurants.html
  - link "Spa":
    - /url: spa-wellness.html
  - link "Gaming":
    - /url: gaming-entertainment.html
  - link "Tours":
    - /url: experiences.html
  - link "Transfers":
    - /url: airport-transfers.html
  - separator
  - link "Trip Details":
    - /url: trip-details.html
  - link "My Itinerary":
    - /url: my-itinerary.html
  - button "View trip summary": "✏️ Trip Details: BOM (6.5h, 2 Guests)"
  - link "Plan My Layover":
    - /url: plan-my-layover.html
  - link "Log in":
    - /url: "#login"
  - link "Sign up":
    - /url: "#signup"
  - dialog "Navigation":
    - link "LayoverX home":
      - /url: index.html
      - img
      - text: LayoverX
    - 'button "✏️ Trip Details: BOM (6.5h, 2 Guests)"'
    - navigation:
      - link "Hotels":
        - /url: hotels.html
      - link "Restaurants":
        - /url: restaurants.html
      - link "Spa & Wellness":
        - /url: spa-wellness.html
      - link "Gaming & Fun":
        - /url: gaming-entertainment.html
      - link "Tours":
        - /url: experiences.html
      - link "Transfers":
        - /url: airport-transfers.html
      - link "How It Works":
        - /url: how-it-works.html
      - link "Contact":
        - /url: contact.html
      - link "My Itinerary":
        - /url: my-itinerary.html
      - link "Trip Details":
        - /url: trip-details.html
    - link "Plan My Layover":
      - /url: plan-my-layover.html
    - link "Log in":
      - /url: "#login"
    - link "Sign up":
      - /url: "#signup"
- main:
  - navigation "Breadcrumb":
    - link "Home":
      - /url: index.html
    - img
    - link "Traveler Details":
      - /url: checkout.html
    - img
    - text: Payment Selection
  - heading "Select Payment Method" [level=1]
  - paragraph: "Step 3 of 4: All payments are processed securely. No booking fees or hidden charges."
  - navigation "Booking progress": 1 Review 2 Details 3 Payment 4 Confirm
  - heading "💳 Payment Method 🔒 SSL Secured" [level=2]
  - button "Card"
  - button "UPI"
  - button "PayPal"
  - text: Cardholder Name
  - textbox "Cardholder Name":
    - /placeholder: e.g. John Doe
  - text: Card Number
  - textbox "Card Number":
    - /placeholder: 4111 2222 3333 4444
  - text: Expiry Date
  - textbox "Expiry Date":
    - /placeholder: MM/YY
  - text: CVV
  - textbox "CVV":
    - /placeholder: "123"
  - link "Back to Details":
    - /url: checkout.html
  - button "Secure Book & Pay"
  - heading "Order Summary" [level=3]
  - list:
    - listitem: No services in cart.
  - separator
  - text: Total Price ₹0
- contentinfo "Site footer":
  - link "LayoverX":
    - /url: index.html
    - img
    - text: LayoverX
  - paragraph: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
  - link "LayoverX on Facebook":
    - /url: "#"
    - img
  - link "LayoverX on Twitter":
    - /url: "#"
    - img
  - link "LayoverX on Instagram":
    - /url: "#"
    - img
  - list:
    - listitem:
      - img
      - link "hello@layoverx.com":
        - /url: mailto:hello@layoverx.com
    - listitem:
      - img
      - link "+91 22 1234 5678":
        - /url: tel:+912212345678
    - listitem:
      - img
      - text: Andheri East, Near CSMIA Terminal 2, Mumbai 400099
  - heading "Hotels" [level=3]
  - list:
    - listitem:
      - link "Airport Hotels":
        - /url: hotels.html
    - listitem:
      - link "Day-Use Rooms":
        - /url: hotels.html#day-use
    - listitem:
      - link "Transit Hotels":
        - /url: hotels.html#transit
    - listitem:
      - link "Luxury Stays":
        - /url: hotels.html#luxury
    - listitem:
      - link "Budget Hotels":
        - /url: hotels.html#budget
  - heading "Restaurants" [level=3]
  - list:
    - listitem:
      - link "Restaurants & Dining":
        - /url: restaurants.html
    - listitem:
      - link "Fine Dining":
        - /url: restaurants.html#fine-dining
    - listitem:
      - link "Local Cuisine":
        - /url: restaurants.html#local
    - listitem:
      - link "Quick Bites":
        - /url: restaurants.html#quick
    - listitem:
      - link "Airport Lounges":
        - /url: restaurants.html#lounge
  - heading "Experiences" [level=3]
  - list:
    - listitem:
      - link "Tours & Experiences":
        - /url: experiences.html
    - listitem:
      - link "City Tours":
        - /url: experiences.html#city-tours
    - listitem:
      - link "Cultural Walks":
        - /url: experiences.html#cultural
    - listitem:
      - link "Airport Transfers":
        - /url: airport-transfers.html
    - listitem:
      - link "Private Cabs":
        - /url: airport-transfers.html#private
  - heading "Company" [level=3]
  - list:
    - listitem:
      - link "How It Works":
        - /url: how-it-works.html
    - listitem:
      - link "Contact Us":
        - /url: contact.html
    - listitem:
      - link "Partner With Us":
        - /url: contact.html#partner
    - listitem:
      - link "FAQs":
        - /url: how-it-works.html#faq
    - listitem:
      - link "Help Center":
        - /url: help-center.html
  - heading "Legal" [level=3]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: privacy.html
    - listitem:
      - link "Terms of Service":
        - /url: terms.html
    - listitem:
      - link "Cookie Policy":
        - /url: "#"
  - paragraph: © 2026 LayoverX. All rights reserved.
  - paragraph: Mumbai, India — Dedicated to transit travelers worldwide.
  - link "Privacy":
    - /url: privacy.html
  - link "Terms":
    - /url: terms.html
  - link "Cookies":
    - /url: "#"
```

# Test source

```ts
  19  |       if (msg.type() === 'error') {
  20  |         errors.push(msg.text());
  21  |       }
  22  |     });
  23  | 
  24  |     await page.goto('/');
  25  |     await page.waitForLoadState('networkidle');
  26  |     
  27  |     // Filter out known non-critical errors
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
> 119 |     await expect(page).toHaveURL(/payment-selection\.html/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  120 |   });
  121 | 
  122 |   test('CTA buttons use proper button class', async ({ page }) => {
  123 |     // Check checkout page CTA
  124 |     await page.goto('/checkout.html');
  125 |     await page.waitForLoadState('networkidle');
  126 |     
  127 |     const proceedBtn = page.locator('button[type="submit"]');
  128 |     await expect(proceedBtn).toHaveClass(/btn/);
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
```