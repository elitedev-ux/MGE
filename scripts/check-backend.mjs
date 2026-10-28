import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const config=await readFile(new URL('../client/src/backend-config.ts',import.meta.url),'utf8')
const base=config.match(/https:\/\/[^']+/)[0]
const key=config.match(/sb_publishable_[^']+/)[0]
const password=process.env.MGE_ADMIN_PASSWORD
if(!password)throw new Error('Provide MGE_ADMIN_PASSWORD in this process environment; never commit it.')
let token
async function admin(action,body={},session=token){
  const response=await fetch(base+'/functions/v1/mge-admin',{method:'POST',headers:{apikey:key,'Content-Type':'application/json',...(session?{'X-MGE-Session':session}:{})},body:JSON.stringify({action,...body}),signal:AbortSignal.timeout(90000)})
  return {status:response.status,...await response.json()}
}
const publicRows=await fetch(base+'/rest/v1/products?select=*&order=sort_order.asc',{headers:{apikey:key}}).then(r=>r.json())
assert.ok(Array.isArray(publicRows)&&publicRows.length>=76,'Public catalogue is available')
assert.equal((await admin('session',{},undefined)).status,401,'No session cannot access admin')
assert.equal((await admin('login',{password:'not-the-admin-password'})).status,401,'Wrong password is rejected')
const login=await admin('login',{password});assert.equal(login.status,200,JSON.stringify(login));token=login.token
assert.match(token,/^[a-f0-9]{64}$/)
const fixtures=[]
try{
  assert.equal((await admin('session')).status,200)
  const denied=await fetch(base+'/rest/v1/products?id=eq.'+publicRows[0].id,{method:'PATCH',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({price:1})})
  assert.ok([401,403].includes(denied.status),'Public key cannot edit products')
  const deniedRpc=await fetch(base+'/rest/v1/rpc/mge_admin_authorize',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_token:token})})
  assert.ok([401,403,404].includes(deniedRpc.status),'Public key cannot call private session RPC')
  const deniedUpload=await fetch(base+'/storage/v1/object/product-images/unauthorized.png',{method:'POST',headers:{apikey:key,'Content-Type':'image/png'},body:new Uint8Array([137,80,78,71,13,10,26,10])})
  assert.ok(!deniedUpload.ok,'Public key cannot upload photos')
  const changes={name:'Backend verification product',brand:'MGE QA',category:'Smartphones',price:1000,original:null,stock:2,description:'Temporary automated verification fixture.',badge:'',detailsNote:'',priceIsPlaceholder:true,specs:{Test:'Verification'}}
  const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='
  const creationKey=crypto.randomUUID()
  const created=await admin('create',{creationKey,changes,images:[image]})
  assert.equal(created.status,201,JSON.stringify(created));fixtures.push(created.row)
  assert.equal(created.row.name,changes.name)
  assert.equal((await fetch(created.row.image)).status,200,'Uploaded image is publicly readable')
  const duplicate=await admin('create',{creationKey,changes,images:[image]});assert.equal(duplicate.status,409)
  const updated=await admin('update',{id:created.row.id,revision:String(created.row.revision),changes:{...changes,price:1500}})
  assert.equal(updated.status,200,JSON.stringify(updated));assert.equal(Number(updated.row.price),1500)
  assert.equal(updated.row.revision,created.row.revision+1)
  assert.equal((await admin('update',{id:created.row.id,revision:String(created.row.revision),changes})).status,409,'Stale edits cannot overwrite a newer save')
  const oversized=Buffer.alloc(3*1024*1024+1);Buffer.from([137,80,78,71,13,10,26,10]).copy(oversized)
  assert.equal((await admin('create',{creationKey:crypto.randomUUID(),changes,images:['data:image/png;base64,'+oversized.toString('base64')]})).status,400,'Over-3MB photo is rejected server-side')
  assert.equal((await admin('create',{creationKey:crypto.randomUUID(),changes,images:['data:image/png;base64,'+Buffer.from('not an image').toString('base64')]})).status,400,'Fake image signatures rejected')
  assert.equal((await admin('update',{id:created.row.id,revision:String(updated.row.revision),changes:{...changes,price:-1}})).status,400)
  const reread=await fetch(base+'/rest/v1/products?id=eq.'+created.row.id,{headers:{apikey:key}}).then(r=>r.json())
  assert.equal(Number(reread[0].price),1500,'Saved price is visible to customers')
  assert.equal((await admin('delete',{id:created.row.id,revision:String(created.row.revision)})).status,409,'Stale deletion is rejected')
  assert.equal((await admin('delete',{id:created.row.id,revision:String(updated.row.revision)})).deletedId,created.row.id,'Delete the temporary fixture only')
  assert.deepEqual(await fetch(base+'/rest/v1/products?id=eq.'+created.row.id,{headers:{apikey:key}}).then(r=>r.json()),[],'Deleted fixture disappears publicly')
  for(const url of created.row.images)assert.equal((await admin('discardPhoto',{path:url.split('/product-images/')[1]})).status,200)
  fixtures.length=0
  assert.equal((await admin('logout')).status,200)
  assert.equal((await admin('session')).status,401,'Logout revokes token on the server')
  console.log('Backend checks passed: public reads, password/session checks, denied public writes/RPC/uploads, create, image persistence, edit, concurrency, validation, 3MB limit, and logout.')
}finally{
  if(token)await admin('logout').catch(()=>{})
  // Remove only these fixture IDs and object paths through the privileged maintenance connection.
  console.log('CLEANUP_FIXTURES '+JSON.stringify(fixtures.map(row=>({id:row.id,images:row.images}))))
}
