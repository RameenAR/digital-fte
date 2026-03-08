'use client'

import { useContext } from 'react'
import { ReviewsContext } from '@/context/ReviewsContext'
import { computeProductReviews, validateReviewInput } from '@/types/reviews'
import type { ReviewInput } from '@/types/reviews'

export function useReviews(productId?: string) {
  const { store, dispatch } = useContext(ReviewsContext)

  const { reviews, averageRating, totalCount } = productId
    ? computeProductReviews(store, productId)
    : { reviews: [], averageRating: 0, totalCount: 0 }

  function getAverage(pid: string): number {
    return computeProductReviews(store, pid).averageRating
  }

  function getCount(pid: string): number {
    return computeProductReviews(store, pid).totalCount
  }

  function submitReview(input: ReviewInput): { success: boolean; errors?: Record<string, string> } {
    const validation = validateReviewInput(input)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }
    dispatch({
      type: 'ADD_REVIEW',
      payload: {
        reviewId: crypto.randomUUID(),
        productId: input.productId,
        reviewerName: input.reviewerName.trim(),
        rating: input.rating,
        body: input.body.trim(),
        createdAt: new Date().toISOString(),
      },
    })
    return { success: true }
  }

  return { reviews, averageRating, totalCount, submitReview, getAverage, getCount }
}
