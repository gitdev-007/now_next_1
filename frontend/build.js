#!/usr/bin/env node
/**
 * LayoverX Static Site Compiler (Node.js)
 * Drop-in replacement for build.py — generates production-ready HTML pages
 * by composing page templates with shared head/header/footer/modals components.
 *
 * Usage:
 *   node frontend/build.js          # Build all pages
 *   node frontend/build.js <file>   # Build a single page e.g. index.html
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// Always resolve relative to this script's directory (frontend/)
const BASE = __dirname;

// ─── Page Metadata ───────────────────────────────────────────────────────────

const PAGES_METADATA = {
  'index.html': {
    title:       'Mumbai Travel & Layover Experience Platform | Hotels, Restaurants, Tours & Transfers',
    description: 'Discover luxury transit hotels, authentic restaurants, spas, local city tours, and airport transfers near CSM International Airport Mumbai. Plan your perfect stopover.',
    canonical:   'https://layoverx.com/index.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelService",
  "name": "LayoverX",
  "description": "Mumbai Airport Transit Travel Marketplace",
  "url": "https://layoverx.com",
  "areaServed": {
    "@type": "City",
    "name": "Mumbai",
    "containedInPlace": {
      "@type": "Country",
      "name": "India"
    }
  },
  "provider": {
    "@type": "Organization",
    "name": "LayoverX",
    "url": "https://layoverx.com"
  }
}
</script>`
  },
  'hotels.html': {
    title:       'Transit Hotels Near Mumbai Airport (CSIA) | Hourly Day-Use Rooms & Stays',
    description: 'Book luxury and budget airport hotels near Mumbai Airport CSMIA. Offers 24/7 check-in, free terminal shuttles, pool/spa access, and day-use rooms starting from 3-hour layovers.',
    canonical:   'https://layoverx.com/hotels.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "LayoverX Transit Hotels",
  "description": "Book hourly day-use transit hotels near Chhatrapati Shivaji Maharaj International Airport Mumbai"
}
</script>`
  },
  'restaurants.html': {
    title:       'Best Restaurants Near Mumbai Airport | Authentic Local Cuisines & Lounges',
    description: 'Discover popular dining spots, local street food trails, fine dining, and transit cafes near Mumbai Airport.',
    canonical:   'https://layoverx.com/restaurants.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "LayoverX Dining Marketplace"
}
</script>`
  },
  'spa-wellness.html': {
    title:       'Airport Spa & Wellness Mumbai | Transit Massage & Relaxation',
    description: 'Refresh during your Mumbai transit with premium spa and wellness services. Express massages, full wellness circuits, and relaxation lounges near CSMIA.',
    canonical:   'https://layoverx.com/spa-wellness.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "LayoverX Spa & Wellness"
}
</script>`
  },
  'gaming-entertainment.html': {
    title:       'Gaming & Entertainment Mumbai Airport | Transit Fun & VR Zones',
    description: 'Bored during a layover? Explore high-energy gaming zones, VR hubs, luxury cinemas, and entertainment centers near Mumbai Airport.',
    canonical:   'https://layoverx.com/gaming-entertainment.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "LayoverX Gaming & Fun"
}
</script>`
  },
  'experiences.html': {
    title:       'Tours & Layover Experiences in Mumbai | Sightseeing & Culture',
    description: 'Book curated city sightseeing tours, shopping guides, and heritage walks optimized for layovers.',
    canonical:   'https://layoverx.com/experiences.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  "name": "LayoverX City Experiences"
}
</script>`
  },
  'airport-transfers.html': {
    title:       'Airport Transfers Mumbai CSMIA | Fixed Price Taxis',
    description: 'Book reliable airport pickup & drop transfers at Mumbai Airport. Fixed pricing and verified drivers.',
    canonical:   'https://layoverx.com/airport-transfers.html',
    json_ld: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "LayoverX Airport Cabs"
}
</script>`
  },
  'how-it-works.html': {
    title:       'How It Works | Exit Mumbai Airport & Transit Visas',
    description: 'Learn how to maximize your Mumbai airport layover with step-by-step guidance.',
    canonical:   'https://layoverx.com/how-it-works.html',
    json_ld:     ''
  },
  'contact.html': {
    title:       'Contact Us | LayoverX Travel Marketplace',
    description: 'Get 24/7 customer support for transit bookings near Mumbai Airport.',
    canonical:   'https://layoverx.com/contact.html',
    json_ld:     ''
  },
  'plan-my-layover.html': {
    title:       'AI Layover Itinerary Planner Mumbai | Flight Schedule Optimizer',
    description: 'Use our flagship smart planner to generate custom, time-optimized itineraries for Mumbai layovers.',
    canonical:   'https://layoverx.com/plan-my-layover.html',
    json_ld:     ''
  },
  'partner-registration.html': {
    title:       'Register as a Supplier | LayoverX Partner Program',
    description: 'Register your airport transit hotel, dining experience, spa center, tour packages, or airport transfers near CSMIA Mumbai.',
    canonical:   'https://layoverx.com/partner-registration.html',
    json_ld:     ''
  },
  'supplier-dashboard.html': {
    title:       'Supplier Dashboard | Onboarding Review Hub',
    description: 'Track your LayoverX supplier partner applications and review status updates.',
    canonical:   'https://layoverx.com/supplier-dashboard.html',
    json_ld:     ''
  },
  'service-details.html': {
    title:       'Service Details | LayoverX Premium Experience',
    description: 'Detailed view of LayoverX travel marketplace amenities, pricing, reviews, and bookings.',
    canonical:   'https://layoverx.com/service-details.html',
    json_ld:     ''
  },
  'my-itinerary.html': {
    title:       'My Layover Itinerary Workspace | LayoverX Smart Planner',
    description: 'Manage, reorder, and refine your custom transit itinerary with our AI co-pilot.',
    canonical:   'https://layoverx.com/my-itinerary.html',
    json_ld:     ''
  },
  'checkout.html': {
    title:       'Secure Checkout | Finalize Layover Experience',
    description: 'Finalize your booking details and secure payment for your transit itinerary.',
    canonical:   'https://layoverx.com/checkout.html',
    json_ld:     ''
  },
  'my-trips.html': {
    title:       'My Trips Dashboard | LayoverX Traveler Portal',
    description: 'Access your upcoming, past, and draft transit itineraries.',
    canonical:   'https://layoverx.com/my-trips.html',
    json_ld:     ''
  },
  'my-profile.html': {
    title:       'My Profile | LayoverX Traveler Portal',
    description: 'View and manage your passenger details and stopover travel preferences.',
    canonical:   'https://layoverx.com/my-profile.html',
    json_ld:     ''
  },
  'account-settings.html': {
    title:       'Account Settings | LayoverX Traveler Portal',
    description: 'Configure notifications, currency, and account preferences.',
    canonical:   'https://layoverx.com/account-settings.html',
    json_ld:     ''
  },
  'saved-itineraries.html': {
    title:       'Saved Itineraries | LayoverX Traveler Portal',
    description: 'Browse and manage your saved custom transit itineraries.',
    canonical:   'https://layoverx.com/saved-itineraries.html',
    json_ld:     ''
  },
  'trip-details.html': {
    title:       'Itinerary Details | LayoverX Traveler Portal',
    description: 'Detailed view of your saved transit schedule and services timeline.',
    canonical:   'https://layoverx.com/trip-details.html',
    json_ld:     ''
  },
  'booking-review.html': {
    title:       'Booking Review | Secure Checkout',
    description: 'Review your stopover plan and item prices before payment.',
    canonical:   'https://layoverx.com/booking-review.html',
    json_ld:     ''
  },
  'payment-selection.html': {
    title:       'Payment Selection | Secure Checkout',
    description: 'Securely choose your payment option and process booking fees.',
    canonical:   'https://layoverx.com/payment-selection.html',
    json_ld:     ''
  },
  'booking-confirmation.html': {
    title:       'Booking Confirmed | LayoverX Stopover Portal',
    description: 'Your stopover services are confirmed and flight delays are tracked.',
    canonical:   'https://layoverx.com/booking-confirmation.html',
    json_ld:     ''
  },
  'supplier-status.html': {
    title:       'Supplier Application Status | Partner Program',
    description: 'Track your onboarding registration verification progress.',
    canonical:   'https://layoverx.com/supplier-status.html',
    json_ld:     ''
  },
  'revenue-admin.html': {
    title:       'Revenue & Dynamic Pricing Admin Dashboard | LayoverX Enterprise',
    description: 'Manage pricing rules, seasonal overrides, promotional campaigns, and real-time revenue performance ledgers.',
    canonical:   'https://layoverx.com/revenue-admin.html',
    json_ld:     ''
  },
  'notifications.html': {
    title:       'Notifications Center | LayoverX Stopover Portal',
    description: 'Stay updated with chauffeur details and flight delay logs.',
    canonical:   'https://layoverx.com/notifications.html',
    json_ld:     ''
  },
  'help-center.html': {
    title:       'Transit Concierge Help Center | Airport Exits & Visas',
    description: 'Guides on customs clearance, luggage lockers, and visas.',
    canonical:   'https://layoverx.com/help-center.html',
    json_ld:     ''
  },
  'faq.html': {
    title:       'Frequently Asked Questions | LayoverX Stopover Portal',
    description: 'Common stopover questions about hours, flight delays, and refunds.',
    canonical:   'https://layoverx.com/faq.html',
    json_ld:     ''
  },
  'terms.html': {
    title:       'Terms of Service | LayoverX Stopover Portal',
    description: 'Platform terms, liability connections and cancelation policies.',
    canonical:   'https://layoverx.com/terms.html',
    json_ld:     ''
  },
  'privacy.html': {
    title:       'Privacy Policy | LayoverX Stopover Portal',
    description: 'How we protect your passport details and flight connection records.',
    canonical:   'https://layoverx.com/privacy.html',
    json_ld:     ''
  }
};

// Pages that should be hidden from search engines
const PRIVATE_PAGES = new Set([
  'checkout.html', 'booking-review.html', 'payment-selection.html',
  'booking-confirmation.html', 'my-trips.html', 'saved-itineraries.html',
  'trip-details.html', 'my-profile.html', 'account-settings.html',
  'supplier-dashboard.html', 'supplier-status.html', 'revenue-admin.html',
  'notifications.html'
]);

// Per-page body theme class
const THEME_MAP = {
  'hotels.html':              'theme-hotels',
  'restaurants.html':         'theme-restaurants',
  'spa-wellness.html':        'theme-spa',
  'gaming-entertainment.html':'theme-gaming',
  'experiences.html':         'theme-tours',
  'airport-transfers.html':   'theme-transfers'
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadComponent(name) {
  const p = path.join(BASE, '..', 'components', 'ui', `${name}.html`);
  if (!fs.existsSync(p)) {
    console.warn(`Warning: Component '${name}' not found at ${p}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
}

/**
 * Extract only the content between <body>…</body> if a full HTML document is
 * stored in pages/, otherwise return the full string as-is.
 */
function extractBodyContent(src) {
  const m = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : src;
}

// ─── Supabase env-variable injection ────────────────────────────────────────

function processSupabaseInit() {
  const jsPath = path.join(BASE, 'js', 'supabase-init.js');
  if (!fs.existsSync(jsPath)) {
    console.warn(`Warning: supabase-init.js not found at ${jsPath}`);
    return;
  }

  console.log('Processing supabase-init.js with environment variables...');
  let content = fs.readFileSync(jsPath, 'utf8');

  const url        = process.env.VITE_SUPABASE_URL;
  const anonKey    = process.env.VITE_SUPABASE_ANON_KEY;
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (url) {
    console.log(`  Injecting VITE_SUPABASE_URL: ${url}`);
    content = content.replace(
      /VITE_SUPABASE_URL:\s*["'].*?["']/,
      `VITE_SUPABASE_URL: "${url}"`
    );
  }
  if (anonKey) {
    console.log(`  Injecting VITE_SUPABASE_ANON_KEY: ${anonKey.slice(0, 10)}...`);
    content = content.replace(
      /VITE_SUPABASE_ANON_KEY:\s*["'].*?["']/,
      `VITE_SUPABASE_ANON_KEY: "${anonKey}"`
    );
  }
  if (backendUrl) {
    console.log(`  Injecting VITE_BACKEND_URL: ${backendUrl}`);
    content = content.replace(
      /VITE_BACKEND_URL:\s*["'].*?["']/,
      `VITE_BACKEND_URL: "${backendUrl}"`
    );
  }

  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('supabase-init.js processed successfully.');
}

// ─── Page compiler ───────────────────────────────────────────────────────────

function compilePage(filename) {
  const pagePath = path.join(BASE, 'pages', filename);
  if (!fs.existsSync(pagePath)) {
    console.error(`Error: Page source '${filename}' not found at ${pagePath}`);
    return;
  }

  console.log(`Compiling ${filename}...`);

  // Load shared components (re-read each time so edits are picked up)
  const headTpl   = loadComponent('head');
  const headerTpl = loadComponent('header');
  const footerTpl = loadComponent('footer');
  const modalsTpl = loadComponent('auth-modals');

  // Page body content
  const rawPage    = fs.readFileSync(pagePath, 'utf8');
  const pageContent = extractBodyContent(rawPage);

  // Resolve metadata
  const meta = PAGES_METADATA[filename] || {
    title:       'LayoverX - Mumbai Airport Layover Experience',
    description: 'Explore hotels, restaurants, tours near Mumbai Airport.',
    canonical:   `https://layoverx.com/${filename}`,
    json_ld:     ''
  };

  // ── Head substitutions ────────────────────────────────────────────────────
  const robotsTag = PRIVATE_PAGES.has(filename)
    ? '<meta name="robots" content="noindex, nofollow">'
    : '<meta name="robots" content="index, follow">';

  let headCompiled = headTpl
    .replace(/\{\{TITLE\}\}/g,       meta.title)
    .replace(/\{\{DESCRIPTION\}\}/g, meta.description)
    .replace(/\{\{CANONICAL\}\}/g,   meta.canonical)
    .replace(/\{\{JSON_LD\}\}/g,     meta.json_ld)
    .replace(/\{\{ROBOTS\}\}/g,      robotsTag);

  // ── Header substitutions (active nav links) ───────────────────────────────
  const active   = 'active-nav-link';
  const inactive = '';

  let headerCompiled = headerTpl
    .replace(/\{\{ACTIVE_HOTELS\}\}/g,      filename === 'hotels.html'              ? active : inactive)
    .replace(/\{\{ACTIVE_RESTAURANTS\}\}/g, filename === 'restaurants.html'         ? active : inactive)
    .replace(/\{\{ACTIVE_SPA\}\}/g,         filename === 'spa-wellness.html'         ? active : inactive)
    .replace(/\{\{ACTIVE_GAMING\}\}/g,      filename === 'gaming-entertainment.html' ? active : inactive)
    .replace(/\{\{ACTIVE_EXPERIENCES\}\}/g, filename === 'experiences.html'          ? active : inactive)
    .replace(/\{\{ACTIVE_TRANSFERS\}\}/g,   filename === 'airport-transfers.html'    ? active : inactive)
    .replace(/\{\{ACTIVE_HOW_IT_WORKS\}\}/g,filename === 'how-it-works.html'         ? active : inactive)
    .replace(/\{\{ACTIVE_CONTACT\}\}/g,     filename === 'contact.html'              ? active : inactive)
    .replace(/\{\{PLAN_MY_LAYOVER_CLASS\}\}/g,
      filename === 'plan-my-layover.html'
        ? 'plan-my-layover-btn active'
        : 'plan-my-layover-btn'
    );

  // ── Theme class on <body> ─────────────────────────────────────────────────
  const themeClass = THEME_MAP[filename] || '';

  // ── Assemble final HTML ───────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
${headCompiled}
<body class="overflow-x-hidden bg-surface ${themeClass}">

  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1001] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg">Skip to main content</a>

  <!-- Header Section -->
  ${headerCompiled}

  <!-- Page Content -->
  <main id="main">
    ${pageContent}
  </main>

  <!-- Footer Section -->
  ${footerTpl}

  <!-- Modals Section -->
  ${modalsTpl}

</body>
</html>
`;

  const outPath = path.join(BASE, filename);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  → ${outPath}`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

function buildAll() {
  // Ensure required directories exist in build target
  ['css', 'js', 'styles/tokens'].forEach(dir => {
    fs.mkdirSync(path.join(BASE, dir), { recursive: true });
  });

  // Copy design system and tokens CSS files
  try {
    const dsSrc = path.join(BASE, '..', 'design-system', 'index.css');
    const dsDst = path.join(BASE, 'css', 'design-system.css');
    if (fs.existsSync(dsSrc)) {
      fs.copyFileSync(dsSrc, dsDst);
      console.log(`Copied design system CSS to ${dsDst}`);
    }
    
    const tokenSrc = path.join(BASE, '..', 'styles', 'tokens', 'tokens.css');
    const tokenDst = path.join(BASE, 'styles', 'tokens', 'tokens.css');
    if (fs.existsSync(tokenSrc)) {
      fs.copyFileSync(tokenSrc, tokenDst);
      console.log(`Copied design tokens CSS to ${tokenDst}`);
    }
  } catch (e) {
    console.error('Error copying design system files:', e);
  }

  processSupabaseInit();

  const pages = Object.keys(PAGES_METADATA);
  pages.forEach(compilePage);

  console.log(`\nBuild complete! ${pages.length} pages generated.`);
}

// Allow running a single page: node build.js contact.html
const arg = process.argv[2];
if (arg) {
  processSupabaseInit();
  compilePage(arg);
} else {
  buildAll();
}
