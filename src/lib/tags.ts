import { TAG_SLUGS, type TagSlug } from "../content.config.ts";

export { TAG_SLUGS };
export type { TagSlug };

export interface Tag {
  slug: TagSlug;
  label: string;
  description: string;
}

export const TAGS: Tag[] = [
  {
    slug: "behavior-change",
    label: "Behaviour change",
    description: "The mechanics of how habits form and stick.",
  },
  {
    slug: "breaking-bad-habits",
    label: "Breaking bad habits",
    description: "Quitting, avoiding, and replacing habits you don't want.",
  },
  {
    slug: "habit-stacking",
    label: "Habit stacking",
    description: "Using existing routines as triggers for new habits.",
  },
  {
    slug: "habit-tracking",
    label: "Habit tracking",
    description: "Measuring habits without making tracking the habit.",
  },
  {
    slug: "identity",
    label: "Identity",
    description: "Becoming the kind of person who does the habit.",
  },
  {
    slug: "motivation",
    label: "Motivation",
    description: "When motivation helps, when it doesn't, and what to do instead.",
  },
  {
    slug: "routines",
    label: "Routines",
    description: "Mornings, evenings, and the routines that compound.",
  },
  {
    slug: "book-summary",
    label: "Book summaries",
    description: "Distilled notes from the books worth keeping.",
  },
];

export const tagBySlug = (slug: string): Tag | undefined =>
  TAGS.find((t) => t.slug === slug);
