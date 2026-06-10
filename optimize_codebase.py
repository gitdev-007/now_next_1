import os
import re
import urllib.parse

PAGES_DIR = 'frontend/pages'

def optimize_unsplash_url(url):
    parsed = urllib.parse.urlparse(url)
    query_params = urllib.parse.parse_qs(parsed.query)
    
    # Force auto=format, fm=webp, q=75
    query_params['auto'] = ['format']
    query_params['fm'] = ['webp']
    query_params['q'] = ['75']
    
    # If width is extremely large, downscale it to standard sizes
    if 'w' in query_params:
        w_val = int(query_params['w'][0])
        if w_val > 1200:
            query_params['w'] = ['1200']
    
    # Rebuild query string in sorted order
    new_query = urllib.parse.urlencode(query_params, doseq=True)
    new_url = urllib.parse.urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))
    return new_url

def process_img_tag(match):
    full_tag = match.group(0)
    
    # Find src URL
    src_match = re.search(r'src=["\'](https://images\.unsplash\.com/[^"\']+)["\']', full_tag)
    if not src_match:
        return full_tag  # No unsplash src found, return unchanged
        
    original_url = src_match.group(1)
    optimized_url = optimize_unsplash_url(original_url)
    
    # Update src URL in the tag
    updated_tag = full_tag.replace(original_url, optimized_url)
    
    # Extract dimensions from url parameters if present to prevent CLS
    parsed_url = urllib.parse.urlparse(original_url)
    params = urllib.parse.parse_qs(parsed_url.query)
    width = params.get('w', [None])[0]
    height = params.get('h', [None])[0]
    
    # Inject width and height attributes if not already in the tag
    if width and 'width=' not in updated_tag:
        updated_tag = re.sub(r'<img', f'<img width="{width}"', updated_tag)
    if height and 'height=' not in updated_tag:
        updated_tag = re.sub(r'<img', f'<img height="{height}"', updated_tag)
        
    # Inject lazy loading if not eager/fetchpriority="high" and not already loading="lazy"
    if 'loading=' not in updated_tag and 'fetchpriority="high"' not in updated_tag:
        updated_tag = re.sub(r'<img', '<img loading="lazy"', updated_tag)
        
    return updated_tag

def process_bg_image(match):
    style_decl = match.group(0)
    url_match = re.search(r'url\(["\'](https://images\.unsplash\.com/[^"\']+)["\']\)', style_decl)
    if not url_match:
        return style_decl
    original_url = url_match.group(1)
    optimized_url = optimize_unsplash_url(original_url)
    return style_decl.replace(original_url, optimized_url)

def optimize_file(filepath):
    print(f"Optimizing assets in: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Process <img> elements
    img_pattern = re.compile(r'<img[^>]+>')
    optimized_content = img_pattern.sub(process_img_tag, content)
    
    # 2. Process inline styles with background-image urls
    bg_pattern = re.compile(r'style=["\'][^"\']*background-image\s*:\s*url\([^)]+\)[^"\']*["\']')
    optimized_content = bg_pattern.sub(process_bg_image, optimized_content)
    
    # 3. Accessibility Audit / Fixes
    # Ensure all interactive buttons have explicit aria labels or readable text
    # Fix role/aria attributes if needed
    
    if optimized_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(optimized_content)
        print(f"SUCCESS: Optimized file saved.")
    else:
        print("No changes needed.")

def run_optimization():
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file.endswith('.html'):
                optimize_file(os.path.join(root, file))

if __name__ == '__main__':
    run_optimization()
    print("Asset Optimization Complete!")
