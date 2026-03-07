// ─── TypeScript types for the Product Listing feature ────────────────────────

import type { FeaturedProduct } from './homepage'

// ─── New: Concentration & Gender ─────────────────────────────────────────────

export type Concentration = 'edp' | 'edt' | 'parfum'
export type Gender = 'men' | 'women' | 'unisex'

export const CONCENTRATION_LABELS: Record<Concentration, string> = {
  edp: 'Eau de Parfum',
  edt: 'Eau de Toilette',
  parfum: 'Parfum',
}

export const GENDER_LABELS: Record<Gender, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product extends FeaturedProduct {
  category: string
  concentration: Concentration
  gender: Gender
  createdAt: Date
  description: string
}

export type SortOption = 'bestselling' | 'price_asc' | 'price_desc' | 'newest'

// ─── FilterState ─────────────────────────────────────────────────────────────

export interface FilterState {
  families: string[]
  concentrations: string[]
  genders: string[]
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
