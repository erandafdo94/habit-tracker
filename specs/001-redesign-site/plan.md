# Implementation Plan: Site Redesign — Clean, Editorial Blog

**Branch**: `main` (working directly on main per project convention) | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-redesign-site/spec.md`

## Summary

Replace the current monospace, dark-only, single-column layout with a calm, editorial design system applied
consistently across the homepage, post pages, topic pages, search, and 404. The redesign stays on the
existing Astro 6 + Pagefind static stack (per the constitution), adds a small set of CSS design tokens
(typography, colour, spacing, radius, motion), introduces a `tags` taxonomy in post frontmatter so we
can power topic pages and related-post recommendations, and ships light + dark themes that follow the
OS preference. Per-post URLs (`/blog/<slug>`) are preserved; no redirects required. Approach: build the
token layer + shared shell first, then rebuild the homepage and post pages as the two P1 surfaces, then
add topic pages, restyled search, and the 404.

## Technical Context

**Language/Version**: TypeScript 5 / Astro 6.1 (Node ≥ 22.12, per `package.json`)
**Primary Dependencies**: `astro` ^6.1.5, `@astrojs/sitemap` ^3.7.2, `pagefind` ^1.1.1 (dev). No new
runtime dependencies are required by the redesign; one optional dev dependency is added (see
research.md): `@fontsource-variable/inter` and `@fontsource/fraunces` so we self-host the type pairing
instead of calling Google Fonts at runtime (Principle IV).
**Storage**: N/A — content is Markdown under `src/content/blog/` via the Astro content collection.
**Testing**: No unit/integration test suite is in place. Verification is via `astro build` (must succeed
with zero new warnings), Pagefind index regenerating successfully, manual viewport sweep at the
breakpoints listed in the spec, and a Lighthouse mobile run against the homepage and a representative
post page that meets the constitution budget (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Accessibility ≥ 95).
**Target Platform**: Modern evergreen browsers on desktop and mobile (last 2 versions of Chrome, Safari,
Firefox, Edge). Server: static hosting only.
**Project Type**: Static blog (single-app Astro site).
**Performance Goals**: Per constitution Principle IV — LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Lighthouse
Accessibility ≥ 95 on a mid-tier mobile profile. No client-side JS required to render core article
content; only Pagefind's search bundle is allowed to ship JS, and it is loaded only when search is
opened.
**Constraints**: Static-only output, no client-side rendering of article bodies (Principle IV); no new
third-party trackers (Principle II / constitution Content Constraints); existing post URLs MUST keep
working (FR-020); existing Markdown bodies MUST render unchanged (FR-021).
**Scale/Scope**: ~17 posts today, growing slowly; ~5 page templates (home, post, blog index, tag,
404), plus search. Build size budget: < 500 KB total CSS+JS shipped per page (gzipped), images aside.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against [.specify/memory/constitution.md](../../.specify/memory/constitution.md) v1.0.0:

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Reader-First, Evidence-Based Content | ✅ Pass | Redesign does not alter post bodies. Existing claims and sources remain intact (FR-021). |
| II. SEO Excellence (NON-NEGOTIABLE) | ✅ Pass | All existing SEO surface (canonical, OG/Twitter, sitemap) is preserved in the new `Base.astro`; `Article`/`BlogPosting` JSON-LD is added (currently missing) — a net improvement, not a regression. Slugs and URLs unchanged. |
| III. Editorial Quality & Source Integrity | ✅ Pass | No content edits in scope. |
| IV. Performance, Accessibility & Core Web Vitals | ✅ Pass | Self-hosted fonts (no Google Fonts request), `font-display: swap`, preconnect dropped, no client JS on article render, system-font fallback stack, AVIF/WebP for any new imagery. Light+dark themes both verified for WCAG AA contrast. CLS is controlled by sizing images and reserving space for the hero. |
| V. Content Lifecycle & Maintenance | ✅ Pass | Adds optional `updatedDate` to the post schema and surfaces it in the post header — enables Principle V's "last updated" requirement, which the current design cannot show. |

**Stack-change check** (constitution Content & Technical Constraints): Astro + Pagefind retained. The two
new dev-only font packages are static asset providers; they do not change the rendering model and they
remove a runtime network dependency on Google Fonts, which is a net Principle IV win. No amendment
required.

**Gate result**: PASS — no violations, Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/001-redesign-site/
├── plan.md              # This file
├── research.md          # Phase 0 output — type pairing, colour system, theming, related-post strategy
├── data-model.md        # Phase 1 output — post frontmatter schema, tag entity, design tokens
├── quickstart.md        # Phase 1 output — dev/build/verify steps for the redesign
├── contracts/
│   ├── frontmatter.schema.md   # Post frontmatter contract (Zod schema in src/content.config.ts)
│   └── url-map.md              # URL contract — every route the site exposes after redesign
└── checklists/
    └── requirements.md   # Created by /speckit-specify; remains the quality gate
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Search.astro              # Restyled; behavior unchanged (Pagefind UI)
│   ├── SiteHeader.astro          # NEW — shared header (logo, nav, theme toggle, search trigger)
│   ├── SiteFooter.astro          # NEW — shared footer (about line, topic links, copyright)
│   ├── PostCard.astro            # NEW — reusable card (home, tag, related)
│   ├── PostMeta.astro            # NEW — date · updated · reading time · tag pill
│   ├── RelatedPosts.astro        # NEW — "Keep reading" block on post pages
│   ├── ThemeToggle.astro         # NEW — inline-script theme switch (no FOUC)
│   └── JsonLd.astro              # NEW — Article/BlogPosting + BreadcrumbList JSON-LD
├── content/
│   └── blog/                     # Unchanged — posts edited only to add `tags` + optional `updatedDate`
├── content.config.ts             # UPDATED — extend Zod schema (tags[], updatedDate?, heroImage?)
├── layouts/
│   ├── Base.astro                # REWRITTEN — uses new tokens, header/footer components, theme bootstrap
│   └── Post.astro                # REWRITTEN — uses Base + PostMeta + RelatedPosts + JsonLd
├── lib/
│   ├── reading-time.ts           # NEW — words → minutes helper
│   └── related.ts                # NEW — tag-overlap ranking for related posts
├── pages/
│   ├── 404.astro                 # NEW — branded 404 with popular topics + link home
│   ├── about.astro               # NEW (optional, low-cost) — one-page "about this blog"
│   ├── blog/
│   │   ├── [...page].astro       # UPDATED — uses PostCard grid
│   │   └── [slug].astro          # Mostly unchanged — passes new fields to Post layout
│   ├── tags/
│   │   ├── index.astro           # NEW — all tags overview
│   │   └── [tag].astro           # NEW — posts filtered by tag (static paths)
│   └── index.astro               # REWRITTEN — hero + featured + recent list with PostCard
└── styles/
    ├── tokens.css                # NEW — CSS custom properties (colour, type, space, radius, motion) for light + dark
    ├── reset.css                 # NEW — minimal modern reset (replaces inline reset)
    ├── prose.css                 # NEW — typography rules for `.prose` (article body)
    └── global.css                # REWRITTEN — imports tokens/reset/prose; site-shell layout only

public/
└── fonts/                        # (Generated by @fontsource at build time — no manual files committed)
```

**Structure Decision**: Single Astro project; redesign is a pure frontend change. Shared layout chrome
moves from `Base.astro` inline blocks into small `.astro` components under `src/components/` so the
homepage, post, tag, and 404 surfaces all reuse the same header/footer and the same `PostCard`. CSS is
split by responsibility (`tokens` / `reset` / `prose` / shell) instead of one `global.css`, so the
design system is the single source of truth and easy to audit against the constitution at review time.

## Complexity Tracking

> Not applicable — Constitution Check passed with no violations.
