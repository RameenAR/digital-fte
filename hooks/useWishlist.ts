'use client'

import { useContext } from 'react'
import { WishlistContext } from '@/context/WishlistContext'
import { useCart } from '@/hooks/useCart'
import type { WishlistItem } from '@/types/wishlist'

export function useWishlist() {
  const { items, totalItems, dispatch } = useContext(WishlistContext)
  const { addToCart } = useCart()

  function isInWishlist(productId: string): boolean {
    return items.some((i) => i.productId === productId)
  }

  function toggleWishlist(product: Omit<WishlistItem, 'addedAt'>) {
    dispatch({
      type: 'TOGGLE_ITEM',
      payload: { ...product, addedAt: new Date().toISOString() },
    })
  }

  function removeFromWishlist(productId: string) {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  function moveToCart(item: WishlistItem) {
    addToCart(
      {
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        imageUrl: item.imageUrl,
        unitPrice: item.price,
      },
      1
    )
    removeFromWishlist(item.productId)
  }

  function clearWishlist() {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  return { items, totalItems, isInWishlist, toggleWishlist, removeFromWishlist, moveToCart, clearWishlist }
}
