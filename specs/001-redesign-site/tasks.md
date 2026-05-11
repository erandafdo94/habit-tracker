---
description: "Implementation task list for the Site Redesign feature"
---

# Tasks: Site Redesign — Clean, Editorial Blog

**Input**: Design documents from `/specs/001-redesign-site/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Not requested. No unit/integration test tasks are included. Verification is via `astro build`, manual viewport sweep, Lighthouse mobile run, and the `quickstart.md` validation steps (see Phase 7).

**Organization**: Tasks are grouped by user story (P1 home → P1 post → P2 topics/search → P3 dark mode + responsive polish) so each can be completed and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story this task belongs to (US1, US2, US3, US4) — Setup/Foundational/Polish have no story label

## Path Conventions

Single Astro project. All source under `src/`; static output to `dist/`. Paths in tasks are repo-relative.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dev dependencies and put the design-system file scaffolding in place. Nothing user-visible yet.

- [X] T001 Install self-hosted font packages by running `npm install --save-dev @fontsource-variable/inter @fontsource/fraunces` and commit the resulting `package.json` + `package-lock.json` changes.
- [X] T002 [P] Create empty placeholder file `src/styles/tokens.css` (will be filled in Phase 2 T010).
- [X] T003 [P] Create empty placeholder file `src/styles/reset.css` (filled in Phase 2 T011).
- [X] T004 [P] Create empty placeholder file `src/styles/prose.css` (filled in Phase 2 T012).
- [X] T005 [P] Create `src/lib/` directory with two empty stubs: `src/lib/reading-time.ts` and `src/lib/related.ts` (filled in Phase 2).
- [X] T006 [P] Create `src/components/` placeholder files (empty `.astro` shells exporting nothing yet): `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/PostCard.astro`, `src/components/PostMeta.astro`, `src/components/RelatedPosts.astro`, `src/components/ThemeToggle.astro`, `src/components/JsonLd.astro`.

**Checkpoint**: Repository compiles (`npm run build` still succeeds against the old layouts — new files are unreferenced).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the design system, content schema, and shared shell that every user story depends on. **No user story phase can start until this phase is complete.**

⚠️ **CRITICAL**: All four user stories read from these files. Land them first.

### Design system & global styles

- [X] T007 Replace `src/styles/tokens.css` with the full token set from [data-model.md §Design Tokens](./data-model.md): colour (light + `[data-theme="dark"]`), typography scale (`--step--1`..`--step-5`, `--font-sans`, `--font-serif`, `--measure`, `--leading-body`, `--leading-tight`), spacing (`--space-1`..`--space-9`), radius (`--radius-1`..`--radius-3`), motion (`--ease-out`, `--duration-fast`, `--duration-base`). Import `@fontsource-variable/inter` and `@fontsource/fraunces` weights at the top so they are bundled.
- [X] T008 Replace `src/styles/reset.css` with a minimal modern reset (box-sizing, margin/padding zeroing, media defaults, `:focus-visible` ring using `--focus`, `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`).
- [X] T009 Replace `src/styles/prose.css` with `.prose` typography rules: serif `h1`–`h3` using `--font-serif`, sans body using `--font-sans`, `max-width: var(--measure)`, line-height `--leading-body`, styled `blockquote`, `code`, `ul`/`ol`, links (underline + `--accent` on hover), figures, `hr`.
- [X] T010 Rewrite `src/styles/global.css` to be a thin orchestrator: `@import "./reset.css"; @import "./tokens.css"; @import "./prose.css";` plus only the site-shell layout rules (max-width container, header/footer grid). Remove all inline colour/font literals.

### Content schema & taxonomy

- [X] T011 Update `src/content.config.ts` to the schema in [contracts/frontmatter.schema.md](./contracts/frontmatter.schema.md): add `updatedDate?`, `tags` (Zod enum from `TAG_SLUGS`, 1–4 items), `featured` (default false), optional `heroImage`, with the `updatedDate ≥ pubDate` refinement. Export `TAG_SLUGS` from the same file.
- [X] T012 Create `src/lib/tags.ts` exporting a `TAGS` constant: array of `{ slug, label, description }` for the 8 tags in [data-model.md §Tag](./data-model.md). Re-export `TAG_SLUGS` from `content.config.ts` for type narrowing.
- [X] T013 Backfill `tags` on every existing post under `src/content/blog/*.md`. Assign 1–3 tags each from the closed taxonomy, picking the most appropriate (e.g. `atomic-habits-summary.md` → `["book-summary", "behavior-change"]`; `habit-stacking-guide.md` → `["habit-stacking", "behavior-change"]`; `breaking-bad-habits.md` → `["breaking-bad-habits"]`; `morning-routine-habits.md` → `["routines"]`; `identity-based-habits.md` → `["identity", "behavior-change"]`). Verify `npm run build` succeeds (Zod will fail the build on any miss).

### Helpers

- [X] T014 [P] Implement `src/lib/reading-time.ts`: export `readingTime(markdown: string): number` per [research.md §3](./research.md) — strip fenced code blocks and HTML tags, split on `\s+`, return `Math.max(1, Math.round(words / 220))`.
- [X] T015 [P] Implement `src/lib/related.ts`: export `relatedPosts(target, all, n = 3)` returning the top `n` posts by Jaccard tag-overlap, tiebreaker `pubDate` desc, excluding `target` itself. Pure function over `CollectionEntry<'blog'>[]`.

### Shared shell components

- [X] T016 Implement `src/components/ThemeToggle.astro`: a `<button>` that toggles `document.documentElement.dataset.theme` between `light`/`dark` and persists to `localStorage['theme']`. Sun/moon glyph swap via CSS based on `data-theme`. `aria-label="Toggle theme"`.
- [X] T017 Implement `src/components/SiteHeader.astro`: left wordmark (link to `/`), centre/right nav (`/blog/`, `/tags/`, optional `/about/`), search trigger button (`aria-label="Search"`), `ThemeToggle`. Mobile: hamburger collapses nav into a popover. No client framework — vanilla `<button>` + small inline `<script>` for the popover.
- [X] T018 Implement `src/components/SiteFooter.astro`: wordmark + one-line tagline, a column of topic links (read from `src/lib/tags.ts`), a "Read" column (`/blog/`, `/tags/`), and a copyright line. Reserved empty slot for future subscribe form (commented placeholder only).
- [X] T019 Implement `src/components/JsonLd.astro`: prop-driven; supports `type: 'WebSite' | 'BlogPosting' | 'BreadcrumbList'`. Renders `<script type="application/ld+json">` with the appropriate object per [contracts/url-map.md §Invariants](./contracts/url-map.md).
- [X] T020 Rewrite `src/layouts/Base.astro` to: (a) include the inline no-FOUC theme bootstrap script from [research.md §8](./research.md) as the **first** child of `<head>`, (b) emit `<link rel="canonical">`, `og:*`, `twitter:*` from props, (c) render `<SiteHeader />`, `<slot />`, `<SiteFooter />` inside a single `.site` container, (d) keep the GA snippet exactly as today, (e) accept an optional `jsonLd` prop and render it via `<JsonLd />`.

### 404

- [X] T021 Create `src/pages/404.astro` using `Base.astro`: heading "Page not found", one-line explanation, links back to `/` and to 4–6 popular topics (read from `src/lib/tags.ts`).

**Checkpoint**: Build succeeds. The site renders with the new shell and tokens; existing posts still resolve at `/blog/<slug>/` (they now use `Post.astro`, but `Post.astro` itself is rebuilt in US2 — so for the moment the post pages may look transitional). The four user-story phases can now begin.

---

## Phase 3: User Story 1 — Homepage first impression (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor lands on `/` and within seconds understands the blog and sees a clean, scannable list of posts. (Spec User Story 1, FR-004–FR-006.)

**Independent Test**: Open the deployed (or `npm run preview`) site at `/` on desktop (1440px) and mobile (375px). Confirm: clear wordmark + one-line value prop in first viewport, featured/recent posts visible as cards with title/description/date/reading time/tag, no layout breakage at 320–1920px, no horizontal scroll.

- [X] T022 [P] [US1] Implement `src/components/PostMeta.astro`: renders `pubDate · "Updated <updatedDate>" (if present) · "<n> min read" · tag pill`. Tag pill links to `/tags/<slug>/`. Reads reading time via `readingTime()` only if passed raw body; otherwise accepts a precomputed number.
- [X] T023 [P] [US1] Implement `src/components/PostCard.astro`: props `{ post, variant: 'default' | 'featured' }`. Layout: title (serif `--step-2`), description (sans `--step-0`, muted), `PostMeta` row. `featured` variant uses `--step-3` title and slightly larger card padding. Entire card is a single link to `/blog/<slug>/`; hover lifts `--border` to `--border-strong`.
- [X] T024 [US1] Rewrite `src/pages/index.astro`: hero (`<h1>` "Build better habits. Break the bad ones." or similar, deck paragraph, no client JS); pull `getCollection('blog')`, sort by `pubDate` desc; pick the first `featured: true` post (fallback: the most recent) and render it as a `<PostCard variant="featured" />`; render the remaining posts as a responsive CSS-grid of `<PostCard />` (1 column < 640px, 2 columns 640–1024px, 3 columns ≥ 1024px). Pass a `jsonLd` of `type: 'WebSite'` to `Base.astro`.
- [X] T025 [US1] Restyle the `Search` integration on the homepage: hide the standalone search block from the previous design; the header search trigger (from `SiteHeader`) opens a modal containing `<Search />` (Pagefind UI). Adjust `src/components/Search.astro` styles only — no behavior change — to use tokens (`--bg-elev`, `--border`, `--radius-2`, `--space-*`).

**Checkpoint**: Homepage matches Spec User Story 1 acceptance scenarios on both viewports. Pagefind search still works (open via header button). MVP demoable.

---

## Phase 4: User Story 2 — Post reading experience (Priority: P1)

**Goal**: A reader opens any post and reads end-to-end comfortably, with clean typography, clear meta, and obvious next steps. (Spec User Story 2, FR-007–FR-010.)

**Independent Test**: Open any post on desktop and mobile. Confirm: serif H1, clear meta row (date, optional "updated", reading time, tag), `.prose` body with ~66ch measure on desktop and 16px+ on mobile, blockquotes/lists/links styled consistently, end-of-post "Keep reading" with 2–3 related posts; `Article` JSON-LD present in the page source.

- [X] T026 [US2] Implement `src/components/RelatedPosts.astro`: takes the current post and the full posts collection; uses `relatedPosts()` from `src/lib/related.ts` to pick 3; renders a `<section>` titled "Keep reading" containing three `<PostCard />`s in the same grid pattern as the homepage. If fewer than 2 candidates exist (unlikely with current corpus), fall back to most recent posts.
- [X] T027 [US2] Rewrite `src/layouts/Post.astro` to render through `Base.astro`. Inside `<Base>`: an `<article class="prose">` whose header contains the serif H1, the description as a deck (`--fg-muted`, `--step-0`), and `<PostMeta>`; then `<slot />` for the Markdown body wrapped in `.prose`; then `<RelatedPosts />`; pass `jsonLd` of `type: 'BlogPosting'` (and a `BreadcrumbList` Home > Blog > Post) into `Base.astro`. Remove the duplicate `<head>` block — `Base.astro` is now the single source of meta.
- [X] T028 [US2] Update `src/pages/blog/[slug].astro` to pass the new fields through to `Post.astro`: `title`, `description`, `pubDate`, `updatedDate`, `slug`, `tags`, and the raw body string (used by `readingTime()` inside `PostMeta`). Also pass `allPosts` so `RelatedPosts` does not need to re-fetch.

**Checkpoint**: Every existing post (`/blog/<slug>/`) reads cleanly on mobile and desktop. JSON-LD validates in Google's Rich Results Test. URL contract from [contracts/url-map.md](./contracts/url-map.md) is preserved — verify by diffing the new `dist/sitemap-0.xml` against the prior production sitemap.

---

## Phase 5: User Story 3 — Topic exploration and search (Priority: P2)

**Goal**: A reader can browse posts by topic and reach restyled search results from anywhere. (Spec User Story 3, FR-011–FR-013.)

**Independent Test**: From a post, click the tag pill and land on `/tags/<tag>/` showing all posts in that tag with the same `PostCard` layout. From any page, open header search, type a keyword, get ranked results within ~1s.

- [X] T029 [US3] Create `src/pages/blog/[...page].astro`'s restyled grid — if not already updated in T024 — to use `<PostCard />` in the same responsive grid. (If file structure already covers this, mark as no-op and proceed.)
- [X] T030 [P] [US3] Create `src/pages/tags/index.astro`: read `TAGS` from `src/lib/tags.ts`; for each tag, compute the number of posts; render as a clean two-column list of `{ label, description, count }`, each linking to `/tags/<slug>/`. Page uses `Base.astro` with appropriate title/description.
- [X] T031 [P] [US3] Create `src/pages/tags/[tag].astro` with `getStaticPaths()` over `TAG_SLUGS`: page header shows tag label + description, body is the `<PostCard />` grid filtered to posts whose `tags` includes the current tag, sorted `pubDate` desc. Empty state: friendly "No posts yet in this topic" message + link back to `/tags/`.
- [X] T032 [US3] Restyle Pagefind UI inside the search modal (built in T025): override Pagefind default CSS variables to map onto our tokens (`--pagefind-ui-background`, `--pagefind-ui-text`, `--pagefind-ui-primary`, etc.) so result cards match the rest of the site. Verify result items use `--fg`, excerpts use `--fg-muted`, and the modal closes on Esc + restores focus to the trigger.

**Checkpoint**: `/tags/` and `/tags/<tag>/` resolve for all 8 tags; sitemap regenerates to include them; search opens from every page and matches the design system.

---

## Phase 6: User Story 4 — Dark mode, responsiveness, accessibility polish (Priority: P3)

**Goal**: The design respects user preferences (dark mode, reduced motion) and looks intentional at every common breakpoint and on assistive tech. (Spec User Story 4, FR-016–FR-019.)

**Independent Test**: Toggle OS dark mode → site flips with no FOUC and AA contrast holds. Resize 320 → 1920 → no horizontal scroll or overlap on home/post/tag/search/404. Run Lighthouse mobile → Accessibility ≥ 95. Enable `prefers-reduced-motion` → no non-essential animation plays.

- [X] T033 [US4] Audit and fix any colour that does not flow through tokens (search the codebase for `#`, `rgb(`, `hsl(` outside `tokens.css`). Replace each with the appropriate token variable. Re-run the WCAG contrast check from [data-model.md](./data-model.md) on both themes.
- [X] T034 [US4] Add `:focus-visible` outlines using `--focus` to every interactive element: links inside `PostCard`, the theme toggle, the search trigger, mobile nav button, Pagefind result links. Keyboard-tab through home → post → tag → 404 to verify no element is unreachable or has an invisible ring.
- [X] T035 [P] [US4] Add `aria-label`s where text is missing: search trigger ("Search"), theme toggle ("Toggle theme"), mobile nav toggle ("Open menu" / "Close menu" toggled by `aria-expanded`). Ensure heading hierarchy is single-H1-per-page on every template.
- [X] T036 [P] [US4] Verify responsive layout at the 8 standard breakpoints from spec Edge Cases (320, 375, 414, 768, 1024, 1280, 1440, 1920) on home, a post, a tag page, search results, 404. Fix any overflow with token-based padding adjustments (no magic numbers).
- [X] T037 [US4] Lighthouse mobile run on `npm run preview` for `/`, a representative post, `/tags/`, and `/tags/<tag>/`. Required scores per [plan.md §Performance Goals](./plan.md): LCP ≤ 2.5s, INP ≤ 200ms (TBT proxy in lab), CLS ≤ 0.1, Accessibility ≥ 95. If any fails, fix the specific cause noted by Lighthouse (commonly: font preload, image dimensions, contrast).

**Checkpoint**: All four user stories pass their acceptance scenarios. Constitution Principle IV budget verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and verification against the constitution + spec gates.

- [X] T038 [P] Delete the old standalone search section markup from `src/pages/index.astro` if any leftover from T024 remains; confirm no dead CSS rules in `global.css`.
- [X] T039 [P] Sweep `src/` for hardcoded font-family or font-size declarations outside `tokens.css` / `prose.css`; replace with tokens.
- [X] T040 Update `src/layouts/Post.astro`'s old inline `<style is:global>` block: delete it entirely (now handled by `tokens.css` + `prose.css`). Confirm no visual regression on a post.
- [X] T041 [P] Optional: create `src/pages/about.astro` (one short page about the blog using `Base.astro` and `.prose`). Skip if scope tightens — the URL map marks it optional.
- [X] T042 Run the full [quickstart.md](./quickstart.md) validation: build, URL diff against live sitemap (all existing post URLs must still resolve), JSON-LD rich-results check on home + a post, viewport sweep at all 8 breakpoints, keyboard pass, reduced-motion check, Lighthouse mobile budget on 4 page types.
- [X] T043 Re-check the Constitution gates in [plan.md §Constitution Check](./plan.md): each of the five principles passes against the shipped site. Note any deferred items in the PR description.

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 (Setup)**: No dependencies. Run first.
- **Phase 2 (Foundational)**: Depends on Phase 1. **Blocks all user-story phases.**
- **Phase 3 (US1)**: Depends on Phase 2. Independent of US2/US3/US4 thereafter.
- **Phase 4 (US2)**: Depends on Phase 2. May overlap with US1 once US1's `PostCard` (T023) is merged, since US2's `RelatedPosts` reuses it.
- **Phase 5 (US3)**: Depends on Phase 2 and reuses `PostCard` (from T023) — practically wait for US1 T023 before starting US3 implementation.
- **Phase 6 (US4)**: Depends on US1+US2+US3 having shipped the markup it audits.
- **Phase 7 (Polish)**: Depends on US1–US4.

### Within-story dependencies

- US1: T022, T023 in parallel → T024 (uses both) → T025.
- US2: T026 → T027 → T028.
- US3: T030, T031 in parallel; T029 and T032 independent of each other.
- US4: T033 → T034 (focus rings depend on tokens being clean); T035, T036 in parallel; T037 last.

### Parallel opportunities

- Phase 1: T002–T006 all `[P]`.
- Phase 2: T014 and T015 `[P]`; T007–T010 sequential within `src/styles/` (touching related files) but T011/T012/T013 can interleave with the style work.
- Phase 3: T022 `[P]` with T023 `[P]`.
- Phase 5: T030 `[P]` with T031 `[P]`.
- Phase 6: T035 `[P]` with T036 `[P]`.
- Phase 7: T038, T039, T041 `[P]`.

---

## Parallel Example: User Story 1

```text
# After Phase 2 is complete, kick off US1 in parallel where possible:

Task T022 [P] [US1]: Implement src/components/PostMeta.astro
Task T023 [P] [US1]: Implement src/components/PostCard.astro

# Then sequentially:
Task T024 [US1]: Rewrite src/pages/index.astro using PostCard + PostMeta
Task T025 [US1]: Restyle Search modal trigger and Pagefind container
```

---

## Implementation Strategy

### MVP first (User Story 1)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational) — the design system, schema, taxonomy, shell, and 404.
3. Complete Phase 3 (US1) — new homepage.
4. **Stop and validate**: the home page passes Spec User Story 1's three acceptance scenarios and the responsive sweep at 320/375/1440. Demoable.

### Incremental delivery after MVP

1. Add Phase 4 (US2) → every post page now ships with the new layout, related posts, and JSON-LD. **This is the second P1 and should land before any public launch announcement.**
2. Add Phase 5 (US3) → topic pages + restyled search.
3. Add Phase 6 (US4) → dark mode polish, full a11y/responsive audit, Lighthouse gate.
4. Phase 7 → polish + final constitution re-check.

### Parallel team strategy

With one dev: serial through the order above. With two: dev A runs US1; dev B runs US2 once `PostCard` (T023) lands; both converge into US3 and US4 once posts and home are stable.

---

## Notes

- `[P]` = different files, no incomplete dependencies.
- `[Story]` label maps a task to a Spec user story for traceability.
- No automated tests in scope — verification is build success + Lighthouse + quickstart.md sweep.
- Commit per task or per logical group (e.g. all of Phase 2's design-system tasks as one commit, then schema + taxonomy as another).
- Stop at any checkpoint to validate independently; the MVP is genuinely demoable after Phase 3.
- Avoid: introducing colour or font literals outside `tokens.css`; coupling a user-story phase to another story's tasks beyond the noted shared component (`PostCard`); adding any new third-party tracker or runtime dependency (constitution).
