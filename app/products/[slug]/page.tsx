import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllProducts, getProductBySlug } from '@/lib/products'
import { getRelatedProducts } from '@/lib/related-products'
import Breadcrumb from '@/components/product-detail/Breadcrumb'
import ProductDetailHero from '@/components/product-detail/ProductDetailHero'
import ScentNotesPyramid from '@/components/product-detail/ScentNotesPyramid'
import ProductDescription from '@/components/product-detail/ProductDescription'
import AddToCart from '@/components/product-detail/AddToCart'
import RelatedProducts from '@/components/product-detail/RelatedProducts'
import WishlistToggle from '@/components/wishlist/WishlistToggle'
import ReviewsSection from '@/components/reviews/ReviewsSection'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: `${product.name} | Lumière Parfums`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Lumière Parfums`,
      description: product.description.slice(0, 160),
      images: [{ url: product.imageUrl, alt: product.name }],
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const [product, allProducts] = await Promise.all([
    getProductBySlug(params.slug),
    getAllProducts(),
  ])

  if (!product) notFound()

  const related = getRelatedProducts(product, allProducts)

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb productName={product.name} />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductDetailHero product={product} />

          <div className="flex flex-col gap-8">
            <ScentNotesPyramid scentNotes={product.scentNotes} />
            <ProductDescription description={product.description} />
            <WishlistToggle
              product={{ productId: product.id, slug: product.slug, name: product.name, imageUrl: product.imageUrl, price: product.price }}
            />
            <AddToCart product={product} />
          </div>
        </div>

        <ReviewsSection productId={product.id} />

        <RelatedProducts products={related} />
      </div>
    </main>
  )
}
