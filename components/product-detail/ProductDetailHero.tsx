'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Product } from '@/types/products'

interface ProductDetailHeroProps {
  product: Product
}

export default function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const [imgError, setImgError] = useState(false)

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(product.price)

  return (
    <div className="space-y-6">
      {/* Hero image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream">
        {imgError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cream/40 to-brand-bark/20" />
        ) : (
          <Image
            src={product.imageUrl}
            alt={`${product.name} perfume bottle`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Name, price, badge */}
      <div className="space-y-3">
        <h1 className="font-serif text-3xl text-brand-black sm:text-4xl">{product.name}</h1>
        <p className="font-sans text-xl text-brand-bark">{formattedPrice}</p>
        <span className="inline-block rounded-full border border-brand-gold px-3 py-1 font-sans text-xs uppercase tracking-widest text-brand-gold">
          {product.category}
        </span>
      </div>
    </div>
  )
}
