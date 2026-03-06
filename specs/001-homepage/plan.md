# Implementation Plan: Perfume E-Commerce Homepage

**Branch**: `001-homepage` | **Date**: 2026-03-05 | **Spec**: specs/001-homepage/spec.md
**Input**: Feature specification from `/specs/001-homepage/spec.md`

## Summary

Build the luxury perfume e-commerce homepage using Next.js 14 (App Router) with
TypeScript and Tailwind CSS. The homepage is composed of four independently
deliverable sections: Hero (P1 — MVP), Featured Collections (P2), Scent Discovery
Quiz (P3), and Brand Story (P4), plus a Newsletter Signup cross-cutting component.
Data is served server-side via Prisma + PostgreSQL. Quiz logic is a pure tag-matching
function exposed via a lightweight API route. All UI is component-driven with no
business logic in components.

## Technical Context

**Language/Version**: TypeScript 5.x · Node.js 20 LTS
**Primary Dependencies**: Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · Prisma 5
**Storage**: PostgreSQL via Prisma ORM (`newsletter_subscribers` table; featured products seeded via Prisma)
**Testing**: Vitest (unit logic) · Playwright (E2E flows) · Testing Library (component rendering)
**Target Platform**: Web — Vercel (SSR + built-in Image Optimization)
**Project Type**: Web application — single Next.js fullstack project
**Performance Goals**: LCP ≤ 2s · JS initial bundle ≤ 200KB gzipped · Lighthouse Perf ≥ 85
**Constraints**: WCAG 2.1 AA · Mobile-first 320px–1920px · Secrets via `.env.local` only
**Scale/Scope**: Single page (homepage) · 2 API routes · 8 React components · ~4 entities

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. User-First | Mobile-first Tailwind; hero fallback image; 44px touch targets | ✅ PASS |
| II. Component-Driven | Each section is an isolated component; design tokens in `tailwind.config.ts` | ✅ PASS |
| III. Test-First | Unit tests for quiz engine + newsletter before implementation; E2E for full flow | ✅ PASS |
| IV. Secure by Default | Email validated server-side; API keys in `.env.local`; no raw secrets in source | ✅ PASS |
| V. Performance Budget | `next/image` (WebP/AVIF); hero `priority` prop; below-fold lazy loading | ✅ PASS |
| VI. Simplicity | `useState` for quiz (no external state); tag-matching array intersection (no ML) | ✅ PASS |

**All gates PASS — Phase 0 research may proceed.**

## Project Structure

### Documentation (this feature)

```text
specs/001-homepage/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── newsletter.md
│   └── quiz-results.md
├── tasks.md             # Phase 2 output (/sp.tasks)
└── checklists/
    └── requirements.md
```

### Source Code

```text
# Web application — Next.js App Router (single project)

app/
├── page.tsx                          # Homepage — assembles all section components
├── layout.tsx                        # Root layout: fonts, nav, footer, meta tags
└── api/
    ├── newsletter/
    │   └── route.ts                  # POST /api/newsletter
    └── quiz/
        └── results/
            └── route.ts              # POST /api/quiz/results

components/
└── homepage/
    ├── HeroSection.tsx               # US1: full-viewport hero + CTA
    ├── FeaturedCollections.tsx       # US2: product grid section wrapper
    ├── ProductCard.tsx               # US2: individual product card
    ├── ScentDiscoveryQuiz.tsx        # US3: quiz state orchestrator
    ├── QuizQuestion.tsx              # US3: single question step
    ├── QuizResults.tsx               # US3: results / fallback display
    ├── BrandStory.tsx                # US4: brand narrative section
    └── NewsletterSignup.tsx          # Cross-cutting: email capture form

lib/
├── quiz-engine.ts                    # Pure fn: answers[] → ranked product ids[]
├── featured-products.ts              # Server fn: returns FeaturedProduct[]
└── newsletter.ts                     # Server action: validate + persist email

types/
└── homepage.ts                       # Shared TypeScript interfaces

data/
├── quiz-questions.ts                 # Static quiz Q&A data with scent tags
└── featured-products-seed.ts         # Seed data (6 sample products)

prisma/
└── schema.prisma                     # NewsletterSubscriber model

public/
├── hero-fallback.jpg                 # Static hero image fallback
└── brand-story.jpg                   # Brand story visual

tests/
├── unit/
│   ├── quiz-engine.test.ts           # RED: tag-matching logic
│   └── newsletter.test.ts            # RED: email validation
└── e2e/
    └── homepage.spec.ts              # Full homepage scroll + interactions
```

**Structure Decision**: Single Next.js fullstack project. No separate backend service
needed for v1 — two lightweight API routes handle all server-side logic. Prisma
provides type-safe DB access without over-engineering a service layer.

## Complexity Tracking

> No constitution violations requiring justification.

## Key Design Decisions

### 1. Quiz State: `useState` (no external state manager)
Quiz state is session-only and component-local. No cross-component sharing needed.
Simplest viable choice; eliminates Redux/Zustand dependency entirely.

### 2. Featured Products: Prisma seed (no CMS for v1)
Product data served from a Prisma-seeded PostgreSQL table. A CMS integration
(e.g., Contentful) is a v2 concern — deferred per the Simplicity principle.

### 3. Newsletter: PostgreSQL via Prisma (no third-party provider for v1)
Email addresses stored locally. Mailchimp/Klaviyo integration deferred to v2.
Keeps v1 dependency count minimal; easy to migrate later.

### 4. Hero Background: HTML5 `<video>` + `<Image>` fallback
Browser-native, zero extra dependencies. Static image fallback satisfies FR-001
edge case and the constitution's performance budget (no JS video library).

### 5. Quiz Recommendation: Tag-intersection scoring
Each quiz answer carries scent-preference tags. Product score = count of tag matches.
Top 2–3 products by score are recommended. If all scores = 0, return top 3 by
display order (bestsellers). Pure function, fully unit-testable, no ML required.
