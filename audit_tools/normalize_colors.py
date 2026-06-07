import os
import re

html_dirs = ['frontend/pages', 'frontend/components']
files = []
for d in html_dirs:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith('.html'):
                files.append(os.path.join(d, f))

normalization_map = {
    r'sky-850': 'sky-900',
    r'sky-250': 'sky-300',
    r'sky-750': 'sky-700',
    r'amber-250': 'amber-300',
    r'gray-150': 'gray-200',
    r'gray-550': 'gray-500',
    r'gray-650': 'gray-600',
    r'gray-750': 'gray-700',
    r'gray-850': 'gray-800',
    r'emerald-650': 'emerald-600' # Some might be in CSS, but let's check HTML too
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in normalization_map.items():
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Normalized colors in {filepath}")

print("Normalization complete.")
