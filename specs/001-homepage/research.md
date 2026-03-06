# Research: Perfume E-Commerce Homepage

**Feature**: 001-homepage | **Date**: 2026-03-05 | **Phase**: 0

---

## Decision 1: Frontend Framework

**Decision**: Next.js 14 with App Router
**Rationale**: Server Components enable zero-JS hero and brand story sections
(better LCP). Built-in `next/image` handles WebP/AVIF conversion and responsive
`srcset` automatically. Vercel deployment is trivial. App Router's `page.tsx`
pattern maps cleanly to one homepage route.
**Alternatives considered**:
- Remix — strong data loading but smaller ecosystem; Vercel integration less mature
- Vite + React SPA — no SSR; worse SEO and LCP; ruled out for e-commerce
- Astro — excellent for static content but quiz/newsletter need server actions

---

## Decision 2: Styling — Tailwind CSS vs CSS Modules vs Styled Components

**Decision**: Tailwind CSS 3 with custom design tokens in `tailwind.config.ts`
**Rationale**: Utility-first classes enforce the constitution's component-driven
principle — styles stay co-located with markup, making components truly portable.
Design tokens (brand colors, font scales) in one config file satisfy the single
source of truth requirement. PurgeCSS built-in keeps bundle small.
**Alternatives considered**:
- CSS Modules — verbose for responsive design; no shared token enforcement
- Styled Components / Emotion — runtime CSS-in-JS adds JS bundle weight; violates
  performance budget principle
- Vanilla CSS — lacks responsive utilities; inconsistent across team

---

## Decision 3: Quiz Recommendation Algorithm

**Decision**: Tag-intersection scoring (pure function, no ML)
**Rationale**: Each answer option carries 1–3 scent-preference tags (e.g., "woody",
"floral", "fresh"). Each product has a set of scent tags. Score = number of matching
tags between collected answer tags and product tags. Top 2–3 by score are returned.
Ties broken by displayOrder. Zero matches → fallback to top 3 by displayOrder.
This is O(n×m) where n = products (~20 max), m = tags (~5 max) — negligible CPU.
**Alternatives considered**:
- Cosine similarity on tag vectors — overkill for <20 products; same results
- External recommendation API — unnecessary external dependency for v1
- Random selection from matching scent family — less personalised; worse UX

---

## Decision 4: Database ORM

**Decision**: Prisma 5 with PostgreSQL
**Rationale**: Type-safe queries eliminate SQL injection risk (satisfies Secure by
Default principle). Auto-generated TypeScript types align with `types/homepage.ts`.
Migrations are reversible (satisfies constitution's migration rule). Well-established
in the Next.js ecosystem with Vercel Postgres or Supabase as hosting options.
**Alternatives considered**:
- Drizzle ORM — lighter but less mature tooling; smaller community
- Raw `pg` queries — no type safety; violates secure-by-default (parameterisation
  must be manual)
- MongoDB / Mongoose — document store unnecessary for structured relational data

---

## Decision 5: Image Delivery

**Decision**: Next.js built-in `<Image>` component with Vercel Image Optimization
**Rationale**: Automatic WebP/AVIF conversion, responsive `srcset`, lazy loading,
and CLS prevention (required dimensions). Zero extra service cost on Vercel. Hero
image uses `priority` prop for eager loading (LCP). Below-fold images use default
lazy loading.
**Alternatives considered**:
- Cloudinary — more features (transformations, DAM) but adds external dependency
  and cost for v1; revisit for v2 when image management complexity grows
- Manual WebP conversion + `<picture>` — labour-intensive; no automatic resizing

---

## Decision 6: Testing Stack

**Decision**: Vitest (unit) · Testing Library (component) · Playwright (E2E)
**Rationale**:
- Vitest: ESM-native, Jest-compatible API, fast cold start — ideal for pure logic
  functions (`quiz-engine.ts`, `newsletter.ts`)
- Testing Library: Renders components in jsdom; encourages testing user behaviour
  not implementation details
- Playwright: Cross-browser E2E (Chromium, Firefox, WebKit); reliable selectors;
  official Vercel preview URL support
**Alternatives considered**:
- Jest — slower than Vitest for ESM; requires extra Babel config with Next.js 14
- Cypress — heavier install; Playwright has caught up on DX; Playwright preferred
  by Next.js team

---

## Decision 7: Newsletter Email Provider (v1 scope)

**Decision**: Store emails in PostgreSQL only (no third-party provider in v1)
**Rationale**: Keeps v1 dependency-free and deployable immediately. The
`newsletter_subscribers` table is a clean data contract that any provider
(Mailchimp, Klaviyo, Brevo) can consume via a v2 sync job.
**Alternatives considered**:
- Mailchimp API — requires API key management, webhook setup, and doubles the
  complexity of the newsletter route; deferred to v2
- Resend / SendGrid — transactional email; needed for order confirmation but not
  for newsletter capture; out of scope for this feature

---

## Resolved NEEDS CLARIFICATION Items

| Item | Resolution |
|------|-----------|
| Newsletter provider | PostgreSQL-only for v1; third-party in v2 |
| Quiz recommendation logic | Tag-intersection scoring (no ML) |
| Hero video source | Brand team supplies assets; fallback image required by FR-001 |
| Brand story copy | Copywriter supplies; spec defines placement only |
| Featured products source | Prisma seed for v1; CMS for v2 |
