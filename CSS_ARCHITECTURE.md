# CSS Architecture — LayoverX Design System

## Overview

The LayoverX CSS architecture follows a **modular, single-responsibility** pattern. Each CSS file owns exactly one concern (variables, reset, typography, layout, etc.) and can be loaded independently or via the main entry point.

---

## File Structure

```
css/
├── index.css           ← Main entry point (imports all modules in order)
├── variables.css       ← Design tokens (CSS custom properties)
├── reset.css           ← CSS reset & base element styles
├── typography.css      ← Heading hierarchy, text utilities, section typography
├── layout.css          ← Container variants, section spacing, grid helpers
├── buttons.css         ← Button system (8 variants × 3 sizes)
├── cards.css           ← Card system (base + sector variants)
├── forms.css           ← Inputs, selects, textareas, validation, search
├── navigation.css      ← Navbar, scroll states, mobile menu
├── components.css      ← Modals, carousels, badges, toasts, FAQ, pagination, skeleton, empty state
├── themes.css          ← Sector theming engine (6 themes)
├── utilities.css       ← Icons, scrollbar, line-clamp, WCAG overrides
├── animations.css      ← Reveal, skeleton shimmer, reduced motion
└── responsive.css      ← Responsive typography overrides (sm/md/lg/xl/2xl)
```

---

## Cascade Order

The files must be loaded in this specific order (as defined in `css/index.css`):

```
Position | File             | Purpose
---------|------------------|-------------------------------------------
1        | variables.css    | CSS custom properties (colors, fonts, spacing)
2        | reset.css        | Box-sizing, margins, base element defaults
3        | typography.css   | h1-h6, .text-*, .section-* typography
4        | layout.css       | .container, .section, .hero-section, grids
5        | buttons.css      | .btn, .btn-primary, .btn-sm, etc.
6        | cards.css        | .card, .card-hotel, .card-img, etc.
7        | forms.css        | .form-group, .form-input, .search-field
8        | navigation.css   | .nav-link, #navbar scroll states
9        | components.css   | .modal, .carousel, .badge, .pagination
10       | themes.css       | .theme-hotels, .theme-restaurants, etc.
11       | utilities.css    | .icon-16, .no-scrollbar, .sr-only
12       | animations.css   | .reveal, @keyframes, reduced motion
13       | responsive.css   | @media text-* overrides at 5 breakpoints
```

### Why This Order

1. **Variables first** — everything references CSS custom properties
2. **Reset second** — establish consistent baseline before any component styles
3. **Typography third** — base heading/text styles needed by all components
4. **Layout fourth** — containers and spacing used by components
5. **Components fifth–ninth** — in order of dependency (buttons → cards → forms → nav → complex components)
6. **Themes tenth** — sector overrides must come after component definitions
7. **Utilities eleventh** — `!important` overrides that should win specificity
8. **Animations twelfth** — standalone, no dependencies
9. **Responsive last** — media query overrides must come after all base definitions

---

## Integration with Existing Build

### Current load order (in `head.html`):
```
1. tailwind.min.css       ← Compiled Tailwind utilities
2. tokens.css             ← Design tokens (our values win)
3. design-system.css      ← Monolithic design system
4. app.js                 ← Application JavaScript
```

### Future load order (migration target):
```
1. tailwind.min.css       ← Compiled Tailwind utilities
2. css/index.css          ← Modular design system entry point
3. app.js                 ← Application JavaScript
```

### No HTML changes needed during migration:
The `css/index.css` entry point means only one `<link>` tag change in `head.html`:
```html
<!-- Before -->
<link rel="stylesheet" href="css/design-system.css">

<!-- After -->
<link rel="stylesheet" href="css/index.css">
```

---

## Module Responsibilities

### `variables.css`
- All CSS custom properties on `:root`
- Colors, fonts, spacing, radius, shadows, transitions
- Container widths, sidebar width
- No selectors other than `:root`

### `reset.css`
- `*, *::before, *::after` box-sizing
- `html`, `body`, `a`, `img`, `button`, `input` base styles
- Focus-visible accessibility outlines
- No color/layout decisions — just normalization

### `typography.css`
- `h1`–`h6` element styles
- `.text-hero`, `.body-large`, `.body`, `.small`, `.caption`
- `.text-xs` through `.text-7xl` utility overrides
- `.section-label`, `.section-title`, `.section-subtitle`
- No color/layout concerns — only font-size, weight, line-height, letter-spacing

### `layout.css`
- `.container`, `.container-sm` through `.container-max`
- `.section`, `.section-sm`, `.section-lg`
- `.hero-section`, `.hero-content`
- `.cta-gradient`
- Grid helpers (`.grid-1`–`.grid-4`), flex helpers
- `.sidebar-sticky`, z-index hierarchy
- Responsive mobile/desktop visibility
- No typography or component-specific styles

### `buttons.css`
- `.btn` base (flex, height, padding, radius, transition)
- `.btn-sm`, `.btn-lg` size modifiers
- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-danger`, `.btn-link`, `.btn-white`
- `.btn-block`, `.btn-icon`
- Hover, active, disabled states
- No layout or typography concerns

### `cards.css`
- `.card` base (surface, border, shadow, hover lift)
- `.card-hotel`, `.card-restaurant`, `.card-transfer`, `.card-experience`, `.card-tour`, `.card-feature`, `.card-pricing`
- `.card-img-container`, `.card-img`, `.card-content`, `.card-footer`
- `.card-horizontal` for marketplace layout
- `.card-badge`, `.testimonial-card`
- No button or form styles

### `forms.css`
- `.form-group`, `.form-label`
- `.form-input`, `.form-select` (including select arrow)
- `textarea.form-input`
- `.input-error`, `.input-success`, `.form-error`
- `.search-field`, `.search-tab`
- `.form-checkbox`, `.form-radio`
- Focus states and validation
- No button or card styles

### `navigation.css`
- `.glass-header`, `.nav-link`, `.active-nav-link`
- `#navbar:not(.scrolled)` / `#navbar.scrolled` states
- `.plan-my-layover-btn` scroll-aware button
- Mobile menu visibility
- No form or card styles

### `components.css`
- `.modal-overlay`, `.modal-content`, `.modal-close`
- `.carousel-container`, `.carousel-item`
- `.stat-card`, `.icon-badge`, `.step-number`
- `.faq-item`, `.trust-badge`
- `.price-tag`, `.glass-card`
- `#toast-container`, `.toast`
- `.select-card`, `.badge` (primary/success/warning/danger)
- `.skeleton` + `@keyframes skeleton-shimmer`
- `.pagination`, `.pagination-item`
- `.empty-state`, `.empty-state-icon`, `.empty-state-title`, `.empty-state-text`
- Decoration mobile hide

### `themes.css`
- `.theme-hotels`, `.theme-restaurants`, `.theme-spa`, `.theme-gaming`, `.theme-tours`, `.theme-transfers`
- `.default-hero`
- `.theme-text-accent`, `.theme-badge`
- `.bg-theme-primary`, `.text-theme-primary`, `.border-theme-primary`, `.text-theme-accent`
- `.themed-body-text`, `.themed-muted-text`, `.themed-heading-text` (body text fix)
- No component-specific styles — only token overrides

### `utilities.css`
- `.icon-16`, `.icon-20`, `.icon-24`, `.icon-32`
- `.no-scrollbar`
- `.text-gray-650`, `.text-slate-650`, `.bg-gray-55`
- `.bg-emerald-650`, `.bg-amber-650`
- `.line-clamp-1`, `.line-clamp-2`, `.line-clamp-3`
- `.aspect-square`, `.aspect-video`, `.aspect-portrait`, `.aspect-card`
- `.sr-only` (visually hidden, accessible)
- No component styles

### `animations.css`
- `.reveal`, `.reveal.revealed`
- `:nth-child(1..4)` stagger delays
- `.fade-in`, `.fade-in.visible`
- `@keyframes shimmer`
- `@media (prefers-reduced-motion: reduce)` complete disable
- No layout or color concerns

### `responsive.css`
- `@media (min-width: 640px)` — `.sm\:text-*` utilities
- `@media (min-width: 768px)` — `.md\:text-*` utilities
- `@media (min-width: 1024px)` — `.lg\:text-*` utilities
- `@media (min-width: 1280px)` — `.xl\:text-*` utilities
- `@media (min-width: 1536px)` — `.\32xl\:text-*` utilities
- Only typography overrides — layout responsive goes in layout.css

---

## Naming Conventions

| Pattern | Example | When to Use |
|---------|---------|-------------|
| `.component` | `.card` | Base component class |
| `.component-variant` | `.btn-primary` | Variant of a component |
| `.component__element` | `.card-img` | Child element of a component |
| `.component--modifier` | `.card--horizontal` | State or modifier |
| `.is-*` | `.is-active` | JavaScript-driven states |
| `.has-*` | `.has-error` | State applied by parent |

### Current Design System Classes (prefixed pattern):
| Prefix | Example | Purpose |
|--------|---------|---------|
| `btn-` | `btn-primary` | Button variants |
| `card-` | `card-hotel` | Card sector variants |
| `form-` | `form-input` | Form elements |
| `modal-` | `modal-content` | Modal elements |
| `nav-` | `nav-link` | Navigation |
| `theme-` | `theme-hotels` | Sector theming |
| `section-` | `section-title` | Section typography |
| `icon-` | `icon-24` | Icon sizing |
| `themed-` | `themed-body-text` | Themed page body fix |

---

## Breakpoint Reference

| Name | Min Width | Target Devices | Suffix |
|------|-----------|----------------|--------|
| Default | 0 | Mobile portrait | *(none)* |
| `sm` | 640px | Mobile landscape, small tablet | `.sm\:*` |
| `md` | 768px | Tablet portrait | `.md\:*` |
| `lg` | 1024px | Desktop, tablet landscape | `.lg\:*` |
| `xl` | 1280px | Wide desktop | `.xl\:*` |
| `2xl` | 1536px | Large desktop | `.\32xl\:*` |

---

## Migration Path

### Phase 1: Create (current)
All modular CSS files exist in `css/`. The monolithic `design-system/index.css` remains the active stylesheet.

### Phase 2: Validate
Run visual regression tests comparing `design-system/index.css` vs `css/index.css` on all 30 pages.

### Phase 3: Activate
Replace the `<link>` in `head.html`:
```html
<!-- Remove -->
<link rel="stylesheet" href="css/design-system.css">

<!-- Add -->
<link rel="stylesheet" href="css/index.css">
```

### Phase 4: Cleanup
Remove `design-system/index.css` and `frontend/css/design-system.css` after confirming no regressions.

---

## Performance

- **File count:** 14 CSS files (including entry point)
- **Total size:** ~16 KB uncompressed (estimated)
- **HTTP/2 multiplexing:** All files served in parallel
- **Critical CSS path:** Inline `variables.css` + `reset.css` in `<head>` for above-fold content
- **No unused CSS imports:** Each module is self-contained with no cross-dependencies
