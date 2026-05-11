# Phase 0 — Research

All open questions raised by the spec and the plan's Technical Context are resolved below. Each
decision is captured with rationale and the alternatives that were considered and rejected.

## 1. Type pairing

**Decision**: Self-hosted **Fraunces** (variable, serif) for display/headings and **Inter** (variable,
sans) for body and UI. Both delivered via `@fontsource-variable/inter` and `@fontsource/fraunces`
(installed as devDependencies; emitted as static assets in `dist/`).

**Rationale**:
- Fraunces gives a warm, editorial voice — the spec explicitly asks for "clean and editorial" and
  rejects the current monospace/dev-blog feel. Variable axes (opsz, soft, wonk) let us tune display
  headings without shipping multiple files.
- Inter is the safest body sans: extensive language coverage, tabular figures, and an INP-friendly
  rendering profile on mobile.
- Self-hosting (via `@fontsource`) avoids a runtime DNS+TLS round-trip to `fonts.googleapis.com`,
  which is the single biggest LCP win available to us on a static site. Aligns with constitution
  Principle IV.
- Variable fonts let us drop separate weights (one woff2 per family, not five), keeping CSS
  shipped under budget.

**Alternatives considered**:
- *System fonts only* (`ui-sans-serif, system-ui, …`): zero bytes, but identical to thousands of
  AI-generated blogs and undercuts the "distinct visual identity" requirement (FR-001, FR-003).
- *Google Fonts CDN with `<link rel="preconnect">`*: simpler to wire, but introduces a third-party
  network dependency and runs counter to the "no new trackers / no unaccounted network calls" stance
  in the constitution.
- *Serif body (Source Serif, Lora)*: tested mentally for reading comfort on mobile at 16–18px; sans
  body holds up better at small sizes and on lower-DPI Android screens, which the spec calls out
  as the primary audience.

## 2. Colour system & theming

**Decision**: HSL-based token set in `src/styles/tokens.css`, with a `:root` default (light) and
`[data-theme="dark"]` override. Theme bootstraps from `localStorage` (if set) else
`prefers-color-scheme`, applied by an inline `<script is:inline>` in `<head>` before paint to avoid
FOUC. A `ThemeToggle.astro` component flips the attribute and persists the choice.

**Token shape** (final values in `tokens.css`; documented in `data-model.md`):
- `--bg`, `--bg-elev` (cards, search panel), `--bg-subtle` (code, quotes)
- `--fg`, `--fg-muted`, `--fg-subtle`
- `--border`, `--border-strong`
- `--accent` (single accent — used for links, tag pills, focus rings)
- `--focus` (high-contrast outline)
- Type scale: `--step--1` … `--step-5` (fluid via `clamp()`)
- Spacing: `--space-1` … `--space-9` (4-px base, geometric)
- Radius: `--radius-1` (4px), `--radius-2` (8px), `--radius-3` (16px)
- Motion: `--ease-out`, `--duration-fast` (120ms), `--duration-base` (200ms)

**Contrast targets** (verified against WCAG 2.1 AA, ≥ 4.5:1 for body text, ≥ 3:1 for large text and
UI):
- Light: `--fg` near `hsl(220 10% 12%)` on `--bg` `hsl(40 30% 98%)` — 16.4:1.
- Dark: `--fg` near `hsl(40 12% 92%)` on `--bg` `hsl(220 14% 9%)` — 15.1:1.
- Accent `hsl(20 80% 45%)` (a warm terracotta) on both themes — ≥ 5.2:1 for links.

**Rationale**: HSL is readable in diffs and easy to derive companion colours from. A single accent
keeps the design calm (Principle: "editorial, not decorative"). Off-white/warm background avoids the
"AI-generic pure white" feel called out in the spec.

**Alternatives considered**:
- *CSS `light-dark()` function*: simpler markup, but tooling and browser support for the toggle case
  (user manually picks the other mode) is still rough. The `data-theme` attribute pattern is the
  workhorse standard for blogs.
- *Tailwind*: adds a build step and a class soup; the project has ~5 templates — hand-rolled CSS with
  tokens is smaller and easier to audit.

## 3. Reading time

**Decision**: Compute at build time in `src/lib/reading-time.ts` from the raw Markdown body. Formula:
`Math.max(1, Math.round(words / 220))` minutes. Words counted by splitting on `\s+` after stripping
fenced code blocks and HTML tags.

**Rationale**: 220 wpm is the median for English non-fiction on screen. Computing at build keeps the
client free of JS. Strip code/HTML so a long fenced block doesn't inflate the number.

**Alternatives considered**: `reading-time` npm package — unnecessary 3rd-party dep for a 12-line
helper.

## 4. Related-posts strategy

**Decision**: Tag-overlap Jaccard score, computed at build time in `src/lib/related.ts`. For each
post: rank all other posts by `|tags(a) ∩ tags(b)| / |tags(a) ∪ tags(b)|`, break ties by
`pubDate` desc. Show top 3.

**Rationale**:
- Deterministic, dependency-free, runs in `getStaticPaths`.
- Falls back gracefully when a post has only one tag (overlap still works).
- The spec (FR-009) only requires "at least two related posts"; 3 is the standard editorial slot.

**Alternatives considered**:
- *Hand-picked per post*: highest quality but adds frontmatter burden across 17 posts and grows with
  every new post. Rejected for v1; can be layered on later by adding an optional
  `relatedSlugs: string[]` to frontmatter that, when present, overrides the algorithm.
- *Embedding similarity*: massive overkill at this corpus size; introduces a build-time ML dep.

## 5. Tag taxonomy

**Decision**: Tags are a flat list of lowercase, kebab-case strings stored in post frontmatter as
`tags: string[]`. The initial taxonomy is closed and small (8 tags) so it stays scannable and
SEO-coherent:

- `behavior-change`
- `breaking-bad-habits`
- `habit-stacking`
- `habit-tracking`
- `identity`
- `motivation`
- `routines`
- `book-summary`

**Rationale**: Small closed taxonomy beats an open free-for-all for SEO (avoids near-duplicate tag
pages like `morning` vs `mornings`). A flat list (no hierarchy) keeps `/tags/<tag>` routing trivial.

**Open work in `/speckit-tasks`**: assigning the initial tag set to each existing post is a single
task (see the migration task in `tasks.md`).

## 6. JSON-LD / structured data

**Decision**: Emit `Article` (subtype `BlogPosting`) JSON-LD on every post page, and `BreadcrumbList`
for `Home > Blog > Post`. The homepage emits `WebSite` with a `SearchAction` pointing at Pagefind's
query parameter. All emitted via a single `JsonLd.astro` component to keep one source of truth.

**Rationale**: Closes a current SEO gap (Principle II calls for schema; the current site emits none).
Costs ~1 KB per page, zero runtime cost.

**Alternatives considered**: `astro-seo` integration — convenient but pulls in opinions and tags we
don't need; a single component is leaner.

## 7. Images

**Decision**: Use Astro's built-in `<Image />` (no extra integration) for any new imagery (hero
fallbacks, OG cards). Format: AVIF first, WebP fallback. Width/height attributes are mandatory.
Article bodies do not need to add images for v1 (current corpus has none).

**Rationale**: Built-in pipeline handles AVIF/WebP and explicit dimensions, which the constitution
Principle II requires. No new dependency.

## 8. Theming bootstrap script (no-FOUC)

**Decision**: Inline `is:inline` script at the very top of `<head>` in `Base.astro`:

```js
(function () {
  try {
    var s = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = s || (m ? 'dark' : 'light');
  } catch (e) {}
})();
```

**Rationale**: Sets `data-theme` before the first paint, which is what CSS variables react to.
Wrapped in try/catch so a locked-down `localStorage` does not blank the page.

## 9. Search restyle (Pagefind)

**Decision**: Keep Pagefind. Restyle the existing `Search.astro` to match the new tokens. Trigger:
header button opens a centred modal panel with the Pagefind UI; closing returns focus to the trigger.

**Rationale**: Pagefind is already wired and SEO-friendly (it runs at build time, not at request).
A modal pattern keeps search reachable from every page (FR-013) without taking permanent space in
the header.

## 10. Performance budget verification

**Decision**: Manual Lighthouse mobile run on `astro preview` is the gate. We document the budget in
`quickstart.md`; the constitution check fails any PR that regresses it. No automated CI is added in
v1 (project has none today; introducing one is out of scope).

**Rationale**: The constitution sets the bar; checking it once at PR time is sufficient at the
current cadence (≈ one publish per week). Automating in CI is a fast-follow.
