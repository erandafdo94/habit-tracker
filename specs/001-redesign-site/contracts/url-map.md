# Contract: URL Map

Every route the site exposes after the redesign. Required by FR-020 (existing URLs MUST keep
resolving) and Principle II (canonical URL is a published contract).

| Path                    | Source file                          | Status after redesign | Notes |
|-------------------------|--------------------------------------|-----------------------|-------|
| `/`                     | `src/pages/index.astro`              | Rewritten             | New hero + featured + recent grid. URL unchanged. |
| `/blog/`                | `src/pages/blog/[...page].astro` (page 1) | Restyled         | All-posts index (pagination unchanged). |
| `/blog/page/N/`         | `src/pages/blog/[...page].astro`     | Restyled              | Pagination URLs unchanged. |
| `/blog/<slug>/`         | `src/pages/blog/[slug].astro` → `Post.astro` | Rewritten layout, **same URL** | One per existing Markdown file. |
| `/tags/`                | `src/pages/tags/index.astro`         | **New**               | Lists all tags with counts. |
| `/tags/<tag>/`          | `src/pages/tags/[tag].astro`         | **New**               | Static paths from closed taxonomy. |
| `/about/`               | `src/pages/about.astro`              | **New** (optional)    | One-page about; safe to defer if scope tightens. |
| `/404`                  | `src/pages/404.astro`                | **New**               | Branded 404 with topic links. |
| `/sitemap-index.xml` / `/sitemap-0.xml` | `@astrojs/sitemap`     | Unchanged             | Includes new `/tags/*` routes automatically. |
| `/pagefind/*`           | Pagefind build output                | Unchanged             | Search index. |

## Invariants

1. Every URL listed in the current production sitemap MUST resolve with HTTP 200 after deploy.
   Verification: diff the new `dist/sitemap-0.xml` against the live sitemap before merge; no entry
   may be missing.
2. Per-post canonical (`<link rel="canonical">`) and OG `og:url` MUST match the path exactly,
   including trailing slash policy. Astro's default is trailing-slash; this is preserved.
3. The home `/` MUST emit `WebSite` JSON-LD with a `SearchAction` template targeting Pagefind's
   `?q=` parameter on `/`.
4. Per-post pages MUST emit `BlogPosting` JSON-LD with `headline`, `description`, `datePublished`,
   `dateModified` (when `updatedDate` present), `mainEntityOfPage`, and `author`.
5. No route added by this redesign is allowed to set `noindex` on production.

## Redirects

None required for v1 — no URL changes are introduced. If a future refactor renames a slug, the
contract is: add the new slug, keep the old file as a stub that emits a `<meta http-equiv="refresh">`
or (preferred) configure a 301 at the host level. Out of scope here.
