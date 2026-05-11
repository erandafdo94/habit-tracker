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

export type TagSlug = (typeof TAG_SLUGS)[number];

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string().min(1).max(120),
      description: z.string().min(1).max(220),
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
