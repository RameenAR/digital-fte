// ─── Shared TypeScript types for the Homepage feature ───────────────────────

export interface ScentNotes {
  top: string[]
  heart: string[]
  base: string[]
}

export interface FeaturedProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  slug: string
  scentNotes: ScentNotes
  scentTags: string[]
  displayOrder: number
  isActive: boolean
}

export interface QuizOption {
  id: string
  label: string
  tags: string[]
}

export interface QuizQuestion {
  id: string
  questionText: string
  options: QuizOption[]
  order: number
}

export interface QuizAnswer {
  questionId: string
  selectedTags: string[]
}

export interface QuizResult {
  products: FeaturedProduct[]
  fallback: boolean
}

export interface NewsletterSubscriber {
  id: string
  email: string
  createdAt: Date
  consentGiven: boolean
}

export interface NewsletterSignupPayload {
  email: string
  consentGiven: boolean
}

export interface NewsletterSignupResponse {
  success: boolean
  message?: string
  error?: string
}
