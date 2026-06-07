import os
import glob
import re

html_files = []
for root, dirs, files in os.walk('frontend'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

replacements = {
    # Fix light text on dark backgrounds
    r'text-white/50': 'text-white',
    r'text-white/60': 'text-white/90',
    r'text-white/70': 'text-white/90',
    r'text-white/80': 'text-white',
    r'text-white/90': 'text-white',
    r'text-white/95': 'text-white',
    r'text-gray-400': 'text-gray-700',
    r'text-gray-500': 'text-gray-700',
    r'text-gray-600': 'text-gray-800',
    
    # Fix hidden background overlaps
    r'bg-white/5': 'bg-white/20',
    r'bg-white/10': 'bg-white/20',
    r'bg-black/30': 'bg-black/60',
    r'bg-black/40': 'bg-black/70',
    
    # Fix specific opacity utility
    r'opacity-60': 'opacity-90',
    r'opacity-70': 'opacity-90',
    r'opacity-80': 'opacity-100',
    
    # Avoid Tailwind text hover fading
    r'hover:text-white/80': 'hover:text-white',
    r'hover:text-gray-400': 'hover:text-gray-600',
}

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in replacements.items():
        # Replace only word-boundaries to avoid partial matches
        content = re.sub(r'(?<![a-zA-Z0-9_-])' + re.escape(pattern) + r'(?![a-zA-Z0-9_-])', replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
        
print("Contrast fix complete.")
