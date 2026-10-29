import { create } from 'zustand'
import type { Product } from './data'

type Catalogue = {products:Product[]; ready:boolean; error:string}
const catalogueCacheKey = 'mge-catalogue-v1'

function cachedProducts():Product[] {
  try {
    const value = localStorage.getItem(catalogueCacheKey)
    const parsed:unknown = value && JSON.parse(value)
    return Array.isArray(parsed) && parsed.every(item => item && typeof item.id === 'string' && typeof item.name === 'string' && Array.isArray(item.images)) ? parsed as Product[] : []
  } catch {
    return []
  }
}

const cached = cachedProducts()
export const useCatalogue = create<Catalogue>(() => ({products:cached,ready:cached.length > 0,error:''}))
export const useProducts = () => useCatalogue(s => s.products)
export function setCatalogue(products:Product[]) {
  try { localStorage.setItem(catalogueCacheKey,JSON.stringify(products)) } catch {}
  useCatalogue.setState({products,ready:true,error:''})
}
