# Amazon affiliate links

Source of truth for affiliate links used in blog posts. Edit this file as you collect new links.

## Rules for Claude

- Only use entries with a real URL. **Skip any entry marked `TBD`** — do not link to a placeholder.
- Reference a book inline (`[*Book Title*](URL)`) only where it's genuinely relevant to the post topic, not as filler.
- Include at most one bottom `book-cta` block per post, with the single most relevant book. Match the existing pattern in `src/content/blog/atomic-habits-summary.md`.
- For **items** (journals, planners, etc.), link inline in context where the product is naturally relevant (e.g. mention a habit tracker journal when discussing paper tracking, a weekly planner when discussing weekly reviews). Use the same `rel="sponsored nofollow noopener" target="_blank"` attribute. Do not force item links into posts where they don't fit.
- Always use `rel="sponsored nofollow noopener" target="_blank"` on the affiliate `<a>` tag.
- If no entry in this file fits the topic, skip the affiliate CTA entirely. Don't force one in.

## Books

- **Atomic Habits** by James Clear — https://amzn.to/4tO7pTQ
- **The Power of Habit** by Charles Duhigg — https://amzn.to/4urvCAw
- **Tiny Habits** by BJ Fogg — https://amzn.to/43o1OJe
- **The 7 Habits of Highly Effective People** by Stephen Covey — https://amzn.to/49fRB56
- **The 7 Habits of Highly Effective Teens** by Sean Covey — https://amzn.to/4upZeye

## Items

- **Habit Tracker Journal** — https://amzn.to/4dTTOWt _(use when discussing paper/journal-based tracking methods)_
- **Weekly Planner** — https://amzn.to/3PvjqQf _(use when discussing weekly reviews, planning habits, or morning routines)_

Add, remove, or reorder entries freely. Format per line: `- **Title** by Author — URL` (or `TBD`).
