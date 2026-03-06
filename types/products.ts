// ─── TypeScript types for the Product Listing feature ────────────────────────

import type { FeaturedProduct } from './homepage'

export interface Product extends FeaturedProduct {
  category: string
  createdAt: Date
}

export type SortOption = 'bestselling' | 'price_asc' | 'price_desc' | 'newest'

export interface FilterState {
  families: string[]
  minPrice: number | null
  maxPrice: number | null
  query: string
  sort: SortOption
  page: number
}

export interface PaginatedResult {
  products: Product[]
  total: number
  page: number
  totalPages: number
}
