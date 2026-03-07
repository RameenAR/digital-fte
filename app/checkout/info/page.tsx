'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm'

export default function CheckoutInfoPage() {
  const router = useRouter()
  const { items } = useCart()

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/checkout/cart')
    }
  }, [items, router])

  if (items.length === 0) return null

  return <CustomerInfoForm />
}
