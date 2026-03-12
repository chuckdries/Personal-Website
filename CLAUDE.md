# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn develop          # Start dev server at localhost:8000
yarn build            # Production build
yarn serve            # Serve the built site
yarn clean            # Clear Gatsby cache (use when seeing stale build issues)

# Type checking & linting
yarn typecheck        # Run TypeScript type checker
yarn lint             # Run ESLint
yarn lint-fix         # Run ESLint with auto-fix
yarn pretty           # Run Prettier on all files

# Deployment (requires SSH access to droplet)
yarn deploy           # Build + upload to production
yarn upload-staging   # Upload to staging
```

Note from CLAUDE.md root: Source nvm before running npm/node commands: `. ~/.nvm/nvm.sh && yarn ...`

## Architecture

This is a **Gatsby 5** personal website (chuckdries.com) using React 18, TypeScript, and Tailwind CSS.

### Data Sources

Gatsby sources data from two directories:
- `data/gallery/` — Photo files (JPEGs). Each photo must have EXIF data including `DateTimeOriginal`, `Rating`, and `Keywords`.
- `data/posts/` — MDX blog posts with frontmatter (`slug`, `title`, `date`, optional `galleryImages`).

### Build-time Data Processing (`gatsby-node.ts`)

For every photo in `data/gallery/`, `onCreateNode` runs at build time to:
1. Parse EXIF/IPTC metadata via `exifr`
2. Extract dominant color via `sharp`
3. Determine the photo's date using `@internationalized/date`
4. Organize photos into year/month slugs (`photos/2024/January/filename.jpg`)
5. Determine `datePublished` via `git log` (when the file was first committed)
6. Attach all this as `fields.imageMeta` and `fields.organization` on the Gatsby node

`createPages` generates:
- Individual photo pages: `photos/{year}/{month}/{filename}` using `PhotoImage.tsx`
- Year overview pages: `photos/{year}` using `PhotoYear.tsx`
- Month gallery pages: `photos/{year}/{month}` using `PhotoMonth.tsx`
- Blog post pages: `posts/{slug}` using `PostTemplate.tsx`

### Photo Gallery UI

The main photos page (`src/pages/photos.tsx`) uses a **virtualized masonry layout**:

- `MasonryContainer` (uses `react-window` `VariableSizeList`) — handles virtualized rendering
- `useMasonryRows` hook — packs images into rows targeting a calculated aspect ratio based on viewport width
- `MasonryRow` — renders a single row of images
- Row types: `"c"` (children/nav header), `"l"` (month/year label), `"i"` (image row)
- Target aspect ratio = `containerWidth / idealItemSize` (150px on mobile, 250px on desktop)

The older `MasonryGallery.tsx` component is a non-virtualized version used on other pages (e.g., `photogallery.tsx`).

### Tailwind Theme

Custom spacing scale (not standard Tailwind): `1=4px, 2=8px, 3=12px, 4=16px, 5=24px, 6=32px, 7=48px, 8=80px`.

CSS custom properties (`--vibrant`, `--dark-vibrant`, etc.) are set at runtime and consumed via custom Tailwind color utilities (`bg-vibrant`, `text-vibrant-dark`, etc.). These come from image color extraction via `node-vibrant` (though currently commented out — dominant color via `sharp` is used instead).

### GraphQL Types

Gatsby generates TypeScript types into `src/gatsby-types.d.ts` (via `graphqlTypegen: true` in `gatsby-config.js`). Query type names follow the pattern `Queries.{QueryName}Query`.

### Key Files

- `gatsby-node.ts` — All build-time data processing and page creation
- `gatsby-config.js` — Plugin config, RSS feeds, filesystem sources
- `tailwind.config.js` — Custom theme (spacing, colors with CSS vars, fonts)
- `src/breakpoints.js` — Breakpoints used by both Tailwind and `use-breakpoint`
- `src/utils.ts` — Shared utilities (aspect ratio, vibrant styles, shutter speed formatting, etc.)
- `src/fragments.js` — Shared GraphQL fragments
