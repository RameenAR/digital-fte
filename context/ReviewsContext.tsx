'use client'

import { createContext, useEffect, useReducer, type ReactNode } from 'react'
import { reviewsReducer, REVIEWS_STORAGE_KEY } from '@/types/reviews'
import type { ReviewStore, ReviewAction } from '@/types/reviews'

interface ReviewsContextValue {
  store: ReviewStore
  dispatch: React.Dispatch<ReviewAction>
}

export const ReviewsContext = createContext<ReviewsContextValue>({
  store: {},
  dispatch: () => {},
})

function readLocalStorage(): ReviewStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ReviewStore
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(reviewsReducer, {}, readLocalStorage)

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(store))
    } catch {
      // private browsing — silently ignore
    }
  }, [store])

  return (
    <ReviewsContext.Provider value={{ store, dispatch }}>
      {children}
    </ReviewsContext.Provider>
  )
}
