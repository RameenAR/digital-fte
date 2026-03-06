'use client'

import { useState, useEffect, useCallback } from 'react'
import type { QuizAnswer, QuizResult, QuizOption } from '@/types/homepage'
import { QUIZ_QUESTIONS } from '@/data/quiz-questions'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'

type QuizState = 'idle' | 'active' | 'loading' | 'results'

interface ScentDiscoveryQuizProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScentDiscoveryQuiz({ isOpen, onClose }: ScentDiscoveryQuizProps) {
  const [state, setState] = useState<QuizState>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setState('idle')
    setCurrentStep(0)
    setAnswers([])
    setResult(null)
    setError(null)
  }, [])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  // Start quiz when modal opens
  useEffect(() => {
    if (isOpen) setState('active')
  }, [isOpen])

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleAnswer = useCallback(
    async (option: QuizOption) => {
      const newAnswers: QuizAnswer[] = [
        ...answers,
        { questionId: QUIZ_QUESTIONS[currentStep].id, selectedTags: option.tags },
      ]
      setAnswers(newAnswers)

      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep((s) => s + 1)
      } else {
        // All questions answered — fetch recommendations
        setState('loading')
        setError(null)
        try {
          const res = await fetch('/api/quiz/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: newAnswers }),
          })
          const data: QuizResult = await res.json()
          setResult(data)
          setState('results')
        } catch {
          setError('Something went wrong. Please try again.')
          setState('active')
          setCurrentStep(QUIZ_QUESTIONS.length - 1)
        }
      }
    },
    [answers, currentStep]
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Scent Discovery Quiz"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-bark/60
            hover:text-brand-black transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          aria-label="Close quiz"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Loading state */}
        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-sans text-sm text-brand-bark/60">Finding your perfect scent…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <p className="mb-4 text-sm text-red-600 font-sans" role="alert">
            {error}
          </p>
        )}

        {/* Active quiz */}
        {state === 'active' && (
          <QuizQuestion
            question={QUIZ_QUESTIONS[currentStep]}
            totalQuestions={QUIZ_QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}

        {/* Results */}
        {state === 'results' && result && (
          <QuizResults result={result} onRetake={reset} />
        )}
      </div>
    </div>
  )
}
