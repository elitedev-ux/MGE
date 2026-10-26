# Product manager

Run npm.cmd run dev and visit http://127.0.0.1:5173/mgeadmin, or use /mgeadmin on the deployed storefront. Enter the owner's password. There is no email login or customer registration. The old /admin route is retired.

Select a product to edit its details, price, stock, badge, notes, and specifications. Save changes publishes directly to Supabase. Reload refreshes the catalogue; stale revisions are rejected to prevent overwriting another editor's save.

Choose New product to add an item with one to four PNG, JPEG, or WebP photos, up to 3 MB each. The first photo is the main image. Existing products can have their entire gallery replaced by choosing new photos; leaving the upload field empty preserves the current gallery. IDs and source references are preserved. There is no delete-product action.

Product saves do not need a rebuild or GitHub push. Customers fetch the current catalogue on page entry, tab focus, and every minute while visible. Their saved cart is reconciled with live stock only after loading. Connection failures show an explicit retry state instead of old bundled prices.

Lock admin revokes the session immediately. Sessions expire after eight hours and are held in browser session storage. Passwords are hashed on the backend and never shipped in JavaScript. Five failed attempts per client or thirty overall within fifteen minutes trigger a temporary lockout.

Existing optimized photos remain with the frontend; new/replacement photos go to Supabase Storage. The backend and bucket both enforce 3 MB. Old replaced images are retained so open customer pages do not lose their photos.

See [Supabase setup](SUPABASE.md) for security, deployment, password rotation, and checks. The historical server/catalogue-admin.mjs is no longer registered in Vite and is not used by the storefront.
