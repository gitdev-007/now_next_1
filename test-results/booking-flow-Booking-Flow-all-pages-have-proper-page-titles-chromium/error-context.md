# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> all pages have proper page titles
- Location: tests\booking-flow.spec.js:181:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Confirmation"
Received string:    "Booking Confirmed | LayoverX Stopover Portal - LayoverX"
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
      - status [ref=e55]: 🎉
      - generic [ref=e56]:
        - text: Stopover Booked
        - heading "Itinerary Confirmed!" [level=1] [ref=e57]
        - paragraph [ref=e58]: Your transit experiences and airport cab transfers are secured. Chauffeur details and hotel slots are synchronized with flight schedules.
      - generic [ref=e59]:
        - generic [ref=e60]:
          - generic [ref=e61]:
            - generic [ref=e62]: Booking Code
            - strong [ref=e63]: LX-XXXXX-CSMIA
          - generic [ref=e64]:
            - generic [ref=e65]: Total Price Paid
            - strong [ref=e66]: ₹0
        - generic [ref=e67]:
          - generic [ref=e68]:
            - generic [ref=e69]: Lead Passenger
            - strong [ref=e70]: "--"
          - generic [ref=e71]:
            - generic [ref=e72]: Passport Number
            - strong [ref=e73]: "--"
          - generic [ref=e74]:
            - generic [ref=e75]: Incoming Flight
            - strong [ref=e76]: "--"
          - generic [ref=e77]:
            - generic [ref=e78]: Outgoing Flight
            - strong [ref=e79]: "--"
      - generic [ref=e80]:
        - generic [ref=e81]: 🚖
        - generic [ref=e82]:
          - heading "Airport Chauffeur Transfer Status" [level=3] [ref=e83]
          - paragraph [ref=e84]: Driver assignment will complete 2 hours before your flight landing. Vehicle model, license plate number, and driver contact number will be sent automatically via WhatsApp/SMS.
      - generic [ref=e85]:
        - button "🖨️ Print Receipt / PDF" [ref=e86] [cursor=pointer]
        - link "📅 View in My Trips" [ref=e87] [cursor=pointer]:
          - /url: my-trips.html
  - contentinfo "Site footer" [ref=e88]:
    - generic [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]:
          - link "LayoverX" [ref=e92] [cursor=pointer]:
            - /url: index.html
            - img [ref=e94]
            - generic [ref=e96]: LayoverX
          - paragraph [ref=e97]: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
          - generic [ref=e98]:
            - link "LayoverX on Facebook" [ref=e99] [cursor=pointer]:
              - /url: "#"
              - img [ref=e100]
            - link "LayoverX on Twitter" [ref=e102] [cursor=pointer]:
              - /url: "#"
              - img [ref=e103]
            - link "LayoverX on Instagram" [ref=e105] [cursor=pointer]:
              - /url: "#"
              - img [ref=e106]
          - list [ref=e108]:
            - listitem [ref=e109]:
              - img [ref=e110]
              - link "hello@layoverx.com" [ref=e112] [cursor=pointer]:
                - /url: mailto:hello@layoverx.com
            - listitem [ref=e113]:
              - img [ref=e114]
              - link "+91 22 1234 5678" [ref=e116] [cursor=pointer]:
                - /url: tel:+912212345678
            - listitem [ref=e117]:
              - img [ref=e118]
              - generic [ref=e121]:
                - text: Andheri East, Near CSMIA
                - text: Terminal 2, Mumbai 400099
        - generic [ref=e122]:
          - heading "Hotels" [level=3] [ref=e123]
          - list [ref=e124]:
            - listitem [ref=e125]:
              - link "Airport Hotels" [ref=e126] [cursor=pointer]:
                - /url: hotels.html
            - listitem [ref=e127]:
              - link "Day-Use Rooms" [ref=e128] [cursor=pointer]:
                - /url: hotels.html#day-use
            - listitem [ref=e129]:
              - link "Transit Hotels" [ref=e130] [cursor=pointer]:
                - /url: hotels.html#transit
            - listitem [ref=e131]:
              - link "Luxury Stays" [ref=e132] [cursor=pointer]:
                - /url: hotels.html#luxury
            - listitem [ref=e133]:
              - link "Budget Hotels" [ref=e134] [cursor=pointer]:
                - /url: hotels.html#budget
        - generic [ref=e135]:
          - heading "Restaurants" [level=3] [ref=e136]
          - list [ref=e137]:
            - listitem [ref=e138]:
              - link "Restaurants & Dining" [ref=e139] [cursor=pointer]:
                - /url: restaurants.html
            - listitem [ref=e140]:
              - link "Fine Dining" [ref=e141] [cursor=pointer]:
                - /url: restaurants.html#fine-dining
            - listitem [ref=e142]:
              - link "Local Cuisine" [ref=e143] [cursor=pointer]:
                - /url: restaurants.html#local
            - listitem [ref=e144]:
              - link "Quick Bites" [ref=e145] [cursor=pointer]:
                - /url: restaurants.html#quick
            - listitem [ref=e146]:
              - link "Airport Lounges" [ref=e147] [cursor=pointer]:
                - /url: restaurants.html#lounge
        - generic [ref=e148]:
          - heading "Experiences" [level=3] [ref=e149]
          - list [ref=e150]:
            - listitem [ref=e151]:
              - link "Tours & Experiences" [ref=e152] [cursor=pointer]:
                - /url: experiences.html
            - listitem [ref=e153]:
              - link "City Tours" [ref=e154] [cursor=pointer]:
                - /url: experiences.html#city-tours
            - listitem [ref=e155]:
              - link "Cultural Walks" [ref=e156] [cursor=pointer]:
                - /url: experiences.html#cultural
            - listitem [ref=e157]:
              - link "Airport Transfers" [ref=e158] [cursor=pointer]:
                - /url: airport-transfers.html
            - listitem [ref=e159]:
              - link "Private Cabs" [ref=e160] [cursor=pointer]:
                - /url: airport-transfers.html#private
        - generic [ref=e161]:
          - heading "Company" [level=3] [ref=e162]
          - list [ref=e163]:
            - listitem [ref=e164]:
              - link "How It Works" [ref=e165] [cursor=pointer]:
                - /url: how-it-works.html
            - listitem [ref=e166]:
              - link "Contact Us" [ref=e167] [cursor=pointer]:
                - /url: contact.html
            - listitem [ref=e168]:
              - link "Partner With Us" [ref=e169] [cursor=pointer]:
                - /url: contact.html#partner
            - listitem [ref=e170]:
              - link "FAQs" [ref=e171] [cursor=pointer]:
                - /url: how-it-works.html#faq
            - listitem [ref=e172]:
              - link "Help Center" [ref=e173] [cursor=pointer]:
                - /url: help-center.html
        - generic [ref=e174]:
          - heading "Legal" [level=3] [ref=e175]
          - list [ref=e176]:
            - listitem [ref=e177]:
              - link "Privacy Policy" [ref=e178] [cursor=pointer]:
                - /url: privacy.html
            - listitem [ref=e179]:
              - link "Terms of Service" [ref=e180] [cursor=pointer]:
                - /url: terms.html
            - listitem [ref=e181]:
              - link "Cookie Policy" [ref=e182] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e184]:
        - paragraph [ref=e185]: © 2026 LayoverX. All rights reserved.
        - paragraph [ref=e186]: Mumbai, India — Dedicated to transit travelers worldwide.
        - generic [ref=e187]:
          - link "Privacy" [ref=e188] [cursor=pointer]:
            - /url: privacy.html
          - link "Terms" [ref=e189] [cursor=pointer]:
            - /url: terms.html
          - link "Cookies" [ref=e190] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
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
> 193 |       expect(title).toContain(p.title);
      |                     ^ Error: expect(received).toContain(expected) // indexOf
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
```