<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/001-redesign-site/plan.md
<!-- SPECKIT END -->

## Blog post conventions (SEO)

Posts live in `src/content/blog/*.md`; schema in `src/content.config.ts`. When creating or editing a post:

- **Length:** 1,500–2,500 words. Posts under ~1,200 words rarely rank for competitive habit-formation queries — the original 14 posts were 533–825 words and did not perform in Google Search Console.
- **`heroImage` is required for SEO** even though the Zod schema marks it optional. The OG image is generated automatically: run `node scripts/generate-og.mjs` to (re)build a branded 1200×630 PNG for every post into `public/og/<slug>.png` from the post's frontmatter `title`. After running it, add the `heroImage` frontmatter block pointing to `/og/<slug>.png`. Without the block, `og:image` and JSON-LD `image` are omitted, killing rich-result eligibility and social CTR.
- **Description:** keep under 155 chars. Schema permits 220 but Google truncates around 155.
- **`updatedDate`:** set on any meaningful revision. Drives JSON-LD `dateModified` and signals freshness.
- **Headings:** never write an H1 in the markdown body. The layout emits `<h1>` from frontmatter `title`. Use H2 for sections, H3 for sub-sections only.
- **Internal links:** 3–5 inline links to other `/blog/<slug>` posts where natural. Helps SEO and keeps readers on-site.
- **One primary keyword per post.** Before adding a new post, scan existing slugs for keyword overlap to avoid cannibalization (e.g. habit-tracking, habit-formation, and atomic-habits clusters already exist).
- **Affiliate links:** inline markdown links to `amzn.to` (`[*Book*](https://amzn.to/...)`) are auto-tagged with `rel="sponsored nofollow noopener" target="_blank"` by the `rehype-external-links` plugin in `astro.config.mjs` — no manual attributes needed. The styled bottom `book-cta` button still needs its raw `<a>` tag with `rel="sponsored nofollow noopener" target="_blank"` written by hand (the plugin can't add its `class`). Match the pattern in `src/content/blog/atomic-habits-summary.md`.
- **Title format:** the layout renders `${title} | atomic`. Keep frontmatter `title` under ~60 chars so the rendered title stays under Google's ~70-char SERP cutoff.
- **FAQ section:** end new posts with an `## FAQ` H2 containing 3–5 Q&A pairs. Helps long-tail capture and sets up FAQ schema later.
- **Tags:** must come from the enum in `src/content.config.ts` (`behavior-change`, `breaking-bad-habits`, `habit-stacking`, `habit-tracking`, `identity`, `motivation`, `routines`, `book-summary`). 1–4 per post.

## Generating a new post

**Trigger phrase: "generate a new blog"** (with or without a topic). When the user says this, follow the procedure in [`prompts/new-blog-post.md`](prompts/new-blog-post.md). No placeholders for the user to fill in — you research the topic, pick affiliate links from `prompts/amazon-affiliates.md`, write the post, and report back.

Affiliate links are maintained by the user in [`prompts/amazon-affiliates.md`](prompts/amazon-affiliates.md). Only entries with a real URL are usable; skip any line marked `TBD`.
