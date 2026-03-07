import { CheckoutProvider } from '@/context/CheckoutContext'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutProvider>
      <div className="min-h-screen bg-brand-cream">
        <header className="border-b border-brand-bark/10 bg-brand-cream">
          <div className="mx-auto flex max-w-4xl items-center px-4 py-4 sm:px-6">
            <a
              href="/"
              className="font-serif text-xl text-brand-black hover:text-brand-gold transition-colors"
            >
              Lumière Parfums
            </a>
          </div>
        </header>
        <CheckoutProgress />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </CheckoutProvider>
  )
}
