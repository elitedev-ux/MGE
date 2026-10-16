import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import ts from 'typescript'

// Run the actual TypeScript shopping store without adding a browser test framework.
const memory = new Map()
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{ getItem:key=>memory.get(key)??null, setItem:(key,value)=>memory.set(key,value), removeItem:key=>memory.delete(key) }})
globalThis.window = { localStorage:globalThis.localStorage }
const dataSource = await fs.readFile(new URL('../client/src/data.ts',import.meta.url),'utf8')
const dataJS = ts.transpileModule(dataSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
const dataURL = `data:text/javascript;base64,${Buffer.from(dataJS).toString('base64')}`
const storeSource = await fs.readFile(new URL('../client/src/store.ts',import.meta.url),'utf8')
const storeJS = ts.transpileModule(storeSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace("'./data'",JSON.stringify(dataURL))
const temp = new URL('../client/.shopping-check.mjs',import.meta.url)
try {
  await fs.writeFile(temp,storeJS)
  const {useShop}=await import(temp.href)
  const {products,purchaseLimit}=await import(dataURL)
  const p=products[0]
  const initialStock=p.stock
  assert.equal(initialStock,null,'new catalogue stock is unknown, not fabricated')
  useShop.getState().quantity(p.id,150)
  assert.equal(useShop.getState().cart[p.id],99,'unknown inventory has a preview bag limit')
  useShop.getState().quantity(p.id,0)
  p.stock=3
  for(let i=0;i<p.stock+4;i++)useShop.getState().add(p.id)
  assert.equal(useShop.getState().cart[p.id],purchaseLimit(p),'adding cannot exceed known stock')
  useShop.getState().quantity(p.id,2)
  assert.equal(useShop.getState().cart[p.id],2)
  useShop.getState().quantity(p.id,999)
  assert.equal(useShop.getState().cart[p.id],p.stock)
  useShop.getState().quantity(p.id,0)
  assert.equal(useShop.getState().cart[p.id],undefined,'zero quantity removes item')
  useShop.getState().save(p.id)
  assert.deepEqual(useShop.getState().wishlist,[p.id])
  useShop.getState().save(p.id)
  assert.deepEqual(useShop.getState().wishlist,[],'save toggles without duplicates')
  useShop.getState().add('retired-product')
  useShop.getState().save('retired-product')
  assert.equal(useShop.getState().cart['retired-product'],undefined)
  assert.deepEqual(useShop.getState().wishlist,[])
  p.stock=0
  useShop.getState().add(p.id)
  assert.equal(useShop.getState().cart[p.id],undefined,'out-of-stock items cannot be added')
  p.stock=initialStock
  memory.set('mge-shopping-v1',JSON.stringify({state:{cart:{'iphone-15-pro':3,[p.id]:2},wishlist:['iphone-15-pro',p.id,p.id]},version:0}))
  await useShop.persist.rehydrate()
  assert.deepEqual(useShop.getState().cart,{[p.id]:2},'retired IDs removed during migration')
  assert.deepEqual(useShop.getState().wishlist,[p.id],'valid saved products survive migration')
  assert.ok(memory.has('mge-shopping-v1'),'changes persist locally')
  console.log('Shopping checks passed: known/unknown stock limits, unavailable items, quantities, wishlist, persistence, and retired-product migration.')
} finally { await fs.unlink(temp).catch(()=>{}) }
