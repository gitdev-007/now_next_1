import os
import glob
import re

html_files = []
for root, dirs, files in os.walk('frontend'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

replacements = {
    # Strip dangerous opacity utility classes
    r'\s+opacity-10\b': '',
    r'\s+opacity-20\b': '',
    r'\s+opacity-30\b': '',
    r'\s+opacity-40\b': '',
    r'\s+opacity-50\b': '',
    
    # Strip dangerous faded text classes
    r'\s+text-white/10\b': '',
    r'\s+text-white/20\b': '',
    r'\s+text-white/30\b': '',
    r'\s+text-white/40\b': '',
    r'\s+text-white/50\b': '',
    
    # Strip backdrop filters that cause readability issues
    r'\s+backdrop-blur-sm\b': ' backdrop-blur-md',
    r'\s+mix-blend-overlay\b': '',
    
    # Strengthen overlays over images so text pops
    r'bg-black/30': 'bg-black/60',
    r'bg-black/40': 'bg-black/70',
    r'from-black/30': 'from-black/60',
    r'from-black/40': 'from-black/70',
    
    # Clean up any residual text-white/95 from navbar anchors since it was moved to CSS
    r'\s*text-white/95': '',
}

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Deep fixed {filepath}")

print("Deep contrast fix complete.")
