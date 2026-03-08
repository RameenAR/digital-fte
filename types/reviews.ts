// ─── Reviews types and pure reducer for 007-product-reviews ─────────────────

export interface Review {
  reviewId: string
  productId: string
  reviewerName: string // 1–50 chars
  rating: number       // integer 1–5
  body: string         // 1–500 chars
  createdAt: string    // ISO string — JSON-serialisable
}

export type ReviewStore = {
  [productId: string]: Review[]
}

export type ReviewAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'CLEAR_PRODUCT'; payload: { productId: string } }
  | { type: 'CLEAR_ALL' }

export interface ReviewInput {
  productId: string
  reviewerName: string
  rating: number
  body: string
}

export interface ValidationResult {
  valid: boolean
  errors: {
    reviewerName?: string
    rating?: string
    body?: string
  }
}

export const REVIEWS_STORAGE_KEY = 'lumiere_reviews'

// ─── Pure reducer — exported for unit testing ─────────────────────────────────

export function reviewsReducer(store: ReviewStore, action: ReviewAction): ReviewStore {
  switch (action.type) {
    case 'ADD_REVIEW': {
      const { productId } = action.payload
      const existing = store[productId] ?? []
      return {
        ...store,
        [productId]: [action.payload, ...existing],
      }
    }
    case 'CLEAR_PRODUCT': {
      const { [action.payload.productId]: _, ...rest } = store
      return rest
    }
    case 'CLEAR_ALL':
      return {}
    default:
      return store
  }
}

// ─── Derived data ─────────────────────────────────────────────────────────────

export function computeProductReviews(
  store: ReviewStore,
  productId: string
): { reviews: Review[]; averageRating: number; totalCount: number } {
  const raw = store[productId] ?? []
  // Sort newest first (already prepended in reducer, but sort for safety)
  const reviews = [...raw].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const totalCount = reviews.length
  const averageRating =
    totalCount === 0
      ? 0
      : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10
  return { reviews, averageRating, totalCount }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateReviewInput(input: ReviewInput): ValidationResult {
  const errors: ValidationResult['errors'] = {}

  const name = input.reviewerName?.trim() ?? ''
  if (!name) {
    errors.reviewerName = 'Name is required (max 50 characters)'
  } else if (name.length > 50) {
    errors.reviewerName = 'Name is required (max 50 characters)'
  }

  if (!input.rating || !Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = 'Please select a rating (1–5 stars)'
  }

  const body = input.body?.trim() ?? ''
  if (!body) {
    errors.body = 'Review text is required (max 500 chars)'
  } else if (body.length > 500) {
    errors.body = 'Review text is required (max 500 chars)'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
