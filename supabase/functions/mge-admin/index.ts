import { edits, photo, toChanges } from './validation.ts'

const base = Deno.env.get('SUPABASE_URL')!
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// Opaque sessions are checked in the database on EVERY request. No Supabase user accounts.
const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey, x-mge-session','Access-Control-Allow-Methods':'POST, OPTIONS'}
const json = (body:unknown,status=200) => new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})
class ApiError extends Error { constructor(public status:number,message:string) {super(message)} }
async function api(path:string,options:RequestInit={}) {
  const response = await fetch(base+path,{...options,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(25000)})
  const body = await response.text()
  if (!response.ok) throw new ApiError(response.status,'The catalogue could not save this request. Please retry or reload.')
  return body ? JSON.parse(body) : null
}
const rpc = (name:string,body:unknown) => api('/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body)})
async function readBody(req:Request) {
  const reader = req.body?.getReader()
  if (!reader) throw new ApiError(400,'Missing request.')
  const chunks:Uint8Array[]=[]; let size=0
  while (true) {
    const {value,done}=await reader.read(); if (done) break
    size+=value.length
    if(size>17*1024*1024){await reader.cancel();throw new ApiError(413,'Images or product details are too large.')}
    chunks.push(value)
  }
  const bytes=new Uint8Array(size);let offset=0
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
  try {return JSON.parse(new TextDecoder().decode(bytes))} catch {throw new ApiError(400,'Invalid request.')}
}
Deno.serve(async req => {
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors})
  if(req.method!=='POST')return json({error:'Method not allowed.'},405)
  try {
    const input=await readBody(req)
    if(!input || typeof input!=='object')return json({error:'Invalid request.'},400)
    if(input.action==='login') {
      if(typeof input.password!=='string' || !input.password.length || input.password.length>128)return json({error:'Enter your admin password.'},400)
      const client=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(client)))).map(b=>b.toString(16).padStart(2,'0')).join('')
      const result=await rpc('mge_admin_login',{p_password:input.password,p_client_hash:hash})
      return json(result,result.status || 200)
    }
    const token=req.headers.get('x-mge-session') || ''
    if(!/^[a-f0-9]{64}$/.test(token) || !await rpc('mge_admin_authorize',{p_token:token}))return json({error:'Your session has expired. Enter your password to continue.'},401)
    if(input.action==='logout'){await rpc('mge_admin_logout',{p_token:token});return json({ok:true})}
    if(input.action==='session')return json({ok:true})
    if(input.action==='discardPhoto') {
      const path=input.path
      if(typeof path!=='string' || !/^product-[a-f0-9-]{36}\/[a-f0-9-]{36}\.(png|jpg|webp)$/.test(path))return json({error:'Invalid photo path.'},400)
      const url=base+'/storage/v1/object/public/product-images/'+path
      const referenced=await api('/rest/v1/products?select=id&images=cs.'+encodeURIComponent('{'+url+'}')+'&limit=1')
      if(referenced.length)return json({error:'This photo is still used by a product.'},409)
      await api('/storage/v1/object/product-images',{method:'DELETE',body:JSON.stringify({prefixes:[path]})})
      return json({ok:true})
    }
    if(input.action!=='create' && input.action!=='update')return json({error:'Unknown action.'},400)
    const parsed=edits.safeParse(input.changes)
    if(!parsed.success)return json({error:parsed.error.issues[0].message},400)
    const creating=input.action==='create'
    if(creating && !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(input.creationKey || ''))return json({error:'Invalid creation identifier.'},400)
    const id=creating ? 'product-'+input.creationKey : input.id
    if(typeof id!=='string' || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(id))return json({error:'Invalid product.'},400)
    const existing=await api('/rest/v1/products?id=eq.'+encodeURIComponent(id)+'&select=*')
    if(creating && existing.length)return json({error:'This product was already created. Reload the catalogue to find it.'},409)
    if(!creating && !existing.length)return json({error:'Product not found.'},404)
    if(!creating && String(existing[0].revision)!==String(input.revision))return json({error:'This product changed in another editor. Reload the catalogue before saving.'},409)
    const photos=input.images ?? []
    if(!Array.isArray(photos) || photos.length>4 || (creating && !photos.length))return json({error:'Add between one and four product photos.'},400)
    let decoded:ReturnType<typeof photo>[]
    try {decoded=photos.map(photo)} catch(e){return json({error:(e as Error).message},400)}
    const uploaded:string[]=[];const urls:string[]=[]
    const cleanup=async()=>{if(uploaded.length)await api('/storage/v1/object/product-images',{method:'DELETE',body:JSON.stringify({prefixes:uploaded})}).catch(()=>{})}
    try {
      for(const item of decoded){
        const path=id+'/'+crypto.randomUUID()+'.'+item.extension
        await api('/storage/v1/object/product-images/'+path,{method:'POST',headers:{'Content-Type':item.type,'cache-control':'3600'},body:item.bytes})
        uploaded.push(path);urls.push(base+'/storage/v1/object/public/product-images/'+path)
      }
    }catch(e){await cleanup();throw e}
    const values={...toChanges(parsed.data),...(urls.length ? {image:urls[0],images:urls} : {}),...(creating ? {id,identification:'owner-supplied',sources:[]} : {})}
    let rows
    try {
      rows=await api('/rest/v1/products'+(creating ? '' : '?id=eq.'+encodeURIComponent(id)+'&revision=eq.'+Number(input.revision)),{method:creating?'POST':'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(values)})
    }catch(e){
      // Only clean up on a definite rejected write; a lost response might have committed.
      if(e instanceof ApiError && e.status>=400 && e.status<500)await cleanup()
      throw e
    }
    if(!rows?.length){await cleanup();return json({error:'This product changed in another editor. Reload before saving.'},409)}
    return json({row:rows[0]},creating?201:200)
  }catch(e){return json({error:e instanceof ApiError ? e.message : 'Connection interrupted. Reload the catalogue to check whether your changes were saved.'},e instanceof ApiError ? e.status : 503)}
})
