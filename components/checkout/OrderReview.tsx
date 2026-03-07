'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useCheckoutContext } from '@/context/CheckoutContext'
import { PROVINCE_LABELS } from '@/types/checkout'

const fmt = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
})

export default function OrderReview() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { customerInfo, placeOrder } = useCheckoutContext()
  const [placing, setPlacing] = useState(false)

  const grandTotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  function handlePlaceOrder() {
    setPlacing(true)
    placeOrder(items, clearCart)
    router.push('/checkout/confirmation')
  }

  if (!customerInfo) return null

  return (
    <div>
      <h1 className="font-serif text-2xl text-brand-black sm:text-3xl">Review Your Order</h1>

      {/* Items */}
      <section aria-labelledby="items-heading" className="mt-6">
        <h2 id="items-heading" className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
          Items
        </h2>
        <div className="divide-y divide-brand-bark/10 rounded border border-brand-bark/10 bg-white px-5">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden rounded bg-brand-cream">
                <Image src={item.imageUrl} alt={item.name} fill sizes="44px" className="object-cover" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2">
                <div>
                  <p className="font-serif text-sm text-brand-black">{item.name}</p>
                  <p className="font-sans text-xs text-brand-bark/50">Qty: {item.quantity}</p>
                </div>
                <p className="font-sans text-sm font-semibold text-brand-black">
                  {fmt.format(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer details */}
      <section aria-labelledby="delivery-heading" className="mt-6">
        <h2 id="delivery-heading" className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
          Delivery Details
        </h2>
        <div className="rounded border border-brand-bark/10 bg-white px-5 py-4 space-y-1 font-sans text-sm text-brand-bark">
          <p className="font-semibold text-brand-black">{customerInfo.fullName}</p>
          <p>{customerInfo.email} · {customerInfo.phone}</p>
          <p>{customerInfo.streetAddress}</p>
          <p>{customerInfo.city}, {PROVINCE_LABELS[customerInfo.province]}, {customerInfo.postalCode}</p>
        </div>
      </section>

      {/* Grand total */}
      <div className="mt-6 flex items-baseline justify-end gap-3">
        <span className="font-sans text-sm text-brand-bark/60">Order Total</span>
        <span className="font-serif text-3xl text-brand-black">{fmt.format(grandTotal)}</span>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          href="/checkout/info"
          className="flex min-h-[44px] items-center justify-center rounded border border-brand-bark/30 px-6 font-sans text-sm text-brand-bark hover:border-brand-gold hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          ← Back to Info
        </Link>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="flex min-h-[44px] items-center justify-center rounded bg-brand-black px-8 font-sans text-sm uppercase tracking-widest text-brand-cream hover:bg-brand-gold transition-colors disabled:cursor-default disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          {placing ? 'Placing Order…' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
