# Quickstart: Perfume E-Commerce Static Website

**Feature**: 008-perfume-static-site | **Date**: 2026-03-09

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari)
- Optional: VS Code with Live Server extension, or Python 3

---

## Running the Website

### Option 1: VS Code Live Server (Recommended)
1. Open VS Code
2. Open the `static-site/` folder
3. Right-click `index.html` → "Open with Live Server"
4. Browser opens at `http://127.0.0.1:5500`

### Option 2: Python HTTP Server
```bash
cd static-site
python -m http.server 3000
# Open http://localhost:3000
```

### Option 3: Direct File Open
- Open `static-site/index.html` directly in a browser
- Note: `fetch()` calls won't work with `file://` protocol, but this project uses none

---

## Project Structure Quick Reference

```
static-site/
├── index.html       → Home page (open this first)
├── shop.html        → All products + filters
├── product.html     → Product detail (opened via ?id=N query param)
├── cart.html        → Cart review page
├── about.html       → Brand story
├── contact.html     → Contact form
│
├── css/             → Stylesheets (style.css = global tokens)
├── js/
│   ├── data/products.js  → Edit here to change product data
│   ├── cart.js           → Cart logic (localStorage)
│   └── navbar.js         → Shared navigation
└── assets/          → Static assets (placeholder SVG)
```

---

## Adding/Editing Products

Open `js/data/products.js` and add an object to the `PRODUCTS` array following the schema in `contracts/products-schema.js`.

```javascript
// Example: Add a new product
{
  id: 13,
  name: "Ocean Breeze",
  brand: "Azure",
  category: "Unisex",
  scentFamily: "Fresh",
  price: 65.00,
  rating: 4.2,
  reviewCount: 45,
  sizes: ["30ml", "50ml"],
  image: "https://picsum.photos/seed/product13/400/500",
  description: "A light, invigorating aquatic fragrance.",
  featured: false,
  tags: ["fresh", "aquatic", "casual"]
}
```

---

## Cart Development Notes

- Cart data is stored in `localStorage` under key `perfume_cart`
- To reset cart during development: `localStorage.removeItem('perfume_cart')` in browser console
- Cart badge updates on every page via `navbar.js` reading localStorage on `DOMContentLoaded`

---

## Testing Checklist

Run through these manually after any change:

- [ ] Home page hero renders, featured products show (at least 4 cards)
- [ ] Shop page shows all products, filters narrow results
- [ ] Clicking a product card opens product detail page
- [ ] "Add to Cart" increments navbar badge
- [ ] Cart page shows items, quantity controls update totals
- [ ] Removing all items shows empty state
- [ ] Cart persists after page refresh (check localStorage)
- [ ] Contact form rejects empty submission with inline errors
- [ ] Contact form accepts valid submission with success message
- [ ] All pages look correct at 375px, 768px, 1440px widths
