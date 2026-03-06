'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { FeaturedProduct } from '@/types/homepage'

interface ProductCardProps {
  product: FeaturedProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  const scentPreview = [
    ...product.scentNotes.top.slice(0, 1),
    ...product.scentNotes.heart.slice(0, 1),
    ...product.scentNotes.base.slice(0, 1),
  ].join(' · ')

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(product.price)

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`View ${product.name} — ${formattedPrice}`}
      className="group relative block overflow-hidden bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream">
        {imgError ? (
          /* Broken image fallback — gradient placeholder */
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-cream/40 to-brand-bark/20"
            aria-hidden="true"
          />
        ) : (
          <Image
            src={product.imageUrl}
            alt={`${product.name} perfume bottle`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Scent notes overlay — revealed on hover/focus */}
        <div
          className="absolute inset-0 flex items-end p-4
            bg-gradient-to-t from-brand-black/80 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
            transition-opacity duration-300"
          aria-hidden="true"
        >
          <p className="text-brand-cream font-sans text-xs tracking-wide">
            {scentPreview}
          </p>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-serif text-lg text-brand-black mb-1">{product.name}</h3>
        <p className="font-sans text-sm text-brand-bark/70">{formattedPrice}</p>
      </div>
    </Link>
  )
}
