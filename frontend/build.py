#!/usr/bin/env python3
"""
LayoverX Static Site Compiler
Generates production-ready, high-fidelity travel marketplace pages.
"""

import os

BASE = 'frontend'

# Ensure directories exist
os.makedirs(f'{BASE}/pages', exist_ok=True)
os.makedirs(f'{BASE}/components', exist_ok=True)
os.makedirs(f'{BASE}/css', exist_ok=True)
os.makedirs(f'{BASE}/js', exist_ok=True)

# Page Metadata definition
PAGES_METADATA = {
    'index.html': {
        'title': 'Mumbai Travel & Layover Experience Platform | Hotels, Restaurants, Tours & Transfers',
        'description': 'Discover luxury transit hotels, authentic restaurants, spas, local city tours, and airport transfers near CSM International Airport Mumbai. Plan your perfect stopover.',
        'canonical': 'https://layoverx.com/index.html',
        'json_ld': """<script type="application/ld+json">
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
</script>"""
    },
    'hotels.html': {
        'title': 'Transit Hotels Near Mumbai Airport (CSIA) | Hourly Day-Use Rooms & Stays',
        'description': 'Book luxury and budget airport hotels near Mumbai Airport CSMIA. Offers 24/7 check-in, free terminal shuttles, pool/spa access, and day-use rooms starting from 3-hour layovers.',
        'canonical': 'https://layoverx.com/hotels.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "LayoverX Transit Hotels",
  "description": "Book hourly day-use transit hotels near Chhatrapati Shivaji Maharaj International Airport Mumbai"
}
</script>"""
    },
    'restaurants.html': {
        'title': 'Best Restaurants Near Mumbai Airport | Authentic Local Cuisines & Lounges',
        'description': 'Discover popular dining spots, local street food trails, fine dining, and transit cafes near Mumbai Airport.',
        'canonical': 'https://layoverx.com/restaurants.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "LayoverX Dining Marketplace"
}
</script>"""
    },
    'spa-wellness.html': {
        'title': 'Airport Spa & Wellness Mumbai | Transit Massage & Relaxation',
        'description': 'Refresh during your Mumbai transit with premium spa and wellness services. Express massages, full wellness circuits, and relaxation lounges near CSMIA.',
        'canonical': 'https://layoverx.com/spa-wellness.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "LayoverX Spa & Wellness"
}
</script>"""
    },
    'gaming-entertainment.html': {
        'title': 'Gaming & Entertainment Mumbai Airport | Transit Fun & VR Zones',
        'description': 'Bored during a layover? Explore high-energy gaming zones, VR hubs, luxury cinemas, and entertainment centers near Mumbai Airport.',
        'canonical': 'https://layoverx.com/gaming-entertainment.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "LayoverX Gaming & Fun"
}
</script>"""
    },
    'experiences.html': {
        'title': 'Tours & Layover Experiences in Mumbai | Sightseeing & Culture',
        'description': 'Book curated city sightseeing tours, shopping guides, and heritage walks optimized for layovers.',
        'canonical': 'https://layoverx.com/experiences.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  "name": "LayoverX City Experiences"
}
</script>"""
    },
    'airport-transfers.html': {
        'title': 'Airport Transfers Mumbai CSMIA | Fixed Price Taxis',
        'description': 'Book reliable airport pickup & drop transfers at Mumbai Airport. Fixed pricing and verified drivers.',
        'canonical': 'https://layoverx.com/airport-transfers.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "LayoverX Airport Cabs"
}
</script>"""
    },
    'how-it-works.html': {
        'title': 'How It Works | Exit Mumbai Airport & Transit Visas',
        'description': 'Learn how to maximize your Mumbai airport layover with step-by-step guidance.',
        'canonical': 'https://layoverx.com/how-it-works.html',
        'json_ld': ''
    },
    'contact.html': {
        'title': 'Contact Us | LayoverX Travel Marketplace',
        'description': 'Get 24/7 customer support for transit bookings near Mumbai Airport.',
        'canonical': 'https://layoverx.com/contact.html',
        'json_ld': ''
    },
    'plan-my-layover.html': {
        'title': 'AI Layover Itinerary Planner Mumbai | Flight Schedule Optimizer',
        'description': 'Use our flagship smart planner to generate custom, time-optimized itineraries for Mumbai layovers.',
        'canonical': 'https://layoverx.com/plan-my-layover.html',
        'json_ld': ''
    },
    'partner-registration.html': {
        'title': 'Register as a Supplier | LayoverX Partner Program',
        'description': 'Register your airport transit hotel, dining experience, spa center, tour packages, or airport transfers near CSMIA Mumbai.',
        'canonical': 'https://layoverx.com/partner-registration.html',
        'json_ld': ''
    },
    'supplier-dashboard.html': {
        'title': 'Supplier Dashboard | Onboarding Review Hub',
        'description': 'Track your LayoverX supplier partner applications and review status updates.',
        'canonical': 'https://layoverx.com/supplier-dashboard.html',
        'json_ld': ''
    },
    'service-details.html': {
        'title': 'Service Details | LayoverX Premium Experience',
        'description': 'Detailed view of LayoverX travel marketplace amenities, pricing, reviews, and bookings.',
        'canonical': 'https://layoverx.com/service-details.html',
        'json_ld': ''
    },
    'my-itinerary.html': {
        'title': 'My Layover Itinerary Workspace | LayoverX Smart Planner',
        'description': 'Manage, reorder, and refine your custom transit itinerary with our AI co-pilot.',
        'canonical': 'https://layoverx.com/my-itinerary.html',
        'json_ld': ''
    },
    'checkout.html': {
        'title': 'Secure Checkout | Finalize Layover Experience',
        'description': 'Finalize your booking details and secure payment for your transit itinerary.',
        'canonical': 'https://layoverx.com/checkout.html',
        'json_ld': ''
    },
    'my-trips.html': {
        'title': 'My Trips Dashboard | LayoverX Traveler Portal',
        'description': 'Access your upcoming, past, and draft transit itineraries.',
        'canonical': 'https://layoverx.com/my-trips.html',
        'json_ld': ''
    }
}

def load_component(name):
    path = os.path.join(BASE, 'components', f'{name}.html')
    if not os.path.exists(path):
        print(f"Warning: Component '{name}' not found at {path}")
        return ""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def compile_page(filename):
    page_path = os.path.join(BASE, 'pages', filename)
    if not os.path.exists(page_path):
        print(f"Error: Page source file '{filename}' not found at {page_path}")
        return
        
    print(f"Compiling {filename}...")
    
    # Load core components
    head_tpl = load_component('head')
    header_tpl = load_component('header')
    footer_tpl = load_component('footer')
    modals_tpl = load_component('auth-modals')
    
    # Read page content
    with open(page_path, 'r', encoding='utf-8') as f:
        page_content = f.read()
        
    # Get metadata
    meta = PAGES_METADATA.get(filename, {
        'title': 'LayoverX - Mumbai Airport Layover Experience',
        'description': 'Explore hotels, restaurants, tours near Mumbai Airport.',
        'canonical': f'https://layoverx.com/{filename}',
        'json_ld': ''
    })
    
    # Compile Head
    head_compiled = head_tpl
    head_compiled = head_compiled.replace('{{TITLE}}', meta['title'])
    head_compiled = head_compiled.replace('{{DESCRIPTION}}', meta['description'])
    head_compiled = head_compiled.replace('{{CANONICAL}}', meta['canonical'])
    head_compiled = head_compiled.replace('{{JSON_LD}}', meta['json_ld'])
    
    # Highlight Active Link in Navbar
    active_class = "active-nav-link"
    inactive_class = ""
    
    header_compiled = header_tpl
    header_compiled = header_compiled.replace('{{ACTIVE_HOTELS}}', active_class if filename == 'hotels.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_RESTAURANTS}}', active_class if filename == 'restaurants.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_SPA}}', active_class if filename == 'spa-wellness.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_GAMING}}', active_class if filename == 'gaming-entertainment.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_EXPERIENCES}}', active_class if filename == 'experiences.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_TRANSFERS}}', active_class if filename == 'airport-transfers.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_HOW_IT_WORKS}}', active_class if filename == 'how-it-works.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_CONTACT}}', active_class if filename == 'contact.html' else inactive_class)
    header_compiled = header_compiled.replace('{{PLAN_MY_LAYOVER_CLASS}}', "plan-my-layover-btn active" if filename == 'plan-my-layover.html' else "plan-my-layover-btn")

    # Determine Theme Class
    theme_map = {
        'hotels.html': 'theme-hotels',
        'restaurants.html': 'theme-restaurants',
        'spa-wellness.html': 'theme-spa',
        'gaming-entertainment.html': 'theme-gaming',
        'experiences.html': 'theme-tours',
        'airport-transfers.html': 'theme-transfers'
    }
    theme_class = theme_map.get(filename, '')

    # Combine into a final HTML structure
    html = f"""<!DOCTYPE html>
<html lang="en">
{head_compiled}
<body class="overflow-x-hidden bg-surface {theme_class}">

  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1001] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg">Skip to main content</a>

  <!-- Header Section -->
  {header_compiled}

  <!-- Page Content -->
  <main id="main">
    {page_content}
  </main>

  <!-- Footer Section -->
  {footer_tpl}

  <!-- Modals Section -->
  {modals_tpl}

</body>
</html>
"""
    
    # Save compiled file to the root of BASE
    output_path = os.path.join(BASE, filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully generated {output_path}")

def build_all():
    pages = list(PAGES_METADATA.keys())
    for p in pages:
        compile_page(p)
    print("Build complete!")

if __name__ == '__main__':
    build_all()
