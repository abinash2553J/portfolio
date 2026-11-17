# portfolio

Personal portfolio of Abinash Karan — React, TypeScript, Vite.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## How it fits together

- `src/pages.tsx` — the routes: `/`, `/work`, `/work/:slug`, `/open-source`, `/about`, `/contact`.
- `src/content.ts` — projects, open-source contributions and links.
- `src/github.ts` — the Open source page's pull requests, fetched live from the GitHub search API; `src/prs.json` is the
  fallback snapshot (`node scripts/prs.mjs` refreshes it).
- `src/meta.ts` — per-page titles, descriptions and share-image names.
- `src/demos/` — the animated product demos, built with the Stageshow kit in `src/kit/`.
- `vite.config.ts` — at build time writes a static `index.html` per route with its own link-preview tags, plus `sitemap.xml` and `robots.txt`.

## Deploy

Import the repo on Vercel; no settings are needed. Absolute URLs in link previews and the sitemap use
`SITE_URL` if set, otherwise Vercel's production domain.

## Share images

`public/og/*.jpg` and `public/apple-touch-icon.png` are generated from `src/meta.ts`. After changing page copy:

```bash
CHROME_PATH=/path/to/chrome node scripts/og.mts
```
