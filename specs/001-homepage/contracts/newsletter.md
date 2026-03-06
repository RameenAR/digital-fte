# API Contract: Newsletter Signup

**Endpoint**: `POST /api/newsletter`
**Feature**: 001-homepage | **Date**: 2026-03-05

---

## Request

**Method**: POST
**Content-Type**: `application/json`

### Body

```json
{
  "email": "user@example.com",
  "consentGiven": true
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| email | string | yes | Valid email format (RFC 5322); max 254 chars |
| consentGiven | boolean | yes | Must be `true` |

---

## Responses

### 200 OK — Successfully subscribed

```json
{
  "success": true,
  "message": "You're subscribed! Check your inbox for updates."
}
```

### 400 Bad Request — Invalid input

```json
{
  "success": false,
  "error": "INVALID_EMAIL",
  "message": "Please enter a valid email address."
}
```

Possible `error` codes:
- `INVALID_EMAIL` — email format invalid or missing
- `CONSENT_REQUIRED` — `consentGiven` is false or missing

### 409 Conflict — Already subscribed

```json
{
  "success": false,
  "error": "ALREADY_SUBSCRIBED",
  "message": "This email is already subscribed."
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "Something went wrong. Please try again."
}
```

---

## Behaviour

1. Lowercase and trim the email before validation and storage.
2. Validate email format server-side (never trust client-only validation).
3. Check for existing subscriber; return 409 if duplicate found.
4. Insert `NewsletterSubscriber` record via Prisma.
5. Return 200 on success; never expose DB error details in the response body.

## Security

- Email is sanitized before DB insertion (Prisma parameterized query).
- No authentication required (public endpoint).
- Rate limiting: 5 requests per IP per minute (to be configured at Vercel/middleware level).
- `consentGiven` stored as explicit audit trail for GDPR/PDPA compliance.

## Idempotency

Not idempotent — duplicate email returns 409, not 200. Client should handle 409
gracefully with a "you're already subscribed" message.
