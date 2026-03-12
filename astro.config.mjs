import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://chuckdries.com',
  integrations: [
    react(),
    mdx(),
    tailwind(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    ssr: {
      noExternal: ['react-aria', 'react-aria-components', 'react-stately', '@react-aria/*', '@react-stately/*', '@react-types/*', 'use-breakpoint', 'react-cool-dimensions'],
    },
  },
});
