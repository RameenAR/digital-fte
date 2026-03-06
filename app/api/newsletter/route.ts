import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { subscribeEmail } from '@/lib/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, consentGiven } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'INVALID_EMAIL', message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: 'CONSENT_REQUIRED', message: 'Consent is required to subscribe.' },
        { status: 400 }
      )
    }

    const result = await subscribeEmail(email, consentGiven)

    if (!result.success) {
      if (result.error === 'ALREADY_SUBSCRIBED') {
        return NextResponse.json(
          { success: false, error: 'ALREADY_SUBSCRIBED', message: 'This email is already subscribed.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { success: false, error: result.error, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, message: "You're subscribed! Watch your inbox for updates." },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
