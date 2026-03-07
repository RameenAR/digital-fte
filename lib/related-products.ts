import type { Product } from '@/types/products'

/**
 * Returns up to `limit` products related to `current` by scentTag overlap.
 * - Excludes the current product itself.
 * - Products with 0 overlap are excluded.
 * - Ranked by overlap count DESC, then displayOrder ASC for ties.
 * Pure function — no side effects.
 */
export function getRelatedProducts(
  current: Product,
  all: Product[],
  limit = 3
): Product[] {
  return all
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      product: p,
      score: p.scentTags.filter((tag) => current.scentTags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      b.score !== a.score
        ? b.score - a.score
        : a.product.displayOrder - b.product.displayOrder
    )
    .slice(0, limit)
    .map(({ product }) => product)
}
