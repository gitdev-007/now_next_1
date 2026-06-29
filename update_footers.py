import re
import os

frontend_path = 'C:/Users/Dev Tinker/Desktop/now_next/frontend'

new_footer = '''<!-- Footer Section -->
  <!-- FOOTER -->
<footer class="bg-slate-950 text-white pt-20 pb-0" role="contentinfo" aria-label="Site footer">
  <div class="container">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 mb-16">
      <div class="col-span-2 sm:col-span-3 lg:col-span-2 mb-4 lg:mb-0">
        <a href="index.html" class="flex items-center gap-2.5 mb-5 group">
          <div class="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <span class="text-xl font-extrabold tracking-tight text-white">LayoverX</span>
        </a>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
          Mumbai's premium layover experience platform. Transform transit hours into memorable journeys with verified hotels, dining, city tours, and airport transfers near CSMIA.
        </p>
        <div class="flex items-center gap-3 mb-8">
          <a href="#" aria-label="LayoverX on Facebook" class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-sky-500 transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.2-1.1 1-1.1h3V2h-4.3C12.3 2 10 3.8 10 7.5V8z"/></svg>
          </a>
          <a href="#" aria-label="LayoverX on Twitter" class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-sky-500 transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95 4.57a10 10 0 01-2.82.78 4.9 4.9 0 002.16-2.72 9.9 9.9 0 01-3.12 1.19 4.92 4.92 0 00-8.38 4.48A14 14 0 011.64 3.16a4.92 4.92 0 001.52 6.57 4.9 4.9 0 01-2.23-.62v.06a4.93 4.93 0 003.95 4.83 4.9 4.9 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.9 9.9 0 010 19.54a13.9 13.9 0 007.55 2.21c9.05 0 14-7.5 14-14v-.64a10 10 0 002.4-2.54z"/></svg>
          </a>
          <a href="#" aria-label="LayoverX on Instagram" class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-sky-500 transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
        <ul class="space-y-3">
          <li class="flex items-center gap-3 text-slate-400 text-sm">
            <svg class="w-4 h-4 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            <a href="mailto:hello@layoverx.com" class="hover:text-white transition-colors focus:outline-none focus-visible:underline">hello@layoverx.com</a>
          </li>
          <li class="flex items-center gap-3 text-slate-400 text-sm">
            <svg class="w-4 h-4 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.47-5.112-3.758-6.58-6.58l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            <a href="tel:+912212345678" class="hover:text-white transition-colors focus:outline-none focus-visible:underline">+91 22 1234 5678</a>
          </li>
          <li class="flex items-start gap-3 text-slate-400 text-sm">
            <svg class="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            <span>Andheri East, Near CSMIA<br/>Terminal 2, Mumbai 400099</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-5 text-xs text-sky-400 uppercase tracking-[0.15em]">Hotels</h3>
        <ul class="space-y-3" role="list">
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="hotels.html">Airport Hotels</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="hotels.html#day-use">Day-Use Rooms</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="hotels.html#transit">Transit Hotels</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="hotels.html#luxury">Luxury Stays</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="hotels.html#budget">Budget Hotels</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-5 text-xs text-sky-400 uppercase tracking-[0.15em]">Restaurants</h3>
        <ul class="space-y-3" role="list">
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="restaurants.html">Restaurants & Dining</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="restaurants.html#fine-dining">Fine Dining</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="restaurants.html#local">Local Cuisine</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="restaurants.html#quick">Quick Bites</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="restaurants.html#lounge">Airport Lounges</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-5 text-xs text-sky-400 uppercase tracking-[0.15em]">Experiences</h3>
        <ul class="space-y-3" role="list">
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="experiences.html">Tours & Experiences</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="experiences.html#city-tours">City Tours</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="experiences.html#cultural">Cultural Walks</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="airport-transfers.html">Airport Transfers</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="airport-transfers.html#private">Private Cabs</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-5 text-xs text-sky-400 uppercase tracking-[0.15em]">Company</h3>
        <ul class="space-y-3" role="list">
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="how-it-works.html">How It Works</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="contact.html">Contact Us</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="contact.html#partner">Partner With Us</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="how-it-works.html#faq">FAQs</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="help-center.html">Help Center</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-5 text-xs text-sky-400 uppercase tracking-[0.15em]">Legal</h3>
        <ul class="space-y-3" role="list">
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="privacy.html">Privacy Policy</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="terms.html">Terms of Service</a></li>
          <li><a class="text-slate-400 hover:text-white text-sm transition-colors focus:outline-none focus-visible:underline" href="#">Cookie Policy</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-800/80 pt-8 pb-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-slate-500 text-xs">&copy; 2026 LayoverX. All rights reserved.</p>
        <p class="text-slate-600 text-xs">Mumbai, India &mdash; Dedicated to transit travelers worldwide.</p>
        <div class="flex items-center gap-6">
          <a class="text-slate-500 hover:text-white text-xs transition-colors focus:outline-none focus-visible:underline" href="privacy.html">Privacy</a>
          <a class="text-slate-500 hover:text-white text-xs transition-colors focus:outline-none focus-visible:underline" href="terms.html">Terms</a>
          <a class="text-slate-500 hover:text-white text-xs transition-colors focus:outline-none focus-visible:underline" href="#">Cookies</a>
        </div>
      </div>
    </div>
  </div>
</footer>
'''

files = [
    "airport-transfers.html",
    "plan-my-layover.html",
    "service-details.html",
    "checkout.html",
    "booking-review.html",
    "booking-confirmation.html",
    "payment-selection.html",
    "my-itinerary.html",
    "my-trips.html",
    "my-profile.html",
    "account-settings.html",
    "notifications.html",
    "saved-itineraries.html",
    "trip-details.html",
    "help-center.html",
    "faq.html",
    "contact.html",
    "how-it-works.html",
    "privacy.html",
    "terms.html",
    "partner-registration.html",
    "supplier-dashboard.html",
    "supplier-status.html",
    "revenue-admin.html"
]

# Pattern to match old footer: from "  <!-- FOOTER -->" through "</footer>" and the newlines before "  <!-- Modals Section -->"
pattern = r'(  <!-- FOOTER -->\s*<footer class="bg-gray-900.*?</footer>)(\n\n\n)  <!-- Modals Section -->'

success_count = 0
fail_count = 0
failed_files = []

for file in files:
    filepath = os.path.join(frontend_path, file)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            match = re.search(pattern, content, re.DOTALL)
            if match:
                replacement = new_footer + match.group(2) + '  <!-- Modals Section -->'
                new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"SUCCESS: {file}")
                success_count += 1
            else:
                print(f"WARNING: Pattern not found in {file}")
                fail_count += 1
                failed_files.append(file)
        except Exception as e:
            print(f"ERROR: {file} - {e}")
            fail_count += 1
            failed_files.append(file)
    else:
        print(f"ERROR: File not found: {file}")
        fail_count += 1
        failed_files.append(file)

print()
print("=========================")
print("Completed!")
print(f"Successful: {success_count}")
print(f"Failed: {fail_count}")
if failed_files:
    print(f"Failed files: {', '.join(failed_files)}")