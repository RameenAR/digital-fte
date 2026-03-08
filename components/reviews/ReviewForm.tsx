'use client'

import { useState } from 'react'
import { useReviews } from '@/hooks/useReviews'
import StarRating from '@/components/reviews/StarRating'

interface ReviewFormProps {
  productId: string
}

const EMPTY = { reviewerName: '', rating: 0, body: '' }

export default function ReviewForm({ productId }: ReviewFormProps) {
  const { submitReview } = useReviews(productId)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = submitReview({ productId, ...form })
    if (!result.success) {
      setErrors(result.errors ?? {})
      return
    }
    setErrors({})
    setForm(EMPTY)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 bg-brand-cream/60 border border-brand-bark/10 p-6">
      <h3 className="font-serif text-lg text-brand-black">Write a Review</h3>

      {submitted && (
        <p className="font-sans text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">
          Thank you for your review!
        </p>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reviewerName" className="font-sans text-xs text-brand-bark uppercase tracking-wide">
          Your Name
        </label>
        <input
          id="reviewerName"
          type="text"
          value={form.reviewerName}
          onChange={(e) => setForm((f) => ({ ...f, reviewerName: e.target.value }))}
          maxLength={50}
          placeholder="e.g. Sarah K."
          className="border border-brand-bark/20 bg-white px-3 py-2 font-sans text-sm text-brand-black placeholder:text-brand-bark/30 focus:outline-none focus:border-brand-gold"
          aria-describedby={errors.reviewerName ? 'name-error' : undefined}
        />
        {errors.reviewerName && (
          <p id="name-error" className="font-sans text-xs text-red-600">{errors.reviewerName}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1">
        <span className="font-sans text-xs text-brand-bark uppercase tracking-wide">Rating</span>
        <StarRating value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
        {errors.rating && (
          <p className="font-sans text-xs text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <label htmlFor="reviewBody" className="font-sans text-xs text-brand-bark uppercase tracking-wide">
          Review
        </label>
        <textarea
          id="reviewBody"
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          maxLength={500}
          rows={4}
          placeholder="Share your experience with this fragrance..."
          className="border border-brand-bark/20 bg-white px-3 py-2 font-sans text-sm text-brand-black placeholder:text-brand-bark/30 focus:outline-none focus:border-brand-gold resize-none"
          aria-describedby={errors.body ? 'body-error' : undefined}
        />
        <div className="flex justify-between items-center">
          {errors.body ? (
            <p id="body-error" className="font-sans text-xs text-red-600">{errors.body}</p>
          ) : <span />}
          <span className="font-sans text-xs text-brand-bark/40">{form.body.length}/500</span>
        </div>
      </div>

      <button
        type="submit"
        className="self-start font-sans text-sm bg-brand-gold text-white px-6 py-2 hover:bg-brand-bark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Submit Review
      </button>
    </form>
  )
}
