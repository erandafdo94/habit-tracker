// @ts-check
import { defineConfig } from 'astro/config';

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

const isAffiliate = (href = '') => href.includes('amzn.to');

// Build a { canonicalUrl -> lastmod } map from blog frontmatter so the sitemap
// carries real freshness dates (updatedDate when present, else pubDate).
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const lastmodByUrl = Object.fromEntries(
  readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(`${blogDir}/${f}`, 'utf8').split('---')[1] ?? '';
      const pick = (k) => fm.match(new RegExp(`${k}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`))?.[1];
      const slug = fm.match(/slug:\s*["']?([a-z0-9-]+)/)?.[1];
      const lastmod = pick('updatedDate') ?? pick('pubDate');
      return slug && lastmod
        ? [`https://atomichabitstracker.com/blog/${slug}/`, lastmod]
        : null;
    })
    .filter(Boolean),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://atomichabitstracker.com',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = lastmodByUrl[item.url];
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          // Affiliate links must be tagged for Google (sponsored/nofollow) and
          // disclosed per Amazon's Operating Agreement; everything else just
          // gets safe defaults.
          target: '_blank',
          rel: (element) =>
            isAffiliate(String(element.properties?.href ?? ''))
              ? ['sponsored', 'nofollow', 'noopener']
              : ['noopener', 'noreferrer'],
        },
      ],
    ],
  },
});
