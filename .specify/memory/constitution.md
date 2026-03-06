<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (none) → 1.0.0
  Added sections:
    - Core Principles (6 principles)
    - Tech Stack & Standards
    - Development Workflow
    - Governance
  Modified principles: N/A (initial version)
  Removed sections: N/A (initial version)
  Templates requiring updates:
    - .specify/templates/plan-template.md  ✅ aligned (Constitution Check section present)
    - .specify/templates/spec-template.md  ✅ aligned (FR/SC structure matches)
    - .specify/templates/tasks-template.md ✅ aligned (phase structure matches)
  Deferred TODOs:
    - RATIFICATION_DATE set to today (2026-03-05) as project inception date
-->

# Perfume E-Commerce Constitution

## Core Principles

### I. User-First, Luxury Experience (NON-NEGOTIABLE)
Every UI decision MUST serve the end customer's shopping journey.
- Pages MUST load in under 2 seconds on a standard 4G connection (LCP ≤ 2s).
- Layouts MUST be mobile-first and responsive across breakpoints (320px–1920px).
- Visual design MUST reflect a premium, editorial aesthetic: no cluttered layouts,
  no cheap stock imagery, no generic component libraries without customization.
- Accessibility MUST meet WCAG 2.1 AA minimum at all times.

**Rationale**: Perfume is an emotional, sensory product sold online — trust and
aesthetics are the primary purchase drivers. A poor UX directly kills conversion.

### II. Component-Driven Development
All UI MUST be built as isolated, reusable components.
- Every component MUST be independently renderable and testable in isolation.
- Components MUST NOT contain business logic — separate concerns strictly.
- Shared design tokens (colors, spacing, typography) MUST live in a single source
  of truth (e.g., `tailwind.config.js` or a design system file).
- No inline styles except for truly dynamic values (e.g., progress widths).

**Rationale**: An e-commerce site grows iteratively — new pages, promotions,
and product types appear constantly. Components prevent duplication and drift.

### III. Test-First (NON-NEGOTIABLE)
TDD is mandatory for all non-trivial logic.
- Tests MUST be written and confirmed to FAIL before implementation begins.
- Red → Green → Refactor cycle MUST be followed strictly.
- Unit tests MUST cover: cart logic, pricing/discount calculations, form validation,
  search/filter functions, and API response transformations.
- Integration tests MUST cover: checkout flow, authentication flow, product listing
  and detail pages.
- No feature is considered done until its acceptance criteria pass in CI.

**Rationale**: Cart bugs, pricing errors, and broken checkouts destroy customer
trust permanently. Automated tests are the only reliable safety net.

### IV. Secure by Default
Security is a first-class constraint, not an afterthought.
- Secrets (API keys, DB credentials, payment tokens) MUST NEVER be hardcoded.
  All secrets MUST be loaded from environment variables via `.env` files (gitignored).
- All user inputs MUST be validated and sanitized on both client and server.
- Payment processing MUST be delegated to a certified PCI-DSS provider (e.g., Stripe).
  Raw card data MUST NEVER touch the application server.
- Authentication MUST use industry-standard sessions or JWTs with secure, httpOnly cookies.
- SQL/NoSQL queries MUST use parameterized statements or ORM abstractions — no
  raw string interpolation.

**Rationale**: An e-commerce site handles payment and personal data. A single
breach destroys brand reputation and triggers legal liability.

### V. Performance Budget
Performance is a feature, not a polish task.
- JavaScript bundle MUST stay under 200KB gzipped for the initial page load.
- Images MUST be served in modern formats (WebP/AVIF) with responsive `srcset`.
- Third-party scripts (analytics, chat widgets) MUST be loaded asynchronously and
  MUST NOT block the critical rendering path.
- Core Web Vitals MUST remain in the "Good" range: LCP ≤ 2.5s, INP ≤ 200ms,
  CLS ≤ 0.1.

**Rationale**: Search ranking and conversion rate are both directly correlated
with page speed. Performance regressions are product regressions.

### VI. Simplicity & Smallest Viable Change
Do the simplest thing that could possibly work.
- YAGNI: build only what the current spec requires — no speculative features.
- Prefer standard library or well-established packages over custom implementations.
- Every PR MUST change the minimum number of files necessary.
- Complexity MUST be justified in writing in the relevant plan.md before introduction.
- No premature abstractions: three similar blocks of code before extracting a helper.

**Rationale**: Over-engineering slows delivery, increases surface area for bugs,
and makes the codebase harder to hand off. Ship fast, refactor with evidence.

---

## Tech Stack & Standards

- **Frontend**: Next.js (App Router) · TypeScript · Tailwind CSS
- **Backend / API**: Next.js API Routes or a dedicated Node.js service
- **Database**: PostgreSQL (primary) via an ORM (e.g., Prisma)
- **Auth**: NextAuth.js or Clerk
- **Payments**: Stripe (PCI-DSS compliant; raw card data never touches our server)
- **Image CDN**: Cloudinary or Vercel Image Optimization
- **Testing**: Vitest (unit) · Playwright (E2E) · Testing Library (component)
- **CI/CD**: GitHub Actions — lint → test → build → deploy on every PR
- **Hosting**: Vercel (preferred) or a containerized Node deployment
- **Linting**: ESLint + Prettier with a shared config committed to the repo
- **Environment**: `.env.local` for local dev; secrets managed via hosting platform

---

## Development Workflow

1. **Spec before code**: Every feature MUST have a `spec.md` approved before
   `plan.md` or `tasks.md` are created.
2. **Branch naming**: `###-short-feature-name` (e.g., `001-product-listing`).
3. **PR requirements**: All CI checks green · At least one reviewer approved ·
   No unresolved comments · Linked to a spec or task ID.
4. **Commit style**: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`).
5. **Definition of Done**:
   - Acceptance criteria in spec.md all pass.
   - No new ESLint or TypeScript errors introduced.
   - Lighthouse CI score does not regress on Performance, Accessibility, or SEO.
   - PHR created and committed with the feature branch.
6. **Database migrations**: MUST be reversible. NEVER drop columns without a
   multi-step migration plan (add → backfill → remove).
7. **Feature flags**: Use environment variables for progressive rollouts; remove
   the flag and dead code within 2 sprints of full rollout.

---

## Governance

- This constitution supersedes all other informal practices or verbal agreements.
- **Amendments**: Require (a) a written proposal in a PR, (b) approval from the
  lead architect, and (c) a migration plan for any existing code that violates
  the new principle.
- **Version policy**: Follow semantic versioning.
  - MAJOR — principle removed, renamed, or made incompatible.
  - MINOR — new principle or section added.
  - PATCH — wording clarification, typo fix, non-semantic refinement.
- **Compliance review**: Every sprint retrospective MUST include a 5-minute
  constitution compliance check — are any principles being consistently violated?
  If so, either fix the code or amend the constitution.
- **ADRs**: Significant architectural decisions (framework choice, auth strategy,
  data model, deployment platform) MUST be documented in `history/adr/` before
  implementation begins. Use `/sp.adr <title>` to initiate.
- **PHRs**: Every user prompt that results in a code, spec, plan, or task change
  MUST produce a Prompt History Record in `history/prompts/`.

**Version**: 1.0.0 | **Ratified**: 2026-03-05 | **Last Amended**: 2026-03-05
