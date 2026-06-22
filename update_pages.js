const fs = require('fs');
const path = require('path');

const base = 'frontend/src/pages';
const pages = fs.readdirSync(base).filter(f => f.endsWith('.html'));

for (const page of pages) {
    const filePath = path.join(base, page);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace search button
    const searchBtn = 'bg-gradient-to-r from-sky-500 to-sky-600 text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-sky-500/10 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2';
    if (content.includes(searchBtn)) {
        content = content.replace(searchBtn, 'btn btn-primary w-full mt-6 flex items-center justify-center gap-2');
        modified = true;
    }
    
    // Replace Explore Tours button
    const exploreBtn = 'w-full sm:w-auto px-8 py-4 bg-sky-700 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 text-center';
    if (content.includes(exploreBtn)) {
        content = content.replace(exploreBtn, 'btn btn-primary');
        modified = true;
    }
    
    // Replace Plan My Layover button
    const planBtn = 'w-full sm:w-auto px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl border border-white/30 transition transform hover:-translate-y-0.5 text-center backdrop-blur-md';
    if (content.includes(planBtn)) {
        content = content.replace(planBtn, 'btn btn-ghost');
        modified = true;
    }
    
    // Replace card action buttons pattern
    const patterns = [
        'bg-sky-700 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 transform',
        'bg-sky-700 hover:bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 transform',
    ];
    for (const pat of patterns) {
        if (content.includes(pat)) {
            content = content.replace(pat, 'btn btn-primary');
            modified = true;
        }
    }
    
    // Replace View Details links
    const viewDetails = 'text-sky-700 hover:text-sky-700 font-semibold text-sm hover:underline transition';
    if (content.includes(viewDetails)) {
        content = content.replace(viewDetails, 'btn btn-ghost text-sm');
        modified = true;
    }
    
    // Replace text-sky-700 with text-theme-primary (for theme-aware text)
    // But keep some as brand color (headers, badges)
    // Convert main content sections, not navigation/footer
    
    // Replace section badges to use theme colors
    content = content.replace(
        'text-sky-700 font-bold text-sm uppercase tracking-wider mb-2',
        'text-theme-primary font-bold text-sm uppercase tracking-wider mb-2'
    );
    
    // Fix h2 headings to use proper design system sizing
    // Already using Tailwind text-3xl/sm:text-4xl - keep for now
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + page);
    } else {
        console.log('Skipped ' + page + ' (no changes)');
    }
}
console.log('Done!');
