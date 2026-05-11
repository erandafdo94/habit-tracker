# Feature Specification: Site Redesign — Clean, Editorial Blog

**Feature Branch**: `001-redesign-site`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "redesign the site. now it looks bleh plane. not very attractive. i want a very nice clean blog"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-time visitor lands on the homepage and immediately understands the blog (Priority: P1)

A new reader (likely arriving from search or social) lands on the homepage. Within seconds they should
recognise that this is a credible, well-designed blog about building better habits and breaking bad
ones, see a clear hero statement, and be able to scan a curated list of recent and notable posts that
invites them to start reading.

**Why this priority**: The homepage is the brand's first impression and the single largest determinant
of bounce rate. Without a clean, attractive homepage, no other improvement matters — readers leave
before they reach the content.

**Independent Test**: Open the deployed site on desktop and mobile with no prior context. A reviewer
should be able to (a) state in one sentence what the blog is about, (b) identify the most recent /
featured post, and (c) feel that the design is intentional and modern — all within the first viewport.

**Acceptance Scenarios**:

1. **Given** a visitor arrives at the homepage on a fresh browser, **When** they view the first
   viewport on desktop (1440px), **Then** they see a clear blog name/wordmark, a one-line value
   proposition about habits, and at least the start of the featured posts list — with no large
   empty whitespace gaps and no clipped/overflowing elements.
2. **Given** a visitor arrives on a mid-tier mobile device (375px), **When** the homepage loads,
   **Then** the same hero message and the first post card are visible above the fold, navigation is
   reachable in one tap, and font sizes are comfortably readable without zooming.
3. **Given** a visitor scrolls the homepage, **When** they reach the post list, **Then** posts are
   presented as scannable cards (title, short description, reading time, publish date, and a topic
   tag), grouped or ordered in a way that highlights the most useful content first.

---

### User Story 2 - A reader opens an individual post and has a comfortable, focused reading experience (Priority: P1)

A reader clicks into a post (e.g. "How to Build Habits That Stick"). The post page should feel like
a carefully designed magazine article: legible typography, an obvious title and metadata, a clean
content column, well-styled headings, lists, and quotes, and clear signposting to related reading
when they finish.

**Why this priority**: This is where the reader spends the vast majority of their time. Reading
comfort drives time-on-page, scroll depth, and return visits — the metrics that compound into SEO
authority for a habits blog.

**Independent Test**: Open any blog post on desktop and mobile. A reviewer should be able to read
the article end-to-end without visual friction (no cramped lines, no awkward heading hierarchy, no
jumpy layout), and at the end be offered at least one obvious next step (related post, topic, or
subscribe).

**Acceptance Scenarios**:

1. **Given** a reader opens a post on desktop, **When** the page loads, **Then** the article is
   centred in a comfortable reading column (roughly 60–75 characters per line), with a clear title,
   publish date, optional "last updated" date, reading time, and topic tag visible above the body.
2. **Given** a reader is reading the article, **When** they encounter headings, blockquotes, lists,
   inline links, and code/keyword emphasis, **Then** each element is styled distinctly and
   consistently — visually calm, with clear hierarchy, and matching the rest of the site's design
   language.
3. **Given** a reader reaches the end of a post, **When** they look for what to do next, **Then**
   they see at least 2–3 related posts (by topic or tag) and a clear way to keep reading, with no
   dead-ends.
4. **Given** a reader is on a mobile device, **When** they read a post, **Then** body text is at
   least 16px, line-height is generous, images scale to the column width, and there is no horizontal
   scrolling.

---

### User Story 3 - A returning or curious reader explores the blog by topic and search (Priority: P2)

A reader who is interested in a specific area (e.g. "habit stacking", "breaking bad habits",
"morning routines") wants to find more posts like the one they just read, or search for a specific
keyword.

**Why this priority**: Topic exploration and search drive pageviews per session and help readers
self-serve into the content most relevant to them. They are important but secondary to homepage
and post-page polish.

**Independent Test**: From a post page, a reader can click a topic tag and arrive at a listing of
related posts; from anywhere on the site, they can open search, type a keyword, and see relevant
results.

**Acceptance Scenarios**:

1. **Given** a reader is on any page, **When** they click the topic tag on a post or in the
   navigation, **Then** they land on a topic page that lists all posts in that topic with the same
   clean card layout used on the homepage.
2. **Given** a reader is on any page, **When** they invoke search and type a keyword, **Then** they
   see ranked results with titles and short excerpts within a second or two, and clicking a result
   takes them straight to the post.
3. **Given** a reader is on a topic page or search results page, **When** they look at the design,
   **Then** it is visually consistent with the rest of the site — same type scale, spacing, and
   colour system — not a "leftover" or unstyled page.

---

### User Story 4 - The reader gets a coherent, polished experience across light/dark modes and devices (Priority: P3)

A reader using their OS in dark mode, or on a tablet, or with reduced-motion preferences, should get
a design that respects those preferences and still looks intentional.

**Why this priority**: Important for perceived quality and accessibility, but the site can launch a
clean redesign in a single mode first and add the second mode as a fast-follow if needed.

**Independent Test**: Toggle OS dark mode and the site should adapt; resize the viewport from 320px
to 1920px and the layout should remain intentional at every common breakpoint.

**Acceptance Scenarios**:

1. **Given** the reader's OS is set to dark mode, **When** they visit the site, **Then** the site
   renders in a dark theme that maintains WCAG 2.1 AA contrast and is visually consistent with the
   light theme (same hierarchy, same proportions).
2. **Given** the reader has `prefers-reduced-motion` enabled, **When** they navigate the site,
   **Then** no non-essential animations or transitions play.
3. **Given** the viewport is resized between 320px and 1920px, **When** the layout reflows, **Then**
   there are no broken layouts, overlapping elements, or horizontal scrollbars at any common
   breakpoint (320, 375, 414, 768, 1024, 1280, 1440, 1920).

---

### Edge Cases

- **Very long titles**: Posts with titles longer than ~80 characters MUST wrap cleanly in cards and
  on the post page without overflowing or being truncated mid-word.
- **No featured image**: Posts that do not yet have a hero image MUST still render with an
  intentional, on-brand fallback (e.g. a typographic header or a defined placeholder), not a broken
  image or blank space.
- **Empty topic / no search results**: Topic pages with zero posts and search queries with zero
  matches MUST show a friendly empty state, not a blank page.
- **Slow connections**: On a constrained connection, the page MUST become readable (text + layout)
  before all images have loaded; no large layout shifts after images arrive.
- **Print / reader-mode**: A post printed or opened in a reader view MUST remain legible and well
  structured (this is a free side effect of clean semantic markup, not a bespoke feature).
- **Existing URLs**: All existing post URLs MUST continue to resolve after the redesign (no broken
  links from search, social shares, or backlinks).

## Requirements *(mandatory)*

### Functional Requirements

**Visual identity & design system**

- **FR-001**: The redesigned site MUST present a clearly defined visual identity — a wordmark or
  logotype, a primary type pairing (one display/heading family, one body family), a restrained
  colour palette (background, foreground, one accent, and muted/secondary tones), and a consistent
  spacing scale applied across every page.
- **FR-002**: The site MUST apply this design system consistently across the homepage, post pages,
  topic/tag pages, search, and any auxiliary pages (about, 404).
- **FR-003**: The design MUST feel "clean and editorial" — generous whitespace, calm colours,
  typographic emphasis over decorative chrome — and explicitly avoid template-generic aesthetics
  (no default unstyled-looking lists, no jumbled hero stock imagery, no mismatched fonts).

**Homepage**

- **FR-004**: The homepage MUST present a hero area with the blog name, a one-line value proposition
  about building better habits and breaking bad ones, and at least one primary call to action
  (e.g. "Start reading" or a link to a flagship post).
- **FR-005**: The homepage MUST display a curated/recent posts list as scannable cards, each showing
  at minimum: title, short description, publish date, estimated reading time, and topic tag.
- **FR-006**: The homepage MAY feature a "featured" or "start here" post that is visually
  distinguished from the rest of the list.

**Post pages**

- **FR-007**: Post pages MUST display, above the article body: title (H1), short description or
  deck, publish date, "last updated" date when present, estimated reading time, and the post's
  primary topic/tag.
- **FR-008**: The article body MUST render with a comfortable measure (target ~60–75 characters per
  line on desktop), generous line-height, clear heading hierarchy (H2/H3 distinct from H1 and from
  body), and consistently styled lists, blockquotes, links, emphasis, and images.
- **FR-009**: Post pages MUST end with a "keep reading" section listing at least two related posts
  (by tag or hand-picked) using the same card style as the homepage.
- **FR-010**: Post pages MUST preserve the SEO surface required by the constitution (unique title,
  meta description, canonical URL, structured data, social card) — the redesign must not regress
  these.

**Navigation, topics & search**

- **FR-011**: A persistent site header MUST provide access to the homepage, topic browsing, and
  search from every page; on mobile the header MUST collapse into a usable mobile pattern.
- **FR-012**: Topic / tag pages MUST list all posts in that topic using the same card pattern as the
  homepage, with a clear topic title and (optionally) a one-line topic description.
- **FR-013**: Search MUST be reachable from every page and return ranked, clickable results with
  title and excerpt; results MUST appear within ~1 second of typing on a typical connection.

**Footer & site furniture**

- **FR-014**: A site footer MUST appear on every page with at minimum: blog name/wordmark, a short
  tagline or about line, links to topics, and a copyright line. A subscribe / email capture is
  optional in v1.
- **FR-015**: A custom-styled 404 page MUST be provided, consistent with the design system and
  offering links back to the homepage and to popular posts/topics.

**Responsiveness, theming, accessibility, performance**

- **FR-016**: All pages MUST be fully responsive from 320px up to 1920px with no horizontal scroll
  and no broken layouts at any common breakpoint.
- **FR-017**: The site MUST support a dark theme that follows the operating system preference by
  default, and MAY offer a manual toggle.
- **FR-018**: The redesign MUST meet WCAG 2.1 AA contrast for all text and interactive elements, be
  fully keyboard navigable, and respect `prefers-reduced-motion`.
- **FR-019**: The redesigned pages MUST meet the performance budget defined in the project
  constitution (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, Lighthouse Accessibility ≥ 95) on a mid-tier
  mobile profile.

**Migration & continuity**

- **FR-020**: All existing post URLs MUST continue to resolve after the redesign; any URL change
  MUST be handled with a permanent (301) redirect from the old path.
- **FR-021**: All existing post content MUST render correctly under the new design without manual
  per-post rework (i.e. existing Markdown frontmatter and body conventions remain supported, or
  any required frontmatter additions are clearly documented and applied in this same change).

### Key Entities *(include if feature involves data)*

- **Post**: An article in the blog. Attributes relevant to design: title, short description/deck,
  publish date, optional last-updated date, estimated reading time, primary topic/tag, optional
  hero image with alt text, body content (Markdown).
- **Topic / Tag**: A subject grouping (e.g. "habit stacking", "breaking bad habits"). Attributes:
  name, slug, optional one-line description, set of posts.
- **Design system tokens**: Named values for colour, typography, spacing, radius, and motion that
  are applied consistently site-wide. Not user-visible as data, but a first-class entity for the
  redesign.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer who has never seen the site can, within 5 seconds on the homepage, correctly
  state that the blog is about building/breaking habits.
- **SC-002**: At least 9 out of 10 reviewers shown the before/after rate the new design as "clean
  and attractive" and prefer it over the current design.
- **SC-003**: On the redesigned site, average homepage bounce rate decreases (or session pages-per-
  visit increases) by a measurable amount within 30 days of launch versus the 30 days prior, on a
  comparable traffic mix.
- **SC-004**: All redesigned pages (homepage, a representative post, a topic page, search results,
  404) pass the constitution's performance and accessibility budget (LCP ≤ 2.5s, INP ≤ 200ms,
  CLS ≤ 0.1, Lighthouse Accessibility ≥ 95) on a mid-tier mobile profile.
- **SC-005**: 100% of existing post URLs continue to resolve (HTTP 200 or 301 to a new canonical
  URL) after the redesign deploys — zero broken links from prior backlinks or search results.
- **SC-006**: A new reader can find a second post to read (via related posts, topic page, or search)
  within 2 clicks from any starting post.
- **SC-007**: On viewports from 320px to 1920px, no page exhibits horizontal scrolling or overlapping
  elements at any of the standard breakpoints listed in the edge cases.

## Assumptions

- The scope is a visual/UX redesign of the existing static blog. The content corpus (the existing
  Markdown posts) is reused as-is; no new posts or rewriting of post bodies are required as part
  of this feature.
- The redesign stays on the current static-site stack already chosen for the project (per the
  constitution's stack constraint). Replacing the stack is out of scope for this feature.
- The primary audience is English-speaking readers arriving via organic search and social shares,
  reading mostly on mobile. The design is optimised mobile-first.
- A single launch ("big bang") replacement of the existing design is acceptable — incremental
  per-page rollout is not required, but the design system MUST be applied consistently across all
  page types listed above before launch.
- The existing search implementation (already part of the project) is reused; this feature restyles
  the search surface but does not re-engineer the indexing/ranking pipeline.
- A subscribe / email-capture component is desirable but not required for v1; the footer slot is
  reserved for it.
- Analytics and any third-party scripts already in use remain unchanged in scope; no new trackers
  are added by this feature (per the constitution).
