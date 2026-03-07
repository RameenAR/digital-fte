'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { computeCart } from '@/types/cart'
import CartLineItem from './CartLineItem'
import EmptyCartMessage from './EmptyCartMessage'

const fmt = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
})

export default function CartReview() {
  const { items, addToCart, removeFromCart } = useCart()
  const { totalPrice } = computeCart(items)

  function handleQuantityChange(productId: string, quantity: number) {
    const item = items.find((i) => i.productId === productId)
    if (!item) return
    const delta = quantity - item.quantity
    if (delta === 0) return
    addToCart({ productId: item.productId, slug: item.slug, name: item.name, imageUrl: item.imageUrl, unitPrice: item.unitPrice }, delta)
  }

  if (items.length === 0) {
    return <EmptyCartMessage />
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-black sm:text-3xl">Your Cart</h1>

      {/* Items */}
      <div className="mt-6 divide-y divide-brand-bark/10 rounded border border-brand-bark/10 bg-white px-5">
        {items.map((item) => (
          <CartLineItem
            key={item.productId}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* Grand total + CTA */}
      <div className="mt-6 flex flex-col items-end gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-sm text-brand-bark/60">Total</span>
          <span className="font-serif text-2xl text-brand-black">{fmt.format(totalPrice)}</span>
        </div>
        <Link
          href="/checkout/info"
          className="flex min-h-[44px] min-w-[200px] items-center justify-center rounded bg-brand-black px-8 py-3 font-sans text-sm uppercase tracking-widest text-brand-cream hover:bg-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
