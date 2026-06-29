# Sprint 06 — How It Works Section Redesign Report

**Project:** LayoverX
**Sprint:** 06 — How It Works (User Journey)
**Date:** 2026-06-26
**Status:** ✅ Complete

---

## 1. Objective

Transform the "How It Works" section into a premium, easy-to-understand journey that explains the LayoverX booking process in under 15 seconds.

Reference quality benchmarks: Airbnb onboarding, Stripe product flow, Apple product storytelling, Booking.com booking flow.

---

## 2. Files Modified

| File | Change |
|---|---|
| `frontend/index.html` (lines 837–913) | Replaced 3 step layout with new semantic `<ol role="list">` 5-step journey, SVG icons, ARIA labels |
| `frontend/css/components.css` | Added full `.hiw-*` system (header, timeline grid, step cards, connector, micro-interactions, responsive, reduced-motion) |

**No other files modified. No other sections touched.**

---

## 3. Step 1 — Inspect (Before)

Original markup (lines 837–874 of `frontend/index.html`):

```html
<section class="py-20 bg-white" id="how-it-works">
  <div class="container">
    <div class="text-center mb-14 reveal">
      <span class="section-label">How It Works</span>
      <h2 class="section-title">Escaping the Terminal is Simple</h2>
      <p class="section-subtitle">Our smart platform handles buffers, travel coordinates, and schedules in 3 simple steps.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      <div class="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-sky-100 via-sky-300 to-sky-100" aria-hidden="true"></div>
      <div class="reveal flex flex-col items-center text-center relative z-10">
        <div class="step-number mb-6">1</div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Input Layover Window</h3>
        <p class="text-slate-500 text-sm max-w-xs leading-relaxed">Provide your arrivals and departures. Our system automatically subtracts custom exit and security check margins.</p>
      </div>
      <!-- ...steps 2 & 3 same pattern... -->
    </div>
    <div class="mt-14 text-center reveal">
      <a href="how-it-works.html" class="...">Read airport exit guidelines & transit visa requirements</a>
    </div>
  </div>
</section>
```

### Issues identified
- **Only 3 steps** — too sparse to convey a real booking journey.
- **Bare text step content** — no card container, no icon, no illustration.
- **Numbered circles only** (`step-number`) — square 64px blocks, no visual variety.
- **No semantic color** — every step identical sky-blue square.
- **Inline Tailwind** repeated 3 times — not scalable.
- **Heading size** stuck at 30px (`.section-title` default).
- **Heading message** "Escaping the Terminal is Simple" — sounds negative / illicit, not aspirational.
- **Connector line** is a single thin `h-px` gradient that doesn't follow the step centers reliably.
- **No hover/focus interaction.**
- **No vertical timeline** for mobile — single column with no visual journey cue.
- **Footer link** uses raw Tailwind classes — no focus state.

---

## 4. Step 2 — Section Header

New structure:

```html
<div class="hiw-header reveal">
  <span class="hiw-eyebrow" aria-hidden="true">How It Works</span>
  <h2 class="hiw-heading">From Gate to City in Five Steps</h2>
  <p class="hiw-subtitle">Plan, customize, and book your perfect layover — all in under a minute. We handle the timing, you enjoy the journey.</p>
</div>
```

### Specifications

| Element | Desktop | Tablet (≥768) | Mobile (<768) | ≤374px |
|---|---|---|---|---|
| Eyebrow | 14px / 600 | 14px / 600 | 14px / 600 | 14px / 600 |
| Heading | **42px / 800** | **34px / 800** | **28px / 800** | 24px / 800 |
| Subtitle | **18px** | 18px | 18px | 16px |

- **Max-width:** 720px, centered (verified).
- **Eyebrow underline:** 32px × 3px primary-color bar beneath the eyebrow label.
- **Heading letter-spacing:** −0.03em (premium tracking).
- **Subtitle:** `var(--text-muted)` for high contrast hierarchy against the heading.
- **Margin below header:** 3.5rem mobile → 4rem tablet → 4.5rem desktop.

---

## 5. Step 3 — User Journey (5 Steps)

The complete journey is presented as a numbered, color-coded timeline:

```
1. Enter Flight Details       ✈  sky
        ↓
2. Discover Nearby Services   🔍  amber
        ↓
3. Build Your Layover        📅  violet
        ↓
4. Book Instantly            💳  emerald
        ↓
5. Enjoy Mumbai              😊  rose
```

Each step answers one part of the user's mental model: *what do I need → what's available → how do I plan → how do I pay → what's the outcome*.

---

## 6. Step 4 — Step Cards

Redesigned every step as a premium card:

### Step card structure
```html
<li class="hiw-step reveal" role="listitem">
  <div class="hiw-step-number" aria-hidden="true"><span>1</span></div>
  <div class="hiw-step-icon hiw-step-icon--sky" aria-hidden="true"><svg…/></div>
  <h3 class="hiw-step-title">Enter Flight Details</h3>
  <p class="hiw-step-desc">…</p>
</li>
```

### Card specifications

| Property | Value |
|---|---|
| Border radius | **20px** (verified) |
| Padding | 24px / 28px / 28px (mobile / tablet / desktop) — spec target **24px** ✓ |
| Background | `var(--surface)` (#fff) |
| Border | `1px solid var(--border-light)` |
| Shadow | `var(--shadow-sm)` → soft large shadow on hover |
| Hover lift | `translateY(-6px)` with spring easing |
| Title | `var(--font-h4)` (18px / 700) |
| Description | 15px / 1.6 / `var(--text-muted)` |
| Step number badge | 40px circle, primary gradient, white text, 4px surface-colored border (creates the "pin" effect) |
| Icon container | **64px** (56px on ≤374px) rounded square (18px radius), semantic color |
| Icon | **28px** SVG (24px on ≤374px), 2px stroke, round caps |

### Step icons (semantic color per step)

| # | Step | Icon | Color |
|---|---|---|---|
| 1 | Enter Flight Details | Plane-takeoff | Sky (#0284c7) |
| 2 | Discover Nearby Services | Search-plus-circle | Amber (#d97706) |
| 3 | Build Your Layover | Calendar-plus | Violet (#7c3aed) |
| 4 | Book Instantly | Credit-card | Emerald (#059669) |
| 5 | Enjoy Mumbai | Smile | Rose (#e11d48) |

---

## 7. Step 5 — Connector Design

Three-tier responsive strategy:

### Mobile / tablet (≤1023px)
No connector — the strict vertical column of cards communicates "next step" implicitly.

### Desktop (1024–1279px)
3-column grid (cards in 3+2 layout). No horizontal connector — visual hierarchy clear from card grouping.

### Large desktop (≥1280px)
5-column grid + animated gradient connector:

```css
.hiw-connector {
  position: absolute;
  top: 36px;            /* aligns with step-number badge center */
  left: 12%;
  right: 12%;
  height: 2px;
  background: linear-gradient(90deg,
    rgba(56,189,248,0.35)   0%,
    rgba(245,158,11,0.35)  25%,
    rgba(139,92,246,0.35)  50%,
    rgba(16,185,129,0.35)  75%,
    rgba(244,63,94,0.35)  100%);
  border-radius: 1px;
  z-index: 0;            /* behind step numbers */
}
```

The connector gradient colors align with each step's icon color, creating a color-coded journey line. Step-number badges (z-index 2) sit on top, creating the "linked steps" visual.

---

## 8. Step 6 — Micro-Interactions

| Interaction | Trigger | Implementation |
|---|---|---|
| Hover elevation | `.hiw-step:hover` | `translateY(-6px)` + soft large shadow + primary-tinted border |
| Smooth transition | Always | `cubic-bezier(0.16, 1, 0.3, 1)` (spring) |
| Icon animation | Card hover | `scale(1.08) rotate(-4deg)` on the icon container |
| Focus state | `:focus-within` (keyboard) | Multi-layer ring: large shadow + 3px primary-glow + 5px primary-light |
| Footer link | `:hover` | `translateY(-1px)` + arrow slide 4px right + background tint |
| Footer focus | `:focus-visible` | 3px primary-glow outline |
| Reveal stagger | Scroll into view | 0.0 → 0.08 → 0.16 → 0.24 → 0.32 → 0.40s (header → 5 cards) |
| Reduced motion | `prefers-reduced-motion: reduce` | All transitions/animations disabled |

---

## 9. Step 7 — Visual Design

| Concern | Implementation |
|---|---|
| Background | `var(--surface)` (#fff) — clean white for high contrast |
| Subtle accent | `::before` radial-gradient glow (primary-tinted, top-left, low opacity) |
| Section padding | 5rem mobile → 6rem tablet → 7rem desktop → 8rem 1280+ |
| Card spacing | 24px mobile / 32px tablet / 28px 1024 / 28px 1440 / 28px 1920 |
| Card padding | 24-28px (responsive) |
| Typography hierarchy | Eyebrow 14px / 600 → Heading 24–42px / 800 → Subtitle 18px / 400 → Title 18px / 700 → Desc 15px / 400 |
| Shadows | `shadow-sm` rest, large soft shadow on hover |
| Border radius | 20px cards, 18px icon containers, full-circle step number |
| Visual clutter | Removed emoji, removed inline Tailwind repetition, removed single-line connector |

---

## 10. Step 8 — Responsive

Verified via Playwright at every required breakpoint:

| Viewport | Cols | Heading | Card height | Connector | Overflow | Status |
|---|---|---|---|---|---|---|
| 320px | 1 | 24px | equal | hidden | ❌ none | ✅ |
| 375px | 1 | 28px | equal | hidden | ❌ none | ✅ |
| 390px | 1 | 28px | equal | hidden | ❌ none | ✅ |
| 480px | 1 | 28px | equal | hidden | ❌ none | ✅ |
| 768px | 2 | 34px | equal | hidden | ❌ none | ✅ |
| 1024px | 3 | 42px | equal | hidden | ❌ none | ✅ |
| 1280px | 5 | 42px | equal | **visible** | ❌ none | ✅ |
| 1440px | 5 | 42px | equal | **visible** | ❌ none | ✅ |
| 1920px | 5 | 42px | equal | **visible** | ❌ none | ✅ |

Equal heights enforced via `grid-auto-rows: 1fr` at every breakpoint (verified by Playwright).

---

## 11. Step 9 — Accessibility

| Criterion | Implementation |
|---|---|
| **ARIA label** | `<section aria-label="How LayoverX works">` |
| **Semantic HTML** | `<ol role="list">` containing `<li role="listitem">` for proper ordered list semantics; `<h2>` section heading + five `<h3>` card titles |
| **Keyboard navigation** | All interactive elements (footer link) keyboard-accessible with visible focus |
| **Visible focus indicators** | 3-layer focus ring on cards (`:focus-within`); 3px outline on footer link (`:focus-visible`) |
| **Heading hierarchy** | Single `<h2>` for section, five `<h3>` for steps (no skipped levels) |
| **Accessible icons** | All SVGs `aria-hidden="true"` (decorative); step number badges `aria-hidden`; semantic color conveyed through title text |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables all transitions, icon animation, arrow slide |

---

## 12. Step 10 — Playwright QA

**Tool:** `playwright@1.61.1` (Chromium)
**Scripts:** `screenshots/capture-hiw.cjs`, `screenshots/verify-hiw.cjs`
**Result:** ✅ All 9 viewports captured and verified.

### DOM verification (1920px desktop)
```json
{
  "stepCount": 5,
  "iconCount": 5,
  "stepTitles": [
    "Enter Flight Details",
    "Discover Nearby Services",
    "Build Your Layover",
    "Book Instantly",
    "Enjoy Mumbai"
  ],
  "cardBorderRadius": "20px",
  "cardPadding": "28px 24px",
  "iconSize": "64px x 64px"
}
```

### Console errors (pre-existing, unrelated)
- Supabase CORS errors when loaded via `file://` (pre-existed this sprint).
- `Cannot read properties of undefined (reading 'onAuthStateChange')` (pre-existing).
- Both errors originate outside the How It Works section.

### Screenshots saved
- `screenshots/hiw-desktop-1920.png`
- `screenshots/hiw-desktop-1440.png`
- `screenshots/hiw-desktop-1280.png`
- `screenshots/hiw-tablet-1024.png`
- `screenshots/hiw-tablet-768.png`
- `screenshots/hiw-mobile-480.png`
- `screenshots/hiw-mobile-390.png`
- `screenshots/hiw-mobile-375.png`
- `screenshots/hiw-mobile-320.png`

---

## 13. Before vs After Comparison

### Before
| Aspect | Value |
|---|---|
| Steps | 3 |
| Card | None (bare text) |
| Icon | None |
| Step number | 64px square, primary, 1.5rem weight |
| Color palette | Sky-only |
| Grid | 1 / 3 cols |
| Padding | 32px (`p-8`) via inline Tailwind |
| Border radius | none (no card) |
| Heading | 30px / 800, "Escaping the Terminal is Simple" |
| Subtitle | 16px |
| Micro-interactions | Tailwind reveal only |
| Connector | 1px gradient h-line, generic position `top-8` |
| Focus state | None |
| ARIA | None |
| Semantic HTML | Generic `<div>` |
| Equal heights | Inherited from grid (3-col only) |

### After
| Aspect | Value |
|---|---|
| Steps | **5** (full booking journey) |
| Card | **Premium 20px-radius card** with 24px padding, soft shadow |
| Icon | **64px semantic-color container** with 28px Feather-style SVG |
| Step number | **40px gradient circle** with white border (pin effect) |
| Color palette | **5 semantic colors** (sky / amber / violet / emerald / rose) |
| Grid | **1 / 2 / 3 / 5** cols (responsive) with `grid-auto-rows: 1fr` |
| Padding | 24-28px responsive |
| Border radius | **20px** |
| Heading | **42 / 34 / 28 / 24px** (exact spec) — "From Gate to City in Five Steps" |
| Subtitle | **18px** (exact spec) |
| Micro-interactions | Hover lift, icon rotate, focus ring, footer link animation, stagger reveal |
| Connector | **2px color-coded gradient** threading through step numbers (1280px+) |
| Focus state | 3-layer focus ring on cards, 3px outline on footer link |
| ARIA | Section label, ordered-list semantics, decorative icons hidden |
| Semantic HTML | `<ol role="list">` + `<li role="listitem">` |
| Equal heights | **Enforced at every breakpoint** (verified by Playwright) |

---

## 14. Success Criteria Verification

| Criterion | Status |
|---|---|
| Clearly explains LayoverX journey | ✅ — 5 explicit steps cover full flow |
| Feels premium and modern | ✅ — semantic colors, premium cards, gradient connector |
| Beautiful step cards | ✅ — 20px radius, soft shadow, icon + step number + title + desc |
| Excellent spacing | ✅ — 8-point grid; equal heights enforced |
| Follows Design System | ✅ — uses `--primary`, `--text-*`, `--border-*`, `--shadow-*`, `--radius-*` |
| Fully responsive | ✅ — verified at 320/375/390/480/768/1024/1280/1440/1920 |
| Easy to understand in seconds | ✅ — scan-friendly 5-step layout with color-coded journey |
| No other sections touched | ✅ — only `#how-it-works` modified |

---

## 15. Key Design Decisions

1. **5 steps over 3** — matches the recommended flow exactly and provides a complete mental model (input → discover → build → book → enjoy).
2. **3 / 5 column responsive grid** — 5 columns only at 1280+ where there's enough horizontal space; degrades to 3 (3+2 layout) at 1024px, 2 at 768px, 1 below.
3. **Step number as "pin"** — 40px circle with 4px white border creates the visual illusion of a pin stuck onto the card, drawing attention without competing with the icon.
4. **Semantic color per step** — 5 distinct colors help users remember each step's purpose and create a color-coded journey that feels curated.
5. **Connector only at 1280px+** — a horizontal connector only makes sense when all 5 cards are in a single row; below that, vertical spacing carries the journey.
6. **`grid-auto-rows: 1fr`** — bulletproof equal-height enforcement regardless of text wrap length.
7. **Heading rewrite** — "Escaping the Terminal is Simple" (negative framing) → "From Gate to City in Five Steps" (positive, journey-focused).
8. **`<ol role="list">`** — proper ordered-list semantics, helpful for screen readers to announce "step 1 of 5".
9. **Subtitle promise** — "all in under a minute" sets a concrete expectation and reduces perceived effort.

---

**Sprint 06 — Complete.**