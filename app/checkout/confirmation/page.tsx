'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckoutContext } from '@/context/CheckoutContext'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'

export default function CheckoutConfirmationPage() {
  const router = useRouter()
  const { completedOrder } = useCheckoutContext()

  useEffect(() => {
    if (!completedOrder) {
      router.replace('/checkout/cart')
    }
  }, [completedOrder, router])

  if (!completedOrder) return null

  return <OrderConfirmation />
}
