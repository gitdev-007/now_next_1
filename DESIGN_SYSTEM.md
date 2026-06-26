# LayoverX Design System

Unified design language for the LayoverX travel platform — inspired by Booking.com, MakeMyTrip, Airbnb, and Tripadvisor. This document is the single source of truth for all visual and interaction standards.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Architecture](#2-architecture)
3. [Design Tokens](#3-design-tokens)
4. [Component Catalog](#4-component-catalog)
5. [Layout Standards](#5-layout-standards)
6. [Responsive Standards](#6-responsive-standards)
7. [Animation Standards](#7-animation-standards)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Sector Theming](#9-sector-theming)
10. [Migration Guide](#10-migration-guide)

---

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Clarity first** | Every UI element must communicate its purpose instantly. No ambiguity, no decoration without function. |
| **Consistency over cleverness** | Use the same patterns everywhere. One button style. One card style. One form style. |
| **Trust through polish** | Smooth animations, crisp typography, generous whitespace — these communicate reliability. |
| **Mobile-first** | Every component must work at 320px before it works at 1920px. |
| **Accessibility is non-negotiable** | WCAG 2.1 AA minimum. Color contrast ≥ 4.5:1 for text, focus indicators on all interactive elements. |

---

## 2. Architecture

### CSS Layer Architecture (Current)

```
┌─────────────────────────────────────────────┐
│  tailwind.min.css (Tailwind v4.3.1)          │  ← Loaded first (utilities + reset)
├─────────────────────────────────────────────┤
│  tokens.css (:root CSS custom properties)    │  ← Loaded second (our values win over Tailwind)
├─────────────────────────────────────────────┤
│  design-system.css (component classes)       │  ← Loaded third (references tokens)
├─────────────────────────────────────────────┤
│  app.js (script)                             │  ← Loaded last (deferred)
└─────────────────────────────────────────────┘
```

### CSS Layer Architecture (Modular — Migration Target)

```
┌─────────────────────────────────────────────┐
│  tailwind.min.css (Tailwind v4.3.1)          │  ← Loaded first
├─────────────────────────────────────────────┤
│  css/index.css (modular entry point)         │  ← Loaded second
│  ├── variables.css                           │
│  ├── reset.css                               │
│  ├── typography.css                          │
│  ├── layout.css                              │
│  ├── buttons.css                             │
│  ├── cards.css                               │
│  ├── forms.css                               │
│  ├── navigation.css                          │
│  ├── components.css                          │
│  ├── themes.css                              │
│  ├── utilities.css                           │
│  ├── animations.css                          │
│  └── responsive.css                          │
├─────────────────────────────────────────────┤
│  app.js (script)                             │  ← Loaded last
└─────────────────────────────────────────────┘
```

### File Structure

```
styles/tokens/tokens.css           ← SINGLE SOURCE OF TRUTH for design tokens
design-system/index.css            ← Source design system (monolithic, current)
frontend/css/design-system.css     ← Build output (copy of design-system/index.css)
frontend/styles/tokens/tokens.css  ← Build output (copy of tokens.css)
frontend/css/tailwind.min.css      ← Compiled Tailwind (no manual edits)
css/                               ← Modular CSS architecture (migration target)
├── index.css                      ← Entry point (imports all modules)
├── variables.css                  ← Design tokens
├── reset.css                      ← CSS reset
├── typography.css                 ← Heading hierarchy & utilities
├── layout.css                     ← Containers, sections, grids
├── buttons.css                    ← Button system
├── cards.css                      ← Card system
├── forms.css                      ← Form elements
├── navigation.css                 ← Navbar & scroll states
├── components.css                 ← Modals, carousels, badges, toasts, etc.
├── themes.css                     ← Sector theming engine
├── utilities.css                  ← Icons, WCAG overrides, helpers
├── animations.css                 ← Reveal, skeleton, reduced motion
└── responsive.css                 ← Responsive typography overrides
```

### Why Tokens Load After Tailwind

Tailwind's compiled `tailwind.min.css` defines `:root` CSS custom properties (e.g., `--font-hero`, `--radius`) with its own defaults. By loading `tokens.css` **after** Tailwind, our custom values override Tailwind's. This gives us full control of the design token scale while keeping Tailwind's utility class system available.

### When to Use Each File

| File | Edit When… |
|------|------------|
| `tokens.css` | Adding/changing colors, fonts, spacing, radius, shadows, transitions |
| `design-system/index.css` | Adding/changing component classes (buttons, cards, forms, modals, etc.) |
| `.html` pages | Building page layouts using design system classes |
| `tailwind-input.css` | Only when adding new Tailwind plugins or layers |

### Component File Structure

```
frontend/src/components/
├── head.html           ← <head> metadata, CSS links, JS scripts
├── header.html         ← Fixed navbar (logo, nav links, auth, mobile menu)
├── footer.html         ← Footer grid with links, social, legal
└── auth-modals.html    ← Login, signup, forgot password, trip context modals
```

**Proposal for new shared components** (extract from source pages):

```
frontend/src/components/
├── marketplace-hero.html    ← Pattern A hero (theme-hero + breadcrumb + feature grid)
├── marketplace-filter.html  ← Filter sidebar (checkboxes + clear all)
├── marketplace-card.html    ← Horizontal card (image left, content right)
├── carousel-section.html    ← Carousel with section header
├── faq-section.html         ← FAQ accordion set
├── testimonial-section.html ← Testimonial cards
├── cta-section.html         ← CTA gradient banner
├── stats-section.html       ← Trust indicators / stat badges
├── empty-state.html         ← No results / no content state
├── skeleton-card.html       ← Loading skeleton placeholder
└── breadcrumb.html          ← Breadcrumb nav
```

---

## 3. Design Tokens

All tokens are defined in `styles/tokens/tokens.css` as CSS custom properties on `:root`.

### 3.1 Color Palette

#### Semantic Colors

```css
/* Primary — Sky 600 (high contrast, WCAG AA compliant) */
--primary:       #0284c7;
--primary-dark:  #0369a1;
--primary-light: #38bdf8;
--primary-glow:  rgba(2, 132, 199, 0.12);

/* Secondary — Slate */
--secondary:       #0f172a;
--secondary-light: #1e293b;

/* Accent */
--accent: #f59e0b;  /* Amber 500 */
```

#### Status Colors

```css
--success:       #10b981;
--success-light: #ecfdf5;
--warning:       #f59e0b;
--warning-light: #fffbeb;
--danger:        #ef4444;
--danger-light:  #fef2f2;
--info:          #3b82f6;
--info-light:    #eff6ff;
```

#### Surface & Background

```css
--background:      #f8fafc;  /* Slate 50 */
--surface:         #ffffff;
--surface-muted:   #f1f5f9;  /* Slate 100 */
--border:          #e2e8f0;  /* Slate 200 */
--border-light:    rgba(226, 232, 240, 0.6);
--border-focus:    #38bdf8;
```

#### Text Contrast System

```css
--text-primary:   #0f172a;  /* Slate 900 — headings */
--text-secondary: #334155;  /* Slate 700 — body */
--text-muted:     #475569;  /* Slate 600 — captions */
--text-on-dark:   #f8fafc;  /* Slate 50 — on dark bg */
```

**WCAG 2.1 AA compliance:**

| Pair | Contrast Ratio |
|------|---------------|
| `--text-primary` (#0f172a) on white | 15.3:1 ✓ |
| `--text-secondary` (#334155) on white | 9.7:1 ✓ |
| `--text-muted` (#475569) on white | 6.9:1 ✓ |
| `--primary` (#0284c7) on white | 5.2:1 ✓ |
| `--text-on-dark` (#f8fafc) on #0f172a | 15.3:1 ✓ |

### 3.2 Typography

#### Font Families

```css
--font-primary: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono:    ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace;
```

#### Type Scale

| Token | Size | Maps to | Usage |
|-------|------|---------|-------|
| `--font-hero` | 3.5rem (56px) | `.text-4xl`..`.text-7xl` | Hero headings only |
| `--font-h1` | 2.5rem (40px) | `h1`, `.text-3xl` | Page titles |
| `--font-h2` | 1.875rem (30px) | `h2`, `.text-2xl` | Section titles |
| `--font-h3` | 1.375rem (22px) | `h3`, `.text-xl` | Subsection titles |
| `--font-h4` | 1.125rem (18px) | `h4`, `.text-lg` | Card titles |
| `--font-h5` | 1rem (16px) | `h5` | Minor headings |
| `--font-h6` | 0.9375rem (15px) | `h6` | Smallest headings |
| `--font-body` | 1rem (16px) | `body`, `p`, `.text-base` | Body copy |
| `--font-body-large` | 1.125rem (18px) | `.body-large` | Large body / lead |
| `--font-secondary` | 0.9375rem (15px) | `.small` | Secondary text |
| `--font-caption` | 0.875rem (14px) | `.text-sm` | Captions, labels |
| `--font-small` | 0.875rem (14px) | — | Small text (alias) |
| `--font-tiny` | 0.75rem (12px) | `.text-xs` | Tiny text, legal |

#### Line Heights

| Token | Value | Used With |
|-------|-------|-----------|
| `--lh-hero` | 1.1 | Hero text |
| `--lh-h1` | 1.2 | h1 |
| `--lh-h2` | 1.25 | h2 |
| `--lh-h3` | 1.3 | h3 |
| `--lh-h4` | 1.35 | h4 |
| `--lh-h5` | 1.4 | h5 |
| `--lh-h6` | 1.45 | h6 |
| `--lh-body` | 1.5 | body, p |
| `--lh-small` | 1.5 | small, caption |

### 3.3 Spacing System (8-Point Grid)

| Token | Value |
|-------|-------|
| `--space-4` | 4px |
| `--space-8` | 8px |
| `--space-12` | 12px |
| `--space-16` | 16px |
| `--space-24` | 24px |
| `--space-32` | 32px |
| `--space-48` | 48px |
| `--space-64` | 64px |
| `--space-80` | 80px |
| `--space-96` | 96px |
| `--space-128` | 128px |

**Spacing rules:**
- Section padding: `--space-64` (mobile), `--space-80` (desktop)
- Card padding: `--space-24`
- Button padding: `--space-24` (sides), `--space-8` (gap)
- Form field padding: `--space-16` (sides)
- Grid gaps: `--space-24` between cards
- Content gaps inside cards: `--space-8`

### 3.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Buttons (`.btn-sm`), compact elements |
| `--radius` | 12px | Buttons, inputs, select, cards |
| `--radius-lg` | 16px | Cards, modals, search fields |
| `--radius-xl` | 24px | Modals, hero CTAs |
| `--radius-pill` | 999px | Toasts, badges, pills, tags |
| `--radius-full` | 50% | Circular avatars, icon containers |

### 3.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(15,23,42,0.05), 0 1px 2px -1px rgba(15,23,42,0.05)` | Cards (resting) |
| `--shadow` | `0 4px 6px rgba(15,23,42,0.05), 0 2px 4px -2px rgba(15,23,42,0.05)` | Modals, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(15,23,42,0.05), 0 4px 6px -4px rgba(15,23,42,0.05)` | Cards (hovered), toasts |
| `--shadow-xl` | `0 20px 25px rgba(15,23,42,0.06), 0 8px 10px -6px rgba(15,23,42,0.06)` | Modals (active) |
| `--shadow-dropdown` | `0 8px 24px rgba(15,23,42,0.12)` | Dropdown menus, popovers |
| `--shadow-floating` | `0 16px 48px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)` | Floating elements, FABs |
| `--shadow-primary` | `0 4px 14px rgba(2,132,199,0.25)` | `.btn-primary` glow |

### 3.7 Container Width Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 640px | Small / narrow content |
| `--container-md` | 768px | Medium content |
| `--container-lg` | 1024px | Standard content |
| `--container-xl` | 1280px | Default page width |
| `--container-max` | 1440px | Maximum content width |

### 3.8 Font Weight Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--fw-regular` | 400 | Body text |
| `--fw-medium` | 500 | Emphasized body |
| `--fw-semibold` | 600 | Buttons, h5, h6 |
| `--fw-bold` | 700 | h3, h4 |
| `--fw-extrabold` | 800 | h1, h2, labels, section-title |
| `--fw-black` | 900 | Hero text |

### 3.9 Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition` | `all 0.25s cubic-bezier(0.4, 0, 0.2, 1)` | General interactions |
| `--transition-fast` | `all 0.15s cubic-bezier(0.4, 0, 0.2, 1)` | Hover states, micro-interactions |

---

## 4. Component Catalog

### 4.1 Button System

| Class | Purpose | Height | Padding | Radius | Styles |
|-------|---------|--------|---------|--------|--------|
| `.btn` | Base | 48px | 0 24px | 12px | `inline-flex`, `font-weight: 600` |
| `.btn-primary` | Primary CTA | — | — | — | Sky 600 bg, white text, shadow-primary glow |
| `.btn-secondary` | Secondary CTA | — | — | — | Slate 900 bg, white text |
| `.btn-outline` | Outline | — | — | — | Transparent, 2px primary border |
| `.btn-ghost` | Ghost | — | — | — | Transparent, no border |
| `.btn-danger` | Destructive | — | — | — | Red bg, white text |
| `.btn-sm` | Compact | 40px | 0 16px | 6px | Smaller font |
| `.btn-lg` | Large | 56px | 0 32px | 12px | Larger hit area |

**Button content rules:**
- Icons use `icon-16`, `icon-20`, `icon-24` classes for sizing
- Always include `gap-0.5` (8px) between icon and text
- Dropdown chevrons use a 16×16 SVG rotated on open

**Button states:**
| State | Style |
|-------|-------|
| Default | As defined by variant |
| Hover | `translateY(-1px)`, intensified bg/shadow |
| Active/Focus | Focus ring: 3px `--primary-light` outline + 2px offset |
| Loading | Show spinner icon, disable pointer events |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` |

### 4.2 Card System

| Class | Purpose |
|-------|---------|
| `.card` | Base card (all variants share this) |
| `.card-hotel` | Hotel card (uses `.card` styles implicitly) |
| `.card-restaurant` | Restaurant card |
| `.card-transfer` | Transfer card |
| `.card-experience` | Experience card |
| `.card-tour` | Tour card |
| `.card-feature` | Feature/value prop card |
| `.card-pricing` | Pricing/plan card |
| `.card-img-container` | Image wrapper (3:2 aspect ratio) |
| `.card-img` | Image with cover fit + zoom on hover |
| `.card-content` | Content padding (24px) + gap (8px) |

**Card behavior:**
- Resting: `--shadow-sm`, 1px `--border-light` border
- Hover: `translateY(-4px)`, `--shadow-lg`, border tinted with primary
- Image scales 1.04x on hover (`.card-img` transition 0.6s)
- Content gap always 8px (consistent vertical rhythm)

### 4.3 Form System

| Class | Purpose |
|-------|---------|
| `.form-group` | Wrapper (flex column, 8px gap) |
| `.form-label` | Label (12px, 800 weight, uppercase, 0.05em tracking) |
| `.form-input` | Text input, textarea (48px height, 16px padding) |
| `.form-select` | Select dropdown (same as input) |
| `.input-error` | Error state (red border) |
| `.input-success` | Success state (green border) |

**Form behavior:**
- Focus: primary border + 4px `--primary-glow` box-shadow
- Error: `--danger` border, 4px red glow on focus
- Height: 48px standard, textarea auto-height with 12px/16px padding
- No placeholder styling override (keep Tailwind default)

### 4.4 Modal System

| Class | Purpose |
|-------|---------|
| `.modal-overlay` | Fixed fullscreen backdrop (dark + blur, hidden by default) |
| `.modal-content` | White rounded panel (max-width 32rem, 90vh max-height) |
| `.modal-close` | Close button (top-right, rotates 90° on hover) |

**Modal behavior:**
- Show: add `.flex` class to overlay (activates `display: flex` + `opacity: 1`)
- Content: scales from 0.95 to 1 on open
- Close: rotates icon 90°, reduces opacity
- Backdrop: `rgba(15, 23, 42, 0.6)` with 12px blur

### 4.5 Navigation

| Class | Purpose |
|-------|---------|
| `.nav-link` | Base nav link (gray text, primary hover) |
| `.active-nav-link` | Active page indicator (primary color + underline) |
| `.plan-my-layover-btn` | Special CTA button in navbar (adapts to scroll state) |
| `.glass-header` | Fixed header with blur background |

**Navbar scroll states:**
- Not scrolled (on hero): transparent bg, white text, white ghost buttons
- Scrolled: white glass bg (85% opacity + 20px blur), dark text, primary glow buttons

### 4.6 Search System

| Class | Purpose |
|-------|---------|
| `.search-tab` | Tab button (transparent, primary hover/active) |
| `.search-field` | Search input group (muted bg, focus-within primary border) |

### 4.7 Hero System

| Class | Purpose |
|-------|---------|
| `.hero-section` | Full-viewport hero (90vh min-height, centered) |
| `.hero-content` | Hero inner (96px top padding to clear navbar) |

### 4.8 Section Typography

| Class | Purpose | Equivalent Inline Tailwind |
|-------|---------|---------------------------|
| `.section-label` | Uppercase label above title | `inline-block text-sky-600 font-bold text-sm uppercase tracking-wider mb-2` |
| `.section-title` | Section heading | `text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4` |
| `.section-subtitle` | Section description | `text-slate-650 max-w-xl mx-auto` |

### 4.9 Visual Elements

| Class | Purpose |
|-------|---------|
| `.icon-badge` | Feature icon container (48px × 48px, rounded) |
| `.step-number` | How-it-works step number (64px × 64px, primary bg) |
| `.testimonial-card` | Testimonial quote card |
| `.faq-item` | FAQ accordion item |
| `.trust-badge` | Trust metric badge (vertical layout) |
| `.price-tag` | Price display (label + value) |
| `.stat-card` | Hero stat/metric card |
| `.glass-card` | Frosted glass card overlay |
| `.cta-gradient` | CTA section gradient background |
| `.reveal` | Scroll-reveal animation wrapper |

### 4.10 Utility Classes

| Class | Purpose |
|-------|---------|
| `.icon-16` | 16×16 icon sizing |
| `.icon-20` | 20×20 icon sizing |
| `.icon-24` | 24×24 icon sizing |
| `.icon-32` | 32×32 icon sizing |
| `.no-scrollbar` | Hide scrollbar (carousels) |
| `.select-card` | Selectable card highlight on hover |
| `.themed-body-text` | Force body text to gray (override sector theming) |
| `.themed-muted-text` | Force muted text to gray |
| `.themed-heading-text` | Force heading text to dark slate |
| `.text-gray-650` | Custom muted text color |
| `.text-slate-650` | Alias for muted text |
| `.bg-gray-55` | Custom muted surface bg |
| `.bg-emerald-650` | Darker emerald for WCAG compliance |
| `.bg-amber-650` | Darker amber for WCAG compliance |

### 4.11 Toast / Notification System

| Class | Purpose |
|-------|---------|
| `#toast-container` | Fixed top-center container (z-index 9999) |
| `.toast` | Individual toast (pill shape, slide-down animation) |
| `.toast-show` | Visible state (opacity 1, translateY 0) |
| `.toast-success` | Green icon indicator |
| `.toast-error` | Red icon indicator |
| `.toast-info` | Primary icon indicator |

### 4.12 Carousel System

| Class | Purpose |
|-------|---------|
| `.carousel-container` | Horizontal scroll wrapper (snap, no scrollbar) |
| `.carousel-item` | Individual slide (33% on desktop, 50% tablet, 85% mobile) |

### 4.13 Badge & Tag System

| Class | Purpose |
|-------|---------|
| `.badge` | Base badge (inline-flex, pill shape, tiny text) |
| `.badge-primary` | Primary color badge |
| `.badge-success` | Green success badge |
| `.badge-warning` | Amber warning badge |
| `.badge-danger` | Red danger badge |

```html
<span class="badge badge-primary">Featured</span>
<span class="badge badge-success">Verified</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Cancelled</span>
```

**Tag usage:** Tags use the same `.badge` classes. For removable tags, append a close button:
```html
<span class="badge badge-primary">
  Filter Tag
  <button class="icon-16 ml-1" aria-label="Remove">×</button>
</span>
```

### 4.14 Pagination

| Class | Purpose |
|-------|---------|
| `.pagination` | Flex container for page items |
| `.pagination-item` | Individual page number / arrow |
| `.pagination-item.active` | Current page indicator |
| `.pagination-item.disabled` | Disabled arrow |

```html
<nav class="pagination" aria-label="Page navigation">
  <span class="pagination-item disabled">‹</span>
  <span class="pagination-item active">1</span>
  <span class="pagination-item">2</span>
  <span class="pagination-item">3</span>
  <span class="pagination-item">›</span>
</nav>
```

### 4.15 Empty State

| Class | Purpose |
|-------|---------|
| `.empty-state` | Centered container (text-align: center, padding) |
| `.empty-state-icon` | Large icon (3rem, muted) |
| `.empty-state-title` | Heading (h3-size, bold, primary text) |
| `.empty-state-text` | Description (body-size, muted, max 24rem) |

```html
<div class="empty-state">
  <div class="empty-state-icon">🔍</div>
  <h3 class="empty-state-title">No results found</h3>
  <p class="empty-state-text">Try adjusting your filters or search criteria</p>
  <button class="btn btn-primary">Clear All Filters</button>
</div>
```

### 4.16 Skeleton Loading

| Class | Purpose |
|-------|---------|
| `.skeleton` | Animated shimmer placeholder (any element shape) |

Uses `@keyframes skeleton-shimmer` with a linear gradient sweep.

```html
<div class="space-y-4">
  <div class="skeleton h-52"></div>
  <div class="skeleton h-4 w-3/4"></div>
  <div class="skeleton h-4 w-1/2"></div>
</div>
```

---

## 5. Layout Standards

### 5.1 Container

| Class | Max Width | Use Case |
|-------|-----------|----------|
| `.container` | 1280px | Default page width |
| `.container-sm` | 640px | Narrow content (forms, auth) |
| `.container-md` | 768px | Medium content |
| `.container-lg` | 1024px | Standard content columns |
| `.container-xl` | 1280px | Wide content (same as default) |
| `.container-max` | 1440px | Maximum width, edge-to-edge |
| `.container-narrow` | 48rem (768px) | Reading / article content |

- All containers: `width: 100%`, `margin: auto`
- Padding: 16px (mobile), 24px (640px+), 32px (1024px+)

### 5.2 Section Spacing

- Mobile: `py-16` (64px top + bottom)
- Desktop (768px+): `py-20` (80px top + bottom)
- Section between different backgrounds: always use `.section`

### 5.3 Grid Patterns

| Pattern | Classes | Column Count |
|---------|---------|-------------|
| Value props (index) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` | 1→2→4 |
| Service carousel | `.carousel-container` with `.carousel-item` | 3→2→1 |
| Featured experiences | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | 1→2→3 |
| Testimonials | `grid grid-cols-1 md:grid-cols-3 gap-6` | 1→3 |
| Trust/Stats | `grid grid-cols-2 md:grid-cols-4 gap-8` | 2→4 |
| How it works | `flex flex-col md:flex-row gap-8` | 1→3 |
| Footer | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8` | 1→2→4 |
| Pricing | `grid grid-cols-1 md:grid-cols-3 gap-6` | 1→3 |

### 5.4 Z-Index Hierarchy

| Layer | Z-Index | Elements |
|-------|---------|----------|
| Base | auto | Page content |
| Sticky | 100 | Filter sidebar |
| Fixed header | 1000 | Navbar |
| Modal overlay | 1500 | Modals, backdrops |
| Toast | 9999 | Toast notifications |

---

## 6. Responsive Standards

### Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Default | < 640px | Mobile (portrait) |
| `sm` | 640px+ | Mobile (landscape), small tablet |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Desktop |
| `xl` | 1280px+ | Wide desktop |

### Responsive Rules

1. **Hero sections**: Full viewport height on mobile, reduced to 60vh on desktop
2. **Cards**: Single column on mobile, 2 columns on tablet, 3-4 columns on desktop
3. **Forms**: Full width on mobile, max-width 480px on desktop
4. **Navigation**: Hamburger menu on mobile, horizontal bar on desktop
5. **Footers**: Single column on mobile, 4 columns on desktop
6. **Modals**: Full-screen on mobile (< 640px), centered panel on desktop
7. **Carousels**: 85% item width on mobile, 50% on tablet, 33% on desktop
8. **Images**: Use `aspect-ratio` for consistent proportions across breakpoints

### Touch Targets (Mobile)

- Minimum touch target: 44px × 44px (WCAG 2.5.5)
- Buttons default to 48px height
- Nav links maintain 44px+ hit area

---

## 7. Animation Standards

### Duration & Easing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button hover, color transitions |
| Standard | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Card hover, modal open/close |
| Emphasis | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Card hover lift, image zoom |
| Page reveal | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll-triggered `.reveal` |

### Animation Types

| Animation | CSS | Applies To |
|-----------|-----|------------|
| Hover lift | `transform: translateY(-4px)` | Cards |
| Hover lift (micro) | `transform: translateY(-1px)` | Buttons |
| Image zoom | `transform: scale(1.04)` | `.card-img` on card hover |
| Fade in up | `opacity: 0 → 1, translateY(24px → 0)` | `.reveal` sections |
| Stagger | `transition-delay: 0s, 0.08s, 0.16s, 0.24s` | `.reveal:nth-child(n)` |
| Modal scale | `transform: scale(0.95 → 1)` | `.modal-content` on open |
| Toast slide | `translateY(-1rem → 0), scale(0.95 → 1)` | `.toast` show/hide |
| Button press | `transform: translateY(0)` | Active state |
| Rotate (close) | `transform: rotate(90deg)` | `.modal-close` hover |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility Standards

### 8.1 Color Contrast

| Text Type | Minimum Ratio | Our Ratios |
|-----------|---------------|------------|
| Body text | 4.5:1 | 9.7:1 (Slate 700 on white) |
| Large text (18px+ bold, 24px+ regular) | 3:1 | 15.3:1 (Slate 900 on white) |
| UI elements (focus rings, borders) | 3:1 | 5.2:1 (Sky 600 on white) |

### 8.2 Focus Indicators

- All interactive elements use `:focus-visible` with 3px `--primary-light` outline + 2px offset
- Never use `outline: none` without providing a visible alternative

### 8.3 Keyboard Navigation

- All interactive elements must be keyboard accessible (Tab, Enter, Escape)
- Modals trap focus when open (Tab cycles within modal)
- Escape key closes modals, dropdowns, and mobile menus
- Carousels support arrow key navigation

### 8.4 Semantic HTML

- Use `<nav>` for navigation, `<main>` for primary content, `<footer>` for footers
- Headings must follow hierarchy (h1 → h2 → h3 → h4, never skip levels)
- Buttons use `<button>`, links use `<a>`, never the reverse
- Forms use `<label>` elements, never placeholder-only identification
- Images must have `alt` attributes (empty `alt=""` for decorative images)

### 8.5 ARIA

- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title
- Mobile menu: `aria-expanded` on toggle button
- Carousels: `role="region"`, `aria-roledescription="carousel"`, `aria-label`
- Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"` with `aria-selected`
- Form errors: `aria-describedby` connecting error message to input
- Toast: `role="alert"`, `aria-live="polite"`

---

## 9. Sector Theming

### Theme Classes

| Theme | Sector | Primary Color | Hero Gradient |
|-------|--------|--------------|---------------|
| `.theme-hotels` | Hotels | `#9a732c` Gold | `#1e1b18 → #332d25` |
| `.theme-restaurants` | Restaurants | `#d84b06` Orange | `#2c0e0e → #450a03` |
| `.theme-spa` | Spa & Wellness | `#6d28d9` Violet | `#160a2c → #18153c` |
| `.theme-gaming` | Gaming | `#a21caf` Fuchsia | `#2a082e → #161233` |
| `.theme-tours` | Tours | `#be123c` Rose | `#370617 → #2c0735` |
| `.theme-transfers` | Transfers | `#334155` Slate | `#1a202c → #2d3748` |

### Theming Utilities

| Class | Effect |
|-------|--------|
| `.theme-hero` | Applies hero gradient from themed `--theme-hero-from`/`--theme-hero-to` |
| `.theme-text-accent` | Gradient text (primary → primary-light) |
| `.theme-badge` | Glass badge with themed colors |
| `.bg-theme-primary` | Background = sector primary |
| `.text-theme-primary` | Text color = sector primary |
| `.border-theme-primary` | Border = sector primary |
| `.text-theme-accent` | Text = sector primary-light |

### Critical: Themed Body Text Fix

**Problem:** On a hotels page, `text-theme-primary` resolves to gold (#9a732c), making body text unreadable.

**Solution:** Use these classes for body text on themed pages:

| Class | Color | When to Use |
|-------|-------|-------------|
| `.themed-body-text` | Slate 700 (#334155) | Paragraphs, descriptions |
| `.themed-muted-text` | Slate 600 (#475569) | Subtitles, captions |
| `.themed-heading-text` | Slate 900 (#0f172a) | Headings within themed sections |

---

## 10. Migration Guide

### Step 1: Replace Section Headers

Replace this pattern (found on all 30 pages):
```html
<span class="inline-block text-sky-600 font-bold text-sm uppercase tracking-wider mb-2">Label</span>
<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Title</h2>
<p class="text-slate-650 max-w-xl mx-auto">Subtitle</p>
```

With:
```html
<span class="section-label">Label</span>
<h2 class="section-title">Title</h2>
<p class="section-subtitle">Subtitle</p>
```

### Step 2: Replace Buttons

Replace inline button patterns with `.btn` + variant:
```html
<!-- Before -->
<a class="px-8 py-4 bg-sky-600 text-white font-bold rounded-xl ...">Book Now</a>

<!-- After -->
<a class="btn btn-primary btn-lg">Book Now</a>
```

### Step 3: Replace Cards

Replace inline card markup with `.card`:
```html
<!-- Before -->
<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col md:flex-row">

<!-- After -->
<article class="card card-hotel flex-col md:flex-row">
```

### Step 4: Replace Buttons in Card Footers

```html
<!-- Before -->
<button class="!py-2 !px-4 text-xs font-bold bg-theme-primary ...">View Details</button>

<!-- After -->
<button class="btn btn-ghost btn-sm">View Details</button>
```

### Step 5: Replace Search Form Buttons

```html
<!-- Before -->
<button class="py-4 bg-theme-primary hover:bg-theme-primary text-white font-bold rounded-xl ...">Search</button>

<!-- After -->
<button class="btn btn-primary btn-lg w-full">Search</button>
```

### Step 6: Replace Filter Sidebar Headers

```html
<!-- Before -->
<h4 class="text-xs font-bold text-theme-primary uppercase tracking-wider mb-3">Price Range</h4>

<!-- After -->
<h4 class="form-label mb-3">Price Range</h4>
```

### Step 7: Replace Marketplace Card Body Text

```html
<!-- Before -->
<p class="text-theme-primary text-sm line-clamp-2">{{description}}</p>

<!-- After -->
<p class="themed-body-text text-sm line-clamp-2">{{description}}</p>
```

### Step 8: Replace View Details Links

```html
<!-- Before -->
<a href="#" class="text-theme-primary font-bold text-sm">View Details →</a>

<!-- After -->
<a href="#" class="btn btn-ghost btn-sm">View Details</a>
```

### Step 9: Replace Testimonial Cards

```html
<!-- Before -->
<div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">

<!-- After -->
<div class="testimonial-card">
```

### Step 10: Replace FAQ Items

```html
<!-- Before -->
<details class="bg-white rounded-2xl border border-gray-200 p-4 group">

<!-- After -->
<details class="faq-item p-6 group">
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-25 | Initial comprehensive design system specification |
