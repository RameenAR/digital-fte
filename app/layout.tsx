import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartBadge from '@/components/layout/CartBadge'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lumière Parfums — Luxury Perfumes',
  description:
    'Discover handcrafted luxury fragrances inspired by the finest ingredients from around the world. Find your signature scent with our personalised discovery quiz.',
  keywords: ['luxury perfume', 'fragrance', 'eau de parfum', 'handcrafted', 'artisan perfume'],
  openGraph: {
    title: 'Lumière Parfums — Luxury Perfumes',
    description:
      'Discover handcrafted luxury fragrances inspired by the finest ingredients from around the world.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <header className="sticky top-0 z-50 border-b border-brand-bark/10 bg-brand-cream/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <a href="/" className="font-serif text-xl text-brand-black hover:text-brand-gold transition-colors">
                Lumière Parfums
              </a>
              <nav className="flex items-center gap-6">
                <a
                  href="/products"
                  className="font-sans text-sm text-brand-bark hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  Collection
                </a>
                <CartBadge />
              </nav>
            </div>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
