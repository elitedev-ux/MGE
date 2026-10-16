# MGE — Miztashogofunmi Global Enterprise

Responsive React storefront with a product catalogue, search and filters, product galleries, wishlist, shopping bag, and WhatsApp checkout. Includes customer support, delivery, returns, privacy, and terms pages, plus a local product manager.

## Development

Use Node.js 22 or newer. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. On Windows PowerShell, use `npm.cmd` if script restrictions block `npm`.

## Product management

Open http://localhost:5173/admin while the development server is running. Add or edit products, pricing, stock, and specifications. New products support up to four photos, each at most 3 MB. Saves update the catalogue on disk with a backup.

The editor is restricted to the local development server. It is not an authenticated hosted admin service. See [product admin documentation](docs/PRODUCT-ADMIN.md).

## Production build

```sh
npm run build
npm run preview
```

The build generates responsive WebP images, checks TypeScript, and writes the site to `client/dist`. Configure your static host to serve `index.html` for React Router routes such as `/shop` and `/contact`. Publish a new build after editing products. Never expose the development server as the production site.

Original product images are preserved. `npm run optimize:images` refreshes optimized variants during development. See [performance notes](docs/PERFORMANCE.md).

## Checks

```sh
npm run test:shopping
node scripts/check-checkout.mjs
node scripts/check-admin.mjs
```

Browser checks under `scripts/` use a local Chrome installation and a running development server. They cover storefront, admin, and customer-care interactions.

## Business configuration

Checkout prepares product names and quantities in WhatsApp for +234 814 538 2171. The customer reviews and sends the message; the site does not process payments directly. Placeholder prices are labelled. Confirm final prices, product details, delivery, and warranty arrangements before purchase.

The environment example documents possible future backend services; no credentials are required for the current storefront. [ARCHITECTURE.md](ARCHITECTURE.md) describes the initial design and planned backend phases.
