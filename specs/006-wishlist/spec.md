# Feature Specification: Wishlist / Favourites

**Feature Branch**: `006-wishlist`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Wishlist / Favourites — users can save products to a personal wishlist by clicking a heart icon on product cards and product detail pages. Wishlist persists across browser sessions using localStorage (no login required). Wishlist count shown in header. Dedicated wishlist page lists saved products with ability to remove items or move them to cart. Empty state with CTA to browse products. No backend — fully client-side with localStorage persistence."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Save & Toggle Products (Priority: P1)

A visitor browsing products sees a heart icon on each product card and on the product detail page. Clicking the heart saves the product to their wishlist; clicking again removes it. The heart icon visually reflects the current saved state (filled = saved, outline = not saved). The count in the site header updates immediately.

**Why this priority**: Core wishlist interaction. Without save/unsave, no other wishlist feature has value. Directly increases product discovery and return-visit intent.

**Independent Test**: Navigate to the product listing page, click a heart icon on any card — the icon fills, the header count increments to 1. Click again — icon becomes outline, count returns to 0.

**Acceptance Scenarios**:

1. **Given** a visitor is on the product listing page, **When** they click the heart icon on a product card, **Then** the icon changes to filled state and the header wishlist count increments by 1.
2. **Given** a product is already saved, **When** the visitor clicks the heart icon again, **Then** the icon returns to outline state and the count decrements by 1.
3. **Given** a visitor is on the product detail page, **When** they click the heart icon, **Then** the product is added to the wishlist and the icon reflects the saved state.
4. **Given** a product is in the wishlist, **When** the visitor navigates away and returns to any page showing that product, **Then** the heart icon is already in filled state.
5. **Given** a visitor adds a product that is already in the wishlist, **When** the add action fires again, **Then** only one copy exists in the wishlist (no duplicates).

---

### User Story 2 — Persistent Wishlist Across Sessions (Priority: P2)

A visitor saves products during one browsing session, closes the browser, and returns later. All previously saved products are still in their wishlist without requiring login or account creation.

**Why this priority**: Without persistence, the wishlist has no long-term value. This is the key differentiator over a simple in-memory "liked" interaction — it turns the wishlist into a genuine save-for-later tool.

**Independent Test**: Save two products, close the browser tab, reopen the site — both products are in the wishlist and the header count shows 2.

**Acceptance Scenarios**:

1. **Given** a visitor has saved 3 products, **When** they close and reopen the browser, **Then** all 3 products remain in the wishlist with the correct count shown in the header.
2. **Given** a visitor has an empty wishlist, **When** they close and reopen the browser, **Then** the header shows no count badge and the wishlist page shows the empty state.
3. **Given** a visitor saves a product, **When** they refresh the current page, **Then** the product is still in the wishlist and the heart icon is in filled state.

---

### User Story 3 — Wishlist Page (Priority: P3)

A visitor navigates to the dedicated `/wishlist` page and sees all their saved products in a grid. Each item shows the product image, name, and price. From this page they can remove individual items or move them directly to the cart.

**Why this priority**: Provides the single destination for reviewing and acting on saved products — completing the "save now, buy later" journey.

**Independent Test**: Save 2 products, navigate to `/wishlist` — both products appear with image, name, price, a remove button, and a "Move to Cart" button. Remove one — only 1 remains. Move the other to cart — wishlist becomes empty and shows empty state.

**Acceptance Scenarios**:

1. **Given** a visitor has 3 items in their wishlist, **When** they navigate to `/wishlist`, **Then** all 3 products are displayed with image, name, and price.
2. **Given** the wishlist page is open, **When** the visitor clicks the remove button on a product, **Then** the product is removed from the list immediately without a page reload.
3. **Given** the wishlist page is open, **When** the visitor clicks "Move to Cart" on a product, **Then** the product is added to the cart and removed from the wishlist.
4. **Given** the visitor removes the last item on the wishlist page, **Then** the empty state is displayed with a "Browse Products" call-to-action.
5. **Given** a visitor has no items saved, **When** they navigate to `/wishlist`, **Then** the empty state is shown with an explanatory message and a link to the products page.

---

### User Story 4 — Header Wishlist Count (Priority: P4)

The site header shows a wishlist icon with a numerical badge reflecting the number of saved products. The badge is hidden when the count is zero. Clicking the icon navigates to the `/wishlist` page.

**Why this priority**: Ambient visibility reinforces save activity and provides one-click access to the wishlist from every page.

**Independent Test**: With 0 items saved, confirm no badge is visible. Add 1 item — badge appears with "1". Navigate to a different page — badge still shows "1". Click the badge — navigate to `/wishlist`.

**Acceptance Scenarios**:

1. **Given** the wishlist is empty, **When** any page is loaded, **Then** the header wishlist icon shows no count badge.
2. **Given** the wishlist contains 2 items, **When** any page is loaded, **Then** the header shows a badge with "2".
3. **Given** the count badge is visible, **When** the visitor clicks the wishlist icon, **Then** they are navigated to `/wishlist`.
4. **Given** the visitor adds a product, **When** the action completes, **Then** the header count updates immediately without a page reload.

---

### Edge Cases

- What happens when a visitor tries to add the same product twice? → Wishlist remains unchanged; no duplicate is created; the heart icon stays in filled state.
- What happens when the wishlist page is visited with no saved items? → Empty state with message and link to browse products is displayed.
- What happens after removing the last item from the wishlist page? → Empty state is shown in-place without redirecting the visitor.
- What if the visitor opens the site in a private/incognito window where storage may be restricted? → Wishlist works in-memory for the duration of the session; data is not persisted after the tab is closed; no error is shown to the visitor.
- What if a product is discontinued or removed from the catalog after being saved? → The item is still displayed on the wishlist page using the stored snapshot data (name, price, image at time of saving); a subtle notice indicates the product may no longer be available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The heart icon MUST appear on every product card in the product listing grid.
- **FR-002**: The heart icon MUST appear on the product detail page.
- **FR-003**: Clicking the heart icon MUST toggle the saved state — add the product if not saved, remove it if already saved.
- **FR-004**: The heart icon MUST visually distinguish between saved (filled) and unsaved (outline) states at all times.
- **FR-005**: The wishlist MUST persist across browser sessions without requiring user login or account creation.
- **FR-006**: The wishlist MUST NOT allow duplicate entries for the same product.
- **FR-007**: The site header MUST display a wishlist icon that links to the `/wishlist` page.
- **FR-008**: The header wishlist icon MUST show a numerical count badge when the wishlist contains one or more items.
- **FR-009**: The count badge MUST be hidden when the wishlist is empty.
- **FR-010**: The `/wishlist` page MUST list all saved products, showing image, name, and price for each.
- **FR-011**: Each item on the wishlist page MUST have a remove button that removes it from the wishlist immediately without a page reload.
- **FR-012**: Each item on the wishlist page MUST have a "Move to Cart" button that adds the product to the cart and removes it from the wishlist in a single action.
- **FR-013**: The `/wishlist` page MUST display an empty state when no products are saved, including a call-to-action link to the products page.
- **FR-014**: All wishlist changes (add, remove, move to cart) MUST be reflected immediately across all visible UI elements without a full page reload.

### Key Entities

- **WishlistItem**: A saved product snapshot containing the product ID, name, price, image URL, slug, and the date it was added to the wishlist.
- **Wishlist**: The ordered collection of WishlistItems for the current visitor. Managed entirely on the client side, persisted between sessions. No size limit.

## Out of Scope

- User accounts or authentication of any kind
- Server-side or cloud wishlist storage
- Cross-device wishlist synchronisation
- Sharing a wishlist via a link or social media
- Wishlist notifications (price drop alerts, back-in-stock alerts)
- Multiple named wishlists per visitor
- Reordering items within the wishlist

## Assumptions

1. The cart context established in the 004-checkout-flow feature is accessible for the "Move to Cart" action.
2. Wishlist data is device- and browser-specific; visitors using multiple devices will have separate wishlists.
3. There is no upper limit on the number of items a visitor can save.
4. "Move to Cart" adds the product at a default quantity of 1 and removes it from the wishlist atomically.
5. Product data stored in the wishlist (name, price, image) is a snapshot taken at the time of saving; live product data changes are not reflected retroactively.
6. If storage is unavailable (e.g., private browsing mode), the wishlist operates as in-memory state for the session without displaying an error to the visitor.
7. The `/wishlist` page is publicly accessible — no authentication gate.
8. The heart icon uses the same SVG icon style as the rest of the site's icon set.

## Dependencies

- **004-checkout-flow**: The cart context is required for the "Move to Cart" functionality on the wishlist page.
- **002-product-listing**: Product cards must be extended to include the heart icon toggle.
- **003-product-detail**: The product detail page must be extended to include the heart icon toggle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can add any product to the wishlist in a single click or tap from the product listing page or product detail page.
- **SC-002**: 100% of wishlist items survive a full browser close-and-reopen (session persistence).
- **SC-003**: The header wishlist count updates within the same interaction that adds or removes a product — no page reload or delay required.
- **SC-004**: A visitor can view all saved products, remove any item, and move any item to cart from a single page (`/wishlist`) without navigating away.
- **SC-005**: The wishlist empty state and the "Browse Products" link are displayed and functional within one user action after the last item is removed.
- **SC-006**: Zero duplicate products appear in the wishlist regardless of how many times the same product's heart icon is clicked.
