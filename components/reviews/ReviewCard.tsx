import type { Review } from '@/types/reviews'
import StarRating from '@/components/reviews/StarRating'

interface ReviewCardProps {
  review: Review
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-brand-bark/10 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="font-serif text-brand-black text-sm font-semibold truncate">
          {review.reviewerName}
        </span>
        <span className="font-sans text-xs text-brand-bark/50 shrink-0">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <StarRating value={review.rating} readOnly size="sm" />
      <p className="font-sans text-sm text-brand-bark/80 leading-relaxed whitespace-pre-wrap break-words">
        {review.body}
      </p>
    </div>
  )
}
