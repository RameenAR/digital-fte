# Quickstart: Perfume E-Commerce Homepage

**Feature**: 001-homepage | **Date**: 2026-03-05
**Purpose**: Get the homepage running locally and validate each user story manually.

---

## Prerequisites

- Node.js 20 LTS installed (`node -v`)
- PostgreSQL running locally or a connection string from Vercel Postgres / Supabase
- Git on `001-homepage` branch

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment

Create `.env.local` at the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/perfume_ecommerce"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Never commit `.env.local` to git.** It is gitignored.

---

## 3. Set Up Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed featured products and quiz data
npx prisma db seed
```

Verify:
```bash
npx prisma studio
# Opens at http://localhost:5555 — check NewsletterSubscriber and FeaturedProduct tables
```

---

## 4. Start Development Server

```bash
npm run dev
# App runs at http://localhost:3000
```

---

## 5. Manual Validation by User Story

### US1 — Hero Section (MVP)

1. Open `http://localhost:3000`
2. ✅ Full-screen hero visible immediately (no scroll needed)
3. ✅ Brand tagline displayed in large serif font
4. ✅ "Explore the Collection" button visible, links to `/products`
5. ✅ Resize browser to 375px width — hero still fills viewport, button tappable
6. ✅ Open DevTools → Network → throttle to "Slow 3G" → refresh → fallback image shows

---

### US2 — Featured Collections

1. Scroll below the hero
2. ✅ Grid of 4–8 product cards visible
3. ✅ Each card shows: product image, name (e.g. "Midnight Rose"), price (e.g. "Rs 4,500")
4. ✅ Hover a card (desktop) → scent notes overlay appears (e.g. "Rose · Oud · Amber")
5. ✅ Click a product card → navigates to `/products/[slug]`
6. ✅ Empty catalogue state: comment out seed data → verify "Coming Soon" placeholders render

---

### US3 — Scent Discovery Quiz

1. Scroll to the quiz section, click "Find Your Scent"
2. ✅ Question 1 of 4 appears with 4 answer options and a progress indicator
3. ✅ Select an option → advances to Question 2
4. ✅ Complete all 4 questions → results screen appears with 2–3 product cards
5. ✅ Results cards link to product detail pages
6. ✅ Close quiz → re-open → quiz resets to Question 1 (no stale state)
7. ✅ Resize to 375px → each question fits on screen without scrolling

Test fallback:
- Temporarily edit `quiz-engine.ts` to return empty array
- Complete quiz → verify "Our top picks for you" label appears with 3 products

---

### US4 — Brand Story

1. Scroll to brand story section
2. ✅ Headline visible (e.g., "Crafted in the Heart of Grasse")
3. ✅ Body copy ≥ 100 words
4. ✅ Supporting image displayed
5. ✅ "Learn More" link navigates to `/about` (or shows 404 if page not yet built)
6. ✅ Resize to 375px → text readable, no horizontal overflow

---

### Newsletter Signup

1. Scroll to newsletter section
2. ✅ Email input + "Subscribe" button visible
3. ✅ Enter valid email → click Subscribe → success message appears (no page reload)
4. ✅ Submit same email again → error "This email is already subscribed."
5. ✅ Submit invalid email (e.g., "notanemail") → validation error appears

---

## 6. Run Automated Tests

```bash
# Unit tests (quiz engine + newsletter validation)
npm run test

# E2E tests (requires dev server running)
npx playwright test tests/e2e/homepage.spec.ts

# Lighthouse audit
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
# Open lighthouse-report.html and verify: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90
```

---

## 7. API Manual Tests

### Newsletter — success
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","consentGiven":true}'
# Expected: {"success":true,"message":"You're subscribed!..."}
```

### Newsletter — duplicate
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","consentGiven":true}'
# Expected: 409 {"error":"ALREADY_SUBSCRIBED",...}
```

### Quiz results — with matches
```bash
curl -X POST http://localhost:3000/api/quiz/results \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId":"q1","selectedTags":["fresh","citrus"]},
      {"questionId":"q2","selectedTags":["floral"]},
      {"questionId":"q3","selectedTags":["woody"]},
      {"questionId":"q4","selectedTags":["musky"]}
    ]
  }'
# Expected: 200 {"products":[...],"fallback":false}
```

---

## 8. Definition of Done Checklist

Before merging `001-homepage` → `main`:

- [ ] All US1–US4 manual validation steps pass
- [ ] `npm run test` — all unit tests green
- [ ] `npx playwright test` — all E2E tests pass
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90
- [ ] No ESLint or TypeScript errors (`npm run lint && npm run type-check`)
- [ ] Cross-browser smoke test: Chrome, Firefox, Safari, Edge
- [ ] PHR created and committed to `history/prompts/001-homepage/`
