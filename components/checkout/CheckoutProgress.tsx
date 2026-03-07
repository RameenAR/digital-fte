'use client'

import { usePathname } from 'next/navigation'

const STEPS = [
  { key: 'cart', label: 'Cart', path: '/checkout/cart' },
  { key: 'info', label: 'Info', path: '/checkout/info' },
  { key: 'review', label: 'Review', path: '/checkout/review' },
  { key: 'confirmation', label: 'Confirmation', path: '/checkout/confirmation' },
]

export default function CheckoutProgress() {
  const pathname = usePathname()
  const activeIndex = STEPS.findIndex((s) => pathname.startsWith(s.path))

  return (
    <nav aria-label="Checkout progress" className="border-b border-brand-bark/10 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-0 px-4 py-4 sm:px-6">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive = index === activeIndex

          return (
            <div key={step.key} className="flex items-center">
              {/* Step pill */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-semibold transition-colors
                    ${isActive ? 'bg-brand-gold text-white' : ''}
                    ${isCompleted ? 'border border-brand-gold text-brand-gold' : ''}
                    ${!isActive && !isCompleted ? 'border border-brand-bark/20 text-brand-bark/30' : ''}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span
                  className={`hidden font-sans text-[10px] uppercase tracking-widest sm:block
                    ${isActive ? 'text-brand-gold' : ''}
                    ${isCompleted ? 'text-brand-gold' : ''}
                    ${!isActive && !isCompleted ? 'text-brand-bark/30' : ''}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px w-8 sm:w-16 transition-colors
                    ${index < activeIndex ? 'bg-brand-gold' : 'bg-brand-bark/20'}
                  `}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
