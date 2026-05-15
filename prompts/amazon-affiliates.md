# Amazon affiliate links

Source of truth for affiliate links used in blog posts. Edit this file as you collect new links.

## Rules for Claude

- Only use entries with a real URL. **Skip any entry marked `TBD`** — do not link to a placeholder.
- Reference a book inline (`[*Book Title*](URL)`) only where it's genuinely relevant to the post topic, not as filler.
- Include at most one bottom `book-cta` block per post, with the single most relevant book. Match the existing pattern in `src/content/blog/atomic-habits-summary.md`.
- Always use `rel="sponsored nofollow noopener" target="_blank"` on the affiliate `<a>` tag.
- If no entry in this file fits the topic, skip the affiliate CTA entirely. Don't force one in.

## Books

- **Atomic Habits** by James Clear — https://amzn.to/42ZplQx
- **The Power of Habit** by Charles Duhigg — TBD
- **Tiny Habits** by BJ Fogg — TBD
- **Hooked** by Nir Eyal — TBD
- **The 7 Habits of Highly Effective People** by Stephen Covey — TBD

Add, remove, or reorder entries freely. Format per line: `- **Title** by Author — URL` (or `TBD`).
