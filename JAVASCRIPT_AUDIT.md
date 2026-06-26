# JavaScript Audit Report — LayoverX

**Date:** June 25, 2026
**Scope:** All JavaScript files (project source, not node_modules)

---

## 1. JS File Inventory

### Frontend (Client-Side)

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `app.js` | `frontend/js/` | **5,599** | Main application: auth, modals, marketplace filters, planner, pricing, checkout, map, analytics, error logging |
| `firebase-config.js` | `frontend/js/` | 23 | Firebase SDK config (API keys, project ID) |
| `supabase-init.js` | `frontend/js/` | 153 | Supabase client init + env variable injection |
| `map-config.js` | `frontend/js/` | 3 | Leaflet map center coordinates |

### Backend (Server-Side)

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `index.js` | `backend/functions/` | 751 | Cloud functions: inventory lock, payments (Razorpay + Stripe), partner registration, flight delay checker, contact form |
| `admin_approval.js` | `backend/functions/` | 267 | Admin partner approval/rejection endpoints |
| `server.js` | `backend/functions/` | 196 | Express server: auth routes, API route mapping, middleware |
| `notificationService.js` | `backend/functions/services/` | 67 | Email + SMS notification dispatch |
| `flightProvider.js` | `backend/functions/services/` | 256 | Flight status API (FlightAware, AviationEdge, mock fallback) |
| `emailService.js` | `backend/functions/services/` | 62 | Resend email client singleton |

### Build & Utility Scripts

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `build.js` | `frontend/` | 480 | Static site compiler: page templates + components → HTML |
| `upgrade_pages.js` | root | 165 | Batch page upgrade tool |
| `update_pages.js` | root | 72 | Batch page content updater |
| `cta-fix.js` | root | 38 | CTA button fix script |
| `fix_networkidle.js` | root | 28 | Playwright networkidle fix |
| `update_artifacts_dir.js` | root | 27 | Test artifacts directory updater |
| `update_test_port.js` | root | 23 | Test port config updater |

### Audit & Test Scripts

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `supplier_onboarding.js` | `audit_tools/` | 415 | Playwright supplier registration flow test |
| `marketplace_regression.js` | `audit_tools/` | 315 | Playwright marketplace regression test |
| `qa_verification.js` | `audit_tools/` | 283 | Playwright QA verification crawl |
| `deep_audit.js` | `audit_tools/` | 169 | Playwright deep DOM audit |
| `test_google_auth.js` | `audit_tools/` | 106 | Google auth test |
| `full_audit.js` | `audit_tools/` | 83 | Playwright full site audit |
| `check-overflow.js` | `audit_tools/` | 62 | Playwright overflow detection |
| `contact_screenshot.js` | `audit_tools/` | 41 | Contact page screenshot |
| `check-computed.js` | `audit_tools/` | 38 | Computed styles checker |

**Total: 26 files, ~10,121 lines**

---

## 2. Duplicate Code

### Critical: `app.js` — `initHomepageSearch` Defined Twice

| Location | Lines | Description |
|----------|-------|-------------|
| 1st definition | 2433–2504 (72 lines) | Reads search params from localStorage, uses `updateDuration` for live duration display |
| 2nd definition | 5466–5558 (93 lines) | Sets hardcoded defaults (t+3h, t+9h), uses `updateLayoverDuration` with 5h safety buffer, different URL construction |

The 2nd definition **silently overrides** the 1st at runtime. Both are registered via `DOMContentLoaded` at line 5589, but only the 2nd executes. The 1st is dead code.

### Critical: `app.js` — `initCarousel` / `initCarouselArrows` Overlap

| Function | Line | Purpose |
|----------|------|---------|
| `initCarousel` | 2507 | Sets up 3 carousels (services, experiences, planner) with scroll/keyboard/button handlers |
| `initCarouselArrows` | 5561 | Re-binds arrow buttons for services and experiences carousels |

`initCarouselArrows` partially duplicates work already done by `initCarousel`. Both are called at DOMContentLoaded (lines 5587 and 5590).

### Backend: Copy-Pasted Utility Functions

| Function | `index.js` | `admin_approval.js` | `notificationService.js` |
|----------|-----------|---------------------|-------------------------|
| `getSupabaseClient()` | lines 13–20 | lines 7–14 | lines 9–16 |
| `sanitizeLogContent()` | lines 22–34 | lines 16–28 | — |
| `logToErrorLogs()` | lines 36–55 | lines 30–49 | — |

All three files define **identical** `getSupabaseClient()` singleton pattern. `sanitizeLogContent()` is copy-pasted verbatim. `logToErrorLogs()` differs only in the console prefix string.

### Backend: Auth Middleware Duplication

| File | Function | Pattern |
|------|----------|---------|
| `admin_approval.js:56` | `authenticateRequest(req, res)` | Returns boolean |
| `server.js:38` | `authenticateRequestJWT(req, res, next)` | Express `next()` middleware |

Both call `supabase.auth.getUser(token)` with identical logic but different return styles.

### Backend: Payment Validation Duplication

`createPaymentIntent` (line 176) and `createRazorpayOrder` (line 267) in `index.js` both iterate `cartItems`, query `services` by `serviceId`, and sum `price * quantity`. The cart validation logic is nearly identical.

---

## 3. Large Files

| File | Lines | Risk |
|------|-------|------|
| `frontend/js/app.js` | **5,599** | Monolith — 98 functions, 15 async, ~48 event listeners, 22+ localStorage keys, handles auth/modals/filters/planner/pricing/checkout/map/analytics |
| `backend/functions/index.js` | **751** | Mixed concerns — payments, inventory, partner registration, flight delays, contact form |
| `audit_tools/supplier_onboarding.js` | 415 | Test-only, acceptable |
| `backend/functions/admin_approval.js` | 267 | Acceptable |
| `audit_tools/marketplace_regression.js` | 315 | Test-only, acceptable |

**`app.js` at 5,599 lines is the primary concern.** It handles 12+ distinct domains in a single file with no module system.

---

## 4. Inline Scripts

### Source Pages (`frontend/src/pages/`)

| Page | Lines | Script Size | Content |
|------|-------|-------------|---------|
| `revenue-admin.html` | 425–1115 | **691 lines** | Full revenue dashboard: stats, ledger, pricing rules, coupons, payouts, Chart.js charts, financial report download |
| `partner-registration.html` | 398–668 | 271 lines | 6-step onboarding wizard with file upload, validation, Firestore submission |
| `payment-selection.html` | 111–392 | 282 lines | Payment processing, transaction recording, revenue ledger, vendor payouts, booking ID generation |
| `supplier-dashboard.html` | 210–460 | 251 lines | Supplier dashboard: auth monitoring, application fetch, status badges, timeline |
| `trip-details.html` | 104–278 | 175 lines | Trip detail rendering, cost breakdown, visual timeline |
| `saved-itineraries.html` | 44–225 | 182 lines | Saved plans CRUD, load-into-planner reconstruction |
| `booking-review.html` | 87–203 | 117 lines | Coupon system, itinerary review with price calculation |
| `supplier-status.html` | 71–149 | 79 lines | Supplier application status display |
| `booking-confirmation.html` | 78–114 | 37 lines | Booking confirmation details from localStorage |
| `checkout.html` | 127–141 | 15 lines | Form save + redirect |
| `my-profile.html` | 104–116 | 13 lines | User profile population |
| `notifications.html` | 65–78 | 14 lines | Clear all notifications |

### Compiled Pages (`frontend/*.html`)

Every compiled page contains a **~350-line Firebase/Supabase compatibility shim** (the `head.html` component at lines 87–437). This is identical across all 30 pages and provides:
- `mockAuth` (onAuthStateChanged, createUser, signIn, signOut)
- `mockDb` (collection/doc/set/get/where)
- `mockStorage` (ref/child/put/getDownloadURL)
- Full `window.supabase` mock (auth, from table operations)

---

## 5. Global Scripts

### `window.layoverx` Namespace (app.js)

The primary global namespace with **~55 properties**:

| Category | Properties |
|----------|-----------|
| **Toast** | `showToast` |
| **Filters** | `resetFilters`, `filterCuisine`, `clearRestFilters`, `filterExp`, `clearExpFilters`, `filterSpa`, `clearSpaFilters`, `filterGaming`, `clearGamingFilters`, `clearCabFilters` |
| **Detail Modals** | `openHotelDetail`, `closeHotelDetail`, `bookHotel`, `openHotelBooking`, `closeHotelBooking`, `confirmHotelBooking`, `openRestDetail`, `closeRestDetail`, `reserveRest`, `openExpDetail`, `closeExpDetail`, `openSpaDetail`, `closeSpaDetail`, `openGamingDetail`, `closeGamingDetail`, `bookExp`, `bookSpa`, `bookGaming`, `bookCab` |
| **Itinerary** | `moveItineraryItem`, `removeItineraryItem`, `updateItemDuration`, `addToItinerary`, `reorderWorkspaceItem`, `removeWorkspaceItem`, `updateWorkspaceItemDuration` |
| **Plans** | `saveCurrentPlan`, `shareCurrentPlan`, `duplicatePlan`, `sharePlan`, `viewPlanDetails`, `loadPlan`, `deletePlan` |
| **Auth Modals** | `openModal`, `closeModal`, `switchModal`, `logout`, `socialLogin`, `togglePassword`, `handleLogin`, `handleSignup`, `checkPasswordStrength`, `handleForgot` |
| **Pricing** | `calculateItineraryPrice`, `calculateContextDuration`, `handleTripContextSubmit` |
| **Workspace** | `saveItineraryDraft`, `loadWorkspaceDraft`, `duplicateItineraryDraft`, `switchExperienceTab`, `savePlannerToItinerary` |
| **Checkout** | `proceedToCheckout`, `handleCheckoutSubmit`, `checkAndCreateLock`, `startCountdownTimer`, `restartCheckout`, `getRemainingTime`, `broadcastCheckoutEvent` |
| **Trips** | `deleteDraftTrips`, `openTripReceipt`, `switchTripsTab` |
| **AI** | `improvePlanWithAi`, `handleAiCopilotSubmit`, `openAiCopilot` |
| **Map** | `initializeTransitMap` |
| **Error** | `logError` |

### Other Globals

| Global | File | Purpose |
|--------|------|---------|
| `window.showToast` | app.js:671 | Alias for `layoverx.showToast` |
| `window.openAuthModal` | app.js:2291 | Alias for `layoverx.openModal` |
| `window.closeAuthModal` | app.js:2292 | Alias for `layoverx.closeModal` |
| `window.layoverxAnalytics` | app.js:5364 | Analytics tracker |
| `window.firebase` | head.html:89 | Firebase compat shim mock |
| `window.supabase` | head.html:305 | Supabase client mock |
| `window.layoverxAuth` | head.html:301 | Auth bridge |
| `window.layoverxDb` | head.html:302 | Database bridge |
| `window.layoverxStorage` | head.html:303 | Storage bridge |
| `global.supabase` | server.js:29 | Server-side Supabase singleton |

---

## 6. Shared Utilities

### Frontend

| Utility | Location | Used By |
|---------|----------|---------|
| `$` (querySelector) | app.js:32 | Throughout app.js |
| `$$` (querySelectorAll) | app.js:33 | Throughout app.js |
| `on` (addEventListener shorthand) | app.js:35 | Throughout app.js |
| `toLocalISO` | app.js:38 | Date formatting |
| `sanitizeLogContent` | app.js:5366 | Error logging |
| `formatTime` | app.js:1684 | Planner timeline |

### Backend

| Utility | Files | Issue |
|---------|-------|-------|
| `getSupabaseClient()` | index.js:13, admin_approval.js:7, notificationService.js:9 | **Duplicated 3×** — should be a shared module |
| `sanitizeLogContent()` | index.js:22, admin_approval.js:16 | **Duplicated 2×** — identical logic |
| `logToErrorLogs()` | index.js:36, admin_approval.js:30 | **Duplicated 2×** — differs only in prefix string |

---

## 7. Authentication Scripts

### Frontend Auth Flow

| Component | File | Lines | Mechanism |
|-----------|------|-------|-----------|
| Auth object | app.js | 417–537 | `Auth.init()`, `Auth.login()`, `Auth.signup()`, `Auth.logout()`, `Auth.updateUI()` |
| Auth modal triggers | app.js | 2290–2430 | `handleLogin`, `handleSignup`, `handleForgot`, `socialLogin`, `togglePassword`, `checkPasswordStrength` |
| Firebase/Supabase shim | head.html | 87–437 | Mock `window.layoverxAuth`, `window.supabase.auth`, `window.firebase` |
| Supabase init | supabase-init.js | 1–153 | Real Supabase client creation with env vars |
| Firebase config | firebase-config.js | 1–23 | Firebase SDK configuration |

### Backend Auth Flow

| Component | File | Lines | Mechanism |
|-----------|------|-------|-----------|
| JWT middleware | server.js | 38–55 | `authenticateRequestJWT` — Express middleware |
| Admin auth | admin_approval.js | 56–86 | `authenticateRequest` + `verifyAdmin` — boolean return |
| Auth routes | server.js | 77–130 | `/api/auth/signup`, `/login`, `/logout`, `/reset` via Supabase |
| Supabase client | server.js | 29 | `global.supabase` singleton |

### Auth Data Flow

```
Browser → head.html shim (mock) → app.js Auth object → window.supabase.auth
                                                            ↓
Backend ← server.js JWT middleware → supabase.auth.getUser(token)
```

---

## 8. Event Listeners

### app.js — All Event Registrations

| Line | Event | Target | Handler |
|------|-------|--------|---------|
| 421 | `onAuthStateChange` | `window.supabase.auth` | Anonymous (auth state) |
| 634 | `hashchange` | `window` | `checkHash` |
| 694 | `scroll` | `window` | `handleScroll` (navbar) |
| 703 | `click` | `#menu-btn` | Anonymous (mobile menu) |
| 712 | `click` | `document` | Anonymous (user dropdown close) |
| 737 | `keydown` | `document` | Anonymous (Escape → modal close) |
| 742 | `click` | `document` | Anonymous (modal overlay close) |
| 844 | `submit` | `#hotel-search-form` | Anonymous |
| 882 | `change` | `input[name^="filter-"]` | `applyFilters` |
| 885 | `click` | `#clear-filters` | Anonymous |
| 904 | `change` | `#hotel-sort` | Anonymous |
| 1001 | `change` | `input[name^="rest-"]` | `applyRestFilters` |
| 1074 | `change` | `input[name^="exp-"]` | `applyExpFilters` |
| 1132 | `change` | `input[name="spa-duration"]` | `applySpaFilters` |
| 1188 | `change` | `input[name="gaming-intensity"]` | `applyGamingFilters` |
| 1228 | `change` | `input[name="cab-type"], input[name="cab-capacity"]` | `applyCabFilters` |
| 1239 | `submit` | `#transfer-search-form` | Anonymous |
| 1590 | `change` | `#plan-hotels-options input[type="checkbox"]` | Anonymous |
| 1604 | `change` | `#plan-dining-options input[type="checkbox"]` | Anonymous |
| 1618 | `change` | `#plan-activities-options input[type="checkbox"]` | Anonymous |
| 1639 | `change` | `#plan-spa-options input[type="checkbox"]` | Anonymous |
| 1654 | `change` | `#plan-gaming-options input[type="checkbox"]` | Anonymous |
| 1669 | `change` | `input[name="plan-cab"]` | Anonymous |
| 1675–1678 | `input`/`change` | `#plan-arrival`, `#plan-departure`, `#plan-location`, `#plan-travelers` | Anonymous |
| 2515 | `click` | Prev carousel button | Anonymous |
| 2519 | `click` | Next carousel button | Anonymous |
| 2528 | `scroll` | Carousel container | `updateButtons` |
| 2529 | `resize` | `window` | `updateButtons` |
| 2534 | `keydown` | Carousel | Anonymous (arrow keys) |
| 2547 | `error` | `document` (capture) | Anonymous (img fallback) |
| 3788 | `onAuthStateChange` | `window.supabase.auth` | Anonymous (checkout auth) |
| 4695 | `onchange` | `#workspace-drafts-select` | Anonymous |
| 5009 | `storage` | `window` | Anonymous (cross-tab sync) |
| 5433 | `error` | `window` | `logErrorToStorage` |
| 5437 | `unhandledrejection` | `window` | `logErrorToStorage` |
| 5514–5517 | `change`/`input` | arrival/departure inputs | `updateLayoverDuration` |
| 5521 | `click` | Search button | Anonymous |
| 5570–5571 | `click` | Carousel arrow buttons | Anonymous |
| 5578 | `scroll` | Carousel | `updateArrows` |
| 5587–5590 | `DOMContentLoaded` | `document` | `init`, `initReveal`, `initHomepageSearch`, `initCarouselArrows` |

**Total: ~48 distinct event registrations**

### Inline Scripts — Event Listeners

| Page | Event | Target |
|------|-------|--------|
| checkout.html | `submit` | Form (`saveDetailsAndContinue`) |
| my-profile.html | `DOMContentLoaded` | Document (profile population) |
| booking-confirmation.html | `DOMContentLoaded` | Document (load confirmation) |
| booking-review.html | `DOMContentLoaded` | Document (load review) |
| payment-selection.html | `DOMContentLoaded` + various | Document + payment form elements |
| supplier-status.html | `DOMContentLoaded` | Document (load status) |
| supplier-dashboard.html | `DOMContentLoaded` + auth | Document + `onAuthStateChange` |
| partner-registration.html | Multiple step buttons | Wizard step navigation |
| revenue-admin.html | Multiple tabs/buttons | Dashboard tab switching |

---

## 9. localStorage Key Map

### 22 Unique Keys Used by app.js

| Key | Read | Write | Remove | Purpose |
|-----|------|-------|--------|---------|
| `layoverx_search_params` | 13× | 6× | — | Search form state |
| `layoverx_current_itinerary` | 9× | 6× | 2× | Active itinerary items |
| `layoverx_saved_plans` | 8× | 4× | — | Saved itinerary plans |
| `layoverx_completed_trips` | 2× | 2× | — | Completed booking history |
| `layoverx_base_prices` | 2× | 1× | — | Pricing configuration |
| `layoverx_pricing_settings` | 4× | 1× | — | Pricing multiplier settings |
| `layoverx_seasonal_pricing` | 2× | 1× | — | Seasonal pricing rules |
| `layoverx_demand_settings` | 2× | 1× | — | Demand multiplier config |
| `layoverx_coupons` | 2× | 1× | — | Coupon codes |
| `layoverx_discounts` | 1× | 1× | — | Discount rules |
| `layoverx_commissions` | 1× | 1× | — | Commission rates |
| `layoverx_pricing_history` | 1× | 1× | — | Price change log |
| `layoverx_revenue_transactions` | 1× | 1× | — | Revenue ledger |
| `layoverx_vendor_payouts` | 1× | 1× | — | Vendor payout records |
| `layoverx_financial_reports` | 1× | 1× | — | Generated reports |
| `layoverx_temp_booking` | 1× | 1× | — | Checkout form data |
| `layoverx_passenger_name` | 2× | 1× | — | Passenger name |
| `layoverx_passport_number` | 2× | 1× | — | Passport number |
| `layoverx_flight_number` | 2× | 1× | — | Flight number |
| `layoverx_emergency_contact` | 2× | 1× | — | Emergency contact |
| `layoverx_lock_*` (3 keys) | 6× | 4× | 4× | Inventory lock state |
| `layoverx_analytics_events` | 1× | 1× | — | Analytics event log |
| `layoverx_error_logs` | 2× | 1× | — | Client-side error logs |
| `layoverx_checkout_event` | — | 1× | — | Cross-tab checkout sync |

### Inline Scripts — Additional Keys

| Key | File |
|-----|------|
| `layoverx_completed_trips` | booking-confirmation.html |
| `layoverx_current_itinerary` | booking-review.html, payment-selection.html |
| `layoverx_active_calculation` | booking-review.html, payment-selection.html |
| `layoverx_revenue_transactions` | payment-selection.html |
| `layoverx_vendor_payouts` | payment-selection.html |
| `layoverx_completed_trips` | payment-selection.html |
| `layoverx_coupons` | booking-review.html, revenue-admin.html |

---

## 10. Summary of Issues

### Critical

1. **`app.js` is a 5,599-line monolith** — 98 functions, 12+ domains, no module system. Every page loads all code regardless of need.
2. **`initHomepageSearch` defined twice** (lines 2433 and 5466) — 2nd silently overrides 1st, 1st is dead code.
3. **Backend utility functions duplicated 3×** — `getSupabaseClient()`, `sanitizeLogContent()`, `logToErrorLogs()` copy-pasted across index.js, admin_approval.js, notificationService.js.
4. **~350-line Firebase/Supabase shim inlined in every compiled page** — identical across all 30 pages, should be a shared JS file.

### High

5. **`initCarousel` / `initCarouselArrows` overlap** — both bind arrow buttons to the same carousels.
6. **691-line inline script in revenue-admin.html** — largest inline script, handles entire dashboard.
7. **282-line inline script in payment-selection.html** — payment processing, transaction recording, revenue ledger.
8. **271-line inline script in partner-registration.html** — 6-step wizard with file upload.
9. **Auth middleware duplicated** — `authenticateRequest` (admin_approval.js) vs `authenticateRequestJWT` (server.js) with identical logic.
10. **Payment cart validation duplicated** — `createPaymentIntent` and `createRazorpayOrder` repeat identical item iteration.

### Medium

11. **22+ unique localStorage keys** — no abstraction layer, raw `getItem`/`setItem` scattered throughout.
12. **~48 event listeners in app.js** — many anonymous, no cleanup or teardown pattern.
13. **15 async functions** — mixed async/await and promise chains.
14. **2 `fetch()` call sites** — one for backend API, one for OpenRouteService, no shared HTTP client.
15. **Mixed handler signatures in backend** — Cloud Functions `(data, context)` style mixed with Express `(req, res)` style.

### Low

16. **Root-level utility scripts** (6 files) — one-off migration/fix scripts, should be archived or removed.
17. **`firebase-config.js` (23 lines)** — minimal config, could be inlined or merged with supabase-init.js.
18. **`map-config.js` (3 lines)** — just coordinates, could be inlined.
19. **No error boundaries** — frontend errors caught by `window.onerror` but no React-style error boundaries.
20. **No code splitting** — all 5,599 lines of app.js load on every page.
