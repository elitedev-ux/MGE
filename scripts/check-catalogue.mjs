import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import ts from 'typescript'

const source=await fs.readFile('client/src/data.ts','utf8')
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
const {products,categories}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const mappings=JSON.parse(await fs.readFile('docs/product-image-map.json','utf8'))
const originals=await fs.readdir('src/assets/MGE PIC')
assert.equal(products.length,76)
assert.equal(new Set(products.map(p=>p.id)).size,products.length)
assert.deepEqual(mappings.map(m=>m.file).sort(),originals.sort(),'every source asset is accounted for exactly once')
for(const p of products){
  assert.ok(categories.includes(p.category),p.id)
  assert.ok(p.price>0 && p.priceIsPlaceholder,p.id)
  assert.equal(p.stock,null)
  assert.equal(p.image,p.images[0])
  assert.ok(Object.keys(p.specs).length>=3,p.id)
  assert.ok(p.description && p.detailsNote,p.id)
  for(const url of p.images){
    assert.ok(url.startsWith('/products/'))
    const bytes=await fs.readFile('client/public'+url)
    const hash=crypto.createHash('sha256').update(bytes).digest('hex')
    assert.ok(mappings.some(m=>m.productId===p.id && m.sha256===hash),`photo belongs to ${p.id}`)
  }
}
assert.ok(products.filter(p=>p.category==='Laptops').every(p=>p.identification==='needs-model' && p.specs.Processor==='Confirm with MGE'))
const app=await fs.readFile('client/src/App.tsx','utf8')
for(const id of ['hp-elitebook-silver','aimb-g2-pro-glasses','bose-quietcomfort-ultra'])assert.ok(products.some(p=>p.id===id))
for(const retired of ['iphone-15-pro','macbook-air-m3','mge-vision-glasses','images.unsplash.com'])assert.ok(!app.includes(retired),`no retired homepage link: ${retired}`)
console.log(`Catalogue checks passed: ${products.length} products, ${mappings.length} source images, photo ownership, categories, demo prices, and explicit unknown specifications.`)
