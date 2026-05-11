# Quickstart — Site Redesign

## Prerequisites

- Node ≥ 22.12 (matches `package.json` `engines`)
- A clean working tree on `main`

## Install (one-time, when implementation starts)

```sh
npm install
npm install --save-dev @fontsource-variable/inter @fontsource/fraunces
```

## Run locally

```sh
npm run dev          # Astro dev server with HMR
```

Open the printed URL; the redesign should be visible immediately. Toggle OS dark mode and confirm the
theme follows. Use the in-header theme toggle to override and confirm the choice persists across a
reload.

## Build & verify

```sh
npm run build        # astro build + postbuild Pagefind index
npm run preview      # serve dist/ for a realistic perf check
```

Then, in `dist/`:

1. **URL diff**: `grep -o '<loc>[^<]*' dist/sitemap-0.xml | sort > /tmp/new.txt` and compare against
   the live sitemap. Every existing URL MUST appear.
2. **JSON-LD**: view source of `/` and a post page; confirm `<script type="application/ld+json">`
   blocks parse (paste into <https://search.google.com/test/rich-results>).
3. **Lighthouse mobile** on the previewed homepage and a representative post page. Required:
   - LCP ≤ 2.5s
   - INP ≤ 200ms (estimated via Total Blocking Time in lab; field metric to be confirmed post-deploy)
   - CLS ≤ 0.1
   - Accessibility ≥ 95
4. **Viewport sweep**: in DevTools, test 320, 375, 414, 768, 1024, 1280, 1440, 1920 — no horizontal
   scroll, no overlapping elements on any of: home, a post, a tag page, search results, 404.
5. **Keyboard pass**: tab through the home and a post; every interactive element must be reachable
   and show a visible focus ring (`--focus`).
6. **Reduced motion**: enable `prefers-reduced-motion` in DevTools; no non-essential animation plays.

## Failure modes & fixes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| FOUC on first paint (light flash in dark mode) | Inline theme bootstrap script not first in `<head>` | Move `<script is:inline>` ahead of any CSS imports in `Base.astro`. |
| CLS spike on home | Hero font (Fraunces) swaps without size matching | Add `size-adjust` and `ascent-override` to `@font-face` (see research §1). |
| Build fails: "Invalid enum value" for `tags` | Post has a tag not in `TAG_SLUGS` | Either add the tag to the closed taxonomy (and to `data-model.md`) or rename to a known tag. |
| Lighthouse Accessibility < 95 | Most likely a missing label on the search trigger or low-contrast meta text | Add `aria-label="Search"`; verify `--fg-muted` ≥ 4.5:1. |
| Pagefind UI looks unstyled | Pagefind CSS not imported in `Search.astro` after restyle | Re-import `@pagefind/default-ui/css/ui.css` (or scope the override). |

## When in doubt

The spec ([spec.md](./spec.md)) and the constitution
([../../.specify/memory/constitution.md](../../.specify/memory/constitution.md)) are the gates. If
something feels wrong, check those first.
