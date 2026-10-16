# Storefront optimization

## Changes

- Generate content-hashed WebP variants at 320, 640, and 1280 pixels (logos: 160 and 320), preserving original files and transparency. Responsive image sizing lets browsers select an appropriate variant for the viewport.
- Optimize catalogue, hero, logo, gallery, cart, and admin images. Below-the-fold images retain lazy loading; the first hero image has high fetch priority. Explicit image dimensions reserve space.
- Load the homepage animation code and admin editor in separate route bundles. Shopping pages no longer download homepage animation code, and customers do not download the admin editor.
- Remove the unused React Query provider from the browser entry point. Memoize product cards and subscribe to only the relevant wishlist state. Reuse the currency formatter.
- Discover the font stylesheet directly from HTML instead of through a CSS import. Preserve the existing font and design.
- Reserve enough space during route loading to keep the footer from jumping into view.

## Measurements

Local production preview, cache disabled, desktop homepage at 1440 × 1000 and mobile shop at 390 × 844. Same-origin encoded resource bytes requested during the initial viewport check; excludes the HTML document and external font resources. These are local checks, not a hosted network-speed guarantee. Raw results: `performance-before.json` and `performance-after.json`.

| Measure | Before | After |
| --- | ---: | ---: |
| Homepage initial asset bytes | 9,449,398 | 275,696 |
| Mobile shop initial asset bytes | 28,864,405 | 224,689 |
| Main JavaScript, uncompressed | 542.98 KB | 393.67 KB |
| Homepage layout shift score | 0.00069 | 0.00069 |
| Mobile shop layout shift score | 0.00038 | 0 |

82 source images total 147,704,317 bytes. Their largest optimized variants total 6,779,874 bytes, a 95% reduction. Smaller responsive variants are served when appropriate.

## Maintenance and verification

`npm.cmd run build` generates variants before TypeScript checking and the production build. `npm.cmd run optimize:images` refreshes them during development. Cached variants are reused when the source is unchanged. New admin uploads work with their originals immediately and gain optimized variants on the next optimization/build run.

The production build passes without the previous oversized-chunk warning. Catalogue integrity, admin creation/editing/upload limits, shopping persistence, and WhatsApp checkout tests pass. Browser checks cover all hero slides, desktop/mobile layouts, catalogue images, galleries, cart, and admin editing/upload controls.

To repeat the resource check, run the production preview on port 5174, then `node scripts/check-performance-browser.mjs after`.
