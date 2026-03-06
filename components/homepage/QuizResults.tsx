import type { QuizResult } from '@/types/homepage'
import ProductCard from './ProductCard'

interface QuizResultsProps {
  result: QuizResult
  onRetake: () => void
}

export default function QuizResults({ result, onRetake }: QuizResultsProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-gold mb-3">
          Your Matches
        </p>
        <h3 className="font-serif text-3xl md:text-4xl text-brand-black mb-2">
          {result.fallback ? 'Our Top Picks for You' : 'Recommended for You'}
        </h3>
        {result.fallback && (
          <p className="font-sans text-sm text-brand-bark/60">
            Explore our most beloved fragrances to find your perfect match.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {result.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onRetake}
          className="font-sans text-sm text-brand-bark/60 underline underline-offset-4
            hover:text-brand-black transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Retake the quiz
        </button>
      </div>
    </div>
  )
}
