# Prompt — generate a new blog post for atomic

Fill in the placeholders below, then paste the whole block (from the `---` divider down) into a Claude Code conversation. The output is a single `.md` file at `src/content/blog/{{SLUG}}.md` plus a reminder to create the hero image.

---

You are writing a blog post for atomichabittracker.com, a habit-tracking product site. The blog establishes authority in habit science and behavior change. Tone: clear, direct, slightly opinionated. No hedging or marketing fluff. Cite research lightly when relevant.

Follow the conventions in `CLAUDE.md` under "Blog post conventions (SEO)". The key constraints are repeated below.

## Inputs

- **Primary keyword:** {{PRIMARY_KEYWORD}}
- **Search intent:** {{informational | how-to | comparison | listicle | definition}}
- **Working title (≤60 chars):** {{TITLE}}
- **Slug (kebab-case, must match the file name):** {{SLUG}}
- **Tags** (1–4 from this exact list: `behavior-change`, `breaking-bad-habits`, `habit-stacking`, `habit-tracking`, `identity`, `motivation`, `routines`, `book-summary`): {{TAGS}}
- **PubDate (today, YYYY-MM-DD):** {{YYYY-MM-DD}}

## Amazon affiliate links

Use these wherever a book is mentioned. Inline format: `[*Book Title*]({{AMZN_LINK_X}})`. If you use a raw `<a>` (e.g. in the bottom CTA block), include `rel="sponsored nofollow noopener" target="_blank"`.

1. **{{BOOK_1_TITLE}}** — {{AMZN_LINK_1}}
2. **{{BOOK_2_TITLE}}** — {{AMZN_LINK_2}}
3. **{{BOOK_3_TITLE}}** — {{AMZN_LINK_3}}
4. **{{BOOK_4_TITLE}}** — {{AMZN_LINK_4}}
5. **{{BOOK_5_TITLE}}** — {{AMZN_LINK_5}}

End the post with a "Get the book" CTA block linking to whichever of the five is most relevant. Pattern to copy from `src/content/blog/atomic-habits-summary.md`:

```html
<div class="book-cta">
  <span class="book-cta-title">Get the book</span>
  <span class="book-cta-book">{{BOOK_TITLE}} by {{AUTHOR}}</span>
  <a class="amazon-btn" href="{{AMZN_LINK_X}}" rel="sponsored nofollow noopener" target="_blank">Buy on Amazon</a>
  <p class="amazon-disclosure">Affiliate link. I earn a small commission at no cost to you.</p>
</div>
```

## Requirements

- **Length:** 1,500–2,500 words. Substance over filler — no padding to hit word count.
- **Structure:**
  1. Opening hook (2–3 sentences). Counterintuitive claim or specific tension.
  2. 4–7 H2 sections, each a distinct angle on the keyword.
  3. H3 sub-sections only where they aid scanning.
  4. Include **either** one table **or** one numbered list, only if it clarifies the content.
  5. End with `## FAQ` containing 3–5 Q&A pairs targeting related long-tail queries.
  6. End with the affiliate CTA block above.
- **Headings:** do NOT write an H1 in the body. The layout emits `<h1>` from frontmatter `title`. Start the body with the hook paragraph, then H2s.
- **Internal links:** include 3–5 inline links to other posts in `src/content/blog/` where the topic naturally references them. Format: `[anchor text](/blog/<slug>)`. Run `ls src/content/blog/` first to see what's available.
- **Avoid cannibalization:** before writing, check whether an existing post already targets `{{PRIMARY_KEYWORD}}` or a near-synonym. If it does, propose how this post differs (sub-angle, intent, audience) or recommend updating the existing post instead.

## Output

Write the file at `src/content/blog/{{SLUG}}.md` with this exact frontmatter shape:

```yaml
---
title: "{{TITLE}}"
description: "{{<155-char description containing the primary keyword>}}"
pubDate: "{{YYYY-MM-DD}}"
slug: "{{SLUG}}"
tags: [{{TAGS}}]
heroImage:
  src: "/og/{{SLUG}}.png"
  alt: "{{<short descriptive alt text>}}"
  width: 1200
  height: 630
---
```

Then the markdown body (no H1).

After saving, remind me to create the hero image at `public/og/{{SLUG}}.png` (1200×630 PNG). Until that file exists, `og:image` and the JSON-LD `image` field will be omitted from the rendered post.
