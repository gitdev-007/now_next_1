# CSS Audit Report — LayoverX

**Date:** June 25, 2026
**Scope:** All CSS files in the project

---

## 1. CSS File Inventory

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `tokens.css` | `frontend/styles/tokens/tokens.css` | 96 | Design tokens (CSS custom properties) |
| `tokens.css` | `styles/tokens/tokens.css` | 96 | **EXACT DUPLICATE** of above |
| `design-system.css` | `frontend/css/design-system.css` | 1065 | Unified design system (resets, typography, buttons, cards, forms, theming) |
| `index.css` | `design-system/index.css` | 1065 | **EXACT DUPLICATE** of design-system.css |
| `tailwind.min.css` | `frontend/css/tailwind.min.css` | — | Compiled Tailwind v4.3.1 utility CSS |
| `tailwind.css` | `frontend/css/tailwind.css` | 1822+ | Tailwind v4.3.1 compiled output with embedded `:root` tokens |
| `tailwind-input.css` | `frontend/css/tailwind-input.css` | 1 | Tailwind input (imports only `tailwindcss`) |
| `tailwind-input.css` | `root/tailwind-input.css` | 7 | Tailwind input (imports tokens + design-system + tailwindcss) |

---

## 2. Duplicate CSS

### Exact Duplicates (100% identical)

| File A | File B | Lines |
|--------|--------|-------|
| `frontend/styles/tokens/tokens.css` | `styles/tokens/tokens.css` | 96 |
| `frontend/css/design-system.css` | `design-system/index.css` | 1065 |

Both pairs are byte-for-byte identical. The root-level copies appear to be the "source" copies, while the `frontend/` copies are the "build output" copies.

### Duplicate CSS Variable Definitions

The `:root` custom properties are defined in **3 separate places** with **conflicting values**:

#### Source 1: `tokens.css` (used by design-system.css)
```css
--font-hero: 3.5rem;     /* 56px */
--font-h1: 2.5rem;       /* 40px */
--font-h2: 1.875rem;     /* 30px */
--font-h3: 1.375rem;     /* 22px */
--font-h4: 1.125rem;     /* 18px */
--lh-hero: 1.5;
--lh-h1: 1.5;
--lh-h2: 1.5;
--lh-h3: 1.5;
--radius-sm: 6px;
--radius: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
```

#### Source 2: `tailwind.css` (compiled Tailwind output)
```css
--font-hero: 4rem;       /* 64px — DIFFERENT */
--font-h1: 3rem;         /* 48px — DIFFERENT */
--font-h2: 2.5rem;       /* 40px — DIFFERENT */
--font-h3: 2rem;         /* 32px — DIFFERENT */
--font-h4: 1.5rem;       /* 24px — DIFFERENT */
--font-h5: 1.25rem;      /* 20px — EXTRA */
--font-body-large: 1.125rem; /* EXTRA */
--font-small: 0.875rem;  /* EXTRA */
--lh-hero: 1.1;          /* DIFFERENT */
--lh-h1: 1.2;            /* DIFFERENT */
--lh-h2: 1.25;           /* DIFFERENT */
--lh-h3: 1.3;            /* DIFFERENT */
--lh-h4: 1.35;           /* DIFFERENT */
--radius-sm: 0.25rem;    /* 4px — DIFFERENT */
--radius: (not defined)  /* Tailwind uses --radius-md: 0.375rem */
--radius-lg: 0.5rem;     /* 8px — DIFFERENT */
--radius-xl: 0.75rem;    /* 12px — DIFFERENT */
```

**Critical conflict:** The same CSS custom property names (`--font-hero`, `--font-h1`, etc.) have different values depending on which file loads last. The design-system.css `@import`s tokens.css, but the compiled `tailwind.css` also defines `:root` variables with different sizes.

---

## 3. CSS Conflicts

### Conflict 1: Typography Scale (Tailwind vs. Design System)

The design-system.css **overrides Tailwind's typography utilities** in `@layer utilities`:

```css
/* design-system.css overrides */
.text-xs { font-size: var(--font-tiny); }    /* 12px */
.text-sm { font-size: var(--font-caption); } /* 14px */
.text-base { font-size: var(--font-body); }  /* 16px */
.text-lg { font-size: var(--font-h4); }      /* 18px */
.text-xl { font-size: var(--font-h3); }      /* 22px */
.text-2xl { font-size: var(--font-h2); }     /* 30px */
.text-3xl { font-size: var(--font-h1); }     /* 40px */
.text-4xl..text-7xl { font-size: var(--font-hero); } /* 56px */
```

But Tailwind's compiled output in `tailwind.css` defines:
```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
--text-6xl: 3.75rem;  /* 60px */
--text-7xl: 4.5rem;   /* 72px */
```

**Result:** The design-system.css overrides shrink the typography scale. `text-5xl` through `text-7xl` all collapse to `56px` (the `--font-hero` value), losing Tailwind's intended progression.

### Conflict 2: `.container` Class

Both Tailwind and design-system.css define `.container`:

**Tailwind's `.container`:**
```css
.container {
  width: 100%;
  @media (width >= 40rem) { max-width: 40rem; }
  @media (width >= 48rem) { max-width: 48rem; }
  @media (width >= 64rem) { max-width: 64rem; }
  @media (width >= 80rem) { max-width: 80rem; }
  @media (width >= 96rem) { max-width: 96rem; }
}
```

**Design system's `.container`:**
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
```

**Result:** The design system version wins (higher specificity or later load). This overrides Tailwind's responsive max-width breakpoints with a fixed 1280px max.

### Conflict 3: Reset Styles

Both Tailwind's `@layer base` and design-system.css's `@layer base` define reset styles:

**Tailwind reset:**
```css
*, ::after, ::before, ::backdrop, ::file-selector-button {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid;
}
```

**Design system reset:**
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

These are largely redundant but could cause specificity issues.

### Conflict 4: `--radius` Variables

| Token | tokens.css | tailwind.css |
|-------|-----------|--------------|
| `--radius-sm` | 6px | 0.25rem (4px) |
| `--radius` | 12px | (not defined) |
| `--radius-lg` | 16px | 0.5rem (8px) |
| `--radius-xl` | 24px | 0.75rem (12px) |

Tailwind adds `--radius-2xl` (1rem) and `--radius-3xl` (1.5rem) which tokens.css doesn't define.

---

## 4. Global CSS (design-system.css)

The design-system.css defines these global styles:

| Category | Classes | Count |
|----------|---------|-------|
| **Reset** | `*`, `html`, `body`, `a`, `img`, `button`, `input/select/textarea` | 7 |
| **Container** | `.container` | 1 |
| **Typography** | `h1-h6`, `.text-hero`, `.body-large`, `.body`, `.small`, `.caption` | 11 |
| **Buttons** | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg` | 8 |
| **Cards** | `.card`, `.card-hotel`, `.card-restaurant`, `.card-transfer`, `.card-experience`, `.card-tour`, `.card-feature`, `.card-pricing`, `.card-img-container`, `.card-img`, `.card-content` | 11 |
| **Forms** | `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.input-error`, `.input-success` | 6 |
| **Modals** | `.modal-overlay`, `.modal-content`, `.modal-close` | 3 |
| **Navigation** | `.nav-link`, `.active-nav-link`, `.plan-my-layover-btn` | 3 |
| **Search** | `.search-tab`, `.search-field` | 2 |
| **Carousel** | `.carousel-container`, `.carousel-item` | 2 |
| **Sections** | `.section`, `.section-label`, `.section-title`, `.section-subtitle` | 4 |
| **Hero** | `.hero-section`, `.hero-content` | 2 |
| **Theme Engine** | `.theme-hotels`, `.theme-restaurants`, `.theme-spa`, `.theme-gaming`, `.theme-tours`, `.theme-transfers`, `.default-hero`, `.theme-hero`, `.theme-text-accent`, `.theme-badge`, `.bg-theme-primary`, `.text-theme-primary`, `.border-theme-primary`, `.text-theme-accent` | 14 |
| **Misc** | `.glass-header`, `.glass-card`, `.icon-16/20/24/32`, `.stat-card`, `.icon-badge`, `.step-number`, `.testimonial-card`, `.faq-item`, `.trust-badge`, `.price-tag`, `.select-card`, `.no-scrollbar`, `.reveal`, `.toast`, `#toast-container` | 16 |
| **Custom Overrides** | `.text-gray-650`, `.text-slate-650`, `.bg-gray-55`, `.bg-emerald-650`, `.bg-amber-650`, `.themed-body-text`, `.themed-muted-text`, `.themed-heading-text` | 8 |

**Total custom component classes: ~100+**

---

## 5. Component CSS

### Button System
```css
.btn           { height: 3rem; padding: 0 1.5rem; border-radius: var(--radius); }
.btn-primary   { background: var(--primary); box-shadow: var(--shadow-primary); }
.btn-secondary { background: var(--secondary); }
.btn-outline   { border: 2px solid var(--primary); }
.btn-ghost     { background: transparent; }
.btn-danger    { background: var(--danger); }
.btn-sm        { height: 2.5rem; padding: 0 1rem; border-radius: var(--radius-sm); }
.btn-lg        { height: 3.5rem; padding: 0 2rem; }
```

**Issue:** `.btn` defines `height: 3rem` (48px) but HTML pages also use inline Tailwind classes like `py-4`, `!py-2`, `!px-4` that override the height/padding.

### Card System
```css
.card, .card-hotel, .card-restaurant, .card-transfer, .card-experience, .card-tour, .card-feature, .card-pricing
  { border-radius: var(--radius-lg); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
.card:hover  { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
```

**Issue:** `.card` has `aspect-ratio: 1.5` on `.card-img-container` (3:2 ratio) but marketplace pages use `h-52` (208px) on images, which overrides the aspect-ratio.

### Form System
```css
.form-input  { height: 3rem; padding: 0 1rem; border: 1px solid var(--border); border-radius: var(--radius); }
.form-label  { font-size: var(--font-tiny); font-weight: 800; text-transform: uppercase; }
.form-group  { display: flex; flex-direction: column; gap: 0.5rem; }
```

**Issue:** `.form-input` uses `border-radius: var(--radius)` (12px) but HTML pages also use `rounded-xl` (12px from Tailwind) and `rounded-2xl` (16px) on inputs, creating inconsistency.

---

## 6. Utility CSS

### Design System Utility Overrides
The design-system.css overrides Tailwind's typography utilities with custom values:

```css
@layer utilities {
  .text-xs { font-size: var(--font-tiny); }   /* 12px */
  .text-sm { font-size: var(--font-caption); } /* 14px */
  .text-base { font-size: var(--font-body); }  /* 16px */
  .text-lg { font-size: var(--font-h4); }      /* 18px */
  .text-xl { font-size: var(--font-h3); }      /* 22px */
  .text-2xl { font-size: var(--font-h2); }     /* 30px */
  .text-3xl { font-size: var(--font-h1); }     /* 40px */
  .text-4xl..text-7xl { font-size: var(--font-hero); } /* 56px */
}
```

Plus responsive overrides at `sm:`, `md:`, `lg:`, `xl:` breakpoints (4 × 8 = 32 additional rules).

### Custom Tailwind Extensions
```css
.text-gray-650 { color: var(--text-muted) !important; }
.text-slate-650 { color: var(--text-muted) !important; }
.bg-gray-55 { background-color: var(--surface-muted) !important; }
.bg-emerald-650 { background-color: #047857 !important; }
.bg-amber-650 { background-color: #d97706 !important; }
```

These extend Tailwind's color palette with custom values.

### Themed Utility Classes
```css
.bg-theme-primary { background-color: var(--primary) !important; }
.hover\:bg-theme-primary:hover { background-color: var(--primary-dark) !important; }
.text-theme-primary { color: var(--primary) !important; }
.border-theme-primary { border-color: var(--primary) !important; }
.text-theme-accent { color: var(--primary-light) !important; }
```

These use `!important` to override Tailwind utilities.

---

## 7. Repeated Typography

### Heading Scale (tokens.css)
| Token | Value | Used For |
|-------|-------|----------|
| `--font-hero` | 3.5rem (56px) | `.text-hero`, `.text-4xl..text-7xl` |
| `--font-h1` | 2.5rem (40px) | `h1`, `.text-3xl` |
| `--font-h2` | 1.875rem (30px) | `h2`, `.text-2xl` |
| `--font-h3` | 1.375rem (22px) | `h3`, `.text-xl` |
| `--font-h4` | 1.125rem (18px) | `h4`, `.text-lg` |
| `--font-body` | 1rem (16px) | `body`, `h5`, `.text-base` |
| `--font-secondary` | 0.9375rem (15px) | `h6` |
| `--font-caption` | 0.875rem (14px) | `.text-sm` |
| `--font-tiny` | 0.75rem (12px) | `.text-xs` |

### Repeated Typography Patterns in HTML
Every section header in HTML follows this pattern (duplicated 30+ times):
```html
<span class="inline-block text-sky-600 font-bold text-sm uppercase tracking-wider mb-2">Label</span>
<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Title</h2>
<p class="text-slate-650 max-w-xl mx-auto">Subtitle</p>
```

This should be the `.section-label`, `.section-title`, `.section-subtitle` classes from the design system, but HTML uses inline Tailwind classes instead.

---

## 8. Repeated Spacing

### Section Spacing
```css
.section { padding-top: 4rem; padding-bottom: 4rem; }
@media (min-width: 768px) { .section { padding-top: 5rem; padding-bottom: 5rem; } }
```

But HTML pages also use:
- `py-16` (64px) on sections
- `py-12` (48px) on sections
- `py-8` (32px) on sections
- `pt-24 pb-16` on hero sections
- `mb-12`, `mb-16` on content blocks

No consistent spacing scale is followed.

### Card Content Spacing
```css
.card-content { padding: 1.5rem; gap: 0.5rem; }
```

But HTML also uses `p-6`, `p-8`, `px-6 pb-6 pt-4` on card internals.

---

## 9. Repeated Buttons

### Design System Buttons
| Class | Height | Padding | Border Radius |
|-------|--------|---------|---------------|
| `.btn` | 3rem (48px) | 0 1.5rem | `var(--radius)` = 12px |
| `.btn-sm` | 2.5rem (40px) | 0 1rem | `var(--radius-sm)` = 6px |
| `.btn-lg` | 3.5rem (56px) | 0 2rem | 12px (inherited) |

### HTML Inline Button Styles
Pages also define buttons with inline Tailwind:
```html
<!-- Hotels page -->
<button class="py-4 bg-theme-primary hover:bg-theme-primary text-white font-bold rounded-xl shadow-md transition hover:-translate-y-0.5 transform flex items-center justify-center gap-2">

<!-- Index page CTA -->
<a class="w-full sm:w-auto px-8 py-4 bg-white text-sky-800 font-bold rounded-xl hover:bg-slate-50 transition transform hover:-translate-y-0.5 shadow-md">

<!-- Plan My Layover -->
<button class="h-11 flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5">
```

**Issues:**
- Heights vary: `py-4` (16px padding), `h-11` (44px), `h-12` (48px), `!py-2 !px-4` (8px/16px padding)
- Border radius varies: `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-lg` (8px)
- Shadow varies: `shadow-md`, `shadow-lg`, `shadow-sm`, no shadow
- Transform varies: `hover:-translate-y-0.5`, `hover:-translate-y-1`, none
- All use `!important` via `.text-theme-primary` etc. but inline classes fight for specificity

---

## 10. Sector Theming Engine

The design-system.css defines a theming engine for 6 sectors:

| Theme Class | Primary Color | Hero Gradient |
|-------------|--------------|---------------|
| `.theme-hotels` | `#9a732c` (gold) | `#1e1b18 → #332d25` |
| `.theme-restaurants` | `#d84b06` (orange) | `#2c0e0e → #450a03` |
| `.theme-spa` | `#6d28d9` (violet) | `#160a2c → #18153c` |
| `.theme-gaming` | `#a21caf` (fuchsia) | `#2a082e → #161233` |
| `.theme-tours` | `#be123c` (rose) | `#370617 → #2c0735` |
| `.theme-transfers` | `#334155` (slate) | `#1a202c → #2d3748` |

**Issue:** These override `--primary` globally. On a hotels page with `.theme-hotels`, ALL `text-theme-primary`, `bg-theme-primary`, `border-theme-primary` resolve to gold `#9a732c`. This means body text colored with `text-theme-primary` becomes gold — which is the bug noted in the "themed body text fix" classes at the bottom of the file.

---

## 11. Inline CSS

### Pages with `<style>` tags: **NONE**
No HTML page in `frontend/src/pages/` contains a `<style>` block.

### Inline `style=""` Attributes
All inline styles are limited to `background-image` URLs for hero/map sections. No color, spacing, or layout styles are applied inline.

---

## 12. Unused / Underutilized CSS

| Class | Defined In | Used In HTML? |
|-------|-----------|---------------|
| `.glass-header` | design-system.css | No |
| `.glass-card` | design-system.css | No |
| `.stat-card` | design-system.css | No (index.html uses inline Tailwind) |
| `.icon-badge` | design-system.css | No |
| `.step-number` | design-system.css | No (index.html uses inline Tailwind) |
| `.testimonial-card` | design-system.css | No (HTML uses `bg-slate-50 p-8 rounded-2xl`) |
| `.faq-item` | design-system.css | No (HTML uses `bg-white rounded-2xl border`) |
| `.trust-badge` | design-system.css | No (HTML uses inline Tailwind) |
| `.price-tag` | design-system.css | No (HTML uses inline Tailwind) |
| `.search-field` | design-system.css | No (HTML uses inline Tailwind) |
| `.section-label` | design-system.css | No (HTML uses inline `text-sky-600 font-bold text-sm uppercase`) |
| `.section-title` | design-system.css | No (HTML uses inline `text-3xl sm:text-4xl font-extrabold`) |
| `.section-subtitle` | design-system.css | No (HTML uses inline `text-slate-650 max-w-xl mx-auto`) |
| `.hero-section` | design-system.css | No (HTML uses `relative min-h-[90vh] flex items-center`) |
| `.hero-content` | design-system.css | No |
| `.body-large` | design-system.css | No |
| `.body` | design-system.css | No |
| `.small` | design-system.css | No |
| `.caption` | design-system.css | No |
| `.text-hero` | design-system.css | No |
| `.icon-16/20/24/32` | design-system.css | No |
| `.cta-gradient` | design-system.css | No |

**~20+ component classes defined but never used in HTML.**

---

## 13. Summary of Issues

### Critical
1. **Conflicting `:root` variable values** between tokens.css and tailwind.css — different font sizes, radii, line-heights
2. **`.container` class conflict** — Tailwind responsive breakpoints vs. design-system fixed 1280px
3. **Duplicate files** — tokens.css and design-system.css exist in 2 locations each (100% identical)

### High
4. **Typography scale collapse** — design-system overrides Tailwind utilities, making `text-4xl` through `text-7xl` all render at 56px
5. **20+ unused component classes** in design-system.css — defined but never applied in HTML
6. **HTML uses inline Tailwind instead of design-system classes** — section labels, titles, subtitles, buttons, cards all bypass the design system
7. **`!important` overrides** — `.text-theme-primary`, `.bg-theme-primary` etc. use ` !important` which fights Tailwind's specificity

### Medium
8. **Sector theming breaks body text** — `text-theme-primary` resolves to sector color (gold, orange, etc.) making body text unreadable; patched with `.themed-body-text` workaround
9. **Button height inconsistency** — design-system defines 48px but HTML uses `py-4`, `h-11`, `h-12`, `!py-2` creating 4+ different button sizes
10. **Border radius inconsistency** — design-system uses `var(--radius)` (12px) but HTML also uses `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-lg` (8px)
11. **Two `tailwind-input.css` files** — root version imports tokens+design-system, frontend version only imports tailwindcss

### Low
12. **Redundant reset styles** — both Tailwind and design-system define `*, *::before, *::after` resets
13. **Shadow inconsistency** — design-system defines `--shadow-sm/lg/xl` but HTML also uses Tailwind's `shadow-sm`, `shadow-md`, `shadow-lg` with different values
14. **No CSS minification** — design-system.css (1065 lines) and tailwind.css (1822+ lines) are unminified

---

## 14. CSS Architecture Diagram

```
tokens.css (96 lines)
  └── defines :root CSS custom properties
  └── imported by design-system.css

design-system.css (1065 lines)
  ├── @import tokens.css
  ├── @layer base (reset, container, typography)
  ├── @layer utilities (overrides Tailwind text-* utilities)
  └── @layer components (buttons, cards, forms, modals, theming, nav, carousel, etc.)

tailwind.css (1822+ lines)
  ├── @layer theme (:root variables — CONFLICTS with tokens.css)
  ├── @layer base (reset — CONFLICTS with design-system.css)
  └── @layer utilities (Tailwind utilities — PARTIALLY OVERRIDDEN by design-system.css)

HTML pages load:
  1. css/tailwind.min.css (compiled Tailwind with embedded tokens)
  2. css/design-system.css (overrides Tailwind's typography + adds components)
```
