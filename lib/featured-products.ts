import type { FeaturedProduct } from '@/types/homepage'
import { FEATURED_PRODUCTS_SEED } from '@/data/featured-products-seed'

/**
 * Returns active featured products sorted by displayOrder (ascending).
 * In production this would query PostgreSQL via Prisma.
 * For v1, it reads from the seed data to avoid requiring a running DB for dev.
 */
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  // TODO (v2): Replace with Prisma query:
  // return prisma.featuredProduct.findMany({
  //   where: { isActive: true },
  //   orderBy: { displayOrder: 'asc' },
  // })
  return FEATURED_PRODUCTS_SEED.filter((p) => p.isActive).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
}
