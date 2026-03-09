/**
 * Products Data Contract
 * Feature: 008-perfume-static-site
 *
 * Defines the shape of the product data array stored in js/data/products.js.
 * This is the source of truth for all product display across pages.
 */

/**
 * @typedef {Object} Product
 * @property {number}   id          - Unique integer identifier (1-based)
 * @property {string}   name        - Display name (max 40 chars)
 * @property {string}   brand       - Brand name
 * @property {string}   category    - "Men" | "Women" | "Unisex"
 * @property {string}   scentFamily - "Floral" | "Woody" | "Fresh" | "Oriental"
 * @property {number}   price       - Price in USD, e.g., 89.99
 * @property {number}   rating      - 1.0 to 5.0 (one decimal place)
 * @property {number}   reviewCount - Total number of reviews
 * @property {string[]} sizes       - Available sizes, e.g., ["30ml","50ml","100ml"]
 * @property {string}   image       - Image URL (picsum with seed)
 * @property {string}   description - Short product description (1-2 sentences)
 * @property {boolean}  featured    - Whether to show in Home featured section
 * @property {string[]} tags        - Descriptive tags for search/display
 */

/**
 * Sample product record (reference implementation):
 *
 * {
 *   id: 1,
 *   name: "Midnight Rose",
 *   brand: "Essence Noir",
 *   category: "Women",
 *   scentFamily: "Floral",
 *   price: 89.99,
 *   rating: 4.5,
 *   reviewCount: 128,
 *   sizes: ["30ml", "50ml", "100ml"],
 *   image: "https://picsum.photos/seed/product1/400/500",
 *   description: "A rich, velvety rose fragrance with dark amber undertones. Perfect for evening wear.",
 *   featured: true,
 *   tags: ["floral", "romantic", "evening", "luxury"]
 * }
 */

/**
 * Filter contract — values used in shop.js filter UI:
 *
 * Category values:   ["Men", "Women", "Unisex"]
 * ScentFamily values: ["Floral", "Woody", "Fresh", "Oriental"]
 * Price ranges:
 *   "under-50"  → price < 50
 *   "50-100"    → price >= 50 && price <= 100
 *   "100-200"   → price > 100 && price <= 200
 *   "over-200"  → price > 200
 *
 * Sort options:
 *   "featured"   → featured === true first, then id ascending
 *   "price-asc"  → price ascending
 *   "price-desc" → price descending
 *   "rating"     → rating descending
 */
