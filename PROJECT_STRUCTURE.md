# Project Structure — LayoverX

## 1. Folder Tree

```
now_next/
├── backend/
│   └── functions/
│       ├── .env
│       ├── admin_approval.js
│       ├── firestore.rules
│       ├── index.js
│       ├── package.json
│       ├── package-lock.json
│       ├── server.js
│       └── services/
│           ├── emailService.js
│           ├── flightProvider.js
│           └── notificationService.js
├── components/
│   └── ui/
│       ├── auth-modals.html
│       ├── footer.html
│       ├── head.html
│       └── header.html
├── design-system/
│   └── index.css
├── docs/
│   ├── PRICING_REVENUE_DOCS.md
│   └── PROJECT_REVENUE_MODEL.txt
├── frontend/
│   ├── assets/
│   │   └── photos/
│   │       └── homepage.png
│   ├── css/
│   │   ├── design-system.css
│   │   ├── tailwind.css
│   │   ├── tailwind.min.css
│   │   └── tailwind-input.css
│   ├── js/
│   │   ├── app.js
│   │   ├── firebase-config.js
│   │   ├── map-config.js
│   │   └── supabase-init.js
│   ├── pages/              (source pages — 30 files)
│   │   ├── account-settings.html
│   │   ├── airport-transfers.html
│   │   ├── booking-confirmation.html
│   │   ├── booking-review.html
│   │   ├── checkout.html
│   │   ├── contact.html
│   │   ├── experiences.html
│   │   ├── faq.html
│   │   ├── gaming-entertainment.html
│   │   ├── help-center.html
│   │   ├── hotels.html
│   │   ├── how-it-works.html
│   │   ├── index.html
│   │   ├── my-itinerary.html
│   │   ├── my-profile.html
│   │   ├── my-trips.html
│   │   ├── notifications.html
│   │   ├── partner-registration.html
│   │   ├── payment-selection.html
│   │   ├── plan-my-layover.html
│   │   ├── privacy.html
│   │   ├── restaurants.html
│   │   ├── revenue-admin.html
│   │   ├── saved-itineraries.html
│   │   ├── service-details.html
│   │   ├── spa-wellness.html
│   │   ├── supplier-dashboard.html
│   │   ├── supplier-status.html
│   │   ├── terms.html
│   │   └── trip-details.html
│   ├── src/
│   │   ├── components/     (source components — 4 files)
│   │   │   ├── auth-modals.html
│   │   │   ├── footer.html
│   │   │   ├── head.html
│   │   │   └── header.html
│   │   └── pages/          (source pages — 30 files)
│   │       ├── account-settings.html
│   │       ├── airport-transfers.html
│   │       ├── booking-confirmation.html
│   │       ├── booking-review.html
│   │       ├── checkout.html
│   │       ├── contact.html
│   │       ├── experiences.html
│   │       ├── faq.html
│   │       ├── gaming-entertainment.html
│   │       ├── help-center.html
│   │       ├── hotels.html
│   │       ├── how-it-works.html
│   │       ├── index.html
│   │       ├── my-itinerary.html
│   │       ├── my-profile.html
│   │       ├── my-trips.html
│   │       ├── notifications.html
│   │       ├── partner-registration.html
│   │       ├── payment-selection.html
│   │       ├── plan-my-layover.html
│   │       ├── privacy.html
│   │       ├── restaurants.html
│   │       ├── revenue-admin.html
│   │       ├── saved-itineraries.html
│   │       ├── service-details.html
│   │       ├── spa-wellness.html
│   │       ├── supplier-dashboard.html
│   │       ├── supplier-status.html
│   │       ├── terms.html
│   │       └── trip-details.html
│   ├── styles/
│   │   └── tokens/
│   │       └── tokens.css
│   ├── index.html          (compiled output)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── build.js
│   ├── build.py
│   └── *.html              (30 compiled output files)
├── pages/                  (root-level pages — 30 files)
│   ├── account-settings.html
│   ├── airport-transfers.html
│   ├── booking-confirmation.html
│   ├── booking-review.html
│   ├── checkout.html
│   ├── contact.html
│   ├── experiences.html
│   ├── faq.html
│   ├── gaming-entertainment.html
│   ├── help-center.html
│   ├── hotels.html
│   ├── how-it-works.html
│   ├── index.html
│   ├── my-itinerary.html
│   ├── my-profile.html
│   ├── my-trips.html
│   ├── notifications.html
│   ├── partner-registration.html
│   ├── payment-selection.html
│   ├── plan-my-layover.html
│   ├── privacy.html
│   ├── restaurants.html
│   ├── revenue-admin.html
│   ├── saved-itineraries.html
│   ├── service-details.html
│   ├── spa-wellness.html
│   ├── supplier-dashboard.html
│   ├── supplier-status.html
│   ├── terms.html
│   └── trip-details.html
├── styles/
│   └── tokens/
│       └── tokens.css
├── audit_tools/
│   ├── full_audit.js
│   ├── deep_audit.js
│   ├── marketplace_regression.js
│   └── qa_verification.js
├── cta-fix.js
├── fix_networkidle.js
├── update_artifacts_dir.js
├── update_pages.js
├── update_test_port.js
├── upgrade_pages.js
├── package.json
├── package-lock.json
├── tailwind-input.css
├── vercel.json
├── README.md
├── possible_cases.txt
└── summary.txt
```

## 2. HTML Pages

| Page | frontend/pages/ (source) | frontend/src/pages/ (source) | frontend/ (compiled) | pages/ (root) |
|------|:---:|:---:|:---:|:---:|
| index | ✓ | ✓ | ✓ | ✓ |
| hotels | ✓ | ✓ | ✓ | ✓ |
| experiences | ✓ | ✓ | ✓ | ✓ |
| restaurants | ✓ | ✓ | ✓ | ✓ |
| spa-wellness | ✓ | ✓ | ✓ | ✓ |
| plan-my-layover | ✓ | ✓ | ✓ | ✓ |
| checkout | ✓ | ✓ | ✓ | ✓ |
| booking-review | ✓ | ✓ | ✓ | ✓ |
| booking-confirmation | ✓ | ✓ | ✓ | ✓ |
| my-itinerary | ✓ | ✓ | ✓ | ✓ |
| my-trips | ✓ | ✓ | ✓ | ✓ |
| my-profile | ✓ | ✓ | ✓ | ✓ |
| saved-itineraries | ✓ | ✓ | ✓ | ✓ |
| trip-details | ✓ | ✓ | ✓ | ✓ |
| payment-selection | ✓ | ✓ | ✓ | ✓ |
| airport-transfers | ✓ | ✓ | ✓ | ✓ |
| service-details | ✓ | ✓ | ✓ | ✓ |
| partner-registration | ✓ | ✓ | ✓ | ✓ |
| supplier-dashboard | ✓ | ✓ | ✓ | ✓ |
| supplier-status | ✓ | ✓ | ✓ | ✓ |
| revenue-admin | ✓ | ✓ | ✓ | ✓ |
| account-settings | ✓ | ✓ | ✓ | ✓ |
| notifications | ✓ | ✓ | ✓ | ✓ |
| contact | ✓ | ✓ | ✓ | ✓ |
| faq | ✓ | ✓ | ✓ | ✓ |
| help-center | ✓ | ✓ | ✓ | ✓ |
| how-it-works | ✓ | ✓ | ✓ | ✓ |
| privacy | ✓ | ✓ | ✓ | ✓ |
| terms | ✓ | ✓ | ✓ | ✓ |
| gaming-entertainment | ✓ | ✓ | ✓ | ✓ |

**Total: 30 pages × 4 locations = 120 HTML files**

## 3. CSS Files

| File | Location |
|------|----------|
| tailwind.min.css | frontend/css/ |
| tailwind.css | frontend/css/ |
| tailwind-input.css | frontend/css/ |
| design-system.css | frontend/css/ |
| index.css | design-system/ |
| tokens.css | frontend/styles/tokens/ |
| tokens.css | styles/tokens/ |
| tailwind-input.css | root |

## 4. JavaScript Files

| File | Location | Purpose |
|------|----------|---------|
| app.js | frontend/js/ | Main application logic |
| firebase-config.js | frontend/js/ | Firebase configuration |
| supabase-init.js | frontend/js/ | Supabase initialization |
| map-config.js | frontend/js/ | Map configuration |
| cta-fix.js | root | CTA fix utility |
| fix_networkidle.js | root | Network idle fix |
| update_pages.js | root | Page updater |
| update_artifacts_dir.js | root | Artifacts dir updater |
| update_test_port.js | root | Test port updater |
| upgrade_pages.js | root | Page upgrader |
| build.js | frontend/ | Build script (Node) |
| build.py | frontend/ | Build script (Python) |

## 5. Assets

| Asset | Location |
|-------|----------|
| homepage.png | frontend/assets/photos/ |

## 6. Components

| Component | Location |
|-----------|----------|
| head.html | components/ui/, frontend/src/components/ |
| header.html | components/ui/, frontend/src/components/ |
| footer.html | components/ui/, frontend/src/components/ |
| auth-modals.html | components/ui/, frontend/src/components/ |

## 7. Build Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| build.js | frontend/ | Node.js build script (compiles src → output) |
| build.py | frontend/ | Python build script (compiles pages → output) |
| vercel.json | root | Deployment configuration |

## 8. Vendor / Third-Party

| Library | Location |
|---------|----------|
| Tailwind CSS v4.3.1 | frontend/css/tailwind.min.css |
| Firebase | frontend/js/firebase-config.js |
| Supabase | frontend/js/supabase-init.js |
| Leaflet | frontend/js/map-config.js |

## 9. Root-Level Utility Scripts

| File | Purpose |
|------|---------|
| cta-fix.js | CTA button fixer |
| fix_networkidle.js | Network idle handler |
| update_pages.js | Page class updater |
| update_artifacts_dir.js | Artifacts directory updater |
| update_test_port.js | Test port updater |
| upgrade_pages.js | Page upgrade utility |

## 10. Configuration Files

| File | Purpose |
|------|---------|
| package.json | Node dependencies |
| package-lock.json | Dependency lock |
| vercel.json | Vercel deployment |
| .env | Environment variables |
| robots.txt | SEO |
| sitemap.xml | SEO |
