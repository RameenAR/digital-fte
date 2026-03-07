'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { CartItem } from '@/types/cart'
import { MAX_QUANTITY } from '@/types/cart'

interface CartLineItemProps {
  item: CartItem
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

const fmt = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
})

export default function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex gap-4 py-5">
      {/* Thumbnail */}
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-brand-cream">
        {imgError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cream/40 to-brand-bark/20" />
        ) : (
          <Image
            src={item.imageUrl}
            alt={`${item.name} perfume bottle`}
            fill
            sizes="64px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-serif text-base text-brand-black">{item.name}</p>
          <p className="mt-0.5 font-sans text-sm text-brand-bark/60">{fmt.format(item.unitPrice)} each</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quantity selector */}
          <div className="flex items-center rounded border border-brand-bark/30">
            <button
              type="button"
              onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="flex h-9 w-9 items-center justify-center font-sans text-lg text-brand-bark hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              −
            </button>
            <span
              className="min-w-[2rem] text-center font-sans text-sm text-brand-black"
              aria-live="polite"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
              disabled={item.quantity >= MAX_QUANTITY}
              aria-label={`Increase quantity of ${item.name}`}
              className="flex h-9 w-9 items-center justify-center font-sans text-lg text-brand-bark hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              +
            </button>
          </div>

          {/* Line subtotal */}
          <p className="w-24 text-right font-sans text-sm font-semibold text-brand-black">
            {fmt.format(item.unitPrice * item.quantity)}
          </p>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="font-sans text-xs text-brand-bark/40 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
