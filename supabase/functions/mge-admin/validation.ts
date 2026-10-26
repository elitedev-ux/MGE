import { z } from 'npm:zod@3.25.76'

const text = z.string().trim().min(1).max(300)
export const edits = z.object({
  name:text, brand:text,
  category:z.enum(['Laptops','Audio','Charging','Wearables','Gaming','Lighting','Office','Accessories']),
  price:z.number().finite().min(0).max(1e10), priceIsPlaceholder:z.boolean(),
  original:z.number().finite().min(0).max(1e10).nullable(),
  stock:z.number().int().min(0).max(1000000).nullable(),
  description:z.string().trim().min(1).max(10000), badge:z.string().trim().max(80),
  detailsNote:z.string().trim().max(5000), specs:z.record(text,z.string().trim().min(1).max(2000)),
}).strict().refine(p => p.original === null || p.original > p.price, {message:'Original price must be greater than the selling price.'})

export function photo(value:unknown) {
  const match = typeof value === 'string' && value.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/)
  if (!match || match[2].length > 4*1024*1024) throw new Error('Use PNG, JPEG, or WebP photos, up to 3 MB each.')
  const bytes = Uint8Array.from(atob(match[2]), c => c.charCodeAt(0))
  const valid = match[1] === 'png' ? [137,80,78,71,13,10,26,10].every((b,i) => bytes[i] === b)
    : match[1] === 'jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP'
  if (!valid || bytes.length > 3*1024*1024) throw new Error('Each photo must be a valid PNG, JPEG, or WebP of 3 MB or less.')
  return {bytes, type:'image/'+match[1], extension:match[1] === 'jpeg' ? 'jpg' : match[1]}
}

export function toChanges(value:z.infer<typeof edits>) {
  return {name:value.name,brand:value.brand,category:value.category,price:value.price,
    price_is_placeholder:value.priceIsPlaceholder,original:value.original,stock:value.stock,
    description:value.description,badge:value.badge || null,details_note:value.detailsNote,specs:value.specs}
}
