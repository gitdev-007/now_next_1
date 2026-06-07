import os
import re

pages_dir = 'frontend/pages'
files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]

for filename in files:
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the first section or header
    # We look for the first tag that starts a main block
    # It usually has classes like bg-gradient-to-r, bg-gray-900, etc.
    
    # Surgical replacement for known patterns
    new_content = content
    
    # 1. Hotels, Restaurants, Experiences, Transfers, Contact all have py-12 or py-16 or py-10
    new_content = re.sub(r'class="(.*?)py-12(.*?)relative overflow-hidden"', r'class="\1pt-20 sm:pt-28 pb-12\2relative overflow-hidden"', new_content)
    new_content = re.sub(r'class="(.*?)py-16(.*?)relative overflow-hidden"', r'class="\1pt-20 sm:pt-28 pb-16\2relative overflow-hidden"', new_content)
    new_content = re.sub(r'class="(.*?)py-10(.*?)border-b border-gray-800"', r'class="\1pt-20 sm:pt-28 pb-10\2border-b border-gray-800"', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated padding for {filename}")

print("Padding fix complete.")
