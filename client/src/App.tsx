import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, CreditCard, Headphones, Heart, Laptop, Menu, Minus, Mouse, Pause, Play, Plus, RotateCcw, Search, ShieldCheck, ShoppingBag, Smartphone, Truck, Watch, X } from 'lucide-react'
import { OptimizedImage } from './components/OptimizedImage'
const Admin = lazy(() => import('./Admin'))
const Home = lazy(() => import('./Home'))
const SupportPages = lazy(() => import('./SupportPages'))
import { ProductCard } from './components/ProductCard'
import { categories, money, purchaseLimit, type Product } from './data'
import { useProducts } from './catalogue-state'
import { CatalogueBoundary, useCatalogueRefresh } from './CatalogueBoundary'
import { useShop } from './store'
import { whatsappCheckoutUrl } from './checkout'
import { Button } from './components/ui/button'

function Header() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, wishlist } = useShop()
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [location.pathname, location.search])
  return <>
    <header><div className="nav-shell">
      <Link className="logo-lockup" to="/" aria-label="MGE home"><OptimizedImage sizes="150px" src="/mge-brand-logo.png" alt="Miztashogofunmi Global Enterprise" width="124" height="50" /></Link>
      <nav id="main-navigation" className={open ? 'open' : ''} aria-label="Main navigation">{[{label:'Discover',to:'/'},{label:'Shop all',to:'/shop'},{label:'Audio',to:'/shop?category=Audio'},{label:'Laptops',to:'/shop?category=Laptops'},{label:'Accessories',to:'/shop?category=Accessories'}].map(item=><Link key={item.to} to={item.to} className={location.pathname+location.search===item.to?'active':''} aria-current={location.pathname+location.search===item.to?'page':undefined}>{item.label}</Link>)}</nav>
      <div className="nav-actions"><form className="search" onSubmit={(e) => { e.preventDefault(); navigate(`/shop?q=${encodeURIComponent(search)}`) }}><input aria-label="Search products" placeholder="Find your next upgrade" value={search} onChange={(e) => setSearch(e.target.value)} /><button aria-label="Submit search"><Search size={18} /></button></form><Link className="icon-button counted-icon" to="/wishlist" aria-label="Wishlist"><Heart size={20} />{wishlist.length > 0 && <span>{wishlist.length}</span>}</Link><Link className="icon-button counted-icon" to="/cart" aria-label="Shopping bag"><ShoppingBag size={20} />{cartCount > 0 && <span>{cartCount}</span>}</Link><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div></header>
  </>
}

function Shop() {
  const products = useProducts()
  const [params, setParams] = useSearchParams()
  const data = products
  const category = params.get('category') || ''; const query = params.get('q') || ''; const sort = params.get('sort') || 'featured'; const max = Number(params.get('max') || 3000000)
  const update = (k: string, v: string) => { const next = new URLSearchParams(params); v ? next.set(k, v) : next.delete(k); setParams(next) }
  const filtered = data.filter(p => (!category || p.category === category) && `${p.name} ${p.brand} ${Object.values(p.specs).join(' ')}`.toLowerCase().includes(query.toLowerCase()) && p.price <= max && (!params.get('deals') || p.original) && (!params.get('brand') || p.brand === params.get('brand'))).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'newest' ? products.indexOf(b) - products.indexOf(a) : 0)
  return <section className="container page"><p className="purple-kicker">THE MGE COLLECTION</p><h1>{params.get('deals') ? 'Better prices. Same great tech.' : category || 'Find your next favourite.'}</h1><p className="muted">Explore the MGE collection. Placeholder prices are labelled; confirm availability before ordering.</p><div className="shop-layout"><aside className="filters"><h3>Categories</h3>{['', ...categories].map(c => <button className={category === c ? 'selected' : ''} key={c} onClick={() => update('category', c)}>{c || 'All products'}<ChevronRight size={14} /></button>)}<label>Brand<select value={params.get('brand') || ''} onChange={e => update('brand', e.target.value)}><option value="">All brands</option>{[...new Set(products.map(p => p.brand))].map(b => <option key={b}>{b}</option>)}</select></label><label>Maximum price <span>{money(max)}</span><input type="range" min="0" max="3000000" step="1000" value={max} onChange={e => update('max', e.target.value)} /></label><Button variant="ghost" onClick={() => setParams({})}>Reset filters</Button></aside><div><div className="shop-toolbar"><form onSubmit={e => e.preventDefault()}><Search size={17} /><input value={query} onChange={e => update('q', e.target.value)} placeholder="Search products or specifications" aria-label="Search collection" /></form><select aria-label="Sort products" value={sort} onChange={e => update('sort', e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="newest">Newest arrivals</option></select></div><p className="muted small">{filtered.length} products</p><div className="product-grid shop-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>{!filtered.length && <div className="empty"><h2>No products found.</h2><p>Try a different search or reset your filters.</p><Button onClick={() => setParams({})}>Reset filters</Button></div>}</div></div></section>
}

function ProductPage() {
  const products = useProducts()
  const { slug } = useParams()
  const p = products.find(p => p.id === slug)
  const { add, save, wishlist } = useShop()
  const [zoom, setZoom] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  useEffect(() => { setImageIndex(0); setZoom(false) }, [slug])
  if (!p) return <NotFound />
  const currentImage = p.images[imageIndex] || p.image
  return <section className="container page">
    <div className="breadcrumb"><Link to="/shop">Shop</Link><ChevronRight size={14}/><Link to={`/shop?category=${p.category}`}>{p.category}</Link><ChevronRight size={14}/>{p.name}</div>
    <div className="detail-grid">
      <div className="product-gallery">
        <button className="detail-image" onClick={() => setZoom(true)} aria-label="Enlarge product image"><OptimizedImage src={currentImage} alt={p.name} sizes="(max-width: 700px) 90vw, 600px" fetchPriority="high"/><span>Click to explore</span></button>
        {p.images.length > 1 && <div className="gallery-thumbnails" aria-label="Product images">{p.images.map((src,i) => <button key={src} onClick={() => setImageIndex(i)} aria-label={`View image ${i+1} of ${p.name}`} aria-pressed={imageIndex === i}><OptimizedImage src={src} alt={`${p.name} — view ${i+1}`} sizes="80px" loading="lazy"/></button>)}</div>}
      </div>
      <div className="detail-copy">
        <p className="purple-kicker">{p.brand} / {p.category}</p><h1>{p.name}</h1><p className="muted">{p.description}</p>
        <div className="detail-price">{money(p.price)} {p.original && <del>{money(p.original)}</del>}</div>
        {p.priceIsPlaceholder && <p className="demo-price-note">Demo price · Final selling price to be confirmed.</p>}
        <p className="stock">{p.stock === null ? 'Availability: confirm with MGE' : p.stock > 0 ? `${p.stock} available` : 'Currently out of stock'}</p>
        <div className="spec-list">{Object.entries(p.specs).map(([k,v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
        <Button className="full" disabled={p.stock === 0} onClick={() => add(p.id)}>Add to bag <ShoppingBag size={18}/></Button>
        <Button variant="outline" className="full" onClick={() => save(p.id)}><Heart size={17}/>{wishlist.includes(p.id) ? 'Saved to wishlist' : 'Save for later'}</Button>
        <p className="small muted">{p.detailsNote}</p>
        {p.sources.length > 0 && <details className="product-sources"><summary>Product references</summary>{p.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} <ArrowRight size={12}/></a>)}</details>}
      </div>
    </div>
    <div className="section-heading related"><h2>You may also like.</h2></div>
    <div className="product-grid">{products.filter(x => x.id !== p.id && x.category === p.category).slice(0,4).map(x => <ProductCard product={x} key={x.id}/>)}</div>
    {zoom && <div className="image-modal" role="dialog" aria-modal="true" aria-label="Product image" onClick={() => setZoom(false)} onKeyDown={e => e.key === 'Escape' && setZoom(false)}><button autoFocus className="icon-button" aria-label="Close image" onClick={() => setZoom(false)}><X/></button><OptimizedImage src={currentImage} alt={p.name} sizes="90vw"/></div>}
  </section>
}

function Cart() {
  const products = useProducts()
  const { cart, quantity } = useShop(); const entries = products.filter(p => cart[p.id]); const total = entries.reduce((s, p) => s + p.price * cart[p.id], 0)
  return <section className="container page"><p className="purple-kicker">YOUR MGE BAG</p><h1>Your shopping bag.</h1>{!entries.length ? <div className="empty"><ShoppingBag size={40} /><h2>Your bag is ready for something great.</h2><p>Discover technology made for your everyday.</p><Button asChild><Link to="/shop">Explore products <ArrowRight size={16} /></Link></Button></div> : <div className="cart-layout"><div>{entries.map(p => <div className="cart-row" key={p.id}><OptimizedImage src={p.image} alt={p.name} sizes="90px" /><div><Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link><p>{money(p.price)}</p><button className="remove" onClick={() => quantity(p.id, 0)}>Remove</button></div><div className="quantity"><button aria-label={`Decrease ${p.name} quantity`} onClick={() => quantity(p.id, cart[p.id] - 1)}><Minus size={14} /></button>{cart[p.id]}<button aria-label={`Increase ${p.name} quantity`} onClick={() => quantity(p.id, cart[p.id] + 1)} disabled={cart[p.id] >= purchaseLimit(p)}><Plus size={14} /></button></div></div>)}</div><div className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Delivery</span><span>Confirmed on WhatsApp</span></div><p>{entries.some(p => p.priceIsPlaceholder) && <>Your bag includes placeholder prices. </>}Confirm final prices, availability, and delivery with MGE on WhatsApp. Your cart items will be filled in—just review and send.</p><Button asChild className="full"><a href={whatsappCheckoutUrl(entries.map(p => ({ name: p.name, quantity: cart[p.id] })))} target="_blank" rel="noopener noreferrer">Checkout on WhatsApp <ArrowRight size={16} /></a></Button></div></div>}</section>
}

function Wishlist() { const products = useProducts(); const { wishlist } = useShop(); return <section className="container page"><p className="purple-kicker">SAVED FOR LATER</p><h1>Your wishlist.</h1><div className="product-grid">{products.filter(p => wishlist.includes(p.id)).map(p => <ProductCard key={p.id} product={p} />)}</div>{!wishlist.length && <div className="empty"><Heart size={38} /><h2>Save something you love.</h2><p>Tap the heart on a product to keep it here.</p><Button asChild><Link to="/shop">Discover products</Link></Button></div>}</section> }
function Info() { return <section className="container page info-page"><p className="purple-kicker">MGE</p><h1>Technology for every day.</h1><p>Miztashogofunmi Global Enterprise (MGE) brings together laptops, accessories, and everyday technology. Explore the collection and speak with us on WhatsApp to confirm the right product for you.</p><Button asChild><Link to="/shop">Explore products <ArrowRight size={16} /></Link></Button></section> }
function NotFound() { return <section className="container page empty"><p className="purple-kicker">404</p><h1>That page is out of range.</h1><p>Let’s get you back to the good stuff.</p><Button asChild><Link to="/">Back to MGE</Link></Button></section> }

function Footer() {
  return <footer><div className="container footer-lead"><div><p>MAKE ROOM FOR SOMETHING BETTER</p><h2>Your next upgrade starts here.</h2></div><Button asChild><Link to="/shop">Discover MGE <ArrowRight size={18}/></Link></Button></div><div className="container footer-grid"><div className="footer-brand"><Link className="footer-logo" to="/" aria-label="Miztashogofunmi Global Enterprise home"><OptimizedImage sizes="150px" src="/mge-brand-logo.png" alt="MGE" width="150" height="60" /></Link><p className="brand-full-name">Miztashogofunmi Global Enterprise</p><p>Thoughtful tech. Everyday possibilities.</p><small>A considered collection of technology for the way you work, connect, and live.</small></div><div><h4>Explore</h4><Link to="/shop?category=Audio">Audio</Link><Link to="/shop?category=Laptops">Laptops</Link><Link to="/shop?category=Accessories">Accessories</Link><Link to="/shop?category=Wearables">Wearables</Link></div><div><h4>Let us help</h4><Link to="/contact">Contact & support</Link><Link to="/delivery">Delivery information</Link><Link to="/returns">Returns & warranty</Link></div><div><h4>About MGE</h4><Link to="/about">Our story</Link><Link to="/wishlist">Your wishlist</Link><Link to="/privacy">Privacy & terms</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Miztashogofunmi Global Enterprise. All rights reserved.</span><span>Nigeria · NGN ₦</span></div></footer>
}

export default function App() {
  const location = useLocation()
  useCatalogueRefresh(location.pathname + location.search)
  useEffect(() => {
    const titles:Record<string,string> = {'/':'Premium technology for your everyday','/contact':'Contact & support','/delivery':'Delivery information','/returns':'Returns & warranty','/privacy':'Privacy','/terms':'Terms of purchase','/about':'Our story','/mgeadmin':'Product manager','/shop':'Shop the collection','/cart':'Your shopping bag','/wishlist':'Your wishlist'}
    document.title = (titles[location.pathname] || 'MGE collection') + ' | Miztashogofunmi Global Enterprise'
  }, [location.pathname])
  if (location.pathname === '/mgeadmin' || location.pathname === '/mgeadmin/') return <Suspense fallback={<main className="container page" role="status">Loading product manager…</main>}><Admin /></Suspense>
  return <><Header /><main><Suspense fallback={<div className="route-loading" role="status">Loading collection…</div>}><Routes><Route path="/" element={<CatalogueBoundary><Home /></CatalogueBoundary>} /><Route path="/shop" element={<CatalogueBoundary><Shop /></CatalogueBoundary>} /><Route path="/product/:slug" element={<CatalogueBoundary><ProductPage /></CatalogueBoundary>} /><Route path="/cart" element={<CatalogueBoundary><Cart /></CatalogueBoundary>} /><Route path="/wishlist" element={<CatalogueBoundary><Wishlist /></CatalogueBoundary>} /><Route path="/about" element={<Info />} />{['contact', 'delivery', 'returns', 'privacy', 'terms'].map(path => <Route key={path} path={`/${path}`} element={<SupportPages />} />)}<Route path="*" element={<NotFound />} /></Routes></Suspense></main><Footer /></>
}
