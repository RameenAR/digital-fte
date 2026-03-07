import type { Metadata } from 'next'
import CartReview from '@/components/checkout/CartReview'

export const metadata: Metadata = {
  title: 'Your Cart | Lumière Parfums',
}

export default function CartPage() {
  return <CartReview />
}
