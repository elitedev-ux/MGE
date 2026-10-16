import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { mkdtemp, readFile, writeFile, unlink, rmdir, readdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { catalogueAdmin } from '../server/catalogue-admin.mjs'

const dir = await mkdtemp(join(tmpdir(),'mge-admin-check-'))
const file = pathToFileURL(join(dir,'data.ts'))
try {
  const original = await readFile(new URL('../client/src/data.ts',import.meta.url),'utf8')
  await writeFile(file,original)
  let handler
  catalogueAdmin(file,pathToFileURL(dir+'/')).configureServer({middlewares:{use:(_,fn) => {handler=fn}}})
  async function call(method='GET',body,headers={},address='127.0.0.1') {
    const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)])
    Object.assign(req,{method,headers:{host:'localhost:5173','x-mge-admin':'catalogue',...headers},socket:{remoteAddress:address}})
    let output
    const res = {statusCode:200,writableEnded:false,setHeader(){},end(text){this.writableEnded=true;output={status:this.statusCode,body:JSON.parse(text)}}}
    await handler(req,res)
    return output
  }
  const initial = await call()
  assert.equal(initial.status,200)
  assert.ok(initial.body.products.length > 0)
  const p=initial.body.products[0]
  const changes = {name:p.name+' Updated',brand:p.brand,category:p.category,price:123456,priceIsPlaceholder:false,original:null,description:p.description,stock:0,badge:'',detailsNote:p.detailsNote,specs:p.specs}
  const payload={id:p.id,revision:initial.body.revisions[p.id],changes}
  assert.equal((await call('PATCH',payload,{'x-mge-admin':''})).status,403)
  assert.equal((await call('PATCH',payload,{origin:'https://untrusted.example'})).status,403)
  assert.equal((await call('GET',undefined,{},'192.168.1.10')).status,403)
  assert.equal((await call('PATCH',{...payload,changes:{...changes,price:-1}})).status,400)
  assert.equal((await call('PATCH',{...payload,changes:{...changes,stock:1.5}})).status,400)
  assert.equal((await call('PATCH',{...payload,changes:{...changes,image:'/other.png'}})).status,400)
  assert.equal((await call('PATCH',{...payload,id:'new-product'})).status,404)
  const saved=await call('PATCH',payload)
  assert.equal(saved.status,200)
  const updated=await call()
  assert.equal(updated.body.products[0].price,123456)
  assert.equal(updated.body.products[0].stock,0)
  assert.equal(updated.body.products[0].priceIsPlaceholder,false)
  assert.deepEqual(updated.body.products[0].images,p.images)
  assert.deepEqual(updated.body.products.slice(1),initial.body.products.slice(1))
  assert.equal(await readFile(new URL('./data.ts.admin-backup',file),'utf8'),original)
  assert.ok((await readFile(file,'utf8')).includes('"price": 123456'))
  assert.equal((await call('PATCH',payload)).status,409)
  const concurrent={...payload,revision:saved.body.revision,changes:{...changes,stock:null,price:250000}}
  const results=await Promise.all([call('PATCH',concurrent),call('PATCH',concurrent)])
  assert.deepEqual(results.map(r=>r.status),[200,409])
  assert.equal((await call()).body.products[0].stock,null)
  const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='
  const creation = {creationKey:randomUUID(),changes:{...changes,name:'Test new product',stock:5},images:['data:image/png;base64,'+png]}
  assert.equal((await call('POST',{...creation,images:[]})).status,400)
  const oversized = Buffer.alloc(3 * 1024 * 1024 + 1)
  Buffer.from(png,'base64').copy(oversized)
  assert.equal((await call('POST',{...creation,images:['data:image/png;base64,'+oversized.toString('base64')]})).status,400)
  assert.equal((await call('POST',{...creation,images:['data:image/png;base64,aGVsbG8=']})).status,400)
  assert.equal((await call('POST',{...creation,creationKey:'../bad'})).status,400)
  const created = await call('POST',creation)
  assert.equal(created.status,201)
  assert.equal(created.body.product.name,'Test new product')
  assert.equal(created.body.product.stock,5)
  assert.equal(created.body.product.identification,'owner-supplied')
  assert.equal((await call()).body.products.length,initial.body.products.length+1)
  const imageName = created.body.product.image.split('/').pop()
  assert.deepEqual(await readFile(join(dir,imageName)),Buffer.from(png,'base64'))
  assert.equal((await call('POST',creation)).status,409)
  assert.equal((await call('PATCH',{id:created.body.product.id,revision:created.body.revision,changes:{...creation.changes,price:555}})).status,200)
  assert.ok((await readFile(file,'utf8')).includes('"price": 555'))
  console.log('Creation checks passed: product and photo persistence, editable new product, invalid images, safe IDs, and duplicate submission protection.')
  console.log('Admin checks passed: persistent edits, stock/price validation, preserved images and other products, backup, local access restriction, stale and concurrent save conflicts.')
} finally {
  for (const name of await readdir(dir)) await unlink(join(dir,name))
  await rmdir(dir)
}
