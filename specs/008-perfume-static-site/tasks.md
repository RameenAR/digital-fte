# Tasks: Perfume E-Commerce Static Website

**Input**: Design documents from `/specs/008-perfume-static-site/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: No automated test tasks — pure static HTML/CSS/JS. Manual acceptance criteria per story in quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create folder structure and shared foundational files before any page work begins.

- [x] T001 Create `static-site/` root folder with subfolders: `css/`, `js/js/data/`, `assets/images/`
- [x] T002 [P] Create `static-site/assets/images/placeholder.svg` — a simple SVG fallback (bottle silhouette or "No Image" box, 400×500 viewBox)
- [x] T003 [P] Create `static-site/css/style.css` — global CSS custom properties (design tokens): `--color-bg: #0D0D0D`, `--color-surface: #1A1A1A`, `--color-gold: #C9A84C`, `--color-gold-light: #E8C97A`, `--color-text: #F5F0E8`, `--color-text-muted: #9A9A8A`, `--color-border: #2E2E2E`, `--color-error: #E05252`, `--color-success: #52A87F`; font variables `--font-heading` (Playfair Display/Georgia serif), `--font-body` (Inter/system-ui); global reset (box-sizing, margin 0, padding 0); `body` base styles (background, color, font)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared JS modules and CSS that every page depends on. Must complete before any page phase.

**⚠️ CRITICAL**: No user story page work can begin until T004–T009 are complete.

- [x] T004 Create `static-site/js/data/products.js` — define `window.PRODUCTS` as an array of 12 product objects matching the schema in `contracts/products-schema.js`. Include at minimum: 4 Women, 4 Men, 4 Unisex products; scent families: Floral, Woody, Fresh, Oriental (3 each); prices spanning all 4 price ranges; 4 products with `featured: true`; image URLs using `https://picsum.photos/seed/product{id}/400/500`

- [x] T005 Create `static-site/js/cart.js` — implement all 7 cart functions from `contracts/cart-api.js`: `getCart()`, `addToCart(productId, size, quantity)`, `updateCartItemQuantity(productId, size, newQuantity)`, `removeFromCart(productId, size)`, `getCartItemCount()`, `getCartSubtotal()`, `clearCart()`. Use `localStorage` key `"perfume_cart"`. Each mutating function must dispatch `new CustomEvent('cart:updated')` on `document`.

- [x] T006 Create `static-site/css/navbar.css` — styles for: `.navbar` (fixed top, full-width, dark bg, flex layout, z-index 1000); `.navbar-logo` (gold font, serif, 1.5rem); `.navbar-links` (flex row, gap, uppercase tracking); `.navbar-links a` (gold hover transition); `.cart-icon` (position relative); `.cart-badge` (gold circle, absolute top-right, hidden when 0); `.hamburger` (3-bar button, hidden on desktop); `@media (max-width: 767px)` — hamburger visible, nav-links collapse, `.nav-open` class reveals links as vertical dropdown

- [x] T007 Create `static-site/js/navbar.js` — inject navbar HTML into `<div id="navbar">` via `innerHTML` on `DOMContentLoaded`; navbar HTML includes: logo link to `index.html`, links to all 6 pages, cart icon with `<span class="cart-badge" id="cart-badge">0</span>`; function `updateCartBadge()` reads `getCartItemCount()` and sets badge text, hides badge if 0; listen for `cart:updated` event on `document` to call `updateCartBadge()`; hamburger button toggles `.nav-open` class on nav element

- [x] T008 Create a reusable `renderProductCard(product)` function in `static-site/js/home.js` (later reused/copied for shop.js) that returns an HTML string for a product card: image with `onerror` fallback to `placeholder.svg`, product name, brand, price (formatted `$XX.XX`), star rating display (filled/empty stars), review count, "Add to Cart" button with `data-product-id` and `data-size` attributes (default to first available size)

- [x] T009 [P] Create `static-site/css/components.css` — shared component styles reused across pages: `.product-card` (dark surface bg, border-radius, overflow hidden, hover lift transform+shadow transition); `.product-card img` (full width, aspect-ratio 4/5, object-fit cover); `.product-card-body` (padding, flex column); `.product-name` (serif font, gold); `.product-price` (gold, bold); `.star-rating` (gold stars); `.btn-primary` (gold bg, dark text, padding, border-radius, hover darken); `.btn-outline` (gold border, gold text, transparent bg, hover fill); `.section-title` (serif, centered, with decorative underline); `.container` (max-width 1200px, margin auto, padding 0 1rem)

---

## Phase 3: User Story 1 — Home Page (Priority: P1) 🎯 MVP

**Goal**: A visitor lands on the homepage and sees a hero, featured products, and category highlights.

**Independent Test**: Open `static-site/index.html` in browser → hero section visible above fold, 4 featured product cards render, 3 category cards render, nav links work, cart badge shows 0.

- [x] T010 [US1] Create `static-site/index.html` — full page HTML shell: `<!DOCTYPE html>`, charset UTF-8, viewport meta, title "Scent Luxe | Premium Perfumes", link tags for `css/style.css`, `css/components.css`, `css/navbar.css`, `css/home.css`; body contains `<div id="navbar">`, `<main>` with sections: `#hero`, `#featured`, `#categories`, `#cta-banner`; script tags at bottom loading `js/data/products.js`, `js/cart.js`, `js/navbar.js`, `js/home.js`

- [x] T011 [US1] Create `static-site/css/home.css` — styles for: `#hero` (full-viewport-height, dark bg with subtle radial gradient, centered flex, text-align center); `.hero-title` (serif 4rem, gold, letter-spacing); `.hero-subtitle` (1.2rem, muted, max-width 600px); `.hero-cta` (btn-primary, large padding, margin-top 2rem); `#featured` (padding 5rem 0); `.featured-grid` (CSS grid, 4 columns desktop, 2 tablet, 1 mobile, gap 2rem); `#categories` (padding 4rem 0, dark surface bg); `.categories-grid` (3 columns desktop, 1 mobile); `.category-card` (relative, overflow hidden, cursor pointer, hover scale image); `.category-card img` (full width, 300px height, object-fit cover, overlay); `.category-label` (absolute bottom, gold text, serif, large); `#cta-banner` (gold bg, dark text, centered, padding 4rem, large serif headline)

- [x] T012 [US1] Create `static-site/js/home.js` — on `DOMContentLoaded`: (1) Render featured products: filter `window.PRODUCTS` where `featured === true`, call `renderProductCard()` for each, inject into `.featured-grid`; (2) Render categories: define 3 category objects (Women/Men/Unisex) with image and count derived from PRODUCTS, inject `.category-card` HTML into `.categories-grid`; (3) Wire "Add to Cart" button clicks: `document.addEventListener('click', e => { if (e.target.matches('.btn-add-cart')) { addToCart(id, size, 1); } })`

**Checkpoint**: Home page fully functional — hero renders, 4 featured products shown, 3 categories shown, add-to-cart updates navbar badge.

---

## Phase 4: User Story 2 — Shop Page (Priority: P1)

**Goal**: Visitor browses all products in a grid and filters by category, scent, price range, and sort order.

**Independent Test**: Open `static-site/shop.html` → all 12 products in grid, selecting "Women" filter shows only Women products, "Clear Filters" restores all, sort by price reorders grid — all without page reload.

- [x] T013 [US2] Create `static-site/shop.html` — HTML shell similar to index.html; `<main>` contains: `.shop-header` (title + product count `<span id="product-count">`), `.shop-layout` (flex row: `.filters-sidebar` + `.products-area`); filters sidebar contains filter groups: Category (Men/Women/Unisex checkboxes), Scent Family (Floral/Woody/Fresh/Oriental checkboxes), Price Range (4 radio options), Sort (select dropdown); `.products-area` contains `.products-grid` (CSS grid) and empty-state `.no-results` div (hidden by default); script tags: products.js, cart.js, navbar.js, shop.js; link tags: style.css, components.css, navbar.css, shop.css

- [x] T014 [US2] Create `static-site/css/shop.css` — styles for: `.shop-header` (flex, space-between, align-center, padding); `.shop-layout` (flex row, gap 2rem, align-start); `.filters-sidebar` (width 260px, sticky top 80px, dark surface bg, border-radius, padding 1.5rem); `.filter-group` (margin-bottom 1.5rem); `.filter-group h3` (gold, uppercase, small tracking, border-bottom gold); `.filter-group label` (flex, gap, cursor pointer, hover gold); `.filters-clear-btn` (outline btn, full-width, margin-top 1rem); `.products-area` (flex 1, min-width 0); `.products-grid` (CSS grid, 3 cols desktop, 2 tablet, 1 mobile, gap 1.5rem); `#product-count` (muted color, small); `.no-results` (centered, italic, muted, padding 4rem); `@media (max-width: 767px)` — filters sidebar becomes full-width collapsible panel with toggle button

- [x] T015 [US2] Create `static-site/js/shop.js` — implement: (1) `renderProducts(productList)` — clears `.products-grid`, renders product cards via `renderProductCard()`, updates `#product-count`, shows/hides `.no-results`; (2) `getActiveFilters()` — reads all checked checkboxes and selected radio/sort values; (3) `applyFilters()` — filters `window.PRODUCTS` by active category, scentFamily, price range, then sorts by active sort option, calls `renderProducts()`; (4) Event listeners on all filter inputs (change event) → call `applyFilters()`; (5) "Clear Filters" button resets all inputs and calls `renderProducts(window.PRODUCTS)`; (6) Add-to-cart delegation (same pattern as home.js); (7) Product card click navigates to `product.html?id={id}`; on DOMContentLoaded: call `renderProducts(window.PRODUCTS)`

**Checkpoint**: Shop page fully functional — grid, filters, sort, clear, add-to-cart all work without page reload.

---

## Phase 5: User Story 3 — Product Detail Page (Priority: P2)

**Goal**: User clicks a product and sees full detail: image gallery, description, size selector, quantity, add-to-cart.

**Independent Test**: Navigate to `product.html?id=1` → product info loads from PRODUCTS array, clicking size button updates selection, changing quantity and clicking "Add to Cart" updates navbar badge with correct quantity.

- [x] T016 [US3] Create `static-site/product.html` — HTML shell; `<main>` contains: `.product-detail` (flex row: `.product-gallery` + `.product-info`); `.product-gallery` has `.main-image` (`<img id="main-img">`) and `.thumbnail-strip` (flex row of small img thumbnails); `.product-info` has: breadcrumb nav, product name `<h1>`, brand, star rating + review count, price `<span id="detail-price">`, description `<p id="detail-desc">`, size selector `.size-options` (buttons), quantity selector (minus button + `<input type="number">` + plus button), "Add to Cart" `<button id="btn-add-detail">`, "Add to Wishlist" secondary button; related products section `#related-products` below main layout; script tags: products.js, cart.js, navbar.js, product.js; link tags: style.css, components.css, navbar.css, product.css

- [x] T017 [US3] Create `static-site/css/product.css` — styles for: `.product-detail` (flex row gap 3rem, padding 3rem 0, align-start); `.product-gallery` (flex 1, position sticky, top 80px); `.main-image img` (width 100%, max-width 500px, border-radius, object-fit cover, aspect-ratio 4/5); `.thumbnail-strip` (flex row, gap 0.5rem, margin-top 1rem); `.thumbnail-strip img` (60px × 75px, object-fit cover, border-radius, cursor pointer, border 2px solid transparent); `.thumbnail-strip img.active` (border-color gold); `.product-info` (flex 1, padding-left 2rem); `.size-options` (flex wrap, gap 0.5rem, margin 1rem 0); `.size-btn` (border border-color-border, border-radius, padding 0.5rem 1rem, cursor pointer, bg transparent, color text); `.size-btn.selected` (border-color gold, bg gold, color dark); `.quantity-selector` (flex, align-center, gap 1rem, margin 1rem 0); `.qty-btn` (circle button, gold border, 36px); `@media (max-width: 767px)` — flex column, gallery unsticks

- [x] T018 [US3] Create `static-site/js/product.js` — on DOMContentLoaded: (1) Parse `?id=N` from `window.location.search`; (2) Find product in `window.PRODUCTS` by id, if not found redirect to `shop.html`; (3) Populate all DOM elements with product data; (4) Render thumbnail images (use picsum with seed variations: `product{id}a`, `product{id}b`, `product{id}c`); (5) Thumbnail click → update `#main-img` src, toggle `.active` class; (6) Size buttons: click → toggle `.selected` class, track `selectedSize`; (7) Quantity controls: minus/plus buttons update input value (min 1, max 10); (8) "Add to Cart" click → `addToCart(product.id, selectedSize, quantity)`, show brief success toast "Added to cart!"; (9) Render related products (same category, exclude current): 3 product cards in `#related-products` grid; (10) `onerror` fallback on all img tags

**Checkpoint**: Product detail page fully functional — data loads from URL param, gallery works, size/qty selectors work, add-to-cart updates badge.

---

## Phase 6: User Story 4 — Cart Page (Priority: P2)

**Goal**: User reviews cart items, updates quantities, removes items, sees total, and has a checkout CTA.

**Independent Test**: Add 2 products via product.html, navigate to cart.html → both items listed with correct prices; change quantity → total updates; remove one item → list shrinks; clear all → empty state shows with "Continue Shopping" link.

- [x] T019 [US4] Create `static-site/cart.html` — HTML shell; `<main>` contains: `.cart-container` (two-column flex: `.cart-items-section` + `.cart-summary`); `.cart-items-section` has heading "Your Cart (`<span id="cart-count">0</span>` items)" and `<div id="cart-items-list">`; `.cart-summary` has: order summary heading, subtotal row, shipping row ("Free"), total row, "Proceed to Checkout" `<button id="btn-checkout">` (disabled with tooltip "Demo only — no real checkout"), "Continue Shopping" link; `<div id="cart-empty">` (hidden by default): empty state message + illustration + "Continue Shopping" button; script tags: products.js, cart.js, navbar.js, cart-page.js; link tags: style.css, components.css, navbar.css, cart.css

- [x] T020 [US4] Create `static-site/css/cart.css` — styles for: `.cart-container` (flex row, gap 2rem, align-start, padding 3rem 0); `.cart-items-section` (flex 3); `.cart-summary` (flex 1, sticky top 80px, dark surface, border-radius, padding 1.5rem); `.cart-item` (flex row, gap 1rem, padding 1.5rem 0, border-bottom border-color); `.cart-item img` (80px × 100px, object-fit cover, border-radius); `.cart-item-info` (flex 1); `.cart-item-name` (serif, gold); `.cart-item-size` (muted small); `.cart-item-price` (gold, bold); `.cart-item-controls` (flex, align-center, gap 1rem); `.qty-control` (flex, align-center, gap 0.5rem); `.qty-btn-sm` (24px circle, gold border, small font); `.qty-input-sm` (40px, centered, no arrows, dark bg, gold text, border); `.btn-remove` (text btn, muted, hover red, small); `.summary-row` (flex, space-between, padding 0.5rem 0); `.summary-total` (gold, bold, large, border-top); `#cart-empty` (centered, padding 4rem, flex column, align-center); `@media (max-width: 767px)` — flex column, summary unsticks

- [x] T021 [US4] Create `static-site/js/cart-page.js` — implement: (1) `renderCartItems()` — reads `getCart()`, if empty shows `#cart-empty` and hides items section; if items exist renders each as `.cart-item` HTML with image, name, size, unit price, qty controls, line total, remove button; updates `#cart-count`, subtotal, total in summary; (2) Quantity control clicks (delegation on `#cart-items-list`): minus → `updateCartItemQuantity(id, size, qty-1)`; plus → `updateCartItemQuantity(id, size, qty+1)`; direct input change → `updateCartItemQuantity(id, size, newVal)`; (3) Remove button click → `removeFromCart(id, size)`, re-render; (4) Listen for `cart:updated` event → `renderCartItems()`; (5) `#btn-checkout` click → alert "This is a demo store. Checkout is not available."; on DOMContentLoaded: `renderCartItems()`

**Checkpoint**: Cart page fully functional — items render, quantities update totals live, remove works, empty state shows, checkout shows demo alert.

---

## Phase 7: User Story 5 — About Page (Priority: P3)

**Goal**: Visitor reads brand story, values, and meets the team.

**Independent Test**: Open `static-site/about.html` → brand story section, 3 core values, 4 team member cards all render; page is responsive at 375px without layout breakage.

- [x] T022 [P] [US5] Create `static-site/about.html` — HTML shell; `<main>` contains: `.about-hero` (full-width image banner with overlay text "Our Story"); `#brand-story` (2-column layout: large text left, decorative image right — on mobile single column); `#values` (3 value cards: "Artisan Craftsmanship", "Sustainable Sourcing", "Timeless Elegance" — each with icon/emoji, title, description); `#team` (section heading + `.team-grid` of 4 team member cards: Founder, Head Perfumer, Creative Director, Customer Experience Lead); `#mission-banner` (full-width gold bg, mission statement quote); script tags: products.js, cart.js, navbar.js; link tags: style.css, components.css, navbar.css, about.css

- [x] T023 [P] [US5] Create `static-site/css/about.css` — styles for: `.about-hero` (height 60vh, background-image via picsum, bg-cover, bg-center, flex center, overlay rgba dark); `.about-hero h1` (white, serif 3rem); `#brand-story` (grid 2 cols, gap 4rem, padding 5rem 0); `.story-text` (flex column, gap 1rem, font-size 1.1rem, line-height 1.8); `.story-image img` (full width, border-radius, aspect-ratio 4/5, object-fit cover); `#values` (bg dark surface, padding 5rem 0); `.values-grid` (grid 3 cols, gap 2rem); `.value-card` (text-center, padding 2rem, border border-color, border-radius, hover border-gold transition); `.value-icon` (font-size 3rem, margin-bottom 1rem); `.value-title` (serif gold); `#team` (padding 5rem 0); `.team-grid` (grid 4 cols, gap 1.5rem); `.team-card` (text-center, dark surface, border-radius, overflow hidden, padding-bottom 1.5rem); `.team-card img` (full width, aspect-ratio 1/1, object-fit cover); `.team-name` (serif gold, margin-top 1rem); `.team-role` (muted small); `#mission-banner` (gold bg, dark text, text-center, padding 4rem); `@media` — 2-col story to 1-col; 3-col values to 1-col; 4-col team to 2-col mobile

**Checkpoint**: About page renders brand story, 3 values, 4 team cards, mission banner — responsive at all breakpoints.

---

## Phase 8: User Story 6 — Contact Page (Priority: P3)

**Goal**: User sends a message via a validated form; invalid inputs show inline errors; valid submission shows success.

**Independent Test**: Open `static-site/contact.html` → click Submit with empty fields → inline errors appear under each field; fill valid name/email/message → submit → form hides, success message appears.

- [x] T024 [P] [US6] Create `static-site/contact.html` — HTML shell; `<main>` contains: `.contact-layout` (2-column flex: `.contact-form-section` + `.contact-info`); `.contact-form-section` has: heading "Get In Touch", `<form id="contact-form">` with fields: name input (`required`), email input (`type="email"`, `required`), subject select (General / Order Inquiry / Product Question / Other), message textarea (`required`, min 20 chars), submit button "Send Message"; each field wrapped in `.form-group` with `<label>`, `<input>`, `<span class="field-error" aria-live="polite">`; `<div id="form-success" hidden>` with success icon + "Message sent successfully! We'll reply within 24 hours." + "Send Another Message" button; `.contact-info` has: address card, email card (with mailto link), phone card, hours card, map placeholder (styled div with "Visit Our Boutique" and a static map iframe or styled placeholder); script tags: products.js, cart.js, navbar.js, contact.js; link tags: style.css, components.css, navbar.css, contact.css

- [x] T025 [P] [US6] Create `static-site/css/contact.css` — styles for: `.contact-layout` (flex row, gap 3rem, padding 4rem 0, align-start); `.contact-form-section` (flex 3); `.contact-info` (flex 2, sticky top 80px); `.form-group` (flex column, gap 0.4rem, margin-bottom 1.5rem); `label` (gold, small uppercase, tracking); `input, textarea, select` (width 100%, bg dark surface, border border-color, border-radius, padding 0.75rem 1rem, color text, outline none); `input:focus, textarea:focus, select:focus` (border-color gold, box-shadow 0 0 0 3px rgba gold 0.2); `.field-error` (color error, font-size 0.8rem, min-height 1rem, display block); `.form-group.has-error input` (border-color error); `textarea` (min-height 150px, resize vertical); `#form-success` (text-center, padding 3rem, animation fade-in); `.success-icon` (gold, font-size 4rem); `.contact-info-card` (dark surface, border-radius, padding 1.5rem, margin-bottom 1rem, flex row gap 1rem); `.contact-info-icon` (gold, font-size 1.5rem); `.map-placeholder` (width 100%, height 300px, bg surface, border-radius, flex center, color muted, border dashed border-color); `@media (max-width: 767px)` — flex column, info unsticks

- [x] T026 [US6] Create `static-site/js/contact.js` — implement: (1) `validateField(input)` — checks: name (non-empty, min 2 chars); email (non-empty + regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`); message (non-empty, min 20 chars); returns error string or empty string; (2) `showError(fieldId, message)` — adds `.has-error` to `.form-group`, sets `.field-error` text; (3) `clearError(fieldId)` — removes `.has-error`, clears error text; (4) Real-time validation: each input gets `blur` event listener → `validateField()` → show/clear error; (5) Form `submit` event: `e.preventDefault()`, validate all fields, if any errors focus first error field and return; if all valid: hide `#contact-form`, show `#form-success`; (6) "Send Another Message" button: show form again, reset form, clear all errors

**Checkpoint**: Contact page fully functional — inline validation on blur, form-level validation on submit, success state renders correctly.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final QA pass, mobile responsiveness, and cross-page integration.

- [x] T027 [P] Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and Google Fonts import for Playfair Display + Inter in all 6 HTML files' `<head>` sections; update `style.css` `--font-heading` and `--font-body` to reference loaded fonts

- [x] T028 [P] Add smooth scroll behavior: `html { scroll-behavior: smooth; }` in `style.css`; add "Back to Top" button (fixed bottom-right, appears after 300px scroll, `#scroll-top-btn`) in all pages via `navbar.js` injection; `window.addEventListener('scroll', ...)` toggles visibility

- [x] T029 Add active nav link highlighting: in `navbar.js`, after rendering navbar, compare `window.location.pathname` to each nav link's `href` and add `.active` class to the matching link; style `.nav-link.active` with gold underline in `navbar.css`

- [x] T030 [P] Add product card "Quick View" and navigation: ensure clicking anywhere on `.product-card` (except the "Add to Cart" button) navigates to `product.html?id={id}`; wrap card in `<a href="product.html?id={id}">` or add `data-product-id` + click delegation in each page's JS

- [x] T031 [P] Add toast notification system: create `showToast(message, type)` function in a new `static-site/js/toast.js`; inject a `#toast-container` div via `navbar.js`; toast appears bottom-right, auto-dismisses after 3 seconds, supports type "success" (green) and "error" (red); use in `product.js` for "Added to cart!" and `contact.js` for validation errors; add toast styles to `style.css` (`.toast`, `.toast.success`, `.toast.error`, slide-in animation)

- [x] T032 Run full manual QA per quickstart.md checklist at breakpoints 375px, 768px, 1024px, 1440px: verify all 6 pages render without console errors, cart persists on refresh, filters work, form validation works, all nav links are correct; fix any issues found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1 Home)**: Depends on Phase 2 completion
- **Phase 4 (US2 Shop)**: Depends on Phase 2; can run in parallel with Phase 3
- **Phase 5 (US3 Product)**: Depends on Phase 2; can run in parallel with Phase 3 & 4
- **Phase 6 (US4 Cart)**: Depends on Phase 2 + cart.js (T005)
- **Phase 7 (US5 About)**: Depends on Phase 2 only — fully independent
- **Phase 8 (US6 Contact)**: Depends on Phase 2 only — fully independent
- **Phase 9 (Polish)**: Depends on all story phases complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 Home | Phase 2 | US2, US3, US5, US6 |
| US2 Shop | Phase 2 + T004 (products data) | US1, US3, US5, US6 |
| US3 Product | Phase 2 + T004, T005 (cart) | US1, US2, US5, US6 |
| US4 Cart | Phase 2 + T005 (cart.js) | US5, US6 |
| US5 About | Phase 2 | US1, US2, US3, US4, US6 |
| US6 Contact | Phase 2 | US1, US2, US3, US4, US5 |

### Within Each User Story

1. HTML page file first (structure)
2. CSS file in parallel with HTML (styles)
3. JS file last (depends on DOM structure defined in HTML)

---

## Parallel Execution Examples

### Phase 2 Parallels (all can run simultaneously)
```
Task: T004 — products.js data file
Task: T005 — cart.js logic
Task: T006 — navbar.css styles
Task: T007 — navbar.js shared component
Task: T008 — renderProductCard() function
Task: T009 — components.css shared styles
```

### Phase 3 Parallels (US1 Home)
```
Task: T010 — index.html (structure)
Task: T011 — home.css (styles, parallel with T010)
→ Then: T012 — home.js (after T010 defines DOM structure)
```

### Phase 7 + Phase 8 Parallels (fully independent)
```
Task: T022 — about.html
Task: T023 — about.css
Task: T024 — contact.html  ← can run at same time as T022/T023
Task: T025 — contact.css
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundation (T004–T009) — **CRITICAL**
3. Complete Phase 3: Home Page (T010–T012)
4. Complete Phase 4: Shop Page (T013–T015)
5. **STOP and VALIDATE**: Home + Shop work independently — this is a shippable MVP
6. Open both pages in browser, verify product display, filtering, and add-to-cart

### Full Delivery Order

Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5) + Phase 8 (US6) [parallel] → Phase 9 (Polish)

---

## Task Summary

| Phase | Tasks | User Story | Priority |
|-------|-------|------------|----------|
| Phase 1: Setup | T001–T003 | — | Blocker |
| Phase 2: Foundation | T004–T009 | — | Blocker |
| Phase 3: Home | T010–T012 | US1 | P1 🎯 MVP |
| Phase 4: Shop | T013–T015 | US2 | P1 |
| Phase 5: Product | T016–T018 | US3 | P2 |
| Phase 6: Cart | T019–T021 | US4 | P2 |
| Phase 7: About | T022–T023 | US5 | P3 |
| Phase 8: Contact | T024–T026 | US6 | P3 |
| Phase 9: Polish | T027–T032 | — | Final |
| **Total** | **32 tasks** | 6 stories | |

---

## Notes

- `[P]` tasks = different files, no inter-dependencies, run in parallel
- `[USN]` label maps task to spec user story for traceability
- Each user story is independently testable after its phase completes
- No build tools needed — open HTML files directly in browser or use Live Server
- Cart state: test persistence by adding items, navigating pages, refreshing browser
- All images use picsum.photos CDN; `onerror` fallback to `assets/images/placeholder.svg`
- Commit after each phase checkpoint for clean git history
