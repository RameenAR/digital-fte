// ─── Wishlist types and pure reducer for 006-wishlist ────────────────────────

export interface WishlistItem {
  productId: string
  slug: string
  name: string
  imageUrl: string
  price: number
  addedAt: string // ISO string — JSON-serialisable
}

export interface Wishlist {
  items: WishlistItem[]
  totalItems: number
}

export type WishlistAction =
  | { type: 'TOGGLE_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_WISHLIST' }

export const WISHLIST_STORAGE_KEY = 'lumiere_wishlist'

// ─── Pure reducer — exported for unit testing ─────────────────────────────────

export function wishlistReducer(items: WishlistItem[], action: WishlistAction): WishlistItem[] {
  switch (action.type) {
    case 'TOGGLE_ITEM': {
      const exists = items.some((i) => i.productId === action.payload.productId)
      if (exists) {
        return items.filter((i) => i.productId !== action.payload.productId)
      }
      return [...items, action.payload]
    }
    case 'REMOVE_ITEM':
      return items.filter((i) => i.productId !== action.payload.productId)
    case 'CLEAR_WISHLIST':
      return []
    default:
      return items
  }
}

// ─── Computed totals ──────────────────────────────────────────────────────────

export function computeWishlist(items: WishlistItem[]): Wishlist {
  return {
    items,
    totalItems: items.length,
  }
}
