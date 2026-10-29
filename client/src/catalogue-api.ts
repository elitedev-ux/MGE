import type { Product } from './data'
import { backendUrl, publishableKey } from './backend-config'
import { setCatalogue, useCatalogue } from './catalogue-state'

export type ProductRow = Omit<Product,'priceIsPlaceholder'|'detailsNote'|'original'|'badge'> & {
  price_is_placeholder:boolean; details_note:string; original:number|null; badge:string|null; revision:number; sort_order:number
}
export function rowToProduct(row:ProductRow):Product {
  return {id:row.id,name:row.name,brand:row.brand,category:row.category,price:Number(row.price),
    priceIsPlaceholder:row.price_is_placeholder,original:row.original == null ? undefined : Number(row.original),
    badge:row.badge || undefined,image:row.image,images:row.images,specs:row.specs,description:row.description,
    stock:row.stock,identification:row.identification,detailsNote:row.details_note,sources:row.sources}
}
function timeoutSignal(milliseconds:number) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(milliseconds)
  if (typeof AbortController === 'undefined') return undefined
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), milliseconds)
  return controller.signal
}
export async function fetchCatalogue() {
  const rows:ProductRow[]=[]
  for(let offset=0;;offset+=1000){
    const response=await fetch(backendUrl+'/rest/v1/products?select=*&order=sort_order.asc&limit=1000&offset='+offset,{headers:{apikey:publishableKey},cache:'no-store',signal:timeoutSignal(15000)})
    if(!response.ok)throw new Error('We could not load the collection. Please try again.')
    const page:ProductRow[]=await response.json()
    if(!Array.isArray(page))throw new Error('The catalogue returned an unexpected response.')
    rows.push(...page)
    if(page.length<1000)break
  }
  return {products:rows.map(rowToProduct),revisions:Object.fromEntries(rows.map(row=>[row.id,String(row.revision)]))}
}
let generation=0
let inFlight:Promise<void>|undefined
export function publishCatalogue(products:Product[]) {generation++;setCatalogue(products)}
export function refreshCatalogue() {
  if(inFlight)return inFlight
  const started=generation
  inFlight=fetchCatalogue().then(result=>{if(started===generation)setCatalogue(result.products)})
    .catch(()=>{if(started===generation && !useCatalogue.getState().ready)useCatalogue.setState({error:'We could not refresh the collection. Please retry before ordering.'})})
    .finally(()=>{inFlight=undefined})
  return inFlight
}

const sessionKey='mge-admin-session-v1'
export const hasAdminSession=()=>!!sessionStorage.getItem(sessionKey)
export const forgetAdminSession=()=>{sessionStorage.removeItem(sessionKey);window.dispatchEvent(new Event('mge-admin-expired'))}
export async function adminRequest(action:string,body:Record<string,unknown>={}) {
  const token=sessionStorage.getItem(sessionKey)
  const response=await fetch(backendUrl+'/functions/v1/mge-admin',{method:'POST',headers:{'Content-Type':'application/json',apikey:publishableKey,...(token?{'X-MGE-Session':token}:{})},body:JSON.stringify({action,...body}),signal:timeoutSignal(90000)})
  const result=await response.json().catch(()=>({error:'The admin service is unavailable. Please try again.'}))
  if(!response.ok){
    if(response.status===401 && action!=='login')forgetAdminSession()
    throw new Error(result.error || 'Unable to save this product. Please retry.')
  }
  if(action==='login')sessionStorage.setItem(sessionKey,result.token)
  if(action==='logout')forgetAdminSession()
  return result
}
export async function saveProduct(action:'create'|'update',body:Record<string,unknown>) {
  const result=await adminRequest(action,body)
  const product=rowToProduct(result.row)
  const current=useCatalogue.getState().products
  publishCatalogue(current.some(p=>p.id===product.id) ? current.map(p=>p.id===product.id?product:p) : [...current,product])
  return {product,revision:String(result.row.revision)}
}
export async function deleteProduct(id:string,revision:string) {
  const result=await adminRequest('delete',{id,revision})
  if(result.deletedId!==id)throw new Error('Deletion could not be confirmed. Reload the catalogue before retrying.')
  publishCatalogue(useCatalogue.getState().products.filter(p=>p.id!==id))
}
