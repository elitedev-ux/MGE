import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { money, type Product } from '../data'
import { useShop } from '../store'
import { OptimizedImage } from './OptimizedImage'

export const ProductCard = memo(function ProductCard({ product: p }: { product: Product }) {
  const add = useShop(s => s.add)
  const save = useShop(s => s.save)
  const saved = useShop(s => s.wishlist.includes(p.id))
  return <article className="product-card">
    <div className="product-photo">
      <Link to={`/product/${p.id}`}><OptimizedImage src={p.image} alt={p.name} loading="lazy" sizes="(max-width: 700px) 45vw, (max-width: 1000px) 40vw, 300px" /></Link>
      {p.badge && <span className="badge">{p.badge}</span>}
      <button className={`save icon-button ${saved ? 'saved' : ''}`} aria-label={`Save ${p.name}`} aria-pressed={saved} onClick={() => save(p.id)}><Heart size={16} /></button>
    </div>
    <div className="product-info">
      <p className="product-brand">{p.brand}</p>
      <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
      <div className="product-meta">{p.stock === null ? 'Availability on request' : p.stock > 0 ? 'In stock' : 'Out of stock'}{p.priceIsPlaceholder && <small>Demo price</small>}</div>
      <div className="price-row"><div><strong>{money(p.price)}</strong>{p.original && <del>{money(p.original)}</del>}</div><button className="add-button" disabled={p.stock === 0} aria-label={`Add ${p.name} to bag`} onClick={() => add(p.id)}><ShoppingBag size={16} /></button></div>
    </div>
  </article>
})
