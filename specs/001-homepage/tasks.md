# Tasks: Perfume E-Commerce Homepage

**Input**: Design documents from `/specs/001-homepage/`
**Prerequisites**: plan.md ✅ · spec.md ✅
**Branch**: `001-homepage`
**Total Tasks**: 38

**Organization**: Tasks grouped by user story — each story is independently
implementable, testable, and deliverable as an MVP increment.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js project, configure tooling, and establish
the shared foundation before any user story work begins.

- [x] T001 Initialize Next.js 14 project with TypeScript and App Router in repository root (`npx create-next-app@latest`)
- [x] T002 Install and configure Tailwind CSS 3 with custom design tokens in `tailwind.config.ts` (colors, fonts, spacing)
- [x] T003 [P] Install Prisma 5 and configure PostgreSQL connection in `prisma/schema.prisma` and `.env.local`
- [x] T004 [P] Install and configure ESLint + Prettier with shared config files (`.eslintrc.json`, `.prettierrc`)
- [x] T005 [P] Install Vitest and Testing Library; add `vitest.config.ts` at repo root
- [x] T006 [P] Install Playwright; initialize config at `playwright.config.ts`
- [x] T007 Create root layout at `app/layout.tsx` with HTML structure, font imports (e.g., Cormorant Garamond + Montserrat via `next/font`), and `<main>` wrapper
- [x] T008 Define shared TypeScript types in `types/homepage.ts` (FeaturedProduct, QuizQuestion, QuizOption, QuizResult, NewsletterSubscriber)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer and utilities that ALL user stories depend on.
No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Blocks all user story implementation.

- [x] T009 Create Prisma schema model `NewsletterSubscriber` (fields: id, email, createdAt, consentGiven) in `prisma/schema.prisma`
- [x] T010 Run Prisma migration to create `newsletter_subscribers` table (`npx prisma migrate dev --name init`)
- [x] T011 [P] Create featured products seed data in `data/featured-products-seed.ts` with 6 sample products (id, name, price, imageUrl, scentNotes, displayOrder)
- [x] T012 [P] Create quiz question static data in `data/quiz-questions.ts` (4 questions, 4 options each, with scent-preference tags per option)
- [x] T013 Create data fetcher `lib/featured-products.ts` — exports `getFeaturedProducts(): Promise<FeaturedProduct[]>` (reads from seed or DB, sorted by displayOrder)
- [x] T014 Add placeholder hero image at `public/hero-fallback.jpg` and brand story image at `public/brand-story.jpg`

**Checkpoint**: Data layer ready — user story components can now be built in any order.

---

## Phase 3: User Story 1 — Hero Section (Priority: P1) 🎯 MVP

**Goal**: Full-screen hero section visible on page load with brand tagline,
background visual, and CTA button linking to product listing.

**Independent Test**: Run `npm run dev`, open `http://localhost:3000`. Verify
the hero section fills the viewport, tagline is visible, "Explore the Collection"
button is present and links to `/products`.

### Implementation for User Story 1

- [x] T015 [US1] Create `components/homepage/HeroSection.tsx` — full-viewport section with brand tagline (h1), CTA button linking to `/products`, and background container
- [x] T016 [US1] Add HTML5 `<video>` background with `autoplay muted loop playsInline` attributes in `HeroSection.tsx`; add `<Image>` fallback (`public/hero-fallback.jpg`) shown via `onError` handler
- [x] T017 [US1] Apply mobile-first Tailwind CSS styles to `HeroSection.tsx`: full-height (`min-h-screen`), responsive text sizes, CTA button with minimum 44px height touch target
- [x] T018 [US1] Integrate `HeroSection` into `app/page.tsx` as the first rendered section
- [x] T019 [US1] Add descriptive `alt` text to hero `<Image>` and `aria-label` to CTA button in `HeroSection.tsx`

**Checkpoint**: US1 complete — hero section fully functional and accessible.
Deploy/demo as MVP.

---

## Phase 4: User Story 2 — Featured Collections (Priority: P2)

**Goal**: Grid of 4–8 curated product cards below the hero, each showing name,
price, image, and scent notes on hover/tap. Clicking navigates to product detail.

**Independent Test**: Scroll below hero on `http://localhost:3000`. Verify at
least 4 product cards render with image, name, and price. Hover a card and confirm
scent notes appear. Click a card and confirm navigation to `/products/[id]`.

### Implementation for User Story 2

- [x] T020 [P] [US2] Create `components/homepage/ProductCard.tsx` — displays product image (`next/image`), name, price, and scent notes overlay revealed on CSS hover (desktop) and touch focus (mobile)
- [x] T021 [P] [US2] Create `components/homepage/FeaturedCollections.tsx` — section wrapper that renders a responsive grid of `ProductCard` components; accepts `products: FeaturedProduct[]` prop
- [x] T022 [US2] Add empty state to `FeaturedCollections.tsx`: when `products.length === 0`, render 4 placeholder "Coming Soon" skeleton cards
- [x] T023 [US2] In `app/page.tsx`, call `getFeaturedProducts()` server-side and pass result as prop to `<FeaturedCollections>`
- [x] T024 [US2] Wrap each `ProductCard` in a Next.js `<Link href={/products/${product.id}}>` for navigation to product detail page
- [x] T025 [US2] Add `alt` text to all product images and `aria-label` to product card links in `ProductCard.tsx`

**Checkpoint**: US2 complete — featured collections browsable and linked. US1 + US2
independently functional.

---

## Phase 5: User Story 3 — Scent Discovery Quiz (Priority: P3)

**Goal**: Interactive 4-question quiz accessible via "Find Your Scent" button.
On completion, shows 2–3 personalised recommendations or bestseller fallback.

**Independent Test**: Click "Find Your Scent" on homepage. Answer all 4 questions.
Verify results screen shows 2–3 product cards with links. Close quiz and verify
state resets on re-open.

### Implementation for User Story 3

- [x] T026 [P] [US3] Create pure function `lib/quiz-engine.ts` — exports `getRecommendations(answers: QuizAnswer[]): string[]` using tag-intersection scoring; returns top 2–3 product ids; empty array if no match
- [x] T027 [P] [US3] Create `app/api/quiz/results/route.ts` — POST handler: validates request body, calls `getRecommendations()`, fetches matching products, returns fallback bestsellers if result empty
- [x] T028 [P] [US3] Create unit test `tests/unit/quiz-engine.test.ts` — tests tag-matching with known inputs (exact match, partial match, no match → fallback), MUST FAIL before T026 implementation
- [x] T029 [US3] Create `components/homepage/QuizQuestion.tsx` — renders single question text, list of selectable option buttons, and a progress bar (e.g., "Question 2 of 4")
- [x] T030 [US3] Create `components/homepage/QuizResults.tsx` — renders 2–3 recommended `ProductCard` components; shows "Our top picks for you" label when `fallback === true`
- [x] T031 [US3] Create `components/homepage/ScentDiscoveryQuiz.tsx` — orchestrates quiz flow using `useState`; manages step index, collected answers, and results; calls `/api/quiz/results` on completion; resets state on close/unmount
- [x] T032 [US3] Add "Find Your Scent" button to `app/page.tsx` that renders `<ScentDiscoveryQuiz>` in a modal or inline section; ensure keyboard-navigable (focus trap in modal, Escape to close)
- [x] T033 [US3] Apply mobile-first styles to `QuizQuestion.tsx`: each question fits on one screen, options are min 44px height, progress bar visible on all breakpoints

**Checkpoint**: US3 complete — quiz flow end-to-end functional with recommendations.

---

## Phase 6: User Story 4 — Brand Story (Priority: P4)

**Goal**: Brand narrative section with headline, 100–200 word copy, supporting
visual, and optional "Learn More" link to About page.

**Independent Test**: Scroll to brand story section on homepage. Verify headline,
body copy (≥100 words), and image are visible. Click "Learn More" and confirm
navigation to `/about`.

### Implementation for User Story 4

- [x] T034 [P] [US4] Create `components/homepage/BrandStory.tsx` — renders section with: `<h2>` headline, narrative `<p>` copy (passed as prop or hardcoded placeholder), `<Image src="public/brand-story.jpg">`, and optional "Learn More" `<Link href="/about">`
- [x] T035 [US4] Apply Tailwind CSS styles to `BrandStory.tsx`: minimum 16px body text, color contrast ≥ 4.5:1, responsive two-column layout (image left, text right on desktop; stacked on mobile)
- [x] T036 [US4] Integrate `<BrandStory>` into `app/page.tsx` below the Featured Collections section

**Checkpoint**: US4 complete — all four user stories independently functional.

---

## Phase 7: Newsletter Signup (Cross-Cutting)

**Purpose**: Email capture form used across the homepage (placed below Brand Story).

- [x] T037 [P] Create unit test `tests/unit/newsletter.test.ts` — tests email validation (valid, invalid format, duplicate), MUST FAIL before T038 implementation
- [x] T038 Create `lib/newsletter.ts` — server action: validates email (regex), checks for duplicate in DB via Prisma, inserts `NewsletterSubscriber`, returns `{ success: boolean; error?: string }`
- [x] T039 Create `app/api/newsletter/route.ts` — POST handler wrapping `lib/newsletter.ts`; returns 400 (invalid), 409 (duplicate), 200 (success)
- [x] T040 [P] Create `components/homepage/NewsletterSignup.tsx` — email `<input>` + submit `<button>`; calls `/api/newsletter` via `fetch`; shows inline success message on 200, error message on 4xx; no page reload
- [x] T041 Integrate `<NewsletterSignup>` into `app/page.tsx` as the last section before footer

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Lighthouse scores, accessibility audit, cross-browser verification,
and final QA.

- [x] T042 [P] Write Playwright E2E test `tests/e2e/homepage.spec.ts` covering: page load, hero CTA click, product card hover + click, quiz full flow, newsletter submit
- [x] T043 [P] Run Lighthouse CI on homepage and fix any issues scoring below: Performance 85, Accessibility 90, SEO 90 (common fixes: image alt text, heading hierarchy, meta description in `layout.tsx`)
- [x] T044 [P] Add `<meta>` description and Open Graph tags to `app/layout.tsx` for SEO
- [x] T045 Add lazy loading (`loading="lazy"`) to all below-fold `<Image>` components (ProductCard, BrandStory); ensure hero image uses `priority` prop (eager load)
- [x] T046 [P] Manual cross-browser smoke test: Chrome, Firefox, Safari, Edge (latest) — verify no layout breakage at 320px, 768px, 1440px viewports
- [x] T047 Keyboard navigation audit: Tab through all interactive elements (CTA, product cards, quiz options, newsletter form) — fix any missing `focus` styles or `tabIndex` issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 Hero (Phase 3)**: Depends on Phase 2 — can start as soon as T014 done
- **US2 Collections (Phase 4)**: Depends on Phase 2 (needs T013 data fetcher)
- **US3 Quiz (Phase 5)**: Depends on Phase 2 (needs T012 quiz data)
- **US4 Brand Story (Phase 6)**: Depends only on Phase 1 (no data dependency)
- **Newsletter (Phase 7)**: Depends on Phase 2 (needs T009–T010 DB schema)
- **Polish (Phase 8)**: Depends on ALL phases complete

### User Story Dependencies

- **US1 (P1)**: Independent after Phase 2 ✅
- **US2 (P2)**: Independent after Phase 2 ✅
- **US3 (P3)**: Independent after Phase 2 ✅ (quiz engine is self-contained)
- **US4 (P4)**: Independent after Phase 1 ✅ (no data fetching needed)

### Within Each User Story

- Component → Integration into `page.tsx` → Accessibility attributes
- Quiz: unit test MUST fail (T028) → engine implementation (T026) → component (T029–T033)
- Newsletter: unit test MUST fail (T037) → server action (T038) → API route (T039) → component (T040)

---

## Parallel Opportunities

```bash
# Phase 1 — run in parallel after T001 completes:
T002  Configure Tailwind CSS
T003  Install Prisma + configure PostgreSQL
T004  Setup ESLint + Prettier
T005  Setup Vitest
T006  Setup Playwright

# Phase 2 — run in parallel:
T011  Create product seed data
T012  Create quiz question data

# Phase 4 — US2, run in parallel:
T020  Create ProductCard component
T021  Create FeaturedCollections component

# Phase 5 — US3, run in parallel after T026 passes:
T027  Create /api/quiz/results route
T028  Write quiz-engine unit tests (RED phase)
T029  Create QuizQuestion component
T030  Create QuizResults component

# Phase 7 — Newsletter, run in parallel:
T037  Write newsletter unit tests (RED phase)
T040  Create NewsletterSignup component (can be stubbed)

# Phase 8 — Polish, run in parallel:
T042  E2E tests (Playwright)
T043  Lighthouse CI fixes
T044  SEO meta tags
T046  Cross-browser smoke test
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: Hero Section (T015–T019)
4. **STOP and VALIDATE**: Open homepage, verify hero loads in <2s, CTA works, mobile layout correct
5. Deploy/demo as MVP — brand is live

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Hero Section → **MVP deployed** (brand online)
3. Featured Collections → product discovery enabled
4. Scent Discovery Quiz → conversion optimization active
5. Brand Story + Newsletter → trust + retention loop complete
6. Polish → production-ready Lighthouse scores

### Parallel Team Strategy (if multiple developers)

- **Dev A**: Phase 1+2 setup → then US1 Hero
- **Dev B**: US2 Featured Collections (after Phase 2 done)
- **Dev C**: US3 Quiz engine + API route (after Phase 2 done)
- **Dev D**: US4 Brand Story (after Phase 1 done — no DB needed)

---

## Notes

- [P] = parallelizable (different files, no blocking dependencies)
- [USn] = maps task to specific user story for traceability
- Tests marked (RED phase) MUST be written and confirmed FAILING before implementation
- Commit after each task or logical group using Conventional Commits
- Stop at each phase checkpoint to validate story independently
- `app/page.tsx` is assembled last — integrate components one user story at a time
