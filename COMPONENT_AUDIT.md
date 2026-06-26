# Component Audit Report — LayoverX

**Date:** June 25, 2026
**Scope:** All reusable UI components across 30 pages, 4 shared components, and design-system CSS

---

## 1. Shared Components (Existing)

### 1.1 `head.html` — `<head>` Template
- **File:** `frontend/src/components/head.html` (36 lines)
- **Template vars:** `{{TITLE}}`, `{{DESCRIPTION}}`, `{{CANONICAL}}`, `{{JSON_LD}}`, `{{ROBOTS}}`
- **Assets loaded:** `tailwind.min.css`, `design-system.css`, `app.js`, `firebase-config.js`, Font Awesome (Inter), Leaflet, Google Maps
- **Issues:** No critical CSS inlining (FOUC risk at large viewports)
- **Duplication risk:** None — used by all 30 pages

### 1.2 `header.html` — Navigation Bar
- **File:** `frontend/src/components/header.html` (124 lines)
- **Template vars:** `{{ACTIVE_HOTELS}}`, `{{ACTIVE_RESTAURANTS}}`, `{{ACTIVE_SPA}}`, `{{ACTIVE_GAMING}}`, `{{ACTIVE_EXPERIENCES}}`, `{{ACTIVE_TRANSFERS}}`, `{{ACTIVE_HOW_IT_WORKS}}`, `{{ACTIVE_CONTACT}}`, `{{PLAN_MY_LAYOVER_CLASS}}`
- **Sub-components:**
  - Logo (svg + text)
  - Desktop nav links (10 links)
  - Trip Summary chip (`#global-trip-badge`)
  - My Itinerary link with badge count
  - "Plan My Layover" primary CTA button
  - Auth guest view (Login/Sign Up)
  - Auth user view (dropdown with avatar, name, menu links)
  - Mobile hamburger menu with full drawer
- **Bugs:**
  - Duplicate `</nav>` tags at lines 121-124 (stray `ton>`, `</div>`, `</div>`, `</nav>`)
  - `openAuthModal` should be `layoverx.openModal` (function exposure inconsistency)
- **Used by:** All 30 pages

### 1.3 `footer.html` — Footer
- **File:** `frontend/src/components/footer.html` (74 lines)
- **Sub-components:**
  - Logo + description
  - Social media links (Facebook, Twitter, Instagram) — all `href="#"` placeholders
  - Link columns: Explore Services (4 links), Company (4 links)
  - Contact info section (email, phone, address)
  - Copyright bar + legal links (Privacy, Terms, Cookie Policy) — all `href="#"` placeholders
- **Issues:**
  - All external social links are `href="#"` — dead links
  - All legal links are `href="#"` — dead links
  - Uses `text-theme-accent` which may resolve to themed sector color on marketplace pages
- **Used by:** All 30 pages

### 1.4 `auth-modals.html` — Authentication Modals
- **File:** `frontend/src/components/auth-modals.html` (192 lines)
- **4 modals:**
  - Login (`#modal-login`): email/password + Google OAuth + forgot link
  - Signup (`#modal-signup`): name/email/password + password strength indicator + Google OAuth
  - Forgot Password (`#modal-forgot`): email input + reset button
  - Trip Context (`#modal-trip-context`): airport area, arrival/departure, travelers, computed layover duration
- **Sub-components:**
  - Modal overlay with backdrop blur
  - Modal close button
  - Social login button (Google SVG)
  - Password toggle button (eye icon)
  - Password strength bar
  - Auth form switch links
  - Divider with "Or" text
- **CSS classes used:** `modal-overlay`, `modal-content`, `modal-close`, `form-group`, `form-label`, `form-input`, `btn btn-primary`, `social-btn`, `auth-link`, `loading-spinner`, `auth-form`
- **Used by:** All 30 pages

---

## 2. Component Inventory — Design System CSS Classes

### 2.1 Buttons (8 variants)

| Class | Height | Padding | Radius | Scope |
|-------|--------|---------|--------|-------|
| `.btn` | 3rem (48px) | 0 1.5rem | `var(--radius)` 12px | Base button |
| `.btn-primary` | (inherits .btn) | — | — | Sky-600 bg with shadow |
| `.btn-secondary` | (inherits .btn) | — | — | Slate-900 bg |
| `.btn-outline` | (inherits .btn) | — | — | Transparent + border |
| `.btn-ghost` | (inherits .btn) | — | — | Transparent, hover effect |
| `.btn-danger` | (inherits .btn) | — | — | Red-500 bg |
| `.btn-sm` | 2.5rem (40px) | 0 1rem | `var(--radius-sm)` 6px | Compact |
| `.btn-lg` | 3.5rem (56px) | 0 2rem | — | Large |

**Implementation status in HTML:**
- `btn btn-primary` — used on most pages ✓
- `btn btn-ghost` — used on most pages ✓
- `btn btn-sm` — sometimes used ✓
- `btn btn-outline` — only on index.html hero ✓
- `bg-theme-primary` inline — still used on hotels page (search button) ✗
- `py-4 bg-theme-primary` inline — used on marketplace pages ✗
- `px-8 py-4 bg-white text-sky-800 rounded-xl hover:bg-slate-50` — CTA button on index.html ✗

### 2.2 Cards (11+ variants)

| Class | Purpose | Used In HTML? |
|-------|---------|---------------|
| `.card` | Base card | **Yes** (index.html, featured) |
| `.card-hotel` | Hotel card | **No** (uses inline) |
| `.card-restaurant` | Restaurant card | **No** |
| `.card-transfer` | Transfer card | **No** |
| `.card-experience` | Experience card | **No** |
| `.card-tour` | Tour card | **No** |
| `.card-feature` | Feature card | **No** |
| `.card-pricing` | Pricing card | **No** |
| `.card-img-container` | Card image wrapper | **Yes** (index.html) |
| `.card-img` | Card image | **Yes** (index.html) |
| `.card-content` | Card content area | **Yes** (index.html) |

**Repeated card patterns in HTML that should use card classes:**

| Pattern | Class Combination | Pages |
|---------|------------------|-------|
| Marketplace listing | `bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Feature card | `bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4` | index.html |
| Carousel card | `card group h-full flex flex-col` | index.html (services & experiences) |
| Testimonial | `bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm` | index.html |
| Planner carousel | `bg-gray-50 rounded-2xl p-4 border border-gray-200 h-full flex flex-col hover:border-sky-300 transition duration-300 group` | plan-my-layover.html |
| FAQ accordion | `bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-2` | faq.html |

### 2.3 Forms

| Class | Purpose | Used In HTML? |
|-------|---------|---------------|
| `.form-group` | Form group wrapper | **Yes** (auth-modals, contact, checkout) |
| `.form-label` | Label | **Yes** (auth-modals, contact) |
| `.form-input` | Input/textarea | **Yes** (auth-modals, contact, checkout) |
| `.form-select` | Select | **Yes** (auth-modals trip context) |
| `.input-error` | Error state | **No** |
| `.input-success` | Success state | **No** |

**Repeated form patterns in HTML that should use form classes:**

| Pattern | Class Combination | Pages |
|---------|------------------|-------|
| Marketplace filter label | `block text-xs font-bold text-theme-primary uppercase mb-1` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Marketplace filter select | `w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-theme-primary` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Marketplace filter checkbox | `rounded border-gray-300 text-theme-primary focus:ring-theme-primary` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Planner dark input | `w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-sm font-semibold text-white focus:ring-2 focus:ring-sky-500` | plan-my-layover.html |
| Search field | `bg-slate-50 border border-slate-200 rounded-2xl p-4` | index.html |

### 2.4 Modals

| Class | Purpose | Used In HTML? |
|-------|---------|---------------|
| `.modal-overlay` | Modal backdrop | **Yes** (auth-modals) |
| `.modal-content` | Modal container | **Yes** (auth-modals) |
| `.modal-close` | Close button | **Yes** (auth-modals) |

**Modal types in project:**
1. Auth modals (login, signup, forgot, trip context) — in auth-modals.html component ✓
2. Hotel detail modal — in hotels.html page (uses `modal-overlay`, `modal-content` classes)
3. Booking modals — in individual pages (uses matching classes)

**Issue:** The `modal-overlay.flex` modifier class is the show/hide mechanism, but some pages use `opacity-0`/`hidden` classes inconsistently.

### 2.5 Badges & Tags

| Class | Purpose | Used In HTML? |
|-------|---------|---------------|
| `.theme-badge` | Hero badge on dark background | **Yes** (hotels hero) |
| `.badge` | Generic badge | **No** |
| `.badge-success` | Green badge | **No** |
| `.badge-warning` | Amber badge | **No** |
| `.badge-danger` | Red badge | **No** |
| `.badge-info` | Blue badge | **No** |

**Repeated badge patterns in HTML:**

| Pattern | Class Combination | Pages |
|---------|------------------|-------|
| Hero badge | `inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20` | restaurants.html (differs per page) |
| Hero badge (hotels) | `inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold theme-badge` | hotels.html |
| Card tag (amenity) | `text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded-md` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Card tag (special) | `text-[10px] bg-gray-50 text-theme-primary font-bold px-2 py-1 rounded-md` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Card image badge | `absolute top-4 left-4 bg-theme-primary text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-md` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |
| Rating badge | `flex items-center gap-2 bg-gray-50 text-theme-primary px-2 py-1 rounded-lg text-xs font-bold` | hotels, restaurants, spa, gaming, experiences, transfers (6 pages) |

### 2.6 Section Headers (Label + Title + Subtitle)

Design system provides:
| Class | Purpose | Used In HTML? |
|-------|---------|---------------|
| `.section-label` | Section label | **No** (uses inline) |
| `.section-title` | Section title | **No** (uses inline) |
| `.section-subtitle` | Section subtitle | **No** (uses inline) |
| `.section` | Section wrapper | **Some** (newly fixed index.html) |

**Repeated inline patterns on ALL pages:**
```html
<span class="inline-block text-sky-600 font-bold text-sm uppercase tracking-wider mb-2">Label</span>
<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Title</h2>
<p class="text-slate-650 max-w-xl mx-auto">Subtitle</p>
```

**Pages affected:** All 30 pages use this pattern somewhere. Only index.html has been recently updated to use `.section-label`, `.section-title`, `.section-subtitle`.

---

## 3. Page-Specific Component Patterns

### 3.1 Hero Sections (5 patterns)

#### Pattern A: Marketplace Hero (6 pages)
- **Pages:** hotels, restaurants, spa-wellness, gaming-entertainment, experiences, airport-transfers
- **Structure:**
  ```html
  <section class="relative theme-hero text-white pt-24 pb-16 overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    <div class="container relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- Breadcrumb -->
        <!-- Hero badge -->
        <h1>...</h1>
        <p>...</p>
        <!-- Feature grid (4 items) -->
        <!-- Right column image with overlay -->
      </div>
    </div>
  </section>
  ```
- **Variance:** Badge text/border colors differ per page (e.g., restaurants uses `text-emerald-300 border border-white/20`, hotels uses `theme-badge`). Each page has unique breadcrumb, title, subtitle, feature list, and hero image.
- **Should be a component:** YES — the entire hero block is identical in structure across 6 pages. Only content differs.

#### Pattern B: Full-Screen Hero (1 page)
- **Page:** index.html
- **Structure:**
  ```html
  <header class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image:url(...)">
    <div class="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80">
    <div class="relative z-10 text-center px-4 py-24 max-w-4xl mx-auto">
      <!-- Badge -->
      <h1>...</h1>
      <p>...</p>
      <!-- CTA buttons -->
      <!-- Stats grid (4 items) -->
    </div>
  </header>
  ```
- **Unique:** Not reusable — only the homepage.

#### Pattern C: Inner Page Hero (3 pages)
- **Pages:** how-it-works, contact, faq
- **Structure:** Same as Pattern A but WITHOUT the right column image. Uses `bg-gradient-to-b from-slate-900 to-slate-950` instead of `theme-hero`.
- **Should be a component:** YES — extract with an optional image slot.

#### Pattern D: Service Details Hero (1 page)
- **Page:** service-details.html
- **Structure:**
  ```html
  <div class="relative min-h-[40vh] pt-24 pb-16 overflow-hidden text-white flex items-center" id="details-hero">
    <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-90 z-0"></div>
    <div class="absolute inset-0 bg-cover bg-center opacity-40 z-0" id="details-hero-bg"></div>
    <div class="container relative z-10 space-y-4">
      <!-- Breadcrumb -->
      <!-- Badge -->
      <h1>...</h1>
      <!-- Rating, stars, location -->
    </div>
  </div>
  ```
- **Unique:** Different structure — hero with dynamic background image overlay.

#### Pattern E: Checkout/Booking Hero (4 pages)
- **Pages:** checkout, booking-review, payment-selection, booking-confirmation
- **Structure:**
  ```html
  <div class="relative min-h-[30vh] pt-24 pb-12 overflow-hidden text-white flex items-center bg-slate-900">
    <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-950 opacity-95 z-0"></div>
    <div class="container relative z-10 space-y-4">
      <!-- Breadcrumb with step links -->
      <h1>...</h1>
      <p>Step progress description</p>
    </div>
  </div>
  ```
- **Should be a component:** YES — 4 pages share identical structure.

### 3.2 Breadcrumbs

- **Pattern:** `<nav>` with `flex items-center gap-2 text-xs text-white/70`
- **Structure:** Home → Category → Current page
- **Used on:** ALL inner pages (how-it-works, contact, service-details, checkout, booking-review, payment-selection, booking-confirmation, faq, terms, privacy, help-center, supplier-dashboard, supplier-status, revenue-admin, notifications, my-itinerary, my-trips, saved-itineraries, trip-details, my-profile, account-settings, partner-registration)
- **Variance:** Text colors differ per hero background (white/70 on dark, text-gray-700 on light)
- **Should be a component:** YES — defined in design-system CSS as `.breadcrumb` class

### 3.3 Marketplace Filter Sidebars (6 pages)

| Page | Filters |
|------|---------|
| hotels.html | Price, Distance, Star Rating, Transit Amenities |
| restaurants.html | Cuisine, Price, Distance |
| spa-wellness.html | Treatment Type, Price, Duration |
| gaming-entertainment.html | Category, Price, Intensity |
| experiences.html | Tour Type, Price, Duration |
| airport-transfers.html | Vehicle Type, Capacity, Fare |

**Common structure:**
```html
<aside class="w-full lg:w-1/4 flex-shrink-0" aria-label="Filters Panel">
  <div class="bg-white rounded-2xl border border-gray-200 p-6 sticky top-52">
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
      <h2 class="text-base font-bold text-gray-900">Filters</h2>
      <button type="button" class="text-xs text-theme-primary font-bold hover:underline">Clear All</button>
    </div>
    <!-- Filter sections -->
    <div class="mb-6">
      <h3 class="form-label mb-4">Filter Name</h3>
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
          <input type="checkbox" class="rounded border-gray-300 text-theme-primary focus:ring-theme-primary"/>
          Option
        </label>
      </div>
    </div>
  </div>
</aside>
```

**Should be a component:** YES — all 6 share identical wrapper structure. Only filter content differs.

### 3.4 Marketplace Listing Layout (6 pages)

```html
<div class="w-full lg:w-3/4">
  <div class="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Sort bar -->
  </div>
  <div class="space-y-6" id="...">
    <!-- Card items -->
  </div>
</div>
```

**Variance:** Each page has different card structure:
- Hotels: Horizontal `flex flex-col md:flex-row` with image left, content right, price + buttons
- Restaurants: Similar horizontal layout
- Others: Similar patterns with category-specific details

**Should be a component:** The listing wrapper (sort bar + card container) is reusable. The individual cards are category-specific but share enough structure to be templated.

### 3.5 Carousel Components

| Carousel | Page | Items |
|----------|------|-------|
| Services carousel | index.html | 6 items (hotels, dining, spa, gaming, tours, activities) |
| Experiences carousel | index.html | 6 items (hotels, restaurants, spa, gaming, tours, transfers) |
| Planner carousel | plan-my-layover.html | 8 items (hotels, dining, spa, gaming, tours, transfers, luggage, shopping) |

**CSS classes used:** `.carousel-container`, `.carousel-item` — defined in design system ✓

**Should be a component:** The carousel wrapper (controls + scrollable container) is reusable. Items are content-specific.

### 3.6 Skeleton Loaders

| Page | Structure |
|------|-----------|
| service-details.html | 4 skeleton blocks (image, heading, text lines, sidebar box) |
| hotels.html | Horizontal card skeleton (image + text lines) |
| my-trips.html | Vertical card skeleton (image + text) |
| my-itinerary.html | Card skeleton |

**Variance:** Each page uses different structure.
**CSS class used:** `animate-pulse` (Tailwind utility)
**Should be a component:** YES — define `.skeleton`, `.skeleton-text`, `.skeleton-circle`, `.skeleton-btn` in design system (already exist but unused)

### 3.7 Timeline Components

| Timeline | Page | Items |
|----------|------|-------|
| Flight planning steps | index.html (how-it-works section) | 3 steps with step numbers |
| Layover calculation | how-it-works.html | 3 steps with numbered circles |
| Example timeline | how-it-works.html | Visual timeline with phases |
| Trip details timeline | trip-details.html | 9-step timeline (landing → cab → hotel → dining → tours → spa → gaming → return cab → boarding) |
| Planner timeline | plan-my-layover.html | Dynamic item timeline |

**CSS classes defined:** `.step-number` (4rem circle with primary color)
**Should be a component:** YES — timeline with nodes and step indicators.

### 3.8 Empty States

| Page | Content |
|------|---------|
| hotels.html | Icon + "No Hotels Found" + reset button |
| supplier-dashboard.html | "No applications yet" message |
| saved-itineraries.html | "No saved plans" message |
| my-trips.html | "No trips yet" message |
| notifications.html | "No alerts found" message |

**Should be a component:** YES — `.empty-state` wrapper with icon, heading, body text, optional CTA button.

---

## 4. Duplicated Components That Should Become Reusable

### 4.1 Marketplace Hero — HIGH value (6 pages → 1 component)

Identical structure across 6 marketplace pages:
- `section.theme-hero` with radial gradient overlay + decorative blur circles
- `div.container` with `grid grid-cols-1 lg:grid-cols-12`
- Left column: breadcrumb, badge, h1, p, feature list (4 items)
- Right column: image with overlay and location badge

**Proposed component:** `marketplace-hero.html`
- Template vars: `{{THEME}}` (for theme-hero), `{{BREADCRUMB}}`, `{{BADGE_TEXT}}`, `{{TITLE}}`, `{{TITLE_ACCENT}}`, `{{DESCRIPTION}}`, `{{FEATURES}}` (array), `{{IMAGE_SRC}}`, `{{IMAGE_ALT}}`, `{{LOCATION_TEXT}}`

### 4.2 Search/Filter Bar — HIGH value (6 pages → 1 component)

Identical filter sidebar across 6 marketplace pages plus search form.

**Proposed component:** `marketplace-filter.html`
- Template vars: `{{FILTER_SECTIONS}}`, `{{SORT_OPTIONS}}`, `{{SEARCH_FORM_ID}}`

### 4.3 Inner Page Hero — MEDIUM value (3 pages → 1 component)

how-it-works, contact, and faq share this hero pattern.

**Proposed component:** `inner-hero.html`
- Template vars: `{{TITLE}}`, `{{TITLE_ACCENT}}`, `{{DESCRIPTION}}`, `{{BADGE_TEXT}}`, `{{FEATURES}}`, `{{IMAGE_SRC}}` (optional)

### 4.4 Booking Step Hero — MEDIUM value (4 pages → 1 component)

checkout, booking-review, payment-selection, booking-confirmation share this hero.

**Proposed component:** `booking-hero.html`
- Template vars: `{{TITLE}}`, `{{TITLE_ACCENT}}`, `{{DESCRIPTION}}`, `{{BREADCRUMB_LINKS}}`

### 4.5 Section Header — HIGH value (30 pages → 1 component)

All 30 pages use this same pattern. Already has CSS classes: `.section-label`, `.section-title`, `.section-subtitle`.

**Action:** Replace inline Tailwind with CSS classes across all pages. No component needed — just use the CSS classes in each page.

### 4.6 Breadcrumb — MEDIUM value (25+ pages → 1 component)

Breadcrumb pattern repeated on most inner pages. CSS class `.breadcrumb` already exists but unused.

**Action:** Use `.breadcrumb` class. Could also create a `breadcrumb.html` template component.

### 4.7 Card Amenities Tags — MEDIUM value (6 pages → 1 component)

`text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded-md` repeated for every amenity tag on marketplace cards.

**Proposed CSS class:** `.tag` or `.card-tag`

### 4.8 Card Image Badge — MEDIUM value (6 pages → 1 component)

`absolute top-4 left-4 bg-theme-primary text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-md`

**Proposed CSS class:** `.card-badge` (already have `.theme-badge` for hero badges)

### 4.9 Rating Display — MEDIUM value (6 pages → 1 component)

`flex items-center gap-2 bg-gray-50 text-theme-primary px-2 py-1 rounded-lg text-xs font-bold` + star rating

**Proposed component:** `rating-badge.html`
- Template vars: `{{RATING}}`, `{{REVIEW_COUNT}}`

### 4.10 Price Display — MEDIUM value (6 pages → 1 component)

Design system has `.price-tag`, `.price-tag-label`, `.price-tag-value` classes but they are unused. HTML uses:
```html
<div class="text-lg font-extrabold text-sky-600">₹3,499</div>
```
or on themed pages:
```html
<div class="text-lg font-black text-theme-primary">₹3,499</div>
```

**Action:** Use `.price-tag` classes consistently.

### 4.11 Step Indicator — MEDIUM value (multiple pages)

`.step-number` class exists in design system but is unused. Steps use:
- `w-16 h-16 bg-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl font-black shadow-lg shadow-sky-600/30` (index.html)
- `w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-xs font-bold text-red-600` (how-it-works.html)
- `w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm` (index.html testimonials)

**Action:** Standardize on `.step-number` or create `.step-circle` variant.

### 4.12 Social Login Button — HIGH value (shared component)

Identical Google login button in both login and signup modals:
```html
<button id="btn-google-login" class="social-btn" onclick="layoverx.socialLogin('google')">
  <svg class="w-5 h-5" viewBox="0 0 24 24">...</svg>
  Continue with Google
</button>
```

**CSS class:** `.social-btn` exists in design system but needs review.

### 4.13 Password Toggle Button — shared between login/signup

Identical SVG eye button in both login and signup modals.

**Proposed component:** Can be extracted as a reusable pattern or CSS class.

---

## 5. Component Usage Summary

| Component | Usage Frequency | Status |
|-----------|----------------|--------|
| Navbar | 30/30 pages | ✅ Shared component (header.html) |
| Footer | 30/30 pages | ✅ Shared component (footer.html) |
| Auth modals | 30/30 pages | ✅ Shared component (auth-modals.html) |
| Breadcrumbs | ~25/30 pages | ⚠️ Repeated inline, `.breadcrumb` class defined but unused |
| Section headers | 30/30 pages | ⚠️ Repeated inline, `.section-label`/`.section-title`/`.section-subtitle` defined but mostly unused |
| Marketplace hero | 6/30 pages | 🔴 Duplicated inline, should be component |
| Inner page hero | 3/30 pages | 🔴 Duplicated inline, should be component |
| Booking step hero | 4/30 pages | 🔴 Duplicated inline, should be component |
| Filter sidebar | 6/30 pages | 🔴 Duplicated inline, should be component |
| Marketplace listing | 6/30 pages | 🔴 Duplicated inline, should be component |
| Marketplace cards | 6/30 pages | ⚠️ Similar structure, high variance in content |
| Carousel | 3 instances | ✅ Uses `.carousel-container`/`.carousel-item` CSS classes |
| Cards (`.card` CSS class) | ~2 instances | ❌ Design system class barely used, most HTML uses inline |
| Buttons (`.btn` CSS class) | ~80% of buttons | ✅ Mostly used, some inline overrides remain |
| Forms (`.form-input` CSS class) | ~80% of forms | ✅ Mostly used |
| Badges | 6/30 pages | ⚠️ Inconsistent: mix of `.theme-badge`, inline, and custom |
| Skeleton loaders | 4 pages | ⚠️ Each page different, `.skeleton` classes exist but unused |
| Step indicators | 3 pages | ⚠️ Different per page, `.step-number` class exists but unused |
| Empty states | 5 pages | 🔴 Each page has unique implementation |
| Testimonials | 1 page | ✅ `.testimonial-card` CSS class exists, now used on index.html |
| FAQ items | 2 pages | ⚠️ `.faq-item` CSS class exists, newly used on index.html |
| Toast notifications | All pages | ✅ `.toast` CSS class used via app.js |

---

## 6. Recommended New Components

| Priority | Component | Template File | Replaces |
|----------|-----------|---------------|----------|
| 🔴 Critical | `marketplace-hero.html` | `src/components/` | 6 × hero sections |
| 🔴 Critical | `marketplace-filter.html` | `src/components/` | 6 × filter sidebars |
| 🔴 Critical | `section-header.html` | `src/components/` | 30+ section headers (via CSS class usage) |
| 🟡 High | `inner-hero.html` | `src/components/` | 3 × inner page heros |
| 🟡 High | `booking-hero.html` | `src/components/` | 4 × checkout/booking heros |
| 🟡 High | `card-tag.html` | CSS only | 6 × amenity/tag styles |
| 🟡 High | `card-badge.html` | CSS only | 6 × card image badges |
| 🟡 High | `empty-state.html` | `src/components/` | 5 empty states |
| 🟢 Medium | `rating-badge.html` | `src/components/` | 6 × rating displays |
| 🟢 Medium | `timeline.html` | `src/components/` | 3 × timeline sections |
| 🟢 Medium | `skeleton-card.html` | `src/components/` | 4 × skeleton loaders |
| 🟢 Medium | `breadcrumb.html` | `src/components/` | 25+ breadcrumbs |
| ⚪ Low | `step-number.html` | CSS only | Step indicators |
| ⚪ Low | `price-tag.html` | CSS only | Price displays |
| ⚪ Low | `social-btn.html` | CSS only | Google OAuth buttons |

---

## 7. Design System CSS Class Utilization

| Class Exists | Used In HTML? | Pages |
|-------------|---------------|-------|
| `.btn` | ✅ | Most |
| `.btn-primary` | ✅ | Most |
| `.btn-secondary` | ❌ | None |
| `.btn-ghost` | ✅ | Several |
| `.btn-outline` | ✅ | Index |
| `.btn-danger` | ❌ | None |
| `.btn-sm` | ✅ | Several |
| `.btn-lg` | ❌ | None |
| `.card` | ✅ | Index (carousels) |
| `.card-hotel` | ❌ | None |
| `.card-restaurant` | ❌ | None |
| `.card-feature` | ❌ | None |
| `.card-pricing` | ❌ | None |
| `.section-label` | ❌* | Index (just fixed) |
| `.section-title` | ❌* | Index (just fixed) |
| `.section-subtitle` | ❌* | Index (just fixed) |
| `.section` | ❌* | Index (just fixed) |
| `.form-label` | ✅ | Auth, contact, checkout |
| `.form-input` | ✅ | Auth, contact, checkout |
| `.step-number` | ❌ | None |
| `.testimonial-card` | ❌* | Index (just fixed) |
| `.faq-item` | ❌* | Index (just fixed) |
| `.trust-badge` | ❌* | Index (just fixed) |
| `.theme-badge` | ✅ | Hotels hero |
| `.price-tag` | ❌ | None |
| `.skeleton` | ❌ | None |
| `.search-field` | ❌ | None |
| `.search-tab` | ✅ | Index |
| `.breadcrumb` | ❌ | None |

*Recently fixed as part of ongoing work.

**Conclusion:** ~20 CSS classes are defined but never used in HTML. The design system CSS has been built out but the pages haven't been updated to use it.
