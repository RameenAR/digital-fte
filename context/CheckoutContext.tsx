'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type {
  CheckoutState,
  CheckoutAction,
  CustomerInfo,
  Order,
  OrderLineItem,
} from '@/types/checkout'
import type { CartItem } from '@/types/cart'
import { CHECKOUT_STORAGE_KEY } from '@/types/checkout'
import { generateOrderNumber } from '@/lib/checkout'

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: CheckoutState = {
  customerInfo: null,
  completedOrder: null,
}

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload }
    case 'SET_COMPLETED_ORDER':
      return { ...state, completedOrder: action.payload }
    case 'CLEAR_CHECKOUT':
      return initialState
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CheckoutContextValue extends CheckoutState {
  setCustomerInfo: (info: CustomerInfo) => void
  placeOrder: (cartItems: CartItem[], clearCart: () => void) => Order
  clearCheckout: () => void
}

export const CheckoutContext = createContext<CheckoutContextValue>({
  customerInfo: null,
  completedOrder: null,
  setCustomerInfo: () => {},
  placeOrder: () => { throw new Error('CheckoutContext not mounted') },
  clearCheckout: () => {},
})

// ─── sessionStorage helpers ───────────────────────────────────────────────────

function readSession(): CheckoutState {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY)
    if (!raw) return initialState
    return JSON.parse(raw) as CheckoutState
  } catch {
    return initialState
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState, readSession)

  useEffect(() => {
    sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function setCustomerInfo(info: CustomerInfo) {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info })
  }

  function placeOrder(cartItems: CartItem[], clearCart: () => void): Order {
    const lineItems: OrderLineItem[] = cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      imageUrl: item.imageUrl,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineSubtotal: item.unitPrice * item.quantity,
    }))

    const order: Order = {
      orderNumber: generateOrderNumber(),
      placedAt: new Date().toISOString(),
      customerInfo: state.customerInfo!,
      lineItems,
      grandTotal: lineItems.reduce((sum, i) => sum + i.lineSubtotal, 0),
    }

    dispatch({ type: 'SET_COMPLETED_ORDER', payload: order })
    clearCart()
    return order
  }

  function clearCheckout() {
    dispatch({ type: 'CLEAR_CHECKOUT' })
  }

  return (
    <CheckoutContext.Provider value={{ ...state, setCustomerInfo, placeOrder, clearCheckout }}>
      {children}
    </CheckoutContext.Provider>
  )
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useCheckoutContext() {
  return useContext(CheckoutContext)
}
