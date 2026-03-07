import { describe, it, expect } from 'vitest'
import { cartReducer, computeCart, MAX_QUANTITY } from '@/types/cart'
import type { CartItem } from '@/types/cart'

const makeItem = (overrides: Partial<CartItem> = {}): Omit<CartItem, 'quantity'> & { quantity: number } => ({
  productId: 'prod-001',
  slug: 'midnight-rose',
  name: 'Midnight Rose',
  imageUrl: '/images/midnight-rose.webp',
  unitPrice: 4500,
  quantity: 1,
  ...overrides,
})

// ─── cartReducer ─────────────────────────────────────────────────────────────

describe('cartReducer', () => {
  it('ADD_ITEM adds a new item when cart is empty', () => {
    const result = cartReducer([], { type: 'ADD_ITEM', payload: makeItem() })
    expect(result).toHaveLength(1)
    expect(result[0].productId).toBe('prod-001')
    expect(result[0].quantity).toBe(1)
  })

  it('ADD_ITEM accumulates quantity for existing product', () => {
    const initial = cartReducer([], { type: 'ADD_ITEM', payload: makeItem({ quantity: 2 }) })
    const result = cartReducer(initial, { type: 'ADD_ITEM', payload: makeItem({ quantity: 3 }) })
    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(5)
  })

  it('ADD_ITEM adds separate entry for different product', () => {
    const initial = cartReducer([], { type: 'ADD_ITEM', payload: makeItem() })
    const result = cartReducer(initial, {
      type: 'ADD_ITEM',
      payload: makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk' }),
    })
    expect(result).toHaveLength(2)
  })

  it(`ADD_ITEM caps quantity at ${MAX_QUANTITY} when adding new item over cap`, () => {
    const result = cartReducer([], { type: 'ADD_ITEM', payload: makeItem({ quantity: 15 }) })
    expect(result[0].quantity).toBe(MAX_QUANTITY)
  })

  it(`ADD_ITEM caps accumulated quantity at ${MAX_QUANTITY}`, () => {
    const initial = cartReducer([], { type: 'ADD_ITEM', payload: makeItem({ quantity: 8 }) })
    const result = cartReducer(initial, { type: 'ADD_ITEM', payload: makeItem({ quantity: 5 }) })
    expect(result[0].quantity).toBe(MAX_QUANTITY)
  })

  it('CLEAR_CART empties all items', () => {
    const initial = cartReducer([], { type: 'ADD_ITEM', payload: makeItem() })
    const result = cartReducer(initial, { type: 'CLEAR_CART' })
    expect(result).toHaveLength(0)
  })

  it('CLEAR_CART on empty cart returns empty array', () => {
    const result = cartReducer([], { type: 'CLEAR_CART' })
    expect(result).toHaveLength(0)
  })
})

// ─── computeCart ─────────────────────────────────────────────────────────────

describe('computeCart', () => {
  it('returns zero totals for empty cart', () => {
    const cart = computeCart([])
    expect(cart.totalItems).toBe(0)
    expect(cart.totalPrice).toBe(0)
    expect(cart.items).toHaveLength(0)
  })

  it('computes totalItems as sum of all quantities', () => {
    const items: CartItem[] = [
      { ...makeItem(), quantity: 2 },
      { ...makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk', unitPrice: 5200 }), quantity: 3 },
    ]
    expect(computeCart(items).totalItems).toBe(5)
  })

  it('computes totalPrice as sum of quantity × unitPrice', () => {
    const items: CartItem[] = [
      { ...makeItem({ unitPrice: 4500 }), quantity: 2 },   // 9000
      { ...makeItem({ productId: 'prod-002', slug: 'saffron-dusk', name: 'Saffron Dusk', unitPrice: 5200 }), quantity: 1 },  // 5200
    ]
    expect(computeCart(items).totalPrice).toBe(14200)
  })
})
