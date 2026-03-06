import type { NewsletterSignupPayload } from '@/types/homepage'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254

export function validateEmail(email: string): boolean {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false
  return EMAIL_REGEX.test(email)
}

export function buildSubscriberPayload(
  rawEmail: string,
  consentGiven: boolean
): NewsletterSignupPayload {
  return {
    email: rawEmail.trim().toLowerCase(),
    consentGiven,
  }
}

/**
 * Server-side: subscribe an email address.
 * In v1 this is called from the API route; in v2 this will use a Prisma insert.
 */
export async function subscribeEmail(
  rawEmail: string,
  consentGiven: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!consentGiven) {
    return { success: false, error: 'CONSENT_REQUIRED' }
  }

  const { email } = buildSubscriberPayload(rawEmail, consentGiven)

  if (!validateEmail(email)) {
    return { success: false, error: 'INVALID_EMAIL' }
  }

  // TODO (v2): Replace with Prisma upsert:
  // try {
  //   await prisma.newsletterSubscriber.create({
  //     data: { email, consentGiven },
  //   })
  // } catch (e: unknown) {
  //   if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
  //     return { success: false, error: 'ALREADY_SUBSCRIBED' }
  //   }
  //   throw e
  // }

  // v1: in-memory stub (always succeeds for a fresh email)
  return { success: true }
}
