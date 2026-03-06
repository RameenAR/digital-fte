'use client'

import { useState } from 'react'
import HeroSection from '@/components/homepage/HeroSection'
import FeaturedCollections from '@/components/homepage/FeaturedCollections'
import ScentDiscoveryQuiz from '@/components/homepage/ScentDiscoveryQuiz'
import BrandStory from '@/components/homepage/BrandStory'
import NewsletterSignup from '@/components/homepage/NewsletterSignup'
import { FEATURED_PRODUCTS_SEED } from '@/data/featured-products-seed'

export default function HomePage() {
  const [quizOpen, setQuizOpen] = useState(false)
  const products = FEATURED_PRODUCTS_SEED.filter((p) => p.isActive)

  return (
    <>
      {/* US1: Hero Section — MVP */}
      <HeroSection />

      {/* US2: Featured Collections */}
      <FeaturedCollections products={products} />

      {/* US3: Scent Discovery Quiz entry point */}
      <section className="py-16 px-6 bg-brand-cream text-center" aria-labelledby="quiz-heading">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-gold mb-4">
            Personalised Discovery
          </p>
          <h2
            id="quiz-heading"
            className="font-serif text-4xl md:text-5xl text-brand-black mb-6"
          >
            Not Sure Where to Start?
          </h2>
          <p className="font-sans text-brand-bark/70 text-base mb-8">
            Answer 4 quick questions and we&apos;ll match you with the perfect fragrance.
          </p>
          <button
            onClick={() => setQuizOpen(true)}
            className="inline-flex items-center justify-center
              border border-brand-black text-brand-black
              font-sans font-semibold text-sm tracking-widest uppercase
              px-10 py-4 min-h-[44px]
              hover:bg-brand-black hover:text-brand-cream transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Find Your Scent
          </button>
        </div>
      </section>

      {/* Quiz modal */}
      <ScentDiscoveryQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />

      {/* US4: Brand Story */}
      <BrandStory />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </>
  )
}
