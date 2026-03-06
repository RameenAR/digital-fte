import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRecommendations } from '@/lib/quiz-engine'
import { getFeaturedProducts } from '@/lib/featured-products'
import type { QuizAnswer } from '@/types/homepage'

const VALID_TAGS = new Set([
  'fresh', 'citrus', 'floral', 'woody', 'oriental',
  'gourmand', 'green', 'musky',
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'answers must be an array.' },
        { status: 400 }
      )
    }

    const answers: QuizAnswer[] = body.answers.map((a: QuizAnswer) => ({
      questionId: a.questionId,
      // Filter out unknown tags silently
      selectedTags: (a.selectedTags || []).filter((tag: string) => VALID_TAGS.has(tag)),
    }))

    if (answers.length < 1) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'answers must contain at least 1 item.' },
        { status: 400 }
      )
    }

    const products = await getFeaturedProducts()
    const result = getRecommendations(answers, products)

    return NextResponse.json(result, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
