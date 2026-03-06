'use client'

import { useState } from 'react'
import type { NewsletterSignupResponse } from '@/types/homepage'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consentGiven: true }),
      })
      const data: NewsletterSignupResponse = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage(data.message ?? 'Subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section className="py-20 px-6 bg-brand-black" aria-labelledby="newsletter-heading">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-gold mb-4">
          Stay in the Know
        </p>
        <h2
          id="newsletter-heading"
          className="font-serif text-4xl text-brand-cream mb-4"
        >
          First to Experience
        </h2>
        <p className="font-sans text-brand-cream/70 text-base mb-10">
          New launches, exclusive offers, and fragrance stories — delivered to your inbox.
        </p>

        {status === 'success' ? (
          <p className="font-sans text-brand-gold text-base" role="status">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 min-h-[44px]
                  bg-white/10 border border-white/20 text-brand-cream
                  placeholder:text-brand-cream/40 font-sans text-sm
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold
                  disabled:opacity-50"
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="px-8 py-3 min-h-[44px]
                  bg-brand-gold text-brand-black
                  font-sans font-semibold text-sm tracking-widest uppercase
                  hover:bg-brand-cream transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>

            {status === 'error' && (
              <p id="newsletter-error" className="mt-3 text-sm text-red-400 font-sans" role="alert">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
