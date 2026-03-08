'use client'

import { useReviews } from '@/hooks/useReviews'

interface RatingBadgeProps {
  productId: string
  className?: string
}

export default function RatingBadge({ productId, className = '' }: RatingBadgeProps) {
  const { averageRating, totalCount } = useReviews(productId)

  if (totalCount === 0) return null

  return (
    <div
      className={`flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-sm ${className}`}
      aria-label={`${averageRating.toFixed(1)} out of 5 — ${totalCount} review${totalCount !== 1 ? 's' : ''}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#B8973A" aria-hidden="true">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
      <span className="font-sans text-[11px] font-semibold text-white">
        {averageRating.toFixed(1)}
      </span>
      <span className="font-sans text-[10px] text-white/70">({totalCount})</span>
    </div>
  )
}
