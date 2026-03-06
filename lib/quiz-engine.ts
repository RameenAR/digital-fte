import type { QuizAnswer, FeaturedProduct, QuizResult } from '@/types/homepage'

/**
 * Tag-intersection scoring recommendation engine.
 * Pure function — no side effects, fully unit-testable.
 *
 * Algorithm:
 *   1. Collect all selectedTags from all answers into one flat array
 *   2. For each active product, score = intersection size of collectedTags ∩ product.scentTags
 *   3. Sort by score DESC, then displayOrder ASC (tie-break)
 *   4. Return top 2–3 products with score > 0
 *   5. If no product scores > 0: return top 3 by displayOrder, fallback = true
 */
export function getRecommendations(
  answers: QuizAnswer[],
  products: FeaturedProduct[]
): QuizResult {
  const activeProducts = products.filter((p) => p.isActive)

  if (activeProducts.length === 0) {
    return { products: [], fallback: false }
  }

  // Collect all selected tags
  const collectedTags = answers.flatMap((a) => a.selectedTags)

  // Score each product
  const scored = activeProducts.map((product) => {
    const score = product.scentTags.filter((tag) => collectedTags.includes(tag)).length
    return { product, score }
  })

  // Sort by score DESC, then displayOrder ASC
  scored.sort((a, b) => b.score - a.score || a.product.displayOrder - b.product.displayOrder)

  // Take top scorers (score > 0)
  const topMatches = scored.filter((s) => s.score > 0).slice(0, 3)

  if (topMatches.length >= 2) {
    return {
      products: topMatches.map((s) => s.product),
      fallback: false,
    }
  }

  // Fallback: return top 3 by displayOrder
  const fallbackProducts = [...activeProducts]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 3)

  return { products: fallbackProducts, fallback: true }
}
