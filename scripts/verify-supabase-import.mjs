import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source=await readFile(new URL('../client/src/data.ts',import.meta.url),'utf8')
const marker='export const products: Product[] = ',start=source.indexOf(marker)+marker.length
const products=JSON.parse(source.slice(start,source.indexOf('\nexport const money',start)).trim())
const config=await readFile(new URL('../client/src/backend-config.ts',import.meta.url),'utf8')
const base=config.match(/https:\/\/[^']+/)[0],key=config.match(/sb_publishable_[^']+/)[0]
const response=await fetch(base+'/rest/v1/products?select=*&order=sort_order.asc',{headers:{apikey:key}})
assert.equal(response.status,200)
const rows=await response.json()
assert.equal(rows.length,products.length)
for(let i=0;i<products.length;i++){
  const p=products[i],r=rows[i]
  const expected={id:p.id,name:p.name,brand:p.brand,category:p.category,price:p.price,price_is_placeholder:p.priceIsPlaceholder,original:p.original??null,image:p.image,images:p.images,badge:p.badge??null,specs:p.specs,description:p.description,stock:p.stock,identification:p.identification,details_note:p.detailsNote,sources:p.sources}
  for(const [field,value] of Object.entries(expected))assert.deepEqual(r[field],value,`${p.id}: ${field}`)
}
console.log(`Verified all fields and ordering for ${rows.length} imported products, including Unicode text and image references.`)
// This compares the initial import; once the owner edits products, differences are expected.
