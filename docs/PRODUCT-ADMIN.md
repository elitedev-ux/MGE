# Product editor

Run `npm.cmd run dev` and visit http://localhost:5173/admin.

Search for an existing product, select it, change its details, and click Save changes. Names, brands, categories, prices, placeholder-price labels, stock, badges, descriptions, specifications, and product notes are editable. Existing IDs, image galleries, and source references are preserved.

Choose New product to add an item. Enter its name, brand, category, description, and price; stock and specifications are optional. Upload one to four PNG, JPEG, or WebP photos, up to 3 MB each. The first photo becomes the main image. Create product saves the photos to `client/public/products/` and adds the product to the catalogue with a unique ID. New products can then be edited like existing products. Retrying the same creation request cannot silently create a duplicate. There are no delete actions or customer accounts.

Saves update `client/src/data.ts` on disk; they are not browser-only storage. The previous catalogue is backed up to `client/src/data.ts.admin-backup` before each save. The storefront receives the changes through Vite. Rebuild and publish to update a hosted storefront.

The write endpoint exists only in the Vite development server, restricted to loopback requests with matching origin and an explicit request header. It is a local editing tool, not a hosted authentication system. The production static build does not include a write API; online administration requires an authenticated backend. Do not expose the development server through a public tunnel.

Validation: `node scripts/check-admin.mjs` uses a temporary catalogue to check persistence, validation, backups, access restrictions, and concurrent-save protection without changing the real product data.
