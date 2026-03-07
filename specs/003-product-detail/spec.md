# Feature Specification: Product Detail Page

**Feature Branch**: `003-product-detail`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Product detail page — show full perfume info (name, price, scent notes, description, images), add to cart button, scent family badge, related products section"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Full Product Details (Priority: P1)

A shopper clicks a product card from the catalogue or follows a shared link, and arrives at `/products/midnight-rose`. They see the complete product profile: hero image, name, price in PKR, scent family badge (e.g., "Floral"), a scent notes pyramid (Top / Heart / Base), and a full editorial description of the fragrance. This is the primary purchase-decision page — every other element supports this core experience.

**Why this priority**: Without a working product detail page, all catalogue links (`/products/[slug]`) return errors. This unblocks the entire purchase journey.

**Independent Test**: Navigate to `http://localhost:3000/products/midnight-rose`. Verify name, price, image, scent family badge ("Floral"), top/heart/base notes, and description are all visible. No other features needed.

**Acceptance Scenarios**:

1. **Given** a shopper is on the catalogue, **When** they click "Midnight Rose", **Then** they land on `/products/midnight-rose` and see the full product name, price (Rs 4,500), hero image, "Floral" badge, and scent notes pyramid.
2. **Given** a shopper opens a shared product URL directly, **When** the page loads, **Then** the correct product is displayed with all detail fields populated.
3. **Given** a shopper is on mobile (375px), **When** they view the product page, **Then** image and info stack vertically with no horizontal scroll.
4. **Given** a shopper visits a non-existent slug (e.g., `/products/xyz`), **When** the page loads, **Then** a clear "Product not found" message and a link to the catalogue are shown.

---

### User Story 2 — Add to Cart (Priority: P2)

A shopper decides to purchase a fragrance and clicks "Add to Cart". They can optionally adjust the quantity (1–10) before adding. After clicking, they receive immediate visual confirmation (button changes to "Added ✓"). The cart item count in the site header updates instantly. The shopper can continue browsing without being redirected away from the product page.

**Why this priority**: The add-to-cart action is the primary conversion event on a product page. Cart checkout / payment is out of scope for this feature.

**Independent Test**: On the product detail page, click "Add to Cart". Verify the button shows "Added ✓" for 2 seconds, and a cart count badge appears or increments in the header. No checkout page needed to validate this story.

**Acceptance Scenarios**:

1. **Given** a shopper is on a product page, **When** they click "Add to Cart" (quantity: 1), **Then** the button shows "Added ✓" and the header cart count increments by 1.
2. **Given** a shopper sets quantity to 3 and clicks "Add to Cart", **Then** the header cart count increments by 3.
3. **Given** a shopper adds the same product twice, **Then** the cart count reflects the cumulative total (1 + 1 = 2).
4. **Given** a shopper navigates to another page and returns, **Then** the cart count retains its value for the duration of the session.

---

### User Story 3 — Discover Related Fragrances (Priority: P3)

After reading about a fragrance, a shopper sees a "You Might Also Like" section at the bottom of the page showing up to 3 other fragrances with a similar scent profile. Each related product card links to its own detail page, enabling further discovery without returning to the full catalogue.

**Why this priority**: Cross-selling and discovery increase session depth and basket size, but the core detail page and cart work independently without this section.

**Independent Test**: On `http://localhost:3000/products/midnight-rose` (floral, oriental, woody tags), scroll to the bottom. Verify up to 3 related product cards appear — each with image, name, price — and each links to a valid `/products/[slug]` URL. "Midnight Rose" itself must not appear in the list.

**Acceptance Scenarios**:

1. **Given** a shopper views "Midnight Rose" (floral, oriental, woody), **When** they scroll to the bottom, **Then** they see up to 3 other fragrances with overlapping scent tags, excluding "Midnight Rose".
2. **Given** a related product card is shown, **When** the shopper clicks it, **Then** they navigate to that product's detail page.
3. **Given** a product has no scent tag overlap with any other, **When** viewing that product, **Then** the related section is hidden entirely (no empty box or placeholder).

---

### Edge Cases

- What happens when a slug does not match any active product? → A "Product not found" message is shown with a link back to `/products`. No crash or blank page.
- What happens when the product image fails to load? → A gradient placeholder is shown (consistent with catalogue behaviour).
- What if the shopper sets quantity to 0 or a negative value? → Quantity is clamped to a minimum of 1; "Add to Cart" remains functional.
- What if quantity exceeds 10? → Quantity is capped at 10; the increment control is disabled at the limit.
- What if there are fewer than 3 products with overlapping scent tags? → The section shows however many are available (1 or 2), without padding or empty slots.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product page at `/products/[slug]` MUST display the product name, price in PKR, and hero image.
- **FR-002**: The page MUST display the scent family badge derived from the product's primary category (e.g., "Floral", "Oriental", "Woody").
- **FR-003**: The page MUST display the scent notes pyramid with three labelled tiers — Top Notes, Heart Notes, Base Notes — each listing the relevant fragrance ingredients.
- **FR-004**: The page MUST display a full editorial product description (50–150 words) conveying the fragrance personality and occasion.
- **FR-005**: The page MUST display an "Add to Cart" button with a quantity selector (default: 1, range: 1–10).
- **FR-006**: Clicking "Add to Cart" MUST change the button to a success state ("Added ✓") for at least 2 seconds before reverting to the default state.
- **FR-007**: The cart item count displayed in the site header MUST update immediately when a product is added.
- **FR-008**: Cart state MUST persist for the duration of the browser session (navigating between pages does not reset the cart count).
- **FR-009**: The page MUST include breadcrumb navigation: Home → All Fragrances → [Product Name], with each segment linking to its respective page.
- **FR-010**: The page MUST show a "You Might Also Like" section with up to 3 products that share at least one scent tag with the current product, excluding the current product itself.
- **FR-011**: Each related product card MUST display image, name, and price, and MUST link to `/products/[slug]` for that product.
- **FR-012**: If the product slug does not exist or the product is inactive, the page MUST display a user-friendly "Product not found" message with a link to `/products`.
- **FR-013**: The page MUST include a unique `<title>` and meta description for search engine visibility (format: "[Product Name] | Lumière Parfums").

### Key Entities

- **Product**: Name, price (PKR), imageUrl, slug, category (scent family label), scentNotes (top/heart/base arrays), scentTags (for related matching), description (editorial text, 50–150 words), isActive flag. Extends the Product entity from the catalogue feature with the addition of `description`.
- **CartItem**: Product reference (id, name, slug, price, imageUrl), quantity (1–10), unit price at time of adding.
- **Cart**: Ordered collection of CartItems. Exposes: total item count, total price (sum of quantity × unit price). Persisted client-side for the browser session. No user account required in v1.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The product detail page loads and displays all critical content (name, image, price, Add to Cart) in under 2 seconds on a standard broadband connection.
- **SC-002**: All critical product information (name, price, image, Add to Cart button) is visible without scrolling on desktop screens at 1280px width.
- **SC-003**: A shopper can add a product to cart within 3 interactions from the catalogue (catalogue click → product page load → Add to Cart click).
- **SC-004**: The "Added ✓" confirmation appears within 300ms of clicking the button — no perceptible delay.
- **SC-005**: The related fragrances section shows at least 2 products for every product in the current catalogue (all 6 seed products share at least 2 scent tags with others).
- **SC-006**: The product page URL is directly shareable — opening the URL in a new tab or incognito window displays the correct product.
- **SC-007**: All interactive elements (breadcrumb links, quantity controls, Add to Cart, related product cards) are reachable and operable with keyboard-only navigation.

---

## Assumptions

- **Cart checkout is out of scope**: This feature delivers add-to-cart only. A cart review page and payment flow are separate future features.
- **Cart is session-only (v1)**: Cart state is stored client-side for the current browser session. It does not persist across sessions and does not require sign-in.
- **Single hero image per product**: Each product has one primary image. A multi-image gallery is out of scope for v1.
- **Description text is editorial**: Each seed product will include pre-written description text (50–150 words). User reviews and ratings are out of scope.
- **Related products algorithm**: "Related" = products with ≥1 overlapping scent tag, ranked by tag overlap count (descending), limited to 3, excluding the current product.
- **Quantity cap of 10**: No stock management in v1; the cap is a UX safeguard.
- **Breadcrumb labels are static**: "Home" → `/`, "All Fragrances" → `/products`.

---

## Out of Scope

- Cart review / cart page (viewing all items)
- Checkout and payment flow
- Product reviews and ratings
- Size or volume variants
- Wishlist / save for later
- Multi-image product gallery
- Stock availability and out-of-stock states
- User authentication for cart persistence across sessions
