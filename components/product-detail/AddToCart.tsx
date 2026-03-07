'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types/products'
import { MAX_QUANTITY } from '@/types/cart'

interface AddToCartProps {
  product: Product
}

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-brand-bark/60">Quantity</span>
        <div className="flex items-center rounded border border-brand-bark/30">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-lg text-brand-bark hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            −
          </button>
          <span
            className="min-w-[2.5rem] text-center font-sans text-sm text-brand-black"
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Increase quantity"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center font-sans text-lg text-brand-bark hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={added}
        aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
        className={`
          flex min-h-[44px] w-full items-center justify-center gap-2 rounded px-8 py-3
          font-sans text-sm uppercase tracking-widest transition-all duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2
          ${added
            ? 'bg-green-700 text-white cursor-default'
            : 'bg-brand-black text-brand-cream hover:bg-brand-gold'
          }
        `}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  )
}
