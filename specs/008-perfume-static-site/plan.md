# Implementation Plan: Perfume E-Commerce Static Website

**Branch**: `008-perfume-static-site` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-perfume-static-site/spec.md`

---

## Summary

Build a six-page responsive perfume e-commerce static website using pure HTML, CSS, and vanilla JavaScript. Pages: Home, Shop, Product Detail, Cart, About, Contact. Cart state persists via localStorage. Product data is hardcoded in a JS data file. No backend, no frameworks, no build tools required.

---

## Technical Context

**Language/Version**: HTML5 · CSS3 · Vanilla JavaScript (ES6+)
**Primary Dependencies**: None — zero external libraries or frameworks
**Storage**: Browser localStorage (cart persistence only)
**Testing**: Manual browser testing across Chrome, Firefox, Safari; DevTools responsive mode for breakpoints
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 90+, Safari 14+); static file serving (no server required)
**Project Type**: Static multi-page website
**Performance Goals**: All pages load within 2 seconds; filter re-render in under 500ms
**Constraints**: No frameworks (per spec); no backend calls; images via placeholder URLs; no payment processing
**Scale/Scope**: ~12 hardcoded products; 6 HTML pages; single developer; no CI/CD pipeline required

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-First, Luxury Experience | ✅ PASS | Mobile-first, premium aesthetic planned; hero + product cards drive engagement |
| II. Component-Driven Development | ✅ PASS | Shared navbar/footer via JS injection; CSS custom properties as design tokens |
| III. Test-First | ⚠️ ADAPTED | Static HTML/CSS/JS — no unit test framework. Manual AC validation per user story. |
| IV. Secure by Default | ✅ PASS | No secrets, no backend, no user data; form is frontend-only (no server submission) |
| V. Performance Budget | ✅ PASS | No JS bundles; inline CSS; placeholder images; zero third-party scripts |
| VI. Simplicity & Smallest Viable Change | ✅ PASS | Pure HTML/CSS/JS — no abstractions, no build tools, no dependencies |

**Gate Decision**: Proceed. Constitution III (Test-First) is adapted — pure static sites have no unit test surface; acceptance scenarios serve as manual test cases.

---

## Project Structure

### Documentation (this feature)

```text
specs/008-perfume-static-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JS data contracts)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
static-site/
├── index.html           # Home page
├── shop.html            # Shop / product listing page
├── product.html         # Product detail page
├── cart.html            # Cart page
├── about.html           # About page
├── contact.html         # Contact page
│
├── css/
│   ├── style.css        # Global styles, design tokens (CSS variables)
│   ├── navbar.css       # Navigation bar styles
│   ├── home.css         # Home page specific styles
│   ├── shop.css         # Shop page specific styles
│   ├── product.css      # Product detail page styles
│   ├── cart.css         # Cart page styles
│   ├── about.css        # About page styles
│   └── contact.css      # Contact page styles
│
├── js/
│   ├── data/
│   │   └── products.js  # Hardcoded product array (source of truth)
│   ├── navbar.js        # Shared navbar rendering + cart badge
│   ├── cart.js          # Cart logic (add/remove/update, localStorage)
│   ├── home.js          # Home page: featured products, categories
│   ├── shop.js          # Shop page: product grid + filter logic
│   ├── product.js       # Product detail: image gallery, quantity, add-to-cart
│   ├── cart-page.js     # Cart page: render items, quantity controls, totals
│   └── contact.js       # Contact form: validation + success message
│
└── assets/
    └── images/
        └── placeholder.svg  # Fallback image for broken product images
```

**Structure Decision**: Single static-site folder at repo root. Pure HTML pages with separate CSS/JS files per page. Shared logic (cart, navbar) in dedicated JS modules loaded by all pages.

---

## Complexity Tracking

No constitution violations requiring justification.

---

## Phase 0: Research

*See [research.md](./research.md) for full findings.*

Key resolved decisions:
1. **Cart persistence** → localStorage (no backend required; widely supported)
2. **Shared navbar** → JS innerHTML injection into a `<div id="navbar">` placeholder on each page
3. **Product data** → Hardcoded JS array in `js/data/products.js`, exported as `window.PRODUCTS`
4. **CSS design tokens** → CSS custom properties in `:root` in `style.css`
5. **Image fallback** → `onerror="this.src='assets/images/placeholder.svg'"` on all `<img>` tags
6. **Filter mechanism** → JS Array `.filter()` on in-memory product array; re-render grid via `innerHTML`
7. **Mobile nav** → CSS `max-width: 768px` media query toggles hamburger; JS toggles `.open` class

---

## Phase 1: Design & Contracts

*See [data-model.md](./data-model.md) and [contracts/](./contracts/) for details.*

### Key Design Decisions

#### Decision 1: Multi-page vs Single-Page Application
- **Chosen**: Multi-page HTML (separate .html files)
- **Rationale**: User asked for "no frameworks" — SPA routing requires JS framework. Multi-page is simplest.
- **Alternative Rejected**: Single HTML + JS routing — adds unnecessary complexity for 6 pages.

#### Decision 2: Cart State Management
- **Chosen**: localStorage with JSON serialization
- **Rationale**: Survives page navigation and browser refresh; zero dependencies; universally supported.
- **Alternative Rejected**: In-memory JS variable — lost on page navigation.

#### Decision 3: Shared Component Strategy
- **Chosen**: JS-injected navbar via `innerHTML` + `DOMContentLoaded` event
- **Rationale**: DRY principle without a framework; single source of truth for navbar HTML.
- **Alternative Rejected**: Duplicate navbar in each HTML file — maintenance nightmare.

#### Decision 4: CSS Architecture
- **Chosen**: CSS Custom Properties (variables) in `:root` + page-specific CSS files
- **Rationale**: Design tokens without preprocessors; luxury dark/gold color palette defined once.
- **Alternative Rejected**: Inline styles — violates constitution; single CSS file — hard to maintain.

---

## Implementation Phases

### Phase A — Foundation (Shared Infrastructure)
1. Create folder structure (`static-site/`, `css/`, `js/`, `assets/`)
2. Write `style.css` with design tokens (color palette, typography, spacing)
3. Write `js/data/products.js` with 12 hardcoded product objects
4. Write `js/cart.js` — cart CRUD functions using localStorage
5. Write `js/navbar.js` — shared navbar HTML + cart badge updater
6. Write `navbar.css` — navbar + hamburger menu styles

### Phase B — Home Page
7. Write `index.html` with semantic HTML structure
8. Write `js/home.js` — render featured products + category cards
9. Write `css/home.css` — hero, featured section, category grid styles

### Phase C — Shop Page
10. Write `shop.html`
11. Write `js/shop.js` — render all products grid + filter logic
12. Write `css/shop.css` — filter sidebar + product grid styles

### Phase D — Product Detail Page
13. Write `product.html`
14. Write `js/product.js` — image gallery, quantity selector, add-to-cart
15. Write `css/product.css` — product layout styles

### Phase E — Cart Page
16. Write `cart.html`
17. Write `js/cart-page.js` — render cart items, quantity controls, totals
18. Write `css/cart.css` — cart table/list styles

### Phase F — About & Contact Pages
19. Write `about.html` + `css/about.css`
20. Write `contact.html` + `js/contact.js` + `css/contact.css`

### Phase G — QA & Polish
21. Test all pages on mobile (375px), tablet (768px), desktop (1440px)
22. Verify cart persistence across page navigation
23. Verify filter logic on shop page
24. Verify form validation on contact page
25. Verify image fallback on all product images

---

## Quickstart

*See [quickstart.md](./quickstart.md) for setup instructions.*

No build tools required. Open `static-site/index.html` directly in a browser, or serve with any static server:

```bash
# Option 1: Direct browser open
open static-site/index.html

# Option 2: VS Code Live Server extension

# Option 3: Python simple server
cd static-site && python -m http.server 3000
```
