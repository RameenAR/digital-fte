/**
 * Cart API Contract
 * Feature: 008-perfume-static-site
 *
 * This file defines the JavaScript function signatures and behaviors
 * for the cart module (js/cart.js). All functions operate on localStorage.
 *
 * localStorage key: "perfume_cart"
 */

/**
 * Returns the current cart state from localStorage.
 * @returns {{ items: CartItem[], updatedAt: string }}
 */
function getCart() {}

/**
 * Adds a product to the cart. If the same productId + size already exists,
 * increments the quantity. Otherwise appends a new CartItem.
 *
 * @param {number} productId   - Must match a product in window.PRODUCTS
 * @param {string} size        - Must be a valid size for the product
 * @param {number} quantity    - Must be >= 1
 * @returns {void}
 * @sideEffect Updates localStorage["perfume_cart"]
 * @sideEffect Dispatches custom event "cart:updated" on document
 */
function addToCart(productId, size, quantity) {}

/**
 * Updates the quantity of a specific cart item.
 * If newQuantity < 1, the item is removed from the cart.
 *
 * @param {number} productId
 * @param {string} size
 * @param {number} newQuantity - Must be >= 0 (0 triggers removal)
 * @returns {void}
 * @sideEffect Updates localStorage["perfume_cart"]
 * @sideEffect Dispatches custom event "cart:updated" on document
 */
function updateCartItemQuantity(productId, size, newQuantity) {}

/**
 * Removes a specific item from the cart entirely.
 *
 * @param {number} productId
 * @param {string} size
 * @returns {void}
 * @sideEffect Updates localStorage["perfume_cart"]
 * @sideEffect Dispatches custom event "cart:updated" on document
 */
function removeFromCart(productId, size) {}

/**
 * Returns the total number of individual items across all CartItems.
 * Example: 2 items of qty 3 each = 6
 *
 * @returns {number}
 */
function getCartItemCount() {}

/**
 * Returns the subtotal of all cart items (price × quantity, summed).
 *
 * @returns {number} Subtotal in USD
 */
function getCartSubtotal() {}

/**
 * Empties the entire cart.
 *
 * @returns {void}
 * @sideEffect Removes localStorage["perfume_cart"]
 * @sideEffect Dispatches custom event "cart:updated" on document
 */
function clearCart() {}

// ---- Type Definitions ----

/**
 * @typedef {Object} CartItem
 * @property {number} productId
 * @property {string} name
 * @property {string} image
 * @property {string} size
 * @property {number} price
 * @property {number} quantity
 */
