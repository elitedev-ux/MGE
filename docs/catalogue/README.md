# October 28 phone import

14 listings use all 15 supplied JPEGs; the two purple iPhone 11 views share one listing. Source filename positions are in `phone-source-files.json`. Rebuild the prepared rows and copy images with `node scripts/prepare-new-phones.mjs <source-directory>`.

Prices are owner-authorized placeholders. Stock, condition, battery health and warranty are unconfirmed. Label capacities are transcribed; unlabelled model families are visual matches, not verified hardware identification. No serial numbers or IMEIs are transcribed into listing fields.

The owner authorized migration to project `eupzhqamkqlnjwjjcufb`. The 76 rows were copied from the original live REST catalogue, preserving all product fields and IDs. The original project was left untouched. The ignored `catalogue-migration.local` snapshot supports `node scripts/check-phone-migration.mjs` for field-by-field verification. New rows are in `new-phones-2026-10-28.json`; runtime reads the database, not this file.

The new project has the existing schema plus `20261028000100_smartphones_category.sql`, the authenticated admin function including delete, and the existing password-only access model. Raw photos and responsive WebP variants ship with the frontend. Customer-uploaded replacements continue to use Supabase Storage.

Deploy the frontend alongside the database switch. If Vercel defines `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY`, update those overrides to the new public values in `client/src/backend-config.ts` before rebuilding.
