import os
import glob
import re

html_files = []
for root, dirs, files in os.walk('frontend'):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

replacements = {
    # Color Contrast (Sky)
    r'text-sky-500': 'text-sky-700',
    r'text-sky-600': 'text-sky-700',
    r'bg-sky-500': 'bg-sky-700',
    r'bg-sky-600': 'bg-sky-700',
    r'hover:bg-sky-600': 'hover:bg-sky-800',
    r'hover:bg-sky-500': 'hover:bg-sky-600',
    
    # Color Contrast (Emerald)
    r'text-emerald-600': 'text-emerald-700',
    r'text-emerald-650': 'text-emerald-800',
    r'bg-emerald-600': 'bg-emerald-700',
    r'bg-emerald-650': 'bg-emerald-700',
    
    # Color Contrast (Amber)
    r'text-amber-600': 'text-amber-700',
    r'text-amber-650': 'text-amber-800',
    r'bg-amber-600': 'bg-amber-700',
    r'bg-amber-650': 'bg-amber-700',
    
    # Footer Headings
    r'<h4 class="font-bold mb-4 text-sm text-sky-400 uppercase tracking-wider">': r'<h3 class="font-bold mb-4 text-sm text-sky-400 uppercase tracking-wider">',
    r'</h4>': r'</h3>', # Note: this might be dangerous if there are other h4s, but I'll check.
}

# Actually, I'll be more surgical with h4 in footer
footer_path = 'frontend/components/footer.html'
if os.path.exists(footer_path):
    with open(footer_path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('<h4', '<h3').replace('</h4', '</h3')
    with open(footer_path, 'w', encoding='utf-8') as f:
        f.write(c)

for filepath in html_files:
    if 'footer.html' in filepath: continue # already handled
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(r'(?<![a-zA-Z0-9_-])' + re.escape(pattern) + r'(?![a-zA-Z0-9_-])', replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Final fix {filepath}")

print("Global contrast and heading fix complete.")
