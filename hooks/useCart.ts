'use client'

import { useContext } from 'react'
import { CartContext } from '@/context/CartContext'
import type { CartItem } from '@/types/cart'

export function useCart() {
  const { items, totalItems, totalPrice, dispatch } = useContext(CartContext)

  function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number) {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
  }

  return { items, totalItems, totalPrice, addToCart, clearCart }
}
