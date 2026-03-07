// ─── Cart types and pure reducer for 003-product-detail ──────────────────────

export interface CartItem {
  productId: string
  slug: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity: number } }
  | { type: 'CLEAR_CART' }

export const MAX_QUANTITY = 10
export const SESSION_STORAGE_KEY = 'lumiere_cart'

// ─── Pure reducer — exported for unit testing ────────────────────────────────

export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity, ...itemData } = action.payload
      const existing = items.find((i) => i.productId === itemData.productId)
      if (existing) {
        return items.map((i) =>
          i.productId === itemData.productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) }
            : i
        )
      }
      return [...items, { ...itemData, quantity: Math.min(quantity, MAX_QUANTITY) }]
    }
    case 'CLEAR_CART':
      return []
    default:
      return items
  }
}

// ─── Computed totals ─────────────────────────────────────────────────────────

export function computeCart(items: CartItem[]): Cart {
  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
  }
}
