const fs = require('fs');
const path = require('path');

const base = 'frontend/src/pages';
const pages = fs.readdirSync(base).filter(f => f.endsWith('.html'));

const replacements = [
  // Inputs styling simplification
  {
    target: /class="form-input w-full border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-600\/20 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all shadow-sm"/g,
    replacement: 'class="form-input"'
  },
  {
    target: /class="form-input border border-gray-200 focus:border-sky-500 rounded-xl py-3 px-4"/g,
    replacement: 'class="form-input"'
  },
  {
    target: /class="form-input border border-gray-200 focus:border-sky-500 rounded-xl py-3 px-4 w-full"/g,
    replacement: 'class="form-input"'
  },
  // Button overrides to design system buttons
  {
    target: /class="px-6 py-3.5 bg-sky-700 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 w-full"/g,
    replacement: 'class="btn btn-primary w-full"'
  },
  {
    target: /class="px-5 py-3 bg-white hover:bg-gray-150 text-gray-700 border border-gray-200 rounded-xl font-bold transition"/g,
    replacement: 'class="btn btn-ghost border border-gray-200"'
  },
  {
    target: /class="px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-lg transition hover:scale-\[1.01\] flex items-center gap-1"/g,
    replacement: 'class="btn btn-primary flex items-center gap-1"'
  },
  {
    target: /class="px-4 py-2 bg-sky-700 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition hover:-translate-y-0.5 transform"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="px-4 py-2 bg-theme-primary hover:bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="px-4 py-2 bg-sky-700 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition shadow-md"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="px-5 py-2.5 bg-gray-100 hover:bg-theme-primary text-gray-800 font-bold text-sm rounded-xl"/g,
    replacement: 'class="btn btn-ghost bg-gray-100"'
  },
  {
    target: /class="px-6 py-2.5 bg-theme-primary hover:bg-theme-primary text-white font-bold text-sm rounded-xl shadow-md"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="btn bg-theme-primary hover:bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="w-full sm:w-auto px-8 py-4 bg-sky-700 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 text-center"/g,
    replacement: 'class="btn btn-primary"'
  },
  {
    target: /class="w-full sm:w-auto px-8 py-4 bg-white\/15 hover:bg-white\/25 text-white font-bold rounded-xl border border-white\/30 transition transform hover:-translate-y-0.5 text-center backdrop-blur-md"/g,
    replacement: 'class="btn btn-ghost"'
  },
  {
    target: /class="w-full mt-6 py-4 btn btn-primary w-full mt-6 flex items-center justify-center gap-2"/g,
    replacement: 'class="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"'
  },
  {
    target: /class="inline-block px-8 py-3.5 bg-white text-theme-primary font-bold rounded-xl hover:bg-gray-50 transition transform hover:-translate-y-0.5 shadow-md"/g,
    replacement: 'class="btn btn-ghost bg-white text-theme-primary hover:bg-gray-50 shadow-md"'
  },
  // Hardcoded sky text and bg to dynamic theme styles
  {
    target: /text-sky-700/g,
    replacement: 'text-theme-primary'
  },
  {
    target: /bg-sky-700/g,
    replacement: 'bg-theme-primary'
  },
  {
    target: /hover:bg-sky-700/g,
    replacement: 'hover:bg-theme-primary'
  },
  {
    target: /hover:text-sky-700/g,
    replacement: 'hover:text-theme-primary'
  },
  {
    target: /border-sky-750/g,
    replacement: 'border-theme-primary'
  },
  {
    target: /border-sky-700/g,
    replacement: 'border-theme-primary'
  },
  {
    target: /text-sky-500/g,
    replacement: 'text-theme-accent'
  },
  {
    target: /text-sky-400/g,
    replacement: 'text-theme-accent'
  },
  {
    target: /bg-sky-50/g,
    replacement: 'bg-emerald-50/40' // soft theme light backdrop
  },
  {
    target: /shadow-sky-500\/20/g,
    replacement: 'shadow-primary'
  },
  {
    target: /shadow-sky-500\/10/g,
    replacement: 'shadow-primary'
  },
  {
    target: /bg-gradient-to-br from-sky-500 to-sky-700/g,
    replacement: 'bg-gradient-to-br from-theme-hero-from to-theme-hero-to'
  },
  {
    target: /text-sky-300/g,
    replacement: 'text-theme-accent'
  },
  {
    target: /bg-sky-500\/20/g,
    replacement: 'bg-white/10'
  },
  {
    target: /border-sky-500\/30/g,
    replacement: 'border-white/20'
  },
  {
    target: /bg-sky-500\/10/g,
    replacement: 'bg-white/5'
  },
  {
    target: /bg-sky-500\/5/g,
    replacement: 'bg-white/5'
  }
];

for (const page of pages) {
  const filePath = path.join(base, page);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const rep of replacements) {
    if (content.match(rep.target)) {
      content = content.replace(rep.target, rep.replacement);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated page: ${page}`);
  } else {
    console.log(`No changes for: ${page}`);
  }
}

console.log('Successfully completed cleanup of all page templates!');
