# Contract: Post Frontmatter

This is the authoritative schema for `src/content/blog/*.md` frontmatter after the redesign. It is
implemented in `src/content.config.ts` as a Zod schema; this document is the human-readable contract.

## Schema (TypeScript / Zod)

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

export const TAG_SLUGS = [
  "behavior-change",
  "breaking-bad-habits",
  "habit-stacking",
  "habit-tracking",
  "identity",
  "motivation",
  "routines",
  "book-summary",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string().min(1).max(80),
      description: z.string().min(1).max(200),
      pubDate: isoDate,
      updatedDate: isoDate.optional(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      tags: z.array(z.enum(TAG_SLUGS)).min(1).max(4),
      featured: z.boolean().default(false),
      heroImage: z
        .object({
          src: z.string(),
          alt: z.string().min(1),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        })
        .optional(),
    })
    .refine(
      (d) => !d.updatedDate || Date.parse(d.updatedDate) >= Date.parse(d.pubDate),
      { message: "updatedDate must be on or after pubDate", path: ["updatedDate"] },
    ),
});

export const collections = { blog };
```

## Example (valid)

```yaml
---
title: "Habit Stacking: The Most Reliable Way to Install a New Habit"
description: "How to use existing routines as triggers for new habits — with practical examples, rules for picking anchors, and a template you can use today."
pubDate: "2025-03-20"
updatedDate: "2026-04-02"
slug: "habit-stacking-guide"
tags: ["habit-stacking", "behavior-change"]
featured: false
---
```

## Migration rules (existing posts)

- `title`, `description`, `pubDate`, `slug` already present — no change.
- `tags` — required. Backfilled per-post in the migration task; default for any uncertain post:
  `["behavior-change"]` (a catch-all).
- `updatedDate` — omit unless the post body has been materially edited since `pubDate`.
- `featured` — omit (defaults to `false`); at most one post may flip it to `true`.
- `heroImage` — omit in v1.

## Breaking-change policy

This contract is loaded at build time. A failing post breaks the build — which is the intended gate.
PRs that add a new field MUST update this document and the schema in the same commit.
