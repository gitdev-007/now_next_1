const fs = require('fs');
const path = require('path');

const base = 'frontend/pages';
const pages = fs.readdirSync(base).filter(f => f.endsWith('.html'));

for (const page of pages) {
    const filePath = path.join(base, page);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix CTA gradient sections - replace hardcoded sky gradient with theme gradient
    const ctaGradient = 'bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-lg shadow-sky-500/10';
    if (content.includes(ctaGradient)) {
        content = content.replace(ctaGradient, 'rounded-3xl p-8 sm:p-12 text-center text-white shadow-lg relative overflow-hidden');
        // Add theme gradient overlay after the div
        content = content.replace(
            'relative overflow-hidden">\n      <h2',
            'relative overflow-hidden bg-gradient-to-br from-[var(--theme-hero-from)] to-[var(--theme-hero-to)]">\n      <h2'
        );
        modified = true;
    }
    
    // Fix hero sections to use theme-hero class properly
    // The hero sections already use theme-hero in most pages
    
    // Fix "Plan My Layover" CTA button on homepage - already uses btn-ghost
    
    // Fix footer signup button in header component - keep as is
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed CTA in ' + page);
    } else {
        console.log('No CTA fix needed for ' + page);
    }
}
console.log('Done!');
