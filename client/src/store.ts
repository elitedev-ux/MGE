import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products, purchaseLimit } from './data'

type ShopState = {cart:Record<string,number>; wishlist:string[]; add:(id:string)=>void; quantity:(id:string,n:number)=>void; save:(id:string)=>void}
const findProduct = (id:string) => products.find(p=>p.id===id)
// Remove retired demo IDs on hydration so header counts match visible products.
function cleanSaved(value:unknown):Pick<ShopState,'cart'|'wishlist'> {
  const saved = (value && typeof value==='object' ? value : {}) as Partial<ShopState>
  const cart:Record<string,number> = {}
  for(const [id,n] of Object.entries(saved.cart || {})) {
    const product=findProduct(id)
    if(product && typeof n==='number' && Number.isFinite(n) && n>=1 && purchaseLimit(product)>0)cart[id]=Math.min(Math.floor(n),purchaseLimit(product))
  }
  const wishlist=Array.isArray(saved.wishlist)?[...new Set(saved.wishlist.filter(id=>typeof id==='string' && findProduct(id)))]:[]
  return {cart,wishlist}
}
export const useShop = create<ShopState>()(persist((set)=>({
  cart:{},wishlist:[],
  add:(id)=>set(s=>{
    const product=findProduct(id)
    if(!product || purchaseLimit(product)<=0)return s
    return {cart:{...s.cart,[id]:Math.min((s.cart[id]||0)+1,purchaseLimit(product))}}
  }),
  quantity:(id,n)=>set(s=>{
    const product=findProduct(id)
    if(!product || !Number.isFinite(n))return s
    const cart={...s.cart}; const count=Math.min(Math.floor(n),purchaseLimit(product))
    if(count<=0)delete cart[id];else cart[id]=count
    return {cart}
  }),
  save:(id)=>set(s=>!findProduct(id)?s:{wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):[...s.wishlist,id]})
}),{name:'mge-shopping-v1',version:2,migrate:cleanSaved,merge:(persisted,current)=>({...current,...cleanSaved(persisted)})}))
