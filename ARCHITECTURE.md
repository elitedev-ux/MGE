# MGE architecture and delivery plan

Phase 1 establishes the React storefront and visual system. This is a development storefront with explicitly labelled sample inventory, not a production commerce service.

## Structure

- `client/`: React + TypeScript + Vite. Tailwind CSS, shadcn-style Radix/CVA button, React Router, Zustand persisted shopping state, TanStack Query catalogue seam, and Framer Motion. React Hook Form and Zod are available for the authenticated forms in Phase 2.
- `server/`: reserved for the required Node/Express TypeScript service. It must remain an independently deployed backend.
- `shared/`: typed API status/error contracts.

## Design system

White canvas, charcoal text, soft gray surfaces, blue primary actions. Inter typography, 6–10 px corner radii, restrained borders, and consistent content width. Responsive grids collapse to two product columns on mobile. Reduced motion preferences disable CSS effects. Reuse the button, product card, spacing, and typography across future checkout, account and admin screens.

## Phase 2: backend and database

Express REST API under `/api/v1`, PostgreSQL through Prisma, versioned SQL migrations, Zod request validation, centralized errors and structured logging. Introduce users/profiles/roles, products/images/variants, category hierarchy, brands, inventory and movements, carts, wishlists, addresses, orders/items, payments, shipments, zones, coupons, reviews, banners, subscribers, settings, audit logs and hashed expiring verification/reset tokens. Use indexes on catalogue search and order/customer/status lookups. Order items retain historical name, SKU, selected options, unit price and tax/shipping snapshots.

Passwords use a secure adaptive hash. JWT sessions use HTTP-only cookies; production cookies are Secure, with SameSite configured to frontend/backend deployment topology. Validate Origin and CSRF tokens for mutations; exact-origin CORS, rate limits, and server authorization apply. Never accept a role from registration input. Admin bootstrap occurs through a server CLI, never public registration.

Catalogue query parameters must move to server filtering, sorting and pagination. Replace sample query functions with an API client; do not silently fall back to demo inventory on API failure. Anonymous local carts merge after login using variant IDs and stock caps.

## Phase 3: purchasing and inventory

All monetary values use integer kobo. The server calculates product prices, coupon eligibility and shipping. A serializable database transaction conditionally reserves variant inventory before creating pending orders. Reserve for 15 minutes, release expired/cancelled unpaid orders idempotently, and capture once after verified payment. Reconcile late successful payments against stock before fulfillment; never silently oversell. Refunds do not automatically restock: an inspected return triggers a separate inventory adjustment.

Paystack initialization, verification and signed raw-body webhook validation run exclusively in Express. Check reference, amount, currency and status against the stored order. Unique payment references and transactional status transitions prevent duplicate capture. Frontend redirects cannot mark orders paid. Bank transfer remains pending until authorized admin verification. Send email through a retryable outbox after committed transitions.

## Phase 4: administration

Protected admin routes share storefront tokens, with a restrained sidebar, summary cards, legible data tables and focused forms. Database-derived analytics only. Product/variant/image/category/brand management, safe archival, inventory adjustment ledger, order and payment status controls, tracking, customer directory, coupons, promotions, CSV validation and store settings. Cloudinary signed upload endpoints enforce type, size and role. Record sensitive actions in audit logs.

## Phase 5: verification and deployment

Frontend: Vercel. Express: Render/Railway. PostgreSQL: Neon/Supabase-hosted PostgreSQL, without replacing Express. Resend transactional mail, configurable WhatsApp number, consent-aware GA4, business-approved policies and contact details. Add SEO metadata and structured data from real records. Verify authentication/CSRF/admin denial, concurrent inventory reservations, webhook duplicates/tampering, price integrity, successful/failed/expired payment journeys, guest-cart merge and transactional email retries before claiming production readiness.

Current limits: no live database, authentication, checkout, admin dashboard or external service connections. Images are remote illustrative photographs, not verified SKU images. No fabricated reviews or store credentials are displayed.
