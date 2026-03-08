# Quickstart: Wishlist / Favourites (006-wishlist)

**Date**: 2026-03-07
**Branch**: `006-wishlist`

---

## Integration Scenarios for Testing

### Scenario 1: Add a product to wishlist from product listing

```
1. Navigate to /products
2. Locate any product card
3. Click the heart icon (top-right of card image)
Expected:
  - Heart icon changes from outline → filled
  - Header wishlist count badge appears / increments
  - No navigation occurs (link not triggered)
```

### Scenario 2: Toggle removes product from wishlist

```
1. Add a product to wishlist (Scenario 1)
2. Click the filled heart icon again
Expected:
  - Heart icon changes from filled → outline
  - Header wishlist count decrements
  - Item no longer in wishlist
```

### Scenario 3: Persistence across browser close

```
1. Add 2 products to wishlist
2. Close the browser tab and reopen
3. Navigate to any page
Expected:
  - Header wishlist count shows 2
  - Both products appear on /wishlist page
  - Heart icons on those product cards are in filled state
```

### Scenario 4: Wishlist page — remove item

```
1. Add 3 products to wishlist
2. Navigate to /wishlist
3. Click the remove button on the first product
Expected:
  - Product removed immediately from the list
  - Header count decrements
  - 2 products remain visible on the page
  - Heart icon on that product's card on /products is now outline
```

### Scenario 5: Wishlist page — move to cart

```
1. Add a product to wishlist
2. Navigate to /wishlist
3. Click "Move to Cart" on the product
Expected:
  - Product removed from wishlist page immediately
  - Header wishlist count decrements
  - Header cart count increments
  - Product appears in cart at quantity 1
  - If wishlist is now empty, empty state is shown
```

### Scenario 6: Wishlist page — empty state

```
1. Ensure wishlist is empty (or clear all)
2. Navigate to /wishlist
Expected:
  - Empty state message is displayed
  - "Browse Products" link is visible and navigates to /products
  - Header shows no wishlist badge
```

### Scenario 7: Duplicate prevention

```
1. Add a product to wishlist
2. Navigate away and return to /products
3. Click the heart icon on the same product again
Expected:
  - Icon becomes outline (toggled off), NOT a duplicate
  - Click again → icon becomes filled, count stays at 1
```

### Scenario 8: Heart icon on product detail page

```
1. Navigate to /products/:slug
2. Click the heart icon on the detail page
Expected:
  - Heart icon becomes filled
  - Header count increments
  - Item appears on /wishlist
```

### Scenario 9: Header WishlistBadge navigates to /wishlist

```
1. Add at least 1 product to wishlist
2. Click the wishlist icon in the header
Expected:
  - Navigates to /wishlist
  - Badge count matches number of saved items
```

### Scenario 10: Private browsing graceful degradation

```
1. Open site in incognito/private window
2. Add a product to wishlist
Expected:
  - Heart icon becomes filled in the current session
  - No error shown to user
3. Close and reopen incognito window
Expected:
  - Wishlist is empty (localStorage not persisted in private mode)
  - No crash or error state
```

---

## Key Touchpoints Summary

| Component / File           | Change Type | Reason                                       |
|----------------------------|-------------|----------------------------------------------|
| `types/wishlist.ts`        | NEW         | WishlistItem, Wishlist, WishlistAction types |
| `context/WishlistContext.tsx` | NEW      | Global wishlist state with localStorage      |
| `hooks/useWishlist.ts`     | NEW         | toggle, isInWishlist, moveToCart API         |
| `components/layout/WishlistBadge.tsx` | NEW | Heart + count badge in header         |
| `components/wishlist/WishlistToggle.tsx` | NEW | Reusable heart button for cards + detail |
| `components/wishlist/WishlistPage.tsx` | NEW | Wishlist page client component         |
| `app/wishlist/page.tsx`    | NEW         | Route for /wishlist                          |
| `app/layout.tsx`           | MODIFY      | Add WishlistProvider + WishlistBadge         |
| `components/homepage/ProductCard.tsx` | MODIFY | Add WishlistToggle heart button        |
| `app/products/[slug]/page.tsx` | MODIFY  | Add WishlistToggle on detail page            |
| `tests/unit/wishlist.test.ts` | NEW      | wishlistReducer + computeWishlist unit tests |
