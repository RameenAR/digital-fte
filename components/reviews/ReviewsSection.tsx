'use client'

import { useReviews } from '@/hooks/useReviews'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewCard from '@/components/reviews/ReviewCard'
import StarRating from '@/components/reviews/StarRating'

interface ReviewsSectionProps {
  productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { reviews, averageRating, totalCount } = useReviews(productId)

  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-serif text-2xl text-brand-black mb-8">
        Customer Reviews
      </h2>

      {/* Average rating summary */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-bark/10">
          <span className="font-serif text-4xl text-brand-black">{averageRating.toFixed(1)}</span>
          <div className="flex flex-col gap-1">
            <StarRating value={Math.round(averageRating)} readOnly />
            <span className="font-sans text-sm text-brand-bark/60">
              {totalCount} review{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Review form */}
      <div className="mb-10">
        <ReviewForm productId={productId} />
      </div>

      {/* Review list */}
      {totalCount === 0 ? (
        <p className="font-sans text-sm text-brand-bark/60 italic">
          No reviews yet — be the first!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      )}
    </section>
  )
}
