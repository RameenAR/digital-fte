import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/products'
import ProductListingClient from '@/components/products/ProductListingClient'

export const metadata: Metadata = {
  title: 'All Fragrances | Lumière Parfums',
  description:
    'Browse our full collection of luxury handcrafted perfumes. Filter by scent family, price, search by name, and discover your signature fragrance.',
  openGraph: {
    title: 'All Fragrances | Lumière Parfums',
    description:
      'Explore our complete collection of handcrafted luxury perfumes — floral, woody, oriental, fresh, and more.',
    type: 'website',
  },
}

export default async function ProductsPage() {
  const allProducts = await getAllProducts()

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-serif text-4xl text-brand-black">Our Collection</h1>
          <p className="mt-2 font-sans text-sm text-brand-bark/70">
            Handcrafted luxury fragrances
          </p>
        </header>

        <ProductListingClient allProducts={allProducts} />
      </div>
    </main>
  )
}
