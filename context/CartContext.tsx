'use client'

import { createContext, useEffect, useReducer, type ReactNode } from 'react'
import { cartReducer, computeCart, SESSION_STORAGE_KEY } from '@/types/cart'
import type { Cart, CartAction, CartItem } from '@/types/cart'

interface CartContextValue extends Cart {
  dispatch: React.Dispatch<CartAction>
}

export const CartContext = createContext<CartContextValue>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  dispatch: () => {},
})

function readSessionStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { items: CartItem[] }
    return Array.isArray(parsed.items) ? parsed.items : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], readSessionStorage)

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ items }))
  }, [items])

  const cart = computeCart(items)

  return (
    <CartContext.Provider value={{ ...cart, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}
