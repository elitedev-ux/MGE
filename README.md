# MGE — Miztashogofunmi Global Enterprise

Responsive React storefront with a product catalogue, search and filters, product galleries, wishlist, shopping bag, and WhatsApp checkout. Includes customer support, delivery, returns, privacy, and terms pages, plus a password-protected Supabase product manager.

## Development

Use Node.js 22 or newer. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. On Windows PowerShell, use `npm.cmd` if script restrictions block `npm`.

## Product management

Open `/mgeadmin` and enter the owner's password. Add or edit products, prices, stock, specifications, and photos (up to four, 3 MB each). Changes save directly to Supabase and appear online without rebuilding. Customers do not need accounts.

See [product management](docs/PRODUCT-ADMIN.md) and [Supabase setup](docs/SUPABASE.md).

## Production build

```sh
npm run build
npm run preview
```

The build generates responsive WebP images, checks TypeScript, and writes the site to `client/dist`. Configure your static host to serve `index.html` for React Router routes such as `/shop` and `/contact`. Product edits publish through Supabase; code/design changes require a new build. Never expose the development server as the production site.

Original product images are preserved. `npm run optimize:images` refreshes optimized variants during development. See [performance notes](docs/PERFORMANCE.md).

## Checks

```sh
npm run test:shopping
node scripts/check-checkout.mjs
node scripts/check-catalogue.mjs
```

Browser checks under `scripts/` use a local Chrome installation and a running development server. They cover storefront, admin, and customer-care interactions.

## Business configuration

Checkout prepares product names and quantities in WhatsApp for +234 814 538 2171. The customer reviews and sends the message; the site does not process payments directly. Placeholder prices are labelled. Confirm final prices, product details, delivery, and warranty arrangements before purchase.

Public Supabase configuration is included; optional overrides are in `.env.example`. Admin secrets stay on the backend. [ARCHITECTURE.md](ARCHITECTURE.md) is the historical initial plan; [Supabase setup](docs/SUPABASE.md) describes the implemented backend.
