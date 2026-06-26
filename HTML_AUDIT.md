# HTML Audit Report — LayoverX

**Date:** June 25, 2026
**Scope:** All 30 HTML source pages in `frontend/src/pages/` + 4 components in `frontend/src/components/`

---

## 1. Shared Components

### Component: `head.html`
- **Location:** `frontend/src/components/head.html`
- **Included in:** All 30 pages (via build system)
- **Contains:**
  - `<meta charset>`, viewport, title (with `{{TITLE}}` template var)
  - SEO meta (description, keywords, canonical, Open Graph, Twitter Card)
  - Google Fonts (Inter: 300–900) with `preload` + `media="print" onload` pattern
  - `css/tailwind.min.css` stylesheet
  - Firebase SDK (app, auth, firestore, storage) with `defer`
  - `js/firebase-config.js` with `defer`
  - `css/design-system.css` stylesheet
  - `js/app.js` with `defer`
  - `{{JSON_LD}}` template slot

### Component: `header.html`
- **Location:** `frontend/src/components/header.html`
- **Included in:** All 30 pages (via build system)
- **Contains:**
  - Fixed `<nav>` with z-[1000], transparent background
  - Logo (SVG lightning bolt + "LayoverX" text)
  - Desktop center nav links (Hotels, Restaurants, Spa, Gaming, Tours, Transfers) with `{{ACTIVE_*}}` template vars
  - Desktop right actions (Trip Summary, My Itinerary, Plan My Layover, Login/Signup, User dropdown)
  - Mobile hamburger button (`lg:hidden`)
  - Mobile dropdown menu with same links + auth buttons
  - Auth guest/auth user views (toggled by JS)
- **Bug:** Line 121–124 has duplicate closing `</nav>` tags (stale/corrupted content)

### Component: `footer.html`
- **Location:** `frontend/src/components/footer.html`
- **Included in:** All 30 pages (via build system)
- **Contains:**
  - 4-column responsive grid (Logo+About, Explore Services, Company, Get In Touch)
  - Social media icons (Facebook, Twitter, Instagram) — all `href="#"` (placeholder)
  - Copyright 2026
  - Legal links (Privacy Policy, Terms, Cookie Policy) — all `href="#"` (placeholder)

### Component: `auth-modals.html`
- **Location:** `frontend/src/components/auth-modals.html`
- **Included in:** All 30 pages (via build system)
- **Contains:**
  - Login modal (`#modal-login`) — email/password form, Google social login, forgot password link
  - Signup modal (`#modal-signup`) — name/email/password form, password strength indicator, Google social login
  - Forgot password modal (`#modal-forgot`) — email form
  - Trip context modal (`#modal-trip-context`) — airport area, arrival/departure datetimes, travelers, duration display

---

## 2. Page Inventory

### Category: Core Service Pages (Marketplace Layout with Hero + Filter Sidebar + Cards)

| # | File | Purpose | Hero Style | Filter Sidebar | Cards | Modals |
|---|------|---------|------------|----------------|-------|--------|
| 1 | `hotels.html` | Transit hotel marketplace | `theme-hero` + grid pattern + blurred circles | Price, Distance, Stars, Amenities (4 sections) | 4 hotel cards (horizontal layout with image left, details right) | Hotel Detail Modal, Hotel Booking Modal (2-step: form + success) |
| 2 | `restaurants.html` | Restaurant marketplace | `theme-hero` + grid pattern + blurred circles | Price, Distance, Rating (3 sections) | 4 restaurant cards (horizontal layout) | Restaurant Detail Modal |
| 3 | `spa-wellness.html` | Spa & wellness marketplace | `theme-hero` + grid pattern + blurred circles | Similar filter pattern | Spa cards | Spa detail modal |
| 4 | `experiences.html` | City tours & experiences | `theme-hero` + grid pattern + blurred circles | Similar filter pattern | Experience cards | Experience detail modal |
| 5 | `gaming-entertainment.html` | Gaming & entertainment | `theme-hero` + grid pattern + blurred circles | Similar filter pattern | Gaming cards | Gaming detail modal |
| 6 | `airport-transfers.html` | Airport cab/transfer booking | `theme-hero` + grid pattern + blurred circles | Similar filter pattern | Transfer cards | Transfer detail modal |

### Category: Homepage

| # | File | Purpose | Layout |
|---|------|---------|--------|
| 7 | `index.html` | Landing page / homepage | Full hero (90vh, background image) → Quick Search bar → Value Props (4 cards) → How It Works (3 steps) → Services Carousel (6 items) → Trust Indicators → Featured Experiences Carousel (6 cards) → Testimonials (3 cards) → FAQ (4 accordions) → CTA section |

### Category: Planning & Booking Flow

| # | File | Purpose | Step |
|---|------|---------|------|
| 8 | `plan-my-layover.html` | AI itinerary builder | Dark header with search form → Service carousel (6 items) → 6 step-builder sections (Transfer, Hotel, Dining, Tours, Spa, Gaming) → Cost estimator sidebar → AI Timeline → Saved plans |
| 9 | `my-itinerary.html` | Itinerary workspace | Dark header → Builder workspace |
| 10 | `booking-review.html` | Review stopover plan | Dark header with background image → Review content |
| 11 | `checkout.html` | Traveler & flight details | Dark header with gradient → 2-column form (left: traveler+flight forms, right: order summary sidebar) |
| 12 | `payment-selection.html` | Payment method selection | Dark header with gradient → Payment form |
| 13 | `booking-confirmation.html` | Booking confirmation | Confirmation content |

### Category: User Account Pages

| # | File | Purpose |
|---|------|---------|
| 14 | `my-profile.html` | User profile page |
| 15 | `my-trips.html` | User trips listing |
| 16 | `saved-itineraries.html` | Saved itineraries listing |
| 17 | `account-settings.html` | Account settings (profile sidebar + settings form) |
| 18 | `notifications.html` | User notifications |
| 19 | `trip-details.html` | Individual trip details |

### Category: Supplier / Admin Pages

| # | File | Purpose |
|---|------|---------|
| 20 | `partner-registration.html` | Supplier registration form |
| 21 | `supplier-dashboard.html` | Supplier dashboard |
| 22 | `supplier-status.html` | Supplier status page |
| 23 | `revenue-admin.html` | Revenue admin panel |

### Category: Info / Static Pages

| # | File | Purpose | Hero Style |
|---|------|---------|------------|
| 24 | `faq.html` | FAQ page | `bg-slate-900` with background image overlay, centered text |
| 25 | `contact.html` | Contact page | Gradient from slate-900 to slate-950 with grid pattern + blurred circles |
| 26 | `help-center.html` | Help center | Dark hero |
| 27 | `how-it-works.html` | How it works guide | Dark hero |
| 28 | `privacy.html` | Privacy policy | Static content |
| 29 | `terms.html` | Terms of service | Static content |
| 30 | `service-details.html` | Generic service detail | Dynamic content |

---

## 3. Hero Section Patterns

### Pattern A: "Theme Hero" (Used by 6 marketplace pages)
```html
<section class="relative theme-hero text-white pt-24 pb-16 overflow-hidden">
  <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
  <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
  <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
  <div class="container relative z-10">
    <!-- Breadcrumb → Badge → H1 with theme-text-accent → Description → Feature grid 2x2 → Hero image -->
  </div>
</section>
```
**Pages:** hotels, restaurants, spa-wellness, experiences, gaming-entertainment, airport-transfers

### Pattern B: "Homepage Hero" (Used by index.html only)
```html
<header class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
  <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('...')"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80"></div>
  <!-- Centered text, no breadcrumb, stat cards -->
</header>
```

### Pattern C: "Dark Header" (Used by checkout, payment, my-itinerary, booking-review)
```html
<div class="relative min-h-[30vh] pt-24 pb-12 overflow-hidden text-white flex items-center bg-slate-900">
  <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-950 opacity-95 z-0"></div>
  <!-- Breadcrumb, H1 with gradient text, subtitle -->
</div>
```

### Pattern D: "Slate Background" (Used by faq, account-settings, booking-review)
```html
<section class="relative bg-slate-900 text-white pt-24 pb-16 overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center opacity-10" style="background-image:url('...')"></div>
  <!-- Centered or left-aligned content -->
</section>
```

### Pattern E: "Gradient Hero" (Used by contact)
```html
<section class="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white pt-24 pb-16 overflow-hidden">
  <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
  <!-- Blurred circles + grid pattern -->
</section>
```

---

## 4. Navigation Structure

### Desktop Navigation (in header.html)
```
Logo | Hotels | Restaurants | Spa | Gaming | Tours | Transfers | [Trip Summary] | [My Itinerary] | [Plan My Layover] | Login/Sign Up | [User Menu]
```

### Mobile Navigation (in header.html)
```
Logo | Hamburger →
  Trip Summary
  My Itinerary
  Hotels | Restaurants | Spa & Wellness | Gaming & Fun | Tours | Transfers
  Plan My Layover (button)
  Login | Sign Up (or User Profile links + Logout)
```

### Active State Pattern
- Template variable `{{ACTIVE_HOTELS}}` etc. replaced at build time
- Desktop: adds a class (e.g., `text-sky-600 border-b-2 border-sky-600`)
- Mobile: adds the same class

---

## 5. Forms Inventory

| Page | Form ID | Fields | Submit Handler |
|------|---------|--------|----------------|
| `hotels.html` | `hotel-search-form` | location (select), checkin (datetime-local), duration (select) | Form submit (native) |
| `hotels.html` | `hotel-booking-form` | room type (radio), name, email, flight, phone | `layoverx.confirmHotelBooking(event)` |
| `restaurants.html` | (none — filter uses onclick) | — | — |
| `checkout.html` | `checkout-booking-form` | traveler name, passport, nationality, phone, incoming flight, outgoing flight | `saveDetailsAndContinue(event)` (inline `<script>`) |
| `contact.html` | `contact-form` | name, email, phone, date, message | Inline: `alert('Message sent!'); this.reset();` |
| `plan-my-layover.html` | `planner-form` | location (select), arrival (datetime-local), departure (datetime-local), travelers (select) | — (JS-driven) |
| `auth-modals.html` | `form-login` | email, password | `layoverx.handleLogin(event)` |
| `auth-modals.html` | `form-signup` | name, email, password | `layoverx.handleSignup(event)` |
| `auth-modals.html` | `form-trip-context` | location (select), arrival (datetime-local), departure (datetime-local), travelers (select) | `layoverx.handleTripContextSubmit(event)` |

---

## 6. Card Patterns

### Card Pattern 1: "Marketplace Horizontal Card" (hotels, restaurants, spa, experiences, gaming, transfers)
```html
<article class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row">
  <div class="relative w-full md:w-80 h-52 md:h-auto flex-shrink-0">
    <img ... class="w-full h-full object-cover"/>
    <span class="absolute top-4 left-4 bg-theme-primary text-white ...">Badge</span>
  </div>
  <div class="p-6 flex-grow flex flex-col justify-between">
    <div>
      <h3 class="text-lg font-bold text-gray-900">Name</h3>
      <div class="text-xs text-theme-primary">Rating + Location</div>
      <p class="text-theme-primary text-sm line-clamp-2">Description</p>
      <div class="flex flex-wrap gap-2">Tags</div>
    </div>
    <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
      <div class="text-lg font-black text-theme-primary">Price</div>
      <div class="flex items-center gap-2">View Details + Add to Itinerary</div>
    </div>
  </div>
</article>
```

### Card Pattern 2: "Carousel Card" (index.html services + experiences)
```html
<div class="carousel-item">
  <a href="..." class="card group h-full flex flex-col">
    <div class="card-img-container">
      <img class="card-img" .../>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
    <div class="card-content flex-grow">
      <h3 class="text-xl font-bold text-slate-900 group-hover:text-sky-600">Title</h3>
      <p class="text-slate-650 text-sm">Description</p>
      <div class="text-sky-600 font-bold text-sm">Explore →</div>
    </div>
  </a>
</div>
```

### Card Pattern 3: "Featured Experience Card" (index.html featured)
```html
<div class="card h-full flex flex-col justify-between">
  <div>
    <div class="card-img-container">...</div>
    <div class="card-content">
      <div class="flex items-center gap-4 text-xs">Rating + Tag</div>
      <h3 class="text-lg font-bold">Title</h3>
      <p class="text-sm">Description</p>
    </div>
  </div>
  <div class="px-6 pb-6 pt-4 border-t">Price + CTA button</div>
</div>
```

### Card Pattern 4: "Testimonial Card" (index.html, hotels, restaurants)
```html
<div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
  <div>
    <div class="text-amber-500">★★★★★</div>
    <p class="text-sm italic">Quote</p>
  </div>
  <div class="flex items-center gap-4">
    <div class="w-10 h-10 rounded-full bg-gradient-to-br">Initials</div>
    <div>Name + Context</div>
  </div>
</div>
```

### Card Pattern 5: "Planner Option Card" (plan-my-layover.html)
```html
<label class="relative border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-sky-300 transition cursor-pointer select-card">
  <input type="checkbox" .../>
  <div>
    <h3 class="font-bold text-sm">Name</h3>
    <p class="text-xs">Description</p>
  </div>
  <div class="text-right">
    <strong class="text-theme-primary text-sm">Price</strong>
  </div>
</label>
```

---

## 7. Inline CSS

### Pages with `<style>` tags: **NONE**
No pages in `frontend/src/pages/` contain inline `<style>` blocks.

### Inline `style=""` attributes found:
- `index.html`: `style="background-image:url('assets/photos/homepage.png')"` (hero bg)
- `faq.html`: `style="background-image:url('...')"` (hero bg)
- `account-settings.html`: `style="background-image:url('...')"` (hero bg)
- `booking-review.html`: `style="background-image:url('...')"` (hero bg)
- `contact.html`: `style="background-image:url('...')"` (map section bg)
- `plan-my-layover.html`: `style="background-image:url('...')"` (route map bg)

All inline styles are limited to `background-image` URLs — no color/spacing/layout inline styles.

---

## 8. Inline JavaScript

### Pages with inline `<script>` blocks:

| Page | Script Content | Lines |
|------|---------------|-------|
| `checkout.html` | `saveDetailsAndContinue(e)` — saves form data to localStorage, redirects to payment | 14 lines |

**Only 1 page** has inline `<script>` — all other JS is handled via `app.js`.

---

## 9. Duplicate Layout Patterns

### Duplicate Hero Pattern (Pattern A)
**6 pages** share an identical hero structure:
- `hotels.html`
- `restaurants.html`
- `spa-wellness.html`
- `experiences.html`
- `gaming-entertainment.html`
- `airport-transfers.html`

All use:
- Same container structure (`theme-hero`, `lg:grid-cols-12`, `lg:col-span-7` + `lg:col-span-5`)
- Same breadcrumb HTML
- Same badge pattern (`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold`)
- Same feature grid (`grid grid-cols-2 gap-4 pt-2` with bullet points)
- Same image container (`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group aspect-[4/3]`)
- Same location badge (`absolute bottom-4 left-4 bg-black/60 backdrop-blur-md`)

### Duplicate Filter Sidebar Pattern
**6 marketplace pages** share similar filter sidebar structure:
- White rounded-2xl card with sticky positioning
- "Filters" header with "Clear All" link
- Checkbox-based filter sections with `text-xs font-bold text-theme-primary uppercase tracking-wider` headers

### Duplicate Card Pattern
**6 marketplace pages** share identical horizontal card layout:
- `flex flex-col md:flex-row`
- Image: `w-full md:w-80 h-52 md:h-auto flex-shrink-0`
- Content: `p-6 flex-grow flex flex-col justify-between`
- Bottom bar: `pt-4 border-t border-gray-100 flex items-center justify-between`

### Duplicate FAQ Pattern
**3 pages** use `<details>` FAQ accordions:
- `index.html` (4 items, bg-slate-50 section)
- `hotels.html` (3 items, bg-white section)
- `restaurants.html` (2 items, bg-gray-50 section)
- `contact.html` (2 items, bg-gray-50 section)

### Duplicate Dark Header Pattern
**4 pages** share identical dark header structure:
- `checkout.html`
- `payment-selection.html`
- `my-itinerary.html`
- `booking-review.html`

---

## 10. Design Inconsistencies

### Hero Section Inconsistencies
| Issue | Pages Affected |
|-------|---------------|
| `theme-hero` class used but not defined in CSS files (relies on design-system.css) | Hotels, Restaurants, Spa, Experiences, Gaming, Transfers |
| `theme-text-accent` class used for accent colors — inconsistent color per page | Same 6 pages |
| `theme-badge` class used for badge styling — not all pages use it | Hotels, Spa, Transfers use `theme-badge`; Restaurants, Experiences, Gaming use inline `bg-white/10 text-{color} border border-theme-primary/30` |
| Breadcrumb separator: some pages use `<svg>` chevron, booking-review uses `→` text arrow | booking-review vs. all others |
| Hero background blur circles: restaurants uses `bg-white/10`, others use `bg-white/5` | restaurants vs. others |

### Badge Color Inconsistencies
| Page | Badge Color |
|------|------------|
| Hotels | `theme-badge` |
| Restaurants | `bg-white/10 text-emerald-300 border border-theme-primary/30` |
| Spa | `theme-badge` |
| Experiences | `bg-white/10 text-amber-300 border border-theme-primary/30` |
| Gaming | `bg-white/10 text-purple-300 border border-theme-primary/30` |
| Transfers | `theme-badge` |

### Text Color Inconsistencies
| Issue | Example |
|-------|---------|
| `text-theme-primary` used for card descriptions in hotels/restaurants | Hotels: `text-theme-primary text-sm` for descriptions |
| `text-slate-650` used in index.html for descriptions | Index uses `text-slate-650 text-sm` |
| `text-gray-300` used in hero descriptions for marketplace pages | Restaurants: `text-gray-300 text-sm` |
| `text-white/80` used in hotels hero, `text-gray-300` in restaurants hero | Hotels vs. Restaurants hero paragraph |

### Card Bottom Bar Inconsistencies
| Issue | Pages |
|-------|-------|
| Hotels use `text-theme-primary` for price + rating text | hotels.html |
| Restaurants use `text-theme-primary` for price text | restaurants.html |
| Index cards use `text-sky-600` for price | index.html |
| Index cards use `text-slate-900` for titles, marketplace uses `text-gray-900` | index vs. marketplace |

### Section Background Inconsistencies
| Page | Marketplace BG | Reviews BG | FAQ BG |
|------|---------------|------------|--------|
| Hotels | `bg-gray-50` | `bg-gray-50` | `bg-white` |
| Restaurants | `bg-gray-50` | `bg-white` | `bg-gray-50` |
| Index | N/A | `bg-white` | `bg-slate-50` |

### FAQ Accordion Styling Inconsistencies
| Page | Container | Summary Style |
|------|-----------|--------------|
| Index | `bg-white border border-slate-200 rounded-2xl p-6` | SVG chevron with `group-open:rotate-180` |
| Hotels | `bg-gray-50 rounded-2xl border border-gray-200 p-4` | Text arrow `▼` with `group-open:rotate-180` |
| Restaurants | `bg-white rounded-2xl border border-gray-200 p-4` | Text arrow `▼` with `group-open:rotate-180` |
| Contact | `bg-white rounded-2xl border border-gray-200 p-4` | Text arrow `▼` with `group-open:rotate-180` |

---

## 11. Frontend Issues

### Critical
1. **Duplicate closing `</nav>` tags in header.html** (lines 121–124) — stale/corrupted content after the mobile menu
2. **Footer legal links are placeholders** — Privacy Policy, Terms, Cookie Policy all link to `href="#"`

### High
3. **No consistent design token usage** — mix of `text-theme-primary`, `text-sky-600`, `text-slate-900`, `text-gray-900`, `text-emerald-700` across pages
4. **Hero section patterns are inconsistent** — 5 different hero patterns with no shared component
5. **Card patterns are not componentized** — 5 different card patterns duplicated across 30 pages
6. **Filter sidebar is not componentized** — duplicated across 6 marketplace pages with minor variations
7. **FAQ accordion is not componentized** — 4 different styling approaches across pages

### Medium
8. **Inline script in checkout.html** — `saveDetailsAndContinue()` function defined inline instead of in app.js
9. **Contact form uses `alert()`** for submission feedback — poor UX
10. **Social media links in footer are `href="#"`** — non-functional
11. **Breadcrumb separator inconsistency** — SVG chevron vs. text arrow `→`
12. **Badge styling inconsistency** — `theme-badge` vs. inline classes
13. **Section background inconsistency** — `bg-gray-50` vs. `bg-slate-50` vs. `bg-white` used interchangeably

### Low
14. **Missing `alt` text** — some images have descriptive alt, others have minimal
15. **Color system** — `text-theme-primary` vs. `text-sky-600` vs. `text-sky-500` used inconsistently
16. **Border radius inconsistency** — mix of `rounded-xl`, `rounded-2xl`, `rounded-3xl` for cards
17. **Shadow inconsistency** — mix of `shadow-sm`, `shadow-md`, `shadow-lg` for similar elements
18. **Missing loading states** — only hotels.html has skeleton loading states; other marketplace pages don't
19. **Missing empty states** — only hotels.html and restaurants.html have empty states

---

## 12. Summary Statistics

| Metric | Count |
|--------|-------|
| Total HTML pages | 30 |
| Shared components | 4 |
| Unique hero patterns | 5 |
| Card patterns | 5 |
| Forms | 9 |
| Pages with inline CSS | 0 |
| Pages with inline JS | 1 (checkout.html) |
| Pages with modals | 7+ |
| Marketplace pages (hero+filter+cards) | 6 |
| Pages with FAQ sections | 4 |
| Pages with testimonial sections | 3 |
| Template variables used | `{{TITLE}}`, `{{DESCRIPTION}}`, `{{CANONICAL}}`, `{{JSON_LD}}`, `{{ACTIVE_HOTELS}}`, `{{ACTIVE_RESTAURANTS}}`, `{{ACTIVE_SPA}}`, `{{ACTIVE_GAMING}}`, `{{ACTIVE_EXPERIENCES}}`, `{{ACTIVE_TRANSFERS}}`, `{{PLAN_MY_LAYOVER_CLASS}}` |
