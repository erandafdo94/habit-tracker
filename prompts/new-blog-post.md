# Trigger: "generate a new blog"

When the user says **"generate a new blog"** (with or without a topic), follow this procedure. No placeholders to fill in — you do the research.

## 1. Pick or refine the topic

If the user supplied a topic, work on that. If they didn't, you pick:

- List `src/content/blog/` to inventory existing posts and the keywords they target.
- Identify a gap or higher-leverage angle that isn't already covered. Prefer:
  - High-intent question keywords ("how to…", "why does…", "what is…") the site doesn't already own.
  - Comparison or "vs" intent the site doesn't cover yet.
  - Long-tail subtopics that branch off the existing pillar posts.
- Don't cannibalize existing posts. Check the current taxonomy clusters (habit tracking, habit formation, identity, breaking bad habits, routines, book summaries) before picking.

State the topic you chose and a one-line reason before writing, so the user can redirect if they disagree.

## 2. Research the topic

The site is an authority blog in habit science. The bar is research-grounded, not surface-level.

- Pull from named studies, books, and frameworks where appropriate (e.g., Lally et al. 2010 for habit formation, Duhigg/Clear for the cue-routine-reward loop, Festinger 1957 for cognitive dissonance, the Fogg behaviour model).
- Cite the source by name when the claim is non-obvious. No invented studies. No fake statistics. If a number is approximate or from memory, say so.
- If web access is available and the topic benefits from a fresh source, use it; otherwise work from training-cutoff knowledge and mark any figure as approximate.

## 3. Pick affiliate links from the source-of-truth file

Read [`prompts/amazon-affiliates.md`](prompts/amazon-affiliates.md). That file lists books with real URLs and entries marked `TBD`.

- Use only entries with a real URL. Skip `TBD` lines.
- Pick books that are genuinely relevant to the topic, not as filler.
- One bottom `book-cta` block per post, only if a relevant book exists in the file. Match the pattern in `src/content/blog/atomic-habits-summary.md`.
- If nothing in the file fits, skip the CTA entirely.

## 4. Write the post

Follow the "Blog post conventions (SEO)" section in [`CLAUDE.md`](CLAUDE.md). The short version:

- 1,500–2,500 words. Substance over filler.
- Opening hook (2–3 sentences). **No H1 in the body** — the layout emits H1 from frontmatter `title`. Start with the hook, then H2s.
- 4–7 H2 sections; H3s only when they help. One table OR one numbered list if it clarifies.
- End with `## FAQ` (3–5 Q&A pairs).
- 3–5 inline internal links to other posts in `src/content/blog/`.
- Voice: clear, opinionated, no marketing fluff. British spellings ("behaviour", "automaticity", "customisable", "operationalise") to match the existing house style.

Frontmatter (skip `heroImage` until the 1200×630 PNG exists at `public/og/<slug>.png`):

```yaml
---
title: "<≤60-char title>"
description: "<≤155-char description containing the primary keyword>"
pubDate: "<today YYYY-MM-DD>"
slug: "<kebab-case-slug>"
tags: [<1–4 from the schema enum>]
---
```

Tag enum (from `src/content.config.ts`): `behavior-change`, `breaking-bad-habits`, `habit-stacking`, `habit-tracking`, `identity`, `motivation`, `routines`, `book-summary`.

## 5. Save, verify, report

- Save at `src/content/blog/<slug>.md`.
- Run `npm run build` to confirm Zod validates the frontmatter and the post compiles.
- Report back: chosen topic + reason, final word count, internal links used, books from the affiliate file referenced (if any).
- Remind the user to create the hero image at `public/og/<slug>.png` (1200×630). Until that file exists, `og:image` and JSON-LD `image` stay omitted.
