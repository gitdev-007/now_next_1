# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> restaurants page loads correctly
- Location: tests\booking-flow.spec.js:371:3

# Error details

```
Error: locator.count: Unexpected token " " while parsing css selector ".restaurant-card, . dining-card, [class*="restaurant"]". Did you mean to CSS.escape it?
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
    - generic [ref=e57]:
      - generic [ref=e58]:
        - navigation "Breadcrumb" [ref=e59]:
          - link "Home" [ref=e60] [cursor=pointer]:
            - /url: index.html
          - img [ref=e61]
          - generic [ref=e63]: Restaurants
        - generic [ref=e64]: 🍽️ EXQUISITE TRANSIT DINING
        - heading "Premium Dining & Local Food Experiences" [level=1] [ref=e65]:
          - text: Premium Dining & Local
          - text: Food Experiences
        - paragraph [ref=e66]: Indulge in Mumbai's legendary culinary landscape without missing your flight. Escape the terminal gates to relish fresh coastal seafood, authentic Maharashtra thalis, and luxury fine dining.
        - generic [ref=e67]:
          - generic [ref=e70]: Airport Proximity (under 15 mins)
          - generic [ref=e73]: Verified High-Hygiene Standards
          - generic [ref=e76]: Fixed-Time Dining Guarantees
          - generic [ref=e79]: Chauffeur Wait-and-Return
      - generic [ref=e81]:
        - img "Premium dining table near Mumbai Airport" [ref=e82]
        - generic [ref=e85]: 📍 Mumbai CSMIA Airport District
    - generic [ref=e88]:
      - button "All Cuisines" [ref=e89] [cursor=pointer]
      - button "🦀 Coastal Seafood" [ref=e90] [cursor=pointer]
      - button "🥘 Local Maharashtrian" [ref=e91] [cursor=pointer]
      - button "🍢 North Indian" [ref=e92] [cursor=pointer]
      - button "🌶️ Mumbai Street Food" [ref=e93] [cursor=pointer]
      - button "✨ Fine Dining" [ref=e94] [cursor=pointer]
    - generic [ref=e97]:
      - complementary "Restaurant Filters" [ref=e98]:
        - generic [ref=e99]:
          - generic [ref=e100]:
            - heading "Filters" [level=2] [ref=e101]
            - button "Clear All" [ref=e102] [cursor=pointer]
          - generic [ref=e103]:
            - heading "Cost For Two" [level=3] [ref=e104]
            - generic [ref=e105]:
              - generic [ref=e106] [cursor=pointer]:
                - checkbox "Under ₹1,000" [ref=e107]
                - text: Under ₹1,000
              - generic [ref=e108] [cursor=pointer]:
                - checkbox "₹1,000 - ₹2,500" [ref=e109]
                - text: ₹1,000 - ₹2,500
              - generic [ref=e110] [cursor=pointer]:
                - checkbox "Above ₹2,500" [ref=e111]
                - text: Above ₹2,500
          - generic [ref=e112]:
            - heading "Distance From CSMIA" [level=3] [ref=e113]
            - generic [ref=e114]:
              - generic [ref=e115] [cursor=pointer]:
                - checkbox "Under 2 km" [ref=e116]
                - text: Under 2 km
              - generic [ref=e117] [cursor=pointer]:
                - checkbox "2 km to 6 km" [ref=e118]
                - text: 2 km to 6 km
              - generic [ref=e119] [cursor=pointer]:
                - checkbox "Above 6 km" [ref=e120]
                - text: Above 6 km
          - generic [ref=e121]:
            - heading "Guest Review Rating" [level=3] [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124] [cursor=pointer]:
                - 'radio "Excellent: 4.5+ ★" [ref=e125]'
                - text: "Excellent: 4.5+ ★"
              - generic [ref=e126] [cursor=pointer]:
                - 'radio "Very Good: 4.0+ ★" [ref=e127]'
                - text: "Very Good: 4.0+ ★"
              - generic [ref=e128] [cursor=pointer]:
                - radio "Show All Ratings" [checked] [ref=e129]
                - text: Show All Ratings
      - generic [ref=e131]:
        - article [ref=e132]:
          - generic [ref=e133]:
            - img "Gajalee Seafood" [ref=e134]
            - generic [ref=e135]: 🦀 Seafood
          - generic [ref=e136]:
            - generic [ref=e137]:
              - generic [ref=e138]:
                - heading "Gajalee Coastal Seafood Restaurant" [level=3] [ref=e139]:
                  - link "Gajalee Coastal Seafood Restaurant" [ref=e140] [cursor=pointer]:
                    - /url: "#"
                - generic [ref=e141]:
                  - text: ⭐ 4.8
                  - generic [ref=e142]: (940 reviews)
              - generic [ref=e143]:
                - img [ref=e144]
                - generic [ref=e147]: Vile Parle East, Mumbai • 3.5 km from CSMIA
              - paragraph [ref=e148]: World-famous coastal dining near airport. Indulge in authentic Butter Garlic Pepper Crab, Tandoori Pomfret, and Sol Kadhi.
              - generic [ref=e149]:
                - generic [ref=e150]: 🦀 Fresh Coastal
                - generic [ref=e151]: 🍷 Premium Lounge
                - generic [ref=e152]: ⚡ High Hygiene
            - generic [ref=e153]:
              - generic [ref=e154]:
                - generic [ref=e155]:
                  - text: Cost for Two
                  - text: ₹1,800
                - generic [ref=e156]:
                  - text: Est. Transit Time
                  - text: 15 mins taxi
              - generic [ref=e157]:
                - link "View Details" [ref=e158] [cursor=pointer]:
                  - /url: service-details.html?type=dining&id=1
                - button "Add to Itinerary" [ref=e159] [cursor=pointer]
        - article [ref=e160]:
          - generic [ref=e161]:
            - img "Peshawri" [ref=e162]
            - generic [ref=e163]: ✨ Luxury
          - generic [ref=e164]:
            - generic [ref=e165]:
              - generic [ref=e166]:
                - heading "Peshawri - ITC Maratha" [level=3] [ref=e167]:
                  - link "Peshawri - ITC Maratha" [ref=e168] [cursor=pointer]:
                    - /url: "#"
                - generic [ref=e169]:
                  - text: ⭐ 4.9
                  - generic [ref=e170]: (1.2k reviews)
              - generic [ref=e171]:
                - img [ref=e172]
                - generic [ref=e175]: Sahar Road, Andheri East • 1.1 km from T2
              - paragraph [ref=e176]: Five-star Northwest Frontier luxury dining. Famous for Dal Bukhara (simmered for 18 hours), paneer tikka, and slow cooked lamb.
              - generic [ref=e177]:
                - generic [ref=e178]: 🍲 Traditional Clay Oven
                - generic [ref=e179]: ✨ Luxury Ambience
                - generic [ref=e180]: 🥩 Sikandari Raan
            - generic [ref=e181]:
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - text: Cost for Two
                  - text: ₹4,500
                - generic [ref=e184]:
                  - text: Est. Transit Time
                  - text: 5 mins taxi
              - generic [ref=e185]:
                - link "View Details" [ref=e186] [cursor=pointer]:
                  - /url: service-details.html?type=dining&id=2
                - button "Add to Itinerary" [ref=e187] [cursor=pointer]
        - article [ref=e188]:
          - generic [ref=e189]:
            - img "Highway Gomantak" [ref=e190]
            - generic [ref=e191]: 🥘 Local food
          - generic [ref=e192]:
            - generic [ref=e193]:
              - generic [ref=e194]:
                - heading "Highway Gomantak" [level=3] [ref=e195]:
                  - link "Highway Gomantak" [ref=e196] [cursor=pointer]:
                    - /url: "#"
                - generic [ref=e197]:
                  - text: ⭐ 4.5
                  - generic [ref=e198]: (560 reviews)
              - generic [ref=e199]:
                - img [ref=e200]
                - generic [ref=e203]: Bandra East, Mumbai • 2.2 km from domestic T1
              - paragraph [ref=e204]: Legendary 30-year-old local Maharashtrian diner. Famous for crispy Bombil fry, Surmai fish thali, and special sol kadhi.
              - generic [ref=e205]:
                - generic [ref=e206]: 🥘 Konkani Thalis
                - generic [ref=e207]: 🐟 Bombay Duck Fry
                - generic [ref=e208]: 🍛 Spicy Mutton Sukka
            - generic [ref=e209]:
              - generic [ref=e210]:
                - generic [ref=e211]:
                  - text: Cost for Two
                  - text: ₹800
                - generic [ref=e212]:
                  - text: Est. Transit Time
                  - text: 10 mins taxi
              - generic [ref=e213]:
                - link "View Details" [ref=e214] [cursor=pointer]:
                  - /url: service-details.html?type=dining&id=3
                - button "Add to Itinerary" [ref=e215] [cursor=pointer]
        - article [ref=e216]:
          - generic [ref=e217]:
            - img "Elco Pani Puri" [ref=e218]
            - generic [ref=e219]: 🌶️ Street Food
          - generic [ref=e220]:
            - generic [ref=e221]:
              - generic [ref=e222]:
                - heading "Elco Pani Puri Center" [level=3] [ref=e223]:
                  - link "Elco Pani Puri Center" [ref=e224] [cursor=pointer]:
                    - /url: "#"
                - generic [ref=e225]:
                  - text: ⭐ 4.4
                  - generic [ref=e226]: (1.8k reviews)
              - generic [ref=e227]:
                - img [ref=e228]
                - generic [ref=e231]: Hill Road, Bandra West • 4.2 km from CSMIA
              - paragraph [ref=e232]: High-hygiene local street food experience. Famous for ice-cold purified mineral water Pani Puri, Dahi Puri, Pav Bhaji, and ragda pattice.
              - generic [ref=e233]:
                - generic [ref=e234]: 🌶️ Mineral Water Chaat
                - generic [ref=e235]: 🧈 Butter Pav Bhaji
                - generic [ref=e236]: 🥛 Fresh Lassi & Juices
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]:
                  - text: Cost for Two
                  - text: ₹400
                - generic [ref=e240]:
                  - text: Est. Transit Time
                  - text: 18 mins taxi
              - generic [ref=e241]:
                - link "View Details" [ref=e242] [cursor=pointer]:
                  - /url: service-details.html?type=dining&id=4
                - button "Add to Itinerary" [ref=e243] [cursor=pointer]
  - generic [ref=e245]:
    - generic [ref=e246]:
      - generic [ref=e247]: Foodie feedback
      - heading "Loved by Global Travelers" [level=2] [ref=e248]
    - generic [ref=e249]:
      - generic [ref=e250]:
        - generic [ref=e251]: ★★★★★
        - paragraph [ref=e252]: "\"The Butter Garlic Crabs at Gajalee were incredible! We had a 6 hour transit, the driver took us there and back in less than 2 hours. Best layover meal ever.\""
        - generic [ref=e253]: Samantha T., London transit
      - generic [ref=e254]:
        - generic [ref=e255]: ★★★★★
        - paragraph [ref=e256]: "\"Dal Bukhara at Peshawri is worth leaving the airport alone. LayoverX table reservation was instant and worked flawlessly. Driver waited for us outside.\""
        - generic [ref=e257]: Akash M., Singapore Transit
      - generic [ref=e258]:
        - generic [ref=e259]: ★★★★★
        - paragraph [ref=e260]: "\"Super safe and hygienic street food. Tried Pani Puri and Pav Bhaji at Elco. Tasted amazing and no stomach issues at all. A must-do transit stop.\""
        - generic [ref=e261]: Chloe L., France transit
  - generic [ref=e263]:
    - generic [ref=e264]:
      - generic [ref=e265]: Transit Dining Info
      - heading "Dining FAQ" [level=2] [ref=e266]
    - generic [ref=e267]:
      - group [ref=e268] [cursor=pointer]:
        - generic "How much time do I need for a dining transit? ▼" [ref=e269]:
          - text: How much time do I need for a dining transit?
          - generic [ref=e270]: ▼
      - group [ref=e271] [cursor=pointer]:
        - generic "Is the street food safe for international transit flyers? ▼" [ref=e272]:
          - text: Is the street food safe for international transit flyers?
          - generic [ref=e273]: ▼
  - contentinfo "Site footer" [ref=e274]:
    - generic [ref=e275]:
      - generic [ref=e276]:
        - generic [ref=e277]:
          - link "LayoverX" [ref=e278] [cursor=pointer]:
            - /url: index.html
            - img [ref=e280]
            - generic [ref=e282]: LayoverX
          - paragraph [ref=e283]: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
          - generic [ref=e284]:
            - link "LayoverX on Facebook" [ref=e285] [cursor=pointer]:
              - /url: "#"
              - img [ref=e286]
            - link "LayoverX on Twitter" [ref=e288] [cursor=pointer]:
              - /url: "#"
              - img [ref=e289]
            - link "LayoverX on Instagram" [ref=e291] [cursor=pointer]:
              - /url: "#"
              - img [ref=e292]
          - list [ref=e294]:
            - listitem [ref=e295]:
              - img [ref=e296]
              - link "hello@layoverx.com" [ref=e298] [cursor=pointer]:
                - /url: mailto:hello@layoverx.com
            - listitem [ref=e299]:
              - img [ref=e300]
              - link "+91 22 1234 5678" [ref=e302] [cursor=pointer]:
                - /url: tel:+912212345678
            - listitem [ref=e303]:
              - img [ref=e304]
              - generic [ref=e307]:
                - text: Andheri East, Near CSMIA
                - text: Terminal 2, Mumbai 400099
        - generic [ref=e308]:
          - heading "Hotels" [level=3] [ref=e309]
          - list [ref=e310]:
            - listitem [ref=e311]:
              - link "Airport Hotels" [ref=e312] [cursor=pointer]:
                - /url: hotels.html
            - listitem [ref=e313]:
              - link "Day-Use Rooms" [ref=e314] [cursor=pointer]:
                - /url: hotels.html#day-use
            - listitem [ref=e315]:
              - link "Transit Hotels" [ref=e316] [cursor=pointer]:
                - /url: hotels.html#transit
            - listitem [ref=e317]:
              - link "Luxury Stays" [ref=e318] [cursor=pointer]:
                - /url: hotels.html#luxury
            - listitem [ref=e319]:
              - link "Budget Hotels" [ref=e320] [cursor=pointer]:
                - /url: hotels.html#budget
        - generic [ref=e321]:
          - heading "Restaurants" [level=3] [ref=e322]
          - list [ref=e323]:
            - listitem [ref=e324]:
              - link "Restaurants & Dining" [ref=e325] [cursor=pointer]:
                - /url: restaurants.html
            - listitem [ref=e326]:
              - link "Fine Dining" [ref=e327] [cursor=pointer]:
                - /url: restaurants.html#fine-dining
            - listitem [ref=e328]:
              - link "Local Cuisine" [ref=e329] [cursor=pointer]:
                - /url: restaurants.html#local
            - listitem [ref=e330]:
              - link "Quick Bites" [ref=e331] [cursor=pointer]:
                - /url: restaurants.html#quick
            - listitem [ref=e332]:
              - link "Airport Lounges" [ref=e333] [cursor=pointer]:
                - /url: restaurants.html#lounge
        - generic [ref=e334]:
          - heading "Experiences" [level=3] [ref=e335]
          - list [ref=e336]:
            - listitem [ref=e337]:
              - link "Tours & Experiences" [ref=e338] [cursor=pointer]:
                - /url: experiences.html
            - listitem [ref=e339]:
              - link "City Tours" [ref=e340] [cursor=pointer]:
                - /url: experiences.html#city-tours
            - listitem [ref=e341]:
              - link "Cultural Walks" [ref=e342] [cursor=pointer]:
                - /url: experiences.html#cultural
            - listitem [ref=e343]:
              - link "Airport Transfers" [ref=e344] [cursor=pointer]:
                - /url: airport-transfers.html
            - listitem [ref=e345]:
              - link "Private Cabs" [ref=e346] [cursor=pointer]:
                - /url: airport-transfers.html#private
        - generic [ref=e347]:
          - heading "Company" [level=3] [ref=e348]
          - list [ref=e349]:
            - listitem [ref=e350]:
              - link "How It Works" [ref=e351] [cursor=pointer]:
                - /url: how-it-works.html
            - listitem [ref=e352]:
              - link "Contact Us" [ref=e353] [cursor=pointer]:
                - /url: contact.html
            - listitem [ref=e354]:
              - link "Partner With Us" [ref=e355] [cursor=pointer]:
                - /url: contact.html#partner
            - listitem [ref=e356]:
              - link "FAQs" [ref=e357] [cursor=pointer]:
                - /url: how-it-works.html#faq
            - listitem [ref=e358]:
              - link "Help Center" [ref=e359] [cursor=pointer]:
                - /url: help-center.html
        - generic [ref=e360]:
          - heading "Legal" [level=3] [ref=e361]
          - list [ref=e362]:
            - listitem [ref=e363]:
              - link "Privacy Policy" [ref=e364] [cursor=pointer]:
                - /url: privacy.html
            - listitem [ref=e365]:
              - link "Terms of Service" [ref=e366] [cursor=pointer]:
                - /url: terms.html
            - listitem [ref=e367]:
              - link "Cookie Policy" [ref=e368] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e370]:
        - paragraph [ref=e371]: © 2026 LayoverX. All rights reserved.
        - paragraph [ref=e372]: Mumbai, India — Dedicated to transit travelers worldwide.
        - generic [ref=e373]:
          - link "Privacy" [ref=e374] [cursor=pointer]:
            - /url: privacy.html
          - link "Terms" [ref=e375] [cursor=pointer]:
            - /url: terms.html
          - link "Cookies" [ref=e376] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
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
  329 |     await expect(hotelsLink).toBeVisible();
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
> 378 |     const count = await restaurantCards.count();
      |                                         ^ Error: locator.count: Unexpected token " " while parsing css selector ".restaurant-card, . dining-card, [class*="restaurant"]". Did you mean to CSS.escape it?
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
  430 |     { url: '/my-trips.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'My Trips' },
  431 |     { url: '/saved-itineraries.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Saved Itineraries' },
  432 |     { url: '/notifications.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Notifications' },
  433 |     { url: '/account-settings.html', hero: 'account-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Account Settings' },
  434 |   ];
  435 | 
  436 |   const supplierPages = [
  437 |     { url: '/supplier-dashboard.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Supplier Dashboard' },
  438 |     { url: '/supplier-status.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Supplier Status' },
  439 |     { url: '/revenue-admin.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Revenue Admin' },
  440 |     { url: '/partner-registration.html', hero: 'supplier-hero', layout: 'account-layout', sidebar: 'account-sidebar', name: 'Partner Registration' },
  441 |   ];
  442 | 
  443 |   for (const pg of accountPages) {
  444 |     test(`${pg.name} uses standardized account-layout pattern`, async ({ page }) => {
  445 |       const errors = [];
  446 |       page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  447 | 
  448 |       await page.goto(pg.url);
  449 |       await page.waitForLoadState('networkidle');
  450 | 
  451 |       // Check hero section
  452 |       const hero = page.locator(`.${pg.hero}`).first();
  453 |       await expect(hero).toBeVisible();
  454 | 
  455 |       // Check account-layout grid
  456 |       const layout = page.locator(`.${pg.layout}`).first();
  457 |       await expect(layout).toBeVisible();
  458 | 
  459 |       // Check sidebar navigation
  460 |       const sidebar = page.locator(`.${pg.sidebar}`).first();
  461 |       await expect(sidebar).toBeVisible();
  462 | 
  463 |       // Check account nav links in sidebar
  464 |       const navLinks = page.locator('.account-nav-link');
  465 |       const count = await navLinks.count();
  466 |       expect(count).toBeGreaterThanOrEqual(4); // At least 4 nav items
  467 | 
  468 |       // Check account-content area
  469 |       const content = page.locator('.account-content').first();
  470 |       await expect(content).toBeVisible();
  471 | 
  472 |       // No critical console errors
  473 |       const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('404'));
  474 |       expect(criticalErrors.length).toBe(0);
  475 |     });
  476 |   }
  477 | 
  478 |   for (const pg of supplierPages) {
```