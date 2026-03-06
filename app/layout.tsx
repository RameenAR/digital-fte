import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

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
  title: 'Essence — Luxury Perfumes',
  description:
    'Discover handcrafted luxury fragrances inspired by the finest ingredients from around the world. Find your signature scent with our personalised discovery quiz.',
  keywords: ['luxury perfume', 'fragrance', 'eau de parfum', 'handcrafted', 'artisan perfume'],
  openGraph: {
    title: 'Essence — Luxury Perfumes',
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
        <main>{children}</main>
      </body>
    </html>
  )
}
