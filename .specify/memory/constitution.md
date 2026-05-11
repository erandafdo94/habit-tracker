<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Rationale: MINOR bump. Added a new NON-NEGOTIABLE punctuation rule under
Content & Technical Constraints banning the em-dash (U+2014) from any
published surface, with rationale (anti-AI-voice) and enforcement (pre-
publish grep). Materially expanded guidance, no removals or incompatible
changes, so MINOR (not MAJOR).

Earlier history:
  1.0.0 (2026-05-11): Initial ratification.

Modified principles: none in this revision
Added principles: none in this revision
Added sections:
  - Content & Technical Constraints, "Punctuation (NON-NEGOTIABLE)" bullet
Removed sections: none

Templates / artifacts reviewed:
  ✅ .specify/templates/plan-template.md, generic Constitution Check gate; no
     edits required (gates resolve from this file at plan time).
  ✅ .specify/templates/spec-template.md, no principle-driven mandatory
     sections to add at this time.
  ✅ .specify/templates/tasks-template.md, no principle-driven task
     categories to add at this time.
  ✅ CLAUDE.md, points contributors to the current plan; no edits required.
  ⚠ README.md, pending: add a short pointer to this constitution if/when
     contributor docs expand.

Deferred / follow-up TODOs: none.
-->

# Atomic Blog Constitution

## Core Principles

### I. Reader-First, Evidence-Based Content

Every post MUST help a real reader build a better habit or break a worse one.
Content MUST be actionable: each article either teaches a concrete technique,
explains a mechanism the reader can apply, or debunks a misconception with a
clearer alternative. Claims about behavior, psychology, neuroscience, or
outcomes MUST be grounded in cited sources (peer-reviewed research, recognized
books, or named expert practitioners). Speculation, motivational filler, and
unsourced statistics are prohibited. Rationale: the blog's authority depends on
trustworthy, useful advice; readers and search engines both reward it.

### II. SEO Excellence (NON-NEGOTIABLE)

Every published page MUST ship with:
- A unique, search-intent-aligned `<title>` (≤ 60 chars) and meta description
  (≤ 160 chars).
- A single H1 matching the page's primary topic, with a coherent H2/H3 outline.
- A canonical URL, descriptive slug (kebab-case, no stop-word stuffing), and
  an `og:`/`twitter:` social card.
- Descriptive `alt` text on every content image; images served in a modern
  format (AVIF/WebP) with explicit width/height.
- Internal links to at least two related posts where they exist, and outbound
  links to primary sources when claims are made.
- Schema.org structured data appropriate to the page type (`Article` /
  `BlogPosting`, plus `FAQPage` or `HowTo` when applicable).
- Inclusion in `sitemap.xml` and crawlability (no `noindex` on production
  posts unless deliberately gated).

Keyword stuffing, cloaking, AI-generated boilerplate, and any tactic that
would violate Google's Spam Policies are prohibited. Rationale: organic
discovery is the primary growth channel; technical SEO hygiene is cheap to
maintain and expensive to retrofit.

### III. Editorial Quality & Source Integrity

Drafts MUST pass a self-review for clarity, accuracy, and structure before
publish. Every non-obvious factual claim MUST be attributable to a named
source; quotes MUST be verbatim and linked. Plagiarism is forbidden; rephrased
ideas MUST credit their origin. AI-assisted drafting is permitted only when
the author verifies every claim, edits for voice, and takes responsibility
for the final text. Rationale: in the habits/self-improvement niche, low
editorial standards are the norm, holding a higher bar is the moat.

### IV. Performance, Accessibility & Core Web Vitals

Production builds MUST meet, on the mid-tier mobile profile:
- Largest Contentful Paint (LCP) ≤ 2.5s
- Interaction to Next Paint (INP) ≤ 200ms
- Cumulative Layout Shift (CLS) ≤ 0.1
- Lighthouse Accessibility score ≥ 95

All interactive elements MUST be keyboard reachable, colour contrast MUST
meet WCAG 2.1 AA, and content MUST remain readable with JavaScript disabled
(the site is statically generated with Astro, no client-side rendering of
core article content). Heavy third-party scripts (chat widgets, ad networks,
multi-pixel trackers) MUST NOT be added without an explicit performance
budget review. Rationale: search ranking, conversion, and reader trust all
degrade with slow or inaccessible pages.

### V. Content Lifecycle & Maintenance

Every post MUST display a publish date and, when edited materially, a
"last updated" date. Posts older than 18 months MUST be reviewed for
accuracy and SEO performance; stale content MUST be either refreshed,
consolidated, redirected (301), or unpublished, never silently abandoned.
Broken outbound links MUST be repaired or removed within one review cycle.
URL slugs, once published, MUST NOT change without a 301 redirect from the
old path. Rationale: evergreen content is the asset class of this blog; an
unmaintained archive erodes both rankings and credibility.

## Content & Technical Constraints

- **Stack**: Astro (static site generation) with `@astrojs/sitemap` and
  Pagefind for on-site search. Changes to the stack require a constitution
  amendment if they affect Principle IV (performance) or Principle II (SEO).
- **Topical scope**: Building better habits, breaking bad habits, and the
  adjacent science (behaviour change, motivation, identity, environment
  design). Off-topic posts are out of scope.
- **Voice**: Plain English, second person, short sentences. No hype, no
  hustle-culture clichés, no fabricated personal anecdotes.
- **Punctuation (NON-NEGOTIABLE)**: The em-dash character (`U+2014`) MUST NOT
  appear anywhere in published content, page copy, component text, page
  titles, meta descriptions, alt text, or commit/PR copy. Use a comma, a
  period, a colon, parentheses, or a hyphen-minus (`-`) instead, whichever
  reads most naturally. The en-dash (`U+2013`) is also prohibited in prose;
  it remains allowed only in numeric ranges (e.g. `60-75`, written with a
  hyphen-minus is preferred). Rationale: em-dashes are a strong tell of
  AI-generated text and undercut the blog's editorial voice. Enforcement: a
  pre-publish grep MUST find zero `—` or `–` characters under `src/` and
  in any new Markdown post.
- **Analytics & privacy**: Analytics MUST be limited to first-party or
  privacy-respecting tooling already in place; no new trackers without
  performance and privacy review.
- **Affiliate & sponsored content**: Permitted only with explicit `rel`
  attributes (`sponsored` / `nofollow` as appropriate) and a visible
  disclosure at the top of the post.

## Editorial & Publication Workflow

1. **Draft** in `src/content/blog/` as Markdown with full frontmatter
   (title, description, publish date, updated date when applicable, tags,
   canonical hero image with alt text).
2. **Self-review** against Principles I–III: claim sourcing, structure,
   readability, keyword/intent alignment, internal links.
3. **Technical check** against Principle II and IV: title/description
   length, slug, schema, image weights, Lighthouse run on the built page.
4. **Publish** by merging to `main`; the static build, sitemap, and
   Pagefind index regenerate on deploy.
5. **Post-publish**: monitor search performance; schedule into the
   18-month refresh queue (Principle V).

A post that fails any gate MUST be fixed or held; gates are not waived
for velocity.

## Governance

This constitution supersedes ad-hoc editorial and engineering practice for
this repository. All pull requests, content or code, MUST verify
compliance with the principles above; reviewers SHOULD cite the specific
principle when requesting changes.

**Amendments** require: (a) a PR modifying this document with a written
rationale, (b) a corresponding version bump per the policy below, and
(c) propagation of any downstream changes to `.specify/templates/*` and
contributor-facing docs in the same PR.

**Versioning policy** (semantic):
- **MAJOR**: A principle is removed, redefined incompatibly, or governance
  rules change in a way prior PRs would no longer satisfy.
- **MINOR**: A new principle or section is added, or existing guidance is
  materially expanded.
- **PATCH**: Wording clarifications, typo fixes, or non-semantic edits.

**Compliance review**: principles are checked at PR time and during the
18-month content refresh cycle (Principle V). Violations discovered after
merge MUST be tracked and remediated; they are not retroactively
grandfathered.

**Version**: 1.1.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
