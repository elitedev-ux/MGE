import { create } from 'zustand'
import type { Product } from './data'

type Catalogue = {products:Product[]; ready:boolean; error:string}
export const useCatalogue = create<Catalogue>(() => ({products:[],ready:false,error:''}))
export const useProducts = () => useCatalogue(s => s.products)
export function setCatalogue(products:Product[]) { useCatalogue.setState({products,ready:true,error:''}) }
