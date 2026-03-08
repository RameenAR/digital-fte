import { describe, it, expect } from 'vitest'
import { wishlistReducer, computeWishlist } from '@/types/wishlist'
import type { WishlistItem } from '@/types/wishlist'

const makeItem = (overrides: Partial<WishlistItem> = {}): WishlistItem => ({
  productId: 'prod-001',
  slug: 'midnight-rose',
  name: 'Midnight Rose',
  imageUrl: '/images/midnight-rose.webp',
  price: 4500,
  addedAt: '2026-03-07T10:00:00.000Z',
  ...overrides,
})

// ─── wishlistReducer ──────────────────────────────────────────────────────────

describe('wishlistReducer', () => {
  it('TOGGLE_ITEM adds item when not in wishlist', () => {
    const result = wishlistReducer([], { type: 'TOGGLE_ITEM', payload: makeItem() })
    expect(result).toHaveLength(1)
    expect(result[0].productId).toBe('prod-001')
  })

  it('TOGGLE_ITEM removes item when already in wishlist', () => {
    const initial = wishlistReducer([], { type: 'TOGGLE_ITEM', payload: makeItem() })
    const result = wishlistReducer(initial, { type: 'TOGGLE_ITEM', payload: makeItem() })
    expect(result).toHaveLength(0)
  })

  it('TOGGLE_ITEM does not create duplicates', () => {
    const step1 = wishlistReducer([], { type: 'TOGGLE_ITEM', payload: makeItem() })
    const step2 = wishlistReducer(step1, { type: 'TOGGLE_ITEM', payload: makeItem() })
    const step3 = wishlistReducer(step2, { type: 'TOGGLE_ITEM', payload: makeItem() })
    expect(step3).toHaveLength(1)
  })

  it('REMOVE_ITEM removes the correct item', () => {
    const initial = [makeItem(), makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk' })]
    const result = wishlistReducer(initial, { type: 'REMOVE_ITEM', payload: { productId: 'prod-001' } })
    expect(result).toHaveLength(1)
    expect(result[0].productId).toBe('prod-002')
  })

  it('CLEAR_WISHLIST empties all items', () => {
    const initial = [makeItem(), makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk' })]
    const result = wishlistReducer(initial, { type: 'CLEAR_WISHLIST' })
    expect(result).toHaveLength(0)
  })
})

// ─── computeWishlist ──────────────────────────────────────────────────────────

describe('computeWishlist', () => {
  it('returns zero totalItems for empty input', () => {
    const wishlist = computeWishlist([])
    expect(wishlist.totalItems).toBe(0)
    expect(wishlist.items).toHaveLength(0)
  })

  it('totalItems equals number of items (not quantity)', () => {
    const items: WishlistItem[] = [
      makeItem(),
      makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk' }),
    ]
    expect(computeWishlist(items).totalItems).toBe(2)
  })
})
