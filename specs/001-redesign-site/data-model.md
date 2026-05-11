# Phase 1 — Data Model

Three first-class entities for the redesign: **Post** (extended), **Tag**, and **Design Tokens**.
The first two are content; the third is the design system the markup binds to.

## Post (extended)

Defined in `src/content.config.ts` as a Zod schema on the `blog` collection. Existing fields are
preserved so current Markdown files keep validating; new fields are additive and (where appropriate)
optional so backfill is incremental.

| Field         | Type       | Required | Default | Notes |
|---------------|------------|----------|---------|-------|
| `title`       | string     | yes      | —       | H1 + `<title>`; ≤ 60 chars (Principle II). |
| `description` | string     | yes      | —       | Meta description + card deck; ≤ 160 chars. |
| `pubDate`     | ISO date string | yes | —       | `YYYY-MM-DD`. Validated as parseable. |
| `updatedDate` | ISO date string | no  | —       | Shown as "Updated …" when present and ≠ `pubDate`. Required by constitution Principle V. |
| `slug`        | string     | yes      | —       | Kebab-case. Must match filename stem; enforced by lint task in `/speckit-tasks`. |
| `tags`        | string[]   | yes      | —       | 1–4 tags from the closed taxonomy (see Tag entity). Lowercase kebab-case. |
| `featured`    | boolean    | no       | `false` | When `true`, post is eligible for the homepage "featured" slot. |
| `heroImage`   | object     | no       | —       | `{ src, alt, width, height }`. Reserved for future use; not rendered in v1. |

**Validation rules**:
- `tags` MUST be non-empty and every value MUST be in the closed taxonomy list (Zod `z.enum`).
- `updatedDate`, when present, MUST be ≥ `pubDate`.
- `description` length: warn at build time if > 160 chars (Astro plugin or simple `console.warn` in
  `content.config.ts` is acceptable).
- At most one post may be `featured: true` at a time; the homepage picks the most recent if multiple
  exist (defensive, not enforced by schema).

**State transitions**: Posts are append-only Markdown files; no runtime state. Editing a post to fix
content bumps `updatedDate`. Slugs are immutable once published (Principle V — would otherwise need a
301 redirect, which is out of scope for v1).

## Tag

Tags are not files on disk — they are derived at build time from the union of `tags[]` across all
posts. The closed taxonomy (from `research.md` §5) is the source of truth and is encoded in two
places that must stay in sync:

1. The Zod `z.enum([...])` in `src/content.config.ts`.
2. A `TAGS` constant exported from `src/lib/tags.ts` that the tag index page (`/tags/`) and the
   homepage topic nav read from.

| Field          | Type   | Notes |
|----------------|--------|-------|
| `slug`         | string | The kebab-case tag string itself; also the URL path segment. |
| `label`        | string | Human-readable label (e.g. `breaking-bad-habits` → "Breaking bad habits"). |
| `description`  | string | One-line description used on `/tags/<slug>` for SEO + UX. |
| `posts`        | Post[] | Derived: all posts whose `tags` includes this `slug`, sorted `pubDate` desc. |

**Initial taxonomy** (see `research.md` §5 for rationale):

| Slug                   | Label                  | One-line description |
|------------------------|------------------------|----------------------|
| `behavior-change`      | Behaviour change       | The mechanics of how habits form and stick. |
| `breaking-bad-habits`  | Breaking bad habits    | Quitting, avoiding, and replacing habits you don't want. |
| `habit-stacking`       | Habit stacking         | Using existing routines as triggers for new habits. |
| `habit-tracking`       | Habit tracking         | Measuring habits without making tracking the habit. |
| `identity`             | Identity               | Becoming the kind of person who does the habit. |
| `motivation`           | Motivation             | When motivation helps, when it doesn't, and what to do instead. |
| `routines`             | Routines               | Mornings, evenings, and the routines that compound. |
| `book-summary`         | Book summaries         | Distilled notes from the books worth keeping. |

## Design Tokens

Tokens live in `src/styles/tokens.css` as CSS custom properties on `:root` (light) with overrides on
`[data-theme="dark"]`. They are the contract every component reads from; no component hardcodes a
colour, font, spacing, or radius value.

### Colour

| Token             | Light                | Dark                  | Use |
|-------------------|----------------------|-----------------------|-----|
| `--bg`            | `hsl(40 30% 98%)`    | `hsl(220 14% 9%)`     | Page background |
| `--bg-elev`       | `hsl(40 30% 95%)`    | `hsl(220 12% 13%)`    | Cards, search panel |
| `--bg-subtle`     | `hsl(40 30% 92%)`    | `hsl(220 10% 16%)`    | `code`, `<pre>`, quote rail |
| `--fg`            | `hsl(220 10% 12%)`   | `hsl(40 12% 92%)`     | Body text |
| `--fg-muted`      | `hsl(220 8% 38%)`    | `hsl(40 8% 68%)`      | Meta, captions |
| `--fg-subtle`     | `hsl(220 8% 55%)`    | `hsl(40 6% 52%)`      | Dividers' adjacent text |
| `--border`        | `hsl(40 10% 86%)`    | `hsl(220 8% 22%)`     | Hairlines |
| `--border-strong` | `hsl(40 10% 70%)`    | `hsl(220 8% 34%)`     | Card edges on hover |
| `--accent`        | `hsl(20 80% 45%)`    | `hsl(20 80% 60%)`     | Links, tag pills, focus |
| `--focus`         | `hsl(220 90% 50%)`   | `hsl(220 90% 70%)`    | Keyboard focus ring |

### Typography

| Token         | Value                                                                 |
|---------------|-----------------------------------------------------------------------|
| `--font-sans` | `"Inter Variable", ui-sans-serif, system-ui, -apple-system, sans-serif` |
| `--font-serif`| `"Fraunces", ui-serif, Georgia, serif`                                |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace`                 |
| `--step--1`   | `clamp(0.83rem, 0.80rem + 0.15vw, 0.89rem)`                           |
| `--step-0`    | `clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem)` (body) |
| `--step-1`    | `clamp(1.20rem, 1.10rem + 0.50vw, 1.42rem)` |
| `--step-2`    | `clamp(1.44rem, 1.25rem + 0.95vw, 1.80rem)` |
| `--step-3`    | `clamp(1.73rem, 1.40rem + 1.65vw, 2.27rem)` |
| `--step-4`    | `clamp(2.07rem, 1.55rem + 2.60vw, 2.86rem)` |
| `--step-5`    | `clamp(2.49rem, 1.70rem + 3.95vw, 3.61rem)` (hero only) |
| `--leading-body`  | `1.7` |
| `--leading-tight` | `1.2` |
| `--measure`       | `66ch` (article column) |

### Spacing (4-px base, geometric)

`--space-1` `4px`, `--space-2` `8px`, `--space-3` `12px`, `--space-4` `16px`,
`--space-5` `24px`, `--space-6` `32px`, `--space-7` `48px`, `--space-8` `64px`, `--space-9` `96px`.

### Radius & motion

`--radius-1` `4px`, `--radius-2` `8px`, `--radius-3` `16px`.
`--ease-out` `cubic-bezier(0.2, 0.8, 0.2, 1)`, `--duration-fast` `120ms`, `--duration-base` `200ms`.
All animations gated by `@media (prefers-reduced-motion: no-preference)`.

## Relationships

- `Post` ↔ `Tag`: many-to-many via the `tags` field; resolved at build into `Tag.posts`.
- `Post` self-referential via `RelatedPosts.astro`, computed from `Tag` overlap (see
  `research.md` §4) — not stored in the data model.
- `Design Tokens` are referenced by every component but never by content files.
