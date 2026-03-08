'use client'

import { createContext, useEffect, useReducer, type ReactNode } from 'react'
import { wishlistReducer, computeWishlist, WISHLIST_STORAGE_KEY } from '@/types/wishlist'
import type { Wishlist, WishlistAction, WishlistItem } from '@/types/wishlist'

interface WishlistContextValue extends Wishlist {
  dispatch: React.Dispatch<WishlistAction>
}

export const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  totalItems: 0,
  dispatch: () => {},
})

function readLocalStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { items: WishlistItem[] }
    return Array.isArray(parsed.items) ? parsed.items : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(wishlistReducer, [], readLocalStorage)

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ items }))
    } catch {
      // private browsing — silently ignore
    }
  }, [items])

  const wishlist = computeWishlist(items)

  return (
    <WishlistContext.Provider value={{ ...wishlist, dispatch }}>
      {children}
    </WishlistContext.Provider>
  )
}
