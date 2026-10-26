import { readFile, writeFile } from 'node:fs/promises'
const source=await readFile(new URL('../client/src/data.ts',import.meta.url),'utf8')
const start=source.indexOf('export const products: Product[] = ')+'export const products: Product[] = '.length
const products=JSON.parse(source.slice(start,source.indexOf('\nexport const money',start)).trim())
const rows=products.map(p=>({id:p.id,name:p.name,brand:p.brand,category:p.category,price:p.price,
  price_is_placeholder:p.priceIsPlaceholder,original:p.original??null,image:p.image,images:p.images,
  badge:p.badge??null,specs:p.specs,description:p.description,stock:p.stock,identification:p.identification,
  details_note:p.detailsNote,sources:p.sources}))
const columns=Object.keys(rows[0]).join(',')
// ASCII SQL avoids Windows console encoding changes during operator-assisted imports.
const value=JSON.stringify(rows).replace(/[^\x00-\x7f]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).replaceAll("'","''")
await writeFile(new URL('../supabase/seed.sql',import.meta.url),`-- Initial catalogue only. Existing online edits are never overwritten.\ninsert into public.products (${columns})\nselect ${columns} from jsonb_populate_recordset(null::public.products, '${value}'::jsonb)\non conflict (id) do nothing;\n`)
console.log(`Prepared ${rows.length} products for initial import.`)
