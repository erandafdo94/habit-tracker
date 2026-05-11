import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

function jaccard(a: readonly string[], b: readonly string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection += 1;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function relatedPosts(target: Post, all: Post[], n = 3): Post[] {
  const targetTags = target.data.tags;
  const scored = all
    .filter((p) => p.id !== target.id)
    .map((p) => ({
      post: p,
      score: jaccard(targetTags, p.data.tags),
      pub: Date.parse(p.data.pubDate),
    }))
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return y.pub - x.pub;
    });

  const top = scored.slice(0, n).map((s) => s.post);
  if (top.length >= 2) return top;

  // Fallback: pad with most recent posts not already included.
  const seen = new Set(top.map((p) => p.id));
  const recent = all
    .filter((p) => p.id !== target.id && !seen.has(p.id))
    .sort(
      (a, b) => Date.parse(b.data.pubDate) - Date.parse(a.data.pubDate),
    );
  return [...top, ...recent].slice(0, n);
}
