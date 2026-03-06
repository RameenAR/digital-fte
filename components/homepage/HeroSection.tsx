'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function HeroSection() {
  const [videoError, setVideoError] = useState(false)

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black"
      aria-label="Hero section"
    >
      {/* Background: video with image fallback */}
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Fallback image — shown when video errors or always on slow connections */}
      <Image
        src="/hero-fallback.jpg"
        alt="Luxury perfume bottles surrounded by exotic flowers and golden light"
        fill
        priority
        className={`object-cover opacity-60 ${!videoError ? 'hidden' : 'block'}`}
        sizes="100vw"
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 via-transparent to-brand-black/60" />

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-brand-gold font-sans text-sm tracking-[0.3em] uppercase mb-6">
          Handcrafted in Small Batches
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-cream leading-tight mb-6">
          Wear Your
          <span className="block italic text-brand-gold">Story</span>
        </h1>
        <p className="font-sans text-brand-cream/80 text-lg md:text-xl max-w-xl mx-auto mb-10">
          Luxury fragrances crafted from the world&apos;s finest ingredients.
          Each bottle tells a story — find yours.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center
            bg-brand-gold text-brand-black
            font-sans font-semibold text-sm tracking-widest uppercase
            px-10 py-4 min-h-[44px]
            transition-all duration-300
            hover:bg-brand-cream hover:scale-105
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
          aria-label="Explore the perfume collection"
        >
          Explore the Collection
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6 text-brand-cream/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
