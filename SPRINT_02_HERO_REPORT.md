# Sprint 02 — Hero Section Redesign

## Overview

Complete redesign of the LayoverX hero section to match premium travel-tech standards (Airbnb, Booking.com, Stripe, Google Travel). Focused on conversion, clarity, and premium visual quality.

## Files Modified

| File | Change |
|------|--------|
| `frontend/pages/index.html` | Hero and search sections replaced — new semantic markup, badge, headline, CTAs, stats row, redesigned search card |
| `frontend/src/pages/index.html` | Synced dev copy |
| `css/hero.css` | **New file** — 350+ lines: hero background, typography, CTA specs, search card, responsive breakpoints |
| `frontend/css/hero.css` | Build copy of hero.css |
| `css/index.css` | Added `@import "./hero.css"` import |
| `frontend/css/index.css` | Synced import |

## Hero Section Improvements

### Background
- Deep gradient (`#0c4a6e` → `#082f49`) with radial overlay pattern for depth
- Subtle glow effect (right-side radial gradient) for premium feel
- Multiple CSS layers (`hero-bg-pattern`, `hero-bg-glow`) for visual richness
- No image dependency — works instantly, no loading delay

### Badge
- Pill-shaped label: "Mumbai Airport Transit Platform" with animated dot
- Glass effect: `backdrop-filter: blur(8px)`, semi-transparent border
- Pulse animation on the status dot (2s ease-in-out)

### Headline
- "Make the Most of Your Mumbai Layover" — benefit-driven, clear, premium
- Desktop: 56px (3.5rem), Tablet: 44px (2.75rem), Mobile: 34px (2.125rem)
- 900 weight, -0.035em letter-spacing, 1.08 line-height
- Max-width: 680px, centered

### Subtitle
- "Hotels, dining, spas, tours, and transfers — curated around your flight schedule. Turn airport waiting into memorable experiences."
- 18px, 400 weight, 1.6 line-height
- Max-width: 560px, centered
- Clear value proposition in under 5 seconds

### Primary CTA — "Plan My Layover"
- Height: 56px
- Padding: 0 2.25rem
- Border-radius: 14px
- Font: 16px/600
- White background with dark text (high contrast on hero)
- Strong shadow: `0 4px 20px rgba(0,0,0,0.15)`
- Hover: `translateY(-2px)`, elevated shadow, background shift
- Arrow icon with hover slide animation

### Secondary CTA — "Explore Services"
- Height: 56px (matching primary for visual balance)
- Transparent with 2px white border (rgba(255,255,255,0.25))
- Hover: fills with `rgba(255,255,255,0.1)`, strengthens border, lifts

### Stats Row
- 4 trust indicators: 150+ Services, 24/7 Support, CSMIA Terminals, 4.9 Rating
- Clean divider-separated layout (vertical lines)
- Responsive: wraps on mobile, smaller font sizes

## Search Section Redesign

### Layout
- White card overlapping hero section (-3rem margin-top) — seamless transition
- Max-width: 1280px, responsive padding
- Premium shadow: `0 20px 60px rgba(15,23,42,0.12), 0 8px 24px rgba(15,23,42,0.06)`
- Border-radius: 20px

### Search Fields
- **Desktop (1024px+)**: 4 columns — Airport Area, Layover Duration, Travelers, Search Button
- **Tablet (640-1023px)**: 2 columns
- **Mobile (<640px)**: 1 column, stacked

### Input Design
- 52px height, 12px border-radius
- Muted background (`#f1f5f9`) with 1.5px border
- Icon prefix for each field (plane, clock, users, arrow)
- `:focus-within`: primary border + focus ring
- `:hover`: border darkens for discoverability

### Duration Field
- Calculated display with dynamic value (`id="home-duration-display"`)
- Primary color value, semibold weight

### Search Button
- 52px height, 12px border-radius
- Primary gradient with shadow
- 16px/600 font
- Hover: lift + elevated shadow + arrow slide
- Full-width on mobile, auto on desktop

### Footer Link
- "Detailed options available in the full planner" with arrow
- Subtle hover color transition

## Responsive Breakpoints

| Breakpoint | Hero Title | CTA Style | Search Layout |
|------------|-----------|-----------|---------------|
| 1440px+ | 60px | Side-by-side | 4 columns |
| 1280px | 60px | Side-by-side | 4 columns |
| 1024px | 56px | Side-by-side | 4 columns |
| 768px | 44px | Side-by-side | 2 columns |
| 480px | 34px | Stacked full-width | 1 column |
| 375px | 34px | Stacked full-width | 1 column |
| 320px | 34px | Stacked full-width | 1 column |

## Accessibility Improvements
- `role="banner"` + `aria-label="Hero"` on hero section
- `aria-hidden="true"` on decorative background elements
- Proper heading hierarchy (`h1` for hero title)
- `aria-label="Search transit services"` on search section
- `for` attributes on all labels connecting to `id` on selects
- `focus-visible` outlines on all interactive elements
- Sufficient contrast (white text on dark gradient background)

## QA Results

| Check | Result |
|-------|--------|
| Hero section present in DOM | ✓ |
| Title font 900 weight | ✓ |
| Primary CTA 16px/600 font | ✓ |
| Primary CTA 14px border-radius | ✓ |
| Primary CTA box-shadow present | ✓ |
| All 7 breakpoints — no overflow | ✓ |
| All 7 breakpoints — screenshots captured | ✓ |
| Console errors | 0 |
| Accessibility checks | ✓ |

## Before vs After Summary

### Before
- Background image with dark overlay (slow to load, variable quality)
- Headline: "Experience Mumbai Beyond The Airport" — unclear value proposition
- CTAs: "Explore Tours" (primary) + "Plan My Layover" (secondary) — wrong hierarchy
- Stats: Tailwind-grid stat cards with inconsistent values
- Search: Separate section with category tabs, Tailwind-heavy markup (`rounded-3xl shadow-2xl border-gray-100`), multiple datetime inputs, separate search button
- Overall: Cluttered, slow to parse, unclear messaging

### After
- Pure CSS gradient background (instant render, no image dependency)
- Headline: "Make the Most of Your Mumbai Layover" — clear, benefit-driven
- CTAs: "Plan My Layover" (primary, white on dark) + "Explore Services" (secondary, outlined) — correct hierarchy
- Stats: Clean divider-separated row with premium typography
- Search: Premium overlapping card with 3 input fields (simplified) + prominent search button
- All custom CSS via design tokens — zero Tailwind utilities on hero or search
- Responsive across all breakpoints from 320px to 1920px
