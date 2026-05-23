// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';

const isAffiliate = (href = '') => href.includes('amzn.to');

// https://astro.build/config
export default defineConfig({
  site: 'https://atomichabittracker.com',
  integrations: [sitemap()],
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
