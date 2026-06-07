"""
SEO & Performance Enhancement Script for LayoverX
Injects theme-color, favicon, preconnect, and performance meta into all HTML files
"""
import os
import re

html_files = [
    'index.html',
    'hotels.html',
    'restaurants.html',
    'experiences.html',
    'airport-transfers.html',
    'plan-my-layover.html',
    'how-it-works.html',
    'contact.html',
]

# Additional SEO tags to inject after charset meta
SEO_INJECT = '''  <meta name="theme-color" content="#0ea5e9"/>
  <meta name="author" content="LayoverX"/>
  <meta name="geo.region" content="IN-MH"/>
  <meta name="geo.placename" content="Mumbai"/>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✈️</text></svg>"/>'''

for fname in html_files:
    if not os.path.exists(fname):
        print(f'Skipped (not found): {fname}')
        continue

    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if theme-color already injected
    if 'theme-color' in content:
        print(f'Already has theme-color: {fname}')
        continue

    # Inject after <meta charset="UTF-8"/>
    charset_tag = '<meta charset="UTF-8"/>'
    if charset_tag in content:
        content = content.replace(
            charset_tag,
            charset_tag + '\n' + SEO_INJECT,
            1
        )
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Enhanced SEO: {fname}')
    else:
        print(f'Could not find charset tag in: {fname}')

print('\nSEO enhancement complete.')
