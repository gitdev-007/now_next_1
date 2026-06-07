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
  "description": "Book hourly day-use transit hotels near Chhatrapati Shivaji Maharaj International Airport Mumbai",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  }
}
</script>"""
    },
    'restaurants.html': {
        'title': 'Best Restaurants Near Mumbai Airport | Authentic Local Cuisines & Lounges',
        'description': 'Discover popular dining spots, local street food trails, fine dining, and transit cafes near Mumbai Airport. Filter by cuisine type, price, and distance from CSMIA terminals.',
        'canonical': 'https://layoverx.com/restaurants.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "LayoverX Dining Marketplace",
  "description": "Explore and reserve tables at top transit restaurants near Mumbai Airport"
}
</script>"""
    },
    'experiences.html': {
        'title': 'Tours & Layover Experiences in Mumbai | Sightseeing, Culture & Food Trails',
        'description': 'Book curated city sightseeing tours, shopping guides, heritage walks, and food tours optimized for layover durations from 4 to 12+ hours with airport pickup.',
        'canonical': 'https://layoverx.com/experiences.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  "name": "LayoverX City Experiences",
  "description": "Time-optimized private city tours and experiences near Mumbai Airport"
}
</script>"""
    },
    'airport-transfers.html': {
        'title': 'Airport Transfers Mumbai CSMIA | Fixed Price Taxis & Chauffeur Cabs',
        'description': 'Book reliable airport pickup & drop transfers at Mumbai Airport. Fixed pricing, flight tracking, and verified local drivers. Sedan, SUV, and luxury cars available.',
        'canonical': 'https://layoverx.com/airport-transfers.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "LayoverX Airport Cabs",
  "description": "Premium fixed-rate taxi transfers to and from Mumbai International Airport"
}
</script>"""
    },
    'how-it-works.html': {
        'title': 'How It Works | Exit Mumbai Airport, Transit Visas & Luggage Lockers',
        'description': 'Learn how to maximize your Mumbai airport layover. Read step-by-step guidance on transit visa requirements, luggage storage facilities, and optimized time itineraries.',
        'canonical': 'https://layoverx.com/how-it-works.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How do I exit the Mumbai Airport during a layover?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Ensure you have a transit visa or e-tourist visa. Head to immigration, clear passport check, store large luggage at the T2 Left Luggage facility, and proceed to exit."
    }
  }]
}
</script>"""
    },
    'contact.html': {
        'title': 'Contact Us & Partner Support | LayoverX Travel Marketplace',
        'description': 'Get 24/7 customer support for transit bookings, or register as a partner hotel, restaurant, tour operator, or taxi fleet operator near Mumbai Airport.',
        'canonical': 'https://layoverx.com/contact.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "LayoverX Customer Support",
  "url": "https://layoverx.com/contact.html"
}
</script>"""
    },
    'plan-my-layover.html': {
        'title': 'AI Layover Itinerary Planner Mumbai | Flight Schedule Optimizer',
        'description': 'Use our flagship smart planner to generate custom, time-optimized itineraries for Mumbai layovers. Custom match hotels, transfers, and city attractions instantly.',
        'canonical': 'https://layoverx.com/plan-my-layover.html',
        'json_ld': """<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAction",
  "name": "LayoverX AI Flight Layover Planner",
  "description": "Optimize transit stopovers with custom activity and lodging scheduling"
}
</script>"""
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
    header_compiled = header_compiled.replace('{{ACTIVE_EXPERIENCES}}', active_class if filename == 'experiences.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_TRANSFERS}}', active_class if filename == 'airport-transfers.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_HOW_IT_WORKS}}', active_class if filename == 'how-it-works.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_CONTACT}}', active_class if filename == 'contact.html' else inactive_class)
    header_compiled = header_compiled.replace('{{ACTIVE_PLAN_MY_LAYOVER_BTN}}', "bg-sky-500 text-white font-bold" if filename == 'plan-my-layover.html' else "")

    # Combine into a final HTML structure
    html = f"""<!DOCTYPE html>
<html lang="en">
{head_compiled}
<body class="overflow-x-hidden pt-16 sm:pt-20 bg-surface">

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
    pages = [
        'index.html',
        'hotels.html',
        'restaurants.html',
        'experiences.html',
        'airport-transfers.html',
        'how-it-works.html',
        'contact.html',
        'plan-my-layover.html'
    ]
    for p in pages:
        compile_page(p)
    print("Build complete!")

if __name__ == '__main__':
    build_all()
