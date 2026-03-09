# Research: Perfume E-Commerce Static Website

**Feature**: 008-perfume-static-site | **Date**: 2026-03-09

---

## Decision 1: Cart Persistence Strategy

**Decision**: Use `localStorage` with JSON serialization.

**Rationale**: localStorage is supported in all modern browsers, persists across page navigation and browser restarts, requires zero dependencies, and can store structured data via `JSON.stringify`/`JSON.parse`. For a static site with no backend, it is the only practical option.

**Alternatives Considered**:
- `sessionStorage` — rejected: data lost when tab is closed; poor UX for returning customers.
- In-memory JS variable — rejected: data lost on every page navigation (multi-page site).
- Cookies — rejected: size limited to 4KB; designed for server communication, not client state.

---

## Decision 2: Shared Navbar Strategy

**Decision**: JS-injected navbar via `innerHTML` insertion into a `<div id="navbar">` placeholder on each HTML page.

**Rationale**: Avoids duplicating navbar HTML in 6 files. A single `navbar.js` file defines the navbar HTML as a template string and inserts it on `DOMContentLoaded`. Cart badge count is updated from localStorage state on every page load.

**Alternatives Considered**:
- HTML `<iframe>` include — rejected: poor semantics, accessibility issues.
- Server-side includes — rejected: requires a server; violates "static-only" constraint.
- Duplicate HTML in each file — rejected: any nav change requires editing 6 files.

---

## Decision 3: Product Data Source

**Decision**: Hardcoded JavaScript array in `js/data/products.js` exposed as `window.PRODUCTS`.

**Rationale**: No backend exists; spec says hardcoded data is acceptable. A single JS file as the source of truth means all pages read from the same data. Using `window.PRODUCTS` avoids ES Module import/export complexity (no build tool).

**Alternatives Considered**:
- JSON file fetched via `fetch()` — rejected: requires a server (CORS issues with `file://`); adds async complexity.
- ES modules with `import` — rejected: requires `type="module"` and a server for `file://` protocol.
- Inline data per page — rejected: duplication, inconsistency risk.

---

## Decision 4: CSS Architecture

**Decision**: CSS Custom Properties (variables) in `:root` in `style.css` as the design token system. Page-specific CSS files for page-level styles.

**Rationale**: Custom properties provide a single source of truth for the color palette, typography, and spacing. They cascade naturally and require no build tool. The luxury perfume aesthetic calls for a dark background (near-black), gold accent (#C9A84C), and cream/ivory text.

**Color Palette Defined**:
```css
:root {
  --color-bg: #0D0D0D;          /* Deep black background */
  --color-surface: #1A1A1A;     /* Card/surface background */
  --color-gold: #C9A84C;        /* Primary accent - gold */
  --color-gold-light: #E8C97A;  /* Hover/lighter gold */
  --color-text: #F5F0E8;        /* Cream white text */
  --color-text-muted: #9A9A8A;  /* Secondary text */
  --color-border: #2E2E2E;      /* Subtle borders */
  --color-error: #E05252;       /* Form error red */
  --color-success: #52A87F;     /* Form success green */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --radius: 8px;
  --transition: 0.3s ease;
}
```

**Alternatives Considered**:
- CSS preprocessor (Sass/Less) — rejected: requires a build tool; violates "no frameworks" constraint.
- Single monolithic CSS file — rejected: hard to maintain across 6 pages.
- Tailwind CDN — rejected: user explicitly requested "no frameworks or CSS libraries".

---

## Decision 5: Mobile Navigation Pattern

**Decision**: CSS-only hamburger menu hidden on desktop; JS toggles `.nav-open` class on `<nav>` element for mobile.

**Rationale**: Simple, accessible, requires no library. The hamburger icon is Unicode `☰` (or CSS bars), toggled by clicking a `<button>`. CSS handles the show/hide animation via `max-height` transition.

**Breakpoints**:
- Mobile: `< 768px` — hamburger menu, single-column layout
- Tablet: `768px – 1023px` — 2-column grid, inline nav
- Desktop: `≥ 1024px` — 3-column grid, full nav

---

## Decision 6: Product Filter Mechanism

**Decision**: JavaScript `Array.filter()` on the in-memory `window.PRODUCTS` array. Re-render product grid via `innerHTML` replacement.

**Rationale**: No network request needed (all data in memory). Filtering and re-rendering 12 products is near-instantaneous. Simple and readable code.

**Filter Dimensions**:
- Category: Men / Women / Unisex
- Scent Family: Floral / Woody / Fresh / Oriental
- Price Range: Under $50 / $50–$100 / $100–$200 / Over $200
- Sort: Featured / Price Low-High / Price High-Low / Rating

---

## Decision 7: Image Strategy

**Decision**: Placeholder images from `https://picsum.photos` with deterministic IDs per product. `onerror` fallback to local `assets/images/placeholder.svg`.

**Rationale**: picsum.photos provides free, stable placeholder images. Each product gets a fixed seed so images are consistent on reload. Local SVG fallback ensures graceful degradation if CDN is unreachable.

**Alternatives Considered**:
- Local images — rejected: adds significant binary weight to repo.
- No images — rejected: product cards require images for premium aesthetic.
