# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-flow.spec.js >> Booking Flow >> hotels page has proper listing structure
- Location: tests\booking-flow.spec.js:358:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
          - generic [ref=e63]: Hotels
        - generic [ref=e64]: 🏨 PREMIER TRANSIT ACCOMMODATION
        - heading "Luxury Transit Hotels Minutes from CSMIA" [level=1] [ref=e65]:
          - text: Luxury Transit Hotels
          - generic [ref=e66]: Minutes from CSMIA
        - paragraph [ref=e67]: Sleep, refresh, and recharge during your Mumbai stopover. Book premium day-rooms, airport transit hotels, and pods by the hour with flexible 24/7 check-in and complimentary terminal shuttle service.
        - generic [ref=e68]:
          - generic [ref=e71]: 24/7 Flexible Check-in
          - generic [ref=e74]: Free Terminal Shuttles
          - generic [ref=e77]: Hourly Packages (3h/6h/12h)
          - generic [ref=e80]: Inside T2 Transit Pods
      - generic [ref=e82]:
        - img "Premium transit hotel room near Mumbai Airport" [ref=e83]
        - generic [ref=e86]: 📍 Mumbai CSMIA Airport District
    - generic [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]: Terminal/Area
        - combobox "Terminal/Area" [ref=e92]:
          - option "All Airport Areas" [selected]
          - option "Near T2 (International)"
          - option "Near T1 (Domestic)"
          - option "Inside Terminal 2 (Transit)"
      - generic [ref=e93]:
        - generic [ref=e94]: Check-in Date & Time
        - textbox "Check-in Date & Time" [ref=e95]: 2026-06-29T22:34
      - generic [ref=e96]:
        - generic [ref=e97]: Stay Duration
        - combobox "Stay Duration" [ref=e98]:
          - option "3 Hours (Day-Use)"
          - option "6 Hours (Day-Use)" [selected]
          - option "12 Hours (Day-Use)"
          - option "Overnight / Full Day"
      - button "Search Hotels" [ref=e99] [cursor=pointer]:
        - img [ref=e100]
        - text: Search Hotels
    - generic [ref=e104]:
      - complementary "Filters Panel" [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - heading "Filters" [level=2] [ref=e108]
            - button "Clear All" [ref=e109] [cursor=pointer]
          - generic [ref=e110]:
            - heading "Price Range (INR)" [level=3] [ref=e111]
            - generic [ref=e112]:
              - generic [ref=e113] [cursor=pointer]:
                - checkbox "Under ₹2,500" [ref=e114]
                - text: Under ₹2,500
              - generic [ref=e115] [cursor=pointer]:
                - checkbox "₹2,500 - ₹5,000" [ref=e116]
                - text: ₹2,500 - ₹5,000
              - generic [ref=e117] [cursor=pointer]:
                - checkbox "₹5,000 - ₹7,500" [ref=e118]
                - text: ₹5,000 - ₹7,500
              - generic [ref=e119] [cursor=pointer]:
                - checkbox "Above ₹7,500" [ref=e120]
                - text: Above ₹7,500
          - generic [ref=e121]:
            - heading "Distance From Terminal" [level=3] [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124] [cursor=pointer]:
                - checkbox "Inside Terminal (0 km)" [ref=e125]
                - text: Inside Terminal (0 km)
              - generic [ref=e126] [cursor=pointer]:
                - checkbox "Under 2 km" [ref=e127]
                - text: Under 2 km
              - generic [ref=e128] [cursor=pointer]:
                - checkbox "2 km to 5 km" [ref=e129]
                - text: 2 km to 5 km
          - generic [ref=e130]:
            - heading "Star Rating" [level=3] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e133] [cursor=pointer]:
                - checkbox "⭐⭐⭐⭐⭐ 5 Star Luxury" [ref=e134]
                - text: ⭐⭐⭐⭐⭐ 5 Star Luxury
              - generic [ref=e135] [cursor=pointer]:
                - checkbox "⭐⭐⭐⭐ 4 Star Premium" [ref=e136]
                - text: ⭐⭐⭐⭐ 4 Star Premium
              - generic [ref=e137] [cursor=pointer]:
                - checkbox "⭐⭐⭐ 3 Star Standard" [ref=e138]
                - text: ⭐⭐⭐ 3 Star Standard
          - generic [ref=e139]:
            - heading "Transit Amenities" [level=3] [ref=e140]
            - generic [ref=e141]:
              - generic [ref=e142] [cursor=pointer]:
                - checkbox "Free Airport Shuttle" [ref=e143]
                - text: Free Airport Shuttle
              - generic [ref=e144] [cursor=pointer]:
                - checkbox "24/7 Check-in" [ref=e145]
                - text: 24/7 Check-in
              - generic [ref=e146] [cursor=pointer]:
                - checkbox "Spa & Massage" [ref=e147]
                - text: Spa & Massage
              - generic [ref=e148] [cursor=pointer]:
                - checkbox "Swimming Pool" [ref=e149]
                - text: Swimming Pool
      - generic [ref=e150]:
        - generic [ref=e151]:
          - generic [ref=e152]:
            - text: Showing
            - strong [ref=e153]: "4"
            - text: verified transit hotels near Mumbai Airport
          - generic [ref=e154]:
            - generic [ref=e155]: "Sort By:"
            - combobox "Sort By:" [ref=e156] [cursor=pointer]:
              - option "Popularity" [selected]
              - 'option "Price: Low to High"'
              - 'option "Price: High to Low"'
              - option "Guest Rating"
              - option "Distance to Airport"
        - generic [ref=e157]:
          - article [ref=e158]:
            - generic [ref=e159]:
              - img "Niranta Airport Transit Hotel" [ref=e160]
              - generic [ref=e161]: Inside T2
            - generic [ref=e162]:
              - generic [ref=e163]:
                - generic [ref=e164]:
                  - heading "Niranta Airport Transit Hotel & Lounge" [level=3] [ref=e165]:
                    - link "Niranta Airport Transit Hotel & Lounge" [ref=e166] [cursor=pointer]:
                      - /url: "#"
                  - generic [ref=e167]:
                    - text: ⭐ 4.8
                    - generic [ref=e168]: (2.4k reviews)
                - generic [ref=e169]:
                  - img [ref=e170]
                  - generic [ref=e173]: International Terminal 2 (Arrivals Lounge), CSMIA
                  - generic [ref=e174]: • 0 km from T2 Gates
                - paragraph [ref=e175]: Ideal for quick transits. No visa check needed if remaining in international area. Features express spa sessions, dining counters, and luxury beds.
                - generic [ref=e176]:
                  - generic [ref=e177]: 🚿 Shower Facility
                  - generic [ref=e178]: ⚡ Fast WiFi
                  - generic [ref=e179]: 🛌 24/7 Check-in
                  - generic [ref=e180]: 💆 Massage Spa
              - generic [ref=e181]:
                - generic [ref=e182]:
                  - generic [ref=e183]:
                    - text: Day-Use (6h slot)
                    - text: ₹3,499
                  - generic [ref=e184]:
                    - text: Full Night Room
                    - text: ₹6,900
                - generic [ref=e185]:
                  - link "View Details" [ref=e186] [cursor=pointer]:
                    - /url: service-details.html?type=hotel&id=1
                  - button "Add to Itinerary" [ref=e187] [cursor=pointer]
          - article [ref=e188]:
            - generic [ref=e189]:
              - img "JW Marriott Mumbai Sahar" [ref=e190]
              - generic [ref=e191]: 5-Star Luxury
            - generic [ref=e192]:
              - generic [ref=e193]:
                - generic [ref=e194]:
                  - heading "JW Marriott Mumbai Sahar" [level=3] [ref=e195]:
                    - link "JW Marriott Mumbai Sahar" [ref=e196] [cursor=pointer]:
                      - /url: "#"
                  - generic [ref=e197]:
                    - text: ⭐ 4.7
                    - generic [ref=e198]: (1.8k reviews)
                - generic [ref=e199]:
                  - img [ref=e200]
                  - generic [ref=e203]: Sahar Road, Andheri East, Mumbai
                  - generic [ref=e204]: • 1.2 km from Terminal 2
                - paragraph [ref=e205]: Ultra-luxury stays with high-speed lounge setups, award-winning spa, resort pool, and 24/7 airport pick and drop shuttles included.
                - generic [ref=e206]:
                  - generic [ref=e207]: 🚍 Free Airport Shuttle
                  - generic [ref=e208]: 🏊 Pool Access
                  - generic [ref=e209]: 🛌 24/7 Check-in
                  - generic [ref=e210]: 🍽️ fine Dining
              - generic [ref=e211]:
                - generic [ref=e212]:
                  - generic [ref=e213]:
                    - text: Day-Use (6h slot)
                    - text: ₹5,499
                  - generic [ref=e214]:
                    - text: Full Night Room
                    - text: ₹12,000
                - generic [ref=e215]:
                  - link "View Details" [ref=e216] [cursor=pointer]:
                    - /url: service-details.html?type=hotel&id=2
                  - button "Add to Itinerary" [ref=e217] [cursor=pointer]
          - article [ref=e218]:
            - generic [ref=e219]:
              - img "Ibis Mumbai Airport" [ref=e220]
              - generic [ref=e221]: Budget friendly
            - generic [ref=e222]:
              - generic [ref=e223]:
                - generic [ref=e224]:
                  - heading "Ibis Mumbai Airport" [level=3] [ref=e225]:
                    - link "Ibis Mumbai Airport" [ref=e226] [cursor=pointer]:
                      - /url: "#"
                  - generic [ref=e227]:
                    - text: ⭐ 4.2
                    - generic [ref=e228]: (1.1k reviews)
                - generic [ref=e229]:
                  - img [ref=e230]
                  - generic [ref=e233]: Western Express Highway, Vile Parle East, Mumbai
                  - generic [ref=e234]: • 0.8 km from Domestic T1
                - paragraph [ref=e235]: Cozy, ergonomic rooms designed for short-stay transits. Excellent continental breakfast, business desk, and hourly check-in.
                - generic [ref=e236]:
                  - generic [ref=e237]: 🚍 Airport Shuttle (paid)
                  - generic [ref=e238]: ☕ Breakfast Buffet
                  - generic [ref=e239]: 🛌 24/7 Check-in
              - generic [ref=e240]:
                - generic [ref=e241]:
                  - generic [ref=e242]:
                    - text: Day-Use (6h slot)
                    - text: ₹2,200
                  - generic [ref=e243]:
                    - text: Full Night Room
                    - text: ₹4,200
                - generic [ref=e244]:
                  - link "View Details" [ref=e245] [cursor=pointer]:
                    - /url: service-details.html?type=hotel&id=3
                  - button "Add to Itinerary" [ref=e246] [cursor=pointer]
          - article [ref=e247]:
            - generic [ref=e248]:
              - img "The Orchid Hotel" [ref=e249]
              - generic [ref=e250]: Eco friendly
            - generic [ref=e251]:
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - heading "The Orchid Hotel Mumbai Vile Parle" [level=3] [ref=e254]:
                    - link "The Orchid Hotel Mumbai Vile Parle" [ref=e255] [cursor=pointer]:
                      - /url: "#"
                  - generic [ref=e256]:
                    - text: ⭐ 4.6
                    - generic [ref=e257]: (1.5k reviews)
                - generic [ref=e258]:
                  - img [ref=e259]
                  - generic [ref=e262]: Nehru Road, Vile Parle East, Mumbai
                  - generic [ref=e263]: • 2.1 km from Terminal 2
                - paragraph [ref=e264]: Asia's first certified 5-star ecofriendly hotel. Features a rooftop swimming pool with runway view, airport lounge, and spa treatments.
                - generic [ref=e265]:
                  - generic [ref=e266]: 🚍 Free Airport Shuttle
                  - generic [ref=e267]: 🏊 Rooftop Pool
                  - generic [ref=e268]: 🌿 Green Certified
              - generic [ref=e269]:
                - generic [ref=e270]:
                  - generic [ref=e271]:
                    - text: Day-Use (6h slot)
                    - text: ₹4,500
                  - generic [ref=e272]:
                    - text: Full Night Room
                    - text: ₹8,500
                - generic [ref=e273]:
                  - link "View Details" [ref=e274] [cursor=pointer]:
                    - /url: service-details.html?type=hotel&id=4
                  - button "Add to Itinerary" [ref=e275] [cursor=pointer]
  - generic [ref=e278]:
    - generic [ref=e279]:
      - generic [ref=e280]: Exclusive Partner
      - heading "Premium In-Terminal Transit" [level=2] [ref=e281]
      - paragraph [ref=e282]: Have a layover under 5 hours? Avoid clearing immigration altogether. Niranta Transit Hotel is located directly inside Terminal 2 Arrivals, offering luxury sleep pods, hot showers, and high-speed working desks. Book by the hour with zero boarding anxiety.
      - generic [ref=e283]:
        - generic [ref=e284]:
          - generic [ref=e285]: 0 min
          - generic [ref=e286]: Immigration Wait
        - generic [ref=e287]:
          - generic [ref=e288]: 24/7
          - generic [ref=e289]: Check-in Availability
        - generic [ref=e290]:
          - generic [ref=e291]: 4.8★
          - generic [ref=e292]: Guest Rating
    - img "Transit hotel lounge room" [ref=e294]
  - generic [ref=e296]:
    - generic [ref=e297]:
      - generic [ref=e298]: Guest Feedback
      - heading "What Transit Guests Say" [level=2] [ref=e299]
    - generic [ref=e300]:
      - generic [ref=e301]:
        - generic [ref=e302]: ★★★★★
        - paragraph [ref=e303]: "\"Niranta was perfect. My flight landed at 3 AM and I had a connecting flight at 9 AM. I slept for 4 solid hours, took a hot shower, and went straight to my next gate. Absolute lifesaver.\""
        - generic [ref=e304]: Elena R., Transit to Sydney
      - generic [ref=e305]:
        - generic [ref=e306]: ★★★★★
        - paragraph [ref=e307]: "\"Booked JW Marriott Sahar day slot for a 12-hour layover. The free shuttle took 10 minutes. Spent the day working by the pool and enjoying the spa. Highly recommend!\""
        - generic [ref=e308]: Devansh J., Delhi Business Transit
      - generic [ref=e309]:
        - generic [ref=e310]: ★★★★☆
        - paragraph [ref=e311]: "\"Super convenient pricing. Ibis airport was clean, modern, and reasonably priced for a 6-hour stay. Free high speed internet allowed me to complete all my meetings.\""
        - generic [ref=e312]: Hiroshi T., Tokyo Transit
  - generic [ref=e314]:
    - generic [ref=e315]:
      - generic [ref=e316]: Got Questions?
      - heading "Airport Hotels FAQ" [level=2] [ref=e317]
    - generic [ref=e318]:
      - group [ref=e319] [cursor=pointer]:
        - generic "Do I need an Indian Visa to stay at these hotels? ▼" [ref=e320]:
          - text: Do I need an Indian Visa to stay at these hotels?
          - generic [ref=e321]: ▼
      - group [ref=e322] [cursor=pointer]:
        - generic "How do hourly transit check-ins work? ▼" [ref=e323]:
          - text: How do hourly transit check-ins work?
          - generic [ref=e324]: ▼
      - group [ref=e325] [cursor=pointer]:
        - generic "Are airport shuttles free? ▼" [ref=e326]:
          - text: Are airport shuttles free?
          - generic [ref=e327]: ▼
  - generic [ref=e330]:
    - heading "Maximize Your Flight Layover" [level=2] [ref=e331]
    - paragraph [ref=e332]: Build an entire layover plan by connecting a transit hotel with city tours and airport transfers.
    - link "Plan My Entire Layover" [ref=e333] [cursor=pointer]:
      - /url: plan-my-layover.html
  - complementary "Hotel Details"
  - contentinfo "Site footer" [ref=e334]:
    - generic [ref=e335]:
      - generic [ref=e336]:
        - generic [ref=e337]:
          - link "LayoverX" [ref=e338] [cursor=pointer]:
            - /url: index.html
            - img [ref=e340]
            - generic [ref=e342]: LayoverX
          - paragraph [ref=e343]: Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
          - generic [ref=e344]:
            - link "LayoverX on Facebook" [ref=e345] [cursor=pointer]:
              - /url: "#"
              - img [ref=e346]
            - link "LayoverX on Twitter" [ref=e348] [cursor=pointer]:
              - /url: "#"
              - img [ref=e349]
            - link "LayoverX on Instagram" [ref=e351] [cursor=pointer]:
              - /url: "#"
              - img [ref=e352]
          - list [ref=e354]:
            - listitem [ref=e355]:
              - img [ref=e356]
              - link "hello@layoverx.com" [ref=e358] [cursor=pointer]:
                - /url: mailto:hello@layoverx.com
            - listitem [ref=e359]:
              - img [ref=e360]:
                - link "+91 22 1234 5678":
                  - /url: tel:+912212345678
            - listitem [ref=e362]:
              - img [ref=e363]
              - generic [ref=e366]:
                - text: Andheri East, Near CSMIA
                - text: Terminal 2, Mumbai 400099
        - generic [ref=e367]:
          - heading "Hotels" [level=3] [ref=e368]
          - list [ref=e369]:
            - listitem [ref=e370]:
              - link "Airport Hotels" [ref=e371] [cursor=pointer]:
                - /url: hotels.html
            - listitem [ref=e372]:
              - link "Day-Use Rooms" [ref=e373] [cursor=pointer]:
                - /url: hotels.html#day-use
            - listitem [ref=e374]:
              - link "Transit Hotels" [ref=e375] [cursor=pointer]:
                - /url: hotels.html#transit
            - listitem [ref=e376]:
              - link "Luxury Stays" [ref=e377] [cursor=pointer]:
                - /url: hotels.html#luxury
            - listitem [ref=e378]:
              - link "Budget Hotels" [ref=e379] [cursor=pointer]:
                - /url: hotels.html#budget
        - generic [ref=e380]:
          - heading "Restaurants" [level=3] [ref=e381]
          - list [ref=e382]:
            - listitem [ref=e383]:
              - link "Restaurants & Dining" [ref=e384] [cursor=pointer]:
                - /url: restaurants.html
            - listitem [ref=e385]:
              - link "Fine Dining" [ref=e386] [cursor=pointer]:
                - /url: restaurants.html#fine-dining
            - listitem [ref=e387]:
              - link "Local Cuisine" [ref=e388] [cursor=pointer]:
                - /url: restaurants.html#local
            - listitem [ref=e389]:
              - link "Quick Bites" [ref=e390] [cursor=pointer]:
                - /url: restaurants.html#quick
            - listitem [ref=e391]:
              - link "Airport Lounges" [ref=e392] [cursor=pointer]:
                - /url: restaurants.html#lounge
        - generic [ref=e393]:
          - heading "Experiences" [level=3] [ref=e394]
          - list [ref=e395]:
            - listitem [ref=e396]:
              - link "Tours & Experiences" [ref=e397] [cursor=pointer]:
                - /url: experiences.html
            - listitem [ref=e398]:
              - link "City Tours" [ref=e399] [cursor=pointer]:
                - /url: experiences.html#city-tours
            - listitem [ref=e400]:
              - link "Cultural Walks" [ref=e401] [cursor=pointer]:
                - /url: experiences.html#cultural
            - listitem [ref=e402]:
              - link "Airport Transfers" [ref=e403] [cursor=pointer]:
                - /url: airport-transfers.html
            - listitem [ref=e404]:
              - link "Private Cabs" [ref=e405] [cursor=pointer]:
                - /url: airport-transfers.html#private
        - generic [ref=e406]:
          - heading "Company" [level=3] [ref=e407]
          - list [ref=e408]:
            - listitem [ref=e409]:
              - link "How It Works" [ref=e410] [cursor=pointer]:
                - /url: how-it-works.html
            - listitem [ref=e411]:
              - link "Contact Us" [ref=e412] [cursor=pointer]:
                - /url: contact.html
            - listitem [ref=e413]:
              - link "Partner With Us" [ref=e414] [cursor=pointer]:
                - /url: contact.html#partner
            - listitem [ref=e415]:
              - link "FAQs" [ref=e416] [cursor=pointer]:
                - /url: how-it-works.html#faq
            - listitem [ref=e417]:
              - link "Help Center" [ref=e418] [cursor=pointer]:
                - /url: help-center.html
        - generic [ref=e419]:
          - heading "Legal" [level=3] [ref=e420]
          - list [ref=e421]:
            - listitem [ref=e422]:
              - link "Privacy Policy" [ref=e423] [cursor=pointer]:
                - /url: privacy.html
            - listitem [ref=e424]:
              - link "Terms of Service" [ref=e425] [cursor=pointer]:
                - /url: terms.html
            - listitem [ref=e426]:
              - link "Cookie Policy" [ref=e427] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e429]:
        - paragraph [ref=e430]: © 2026 LayoverX. All rights reserved.
        - paragraph [ref=e431]: Mumbai, India — Dedicated to transit travelers worldwide.
        - generic [ref=e432]:
          - link "Privacy" [ref=e433] [cursor=pointer]:
            - /url: privacy.html
          - link "Terms" [ref=e434] [cursor=pointer]:
            - /url: terms.html
          - link "Cookies" [ref=e435] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
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
> 368 |     expect(count).toBeGreaterThan(0);
      |                   ^ Error: expect(received).toBeGreaterThan(expected)
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
```