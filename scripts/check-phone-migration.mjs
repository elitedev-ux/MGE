import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const config=await fs.readFile('client/src/backend-config.ts','utf8')
const base=config.match(/https:\/\/[^']+/)[0],key=config.match(/sb_publishable_[^']+/)[0]
const response=await fetch(base+'/rest/v1/products?select=*&order=sort_order.asc',{headers:{apikey:key}})
assert.equal(response.status,200)
const actual=await response.json()
const old=JSON.parse(await fs.readFile('catalogue-migration.local','utf8'))
const added=JSON.parse(await fs.readFile('docs/catalogue/new-phones-2026-10-28.json','utf8'))
const expected=[...old,...added]
assert.equal(actual.length,expected.length)
for(const row of expected){
 const got=actual.find(x=>x.id===row.id);assert.ok(got,row.id)
 for(const [field,value] of Object.entries(row))if(!['sort_order','revision','updated_at'].includes(field))assert.deepEqual(got[field],value,row.id+': '+field)
 for(const url of row.images){if(url.startsWith('/'))assert.ok((await fs.stat('client/public'+url)).size>0)}
}
console.log(`Verified ${old.length} preserved products and ${added.length} new phones, all fields and local images.`)
