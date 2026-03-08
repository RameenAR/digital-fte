import { describe, it, expect } from 'vitest'
import {
  reviewsReducer,
  computeProductReviews,
  validateReviewInput,
} from '@/types/reviews'
import type { Review, ReviewStore } from '@/types/reviews'

const makeReview = (overrides: Partial<Review> = {}): Review => ({
  reviewId: 'rev-001',
  productId: 'prod-001',
  reviewerName: 'Sarah K.',
  rating: 5,
  body: 'Absolutely stunning fragrance!',
  createdAt: '2026-03-08T10:00:00.000Z',
  ...overrides,
})

// ─── reviewsReducer ───────────────────────────────────────────────────────────

describe('reviewsReducer', () => {
  it('ADD_REVIEW adds review to empty store for new product', () => {
    const review = makeReview()
    const result = reviewsReducer({}, { type: 'ADD_REVIEW', payload: review })
    expect(result['prod-001']).toHaveLength(1)
    expect(result['prod-001'][0].reviewId).toBe('rev-001')
  })

  it('ADD_REVIEW prepends review for existing product', () => {
    const first = makeReview({ reviewId: 'rev-001', createdAt: '2026-03-07T10:00:00.000Z' })
    const second = makeReview({ reviewId: 'rev-002', createdAt: '2026-03-08T10:00:00.000Z' })
    const store: ReviewStore = { 'prod-001': [first] }
    const result = reviewsReducer(store, { type: 'ADD_REVIEW', payload: second })
    expect(result['prod-001']).toHaveLength(2)
    expect(result['prod-001'][0].reviewId).toBe('rev-002')
  })

  it('ADD_REVIEW does not affect other products', () => {
    const existing = makeReview({ productId: 'prod-002', reviewId: 'rev-existing' })
    const store: ReviewStore = { 'prod-002': [existing] }
    const newReview = makeReview({ productId: 'prod-001', reviewId: 'rev-new' })
    const result = reviewsReducer(store, { type: 'ADD_REVIEW', payload: newReview })
    expect(result['prod-002']).toHaveLength(1)
    expect(result['prod-001']).toHaveLength(1)
  })

  it('CLEAR_PRODUCT removes only the specified product', () => {
    const store: ReviewStore = {
      'prod-001': [makeReview()],
      'prod-002': [makeReview({ productId: 'prod-002', reviewId: 'rev-002' })],
    }
    const result = reviewsReducer(store, { type: 'CLEAR_PRODUCT', payload: { productId: 'prod-001' } })
    expect(result['prod-001']).toBeUndefined()
    expect(result['prod-002']).toHaveLength(1)
  })

  it('CLEAR_ALL empties the entire store', () => {
    const store: ReviewStore = {
      'prod-001': [makeReview()],
      'prod-002': [makeReview({ productId: 'prod-002', reviewId: 'rev-002' })],
    }
    const result = reviewsReducer(store, { type: 'CLEAR_ALL' })
    expect(Object.keys(result)).toHaveLength(0)
  })
})

// ─── computeProductReviews ────────────────────────────────────────────────────

describe('computeProductReviews', () => {
  it('returns empty result for empty store', () => {
    const { reviews, averageRating, totalCount } = computeProductReviews({}, 'prod-001')
    expect(reviews).toHaveLength(0)
    expect(averageRating).toBe(0)
    expect(totalCount).toBe(0)
  })

  it('returns correct average for single review', () => {
    const store: ReviewStore = { 'prod-001': [makeReview({ rating: 4 })] }
    const { averageRating, totalCount } = computeProductReviews(store, 'prod-001')
    expect(averageRating).toBe(4)
    expect(totalCount).toBe(1)
  })

  it('computes average rating to 1 decimal place', () => {
    const store: ReviewStore = {
      'prod-001': [
        makeReview({ reviewId: 'r1', rating: 4 }),
        makeReview({ reviewId: 'r2', rating: 3 }),
      ],
    }
    const { averageRating } = computeProductReviews(store, 'prod-001')
    expect(averageRating).toBe(3.5)
  })

  it('sorts reviews newest first', () => {
    const older = makeReview({ reviewId: 'r1', createdAt: '2026-03-07T10:00:00.000Z' })
    const newer = makeReview({ reviewId: 'r2', createdAt: '2026-03-08T10:00:00.000Z' })
    const store: ReviewStore = { 'prod-001': [older, newer] }
    const { reviews } = computeProductReviews(store, 'prod-001')
    expect(reviews[0].reviewId).toBe('r2')
    expect(reviews[1].reviewId).toBe('r1')
  })
})

// ─── validateReviewInput ──────────────────────────────────────────────────────

describe('validateReviewInput', () => {
  it('returns invalid with all errors when all fields empty', () => {
    const result = validateReviewInput({ productId: 'prod-001', reviewerName: '', rating: 0, body: '' })
    expect(result.valid).toBe(false)
    expect(result.errors.reviewerName).toBeDefined()
    expect(result.errors.rating).toBeDefined()
    expect(result.errors.body).toBeDefined()
  })

  it('returns error when name exceeds 50 characters', () => {
    const result = validateReviewInput({
      productId: 'prod-001',
      reviewerName: 'A'.repeat(51),
      rating: 4,
      body: 'Great!',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.reviewerName).toBeDefined()
  })

  it('returns error when body exceeds 500 characters', () => {
    const result = validateReviewInput({
      productId: 'prod-001',
      reviewerName: 'Sarah',
      rating: 4,
      body: 'A'.repeat(501),
    })
    expect(result.valid).toBe(false)
    expect(result.errors.body).toBeDefined()
  })

  it('returns error when rating is out of range', () => {
    const result = validateReviewInput({ productId: 'prod-001', reviewerName: 'Sarah', rating: 6, body: 'Great!' })
    expect(result.valid).toBe(false)
    expect(result.errors.rating).toBeDefined()
  })

  it('returns valid for correct input', () => {
    const result = validateReviewInput({
      productId: 'prod-001',
      reviewerName: 'Sarah K.',
      rating: 5,
      body: 'Absolutely stunning!',
    })
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })
})
