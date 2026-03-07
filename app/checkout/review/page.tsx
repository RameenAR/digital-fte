'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useCheckoutContext } from '@/context/CheckoutContext'
import OrderReview from '@/components/checkout/OrderReview'

export default function CheckoutReviewPage() {
  const router = useRouter()
  const { items } = useCart()
  const { customerInfo } = useCheckoutContext()

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/checkout/cart')
    } else if (!customerInfo) {
      router.replace('/checkout/info')
    }
  }, [items, customerInfo, router])

  if (items.length === 0 || !customerInfo) return null

  return <OrderReview />
}
