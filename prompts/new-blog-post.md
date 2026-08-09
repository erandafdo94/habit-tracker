# Trigger: "generate a new blog"

When the user says **"generate a new blog"** (with or without a topic), follow this procedure. No placeholders to fill in — you do the research.

## 1. Pick a meaningful, SEO-worthy topic

This is a habit-science authority blog. The goal is not "another habit post" — it's the post that owns a real search query and strengthens the site's topical authority in habits. If the user supplied a topic, work on that. If they didn't, you pick, using the strategy below.

### 1a. Inventory and find the gap

- List `src/content/blog/` and read the frontmatter (title, tags, slug) to see what keywords the site already owns and which clusters are over- vs under-built.
- The site is currently **deep on habit mechanisms and routines** but **thin on the highest-demand, on-brand clusters below**. Prefer an under-built cluster over adding another mechanism explainer:

  | Cluster | State | Examples of untapped queries |
  |---|---|---|
  | **Habit tracker (tool intent)** | Thin — but it *is* the domain name | "best habit tracker apps", "habit tracker template / printable", "habit tracker notion", "how to use a habit tracker" |
  | **Build a *specific* habit** | Only `exercise-habit-guide` exists | "how to build a reading habit", "meditation habit", "journaling habit", "drink more water", "wake up early", "saving-money habit" |
  | **Break a *specific* bad habit** | Only one generic post | "how to stop procrastinating", "stop phone addiction", "quit sugar", "stop doomscrolling", "stop nail biting" |
  | **Examples / lists (snippet bait)** | Missing | "good daily habits to start", "atomic habits examples", "habit stacking examples", "keystone habit examples" |
  | **Atomic Habits brand cluster** | Only a summary + a vs post | "atomic habits cheat sheet", "habit scorecard", "habit contract", "never miss twice", "atomic habits examples" |

### 1b. Match the search intent (the single biggest ranking factor)

Before writing, decide what the searcher actually wants and match the post's **format, depth, and angle** to it. A commercial query answered with a think-piece will not rank. Read the intent from the keyword modifiers:

- **Informational** ("how to", "why", "what is", "how long") → teaching guide or explainer.
- **Comparison / commercial** ("best", "vs", "top", "alternative", "review") → ranked roundup or side-by-side with a clear recommendation.
- **List / example** ("examples", "ideas", "list of") → scannable, well-structured list that a featured snippet or AI Overview can lift verbatim.

Prefer **long-tail, specific intent** over broad head terms — matching a precise intent beats chasing volume, and the site can realistically rank for it.

### 1c. Vary the format

Most existing posts are how-to guides or book summaries. Deliberately rotate: how-to guide, framework explainer, comparison/"vs", ranked listicle, myth-busting/contrarian take, single-technique deep dive, specific-habit guide, or tool/app roundup. Pick the format the intent (1b) demands, and favour one that's under-used lately.

### 1d. Don't cannibalize; link the cluster

- **One primary keyword per post.** Check existing slugs and tags so you're not re-targeting a query the site already owns (watch the crowded `behaviour-change` cluster especially).
- Plan the internal links up front: the new post should link **up** to its pillar/parent post and **sideways** to 2–3 sibling posts in the same cluster. This hub-and-spoke linking is what makes Google read the cluster as authoritative.

State the chosen topic, its cluster, the intent type, and a one-line reason before writing, so the user can redirect if they disagree.

## 2. Research the topic

The site is an authority blog in habit science. The bar is research-grounded, not surface-level.

- Pull from named studies, books, and frameworks where appropriate (e.g., Lally et al. 2010 for habit formation, Duhigg/Clear for the cue-routine-reward loop, Festinger 1957 for cognitive dissonance, the Fogg behaviour model).
- Cite the source by name when the claim is non-obvious. No invented studies. No fake statistics. If a number is approximate or from memory, say so.
- If web access is available and the topic benefits from a fresh source, use it; otherwise work from training-cutoff knowledge and mark any figure as approximate.

## 3. Affiliate links are optional — only when they genuinely fit

**Most posts do not need an Amazon affiliate link, and that's fine.** Affiliate placement is opportunistic, not a requirement. Forcing a book into a post that isn't about that book reads as spam to both readers and Google, and dilutes the affiliate signal on the posts where it belongs. Tool roundups, tactical how-tos, science explainers, and list posts will often have **no** book CTA at all — don't invent a reason for one.

Add an affiliate link only when a book or product is **naturally central** to the topic (e.g. a book summary, or a paper-tracking post where a journal is the actual subject):

- Read [`prompts/amazon-affiliates.md`](prompts/amazon-affiliates.md). Use only entries with a **real URL** — skip any `TBD` line.
- At most one bottom `book-cta` block per post, and only if a genuinely relevant entry exists. Match the pattern in `src/content/blog/atomic-habits-summary.md`.
- Items (journal, planner) link inline where the product is the natural subject, not shoehorned.
- If nothing fits, **skip it entirely.** A post with no affiliate link is a perfectly good outcome.

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
- Report back: chosen topic + cluster + intent type + format, one-line reason, final word count, internal links used (and which pillar it links up to), and any affiliate link used — or note explicitly that none fit.
- Remind the user to create the hero image at `public/og/<slug>.png` (1200×630). Until that file exists, `og:image` and JSON-LD `image` stay omitted.
