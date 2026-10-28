import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Save, Package, X, Plus } from 'lucide-react'
import { categories, money, type Product } from './data'
import { Button } from './components/ui/button'
import './admin.css'
import { AdminAccess, lockAdmin } from './AdminAccess'
import { fetchCatalogue, publishCatalogue, saveProduct, deleteProduct } from './catalogue-api'
import { OptimizedImage } from './components/OptimizedImage'

type Draft = { name:string; brand:string; category:string; price:string; original:string; stock:string; description:string; badge:string; detailsNote:string; priceIsPlaceholder:boolean; specs:[string,string][] }
const draftOf = (p:Product):Draft => ({name:p.name,brand:p.brand,category:p.category,price:String(p.price),original:p.original == null ? '' : String(p.original),stock:p.stock === null ? '' : String(p.stock),description:p.description,badge:p.badge || '',detailsNote:p.detailsNote,priceIsPlaceholder:p.priceIsPlaceholder,specs:Object.entries(p.specs)})
export default function Admin() { return <AdminAccess><ProductManager /></AdminAccess> }

function ProductManager() {
  const [products,setProducts] = useState<Product[]>([])
  const [revisions,setRevisions] = useState<Record<string,string>>({})
  const [selected,setSelected] = useState<Product | null>(null)
  const [creating,setCreating] = useState(false)
  const [photos,setPhotos] = useState<string[]>([])
  const [readingPhotos,setReadingPhotos] = useState(false)
  const [draft,setDraft] = useState<Draft | null>(null)
  const [search,setSearch] = useState('')
  const [category,setCategory] = useState('')
  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)
  const [error,setError] = useState('')
  const [notice,setNotice] = useState('')
  const dirty = !!(draft && selected && (creating || photos.length > 0 || JSON.stringify(draft) !== JSON.stringify(draftOf(selected))))
  async function load() {
    setLoading(true); setError('')
    try {
      const result = await fetchCatalogue()
      publishCatalogue(result.products)
      setProducts(result.products); setRevisions(result.revisions)
      setSelected(null); setDraft(null); setCreating(false); setPhotos([])
    } catch(e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  useEffect(() => {
    const warn = (event:BeforeUnloadEvent) => { if (dirty) {event.preventDefault();event.returnValue=''} }
    window.addEventListener('beforeunload',warn)
    return () => window.removeEventListener('beforeunload',warn)
  }, [dirty])
  const discard = () => !dirty || window.confirm('Discard your unsaved product changes?')
  const select = (p:Product) => { if (!saving && !readingPhotos && discard()) { setCreating(false);setPhotos([]);setSelected(p);setDraft(draftOf(p));setError('');setNotice('') } }
  const field = <K extends keyof Draft>(key:K,value:Draft[K]) => {setDraft(d => d ? {...d,[key]:value} : d);setNotice('')}
  function newProduct() {
    if (saving || readingPhotos || !discard()) return
    const product:Product = {id:crypto.randomUUID(),name:'',brand:'',category:categories[0],price:0,priceIsPlaceholder:false,image:'',images:[],specs:{},description:'',stock:null,identification:'owner-supplied',detailsNote:'',sources:[]}
    setCreating(true);setPhotos([]);setSelected(product);setDraft({...draftOf(product),price:''});setError('');setNotice('')
  }
  async function addPhotos(files:FileList | null) {
    if (!files?.length) return
    if (files.length + photos.length > 4) {setError('You can add up to four photos.');return}
    setReadingPhotos(true);setError('')
    try {
      const added = await Promise.all([...files].map(file => {
        if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 3*1024*1024) throw new Error('Use PNG, JPEG, or WebP photos, up to 3 MB each.')
        return new Promise<string>((resolve,reject) => {const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read this photo.'));reader.readAsDataURL(file)})
      }))
      setPhotos(current => [...current,...added])
    } catch(e) {setError((e as Error).message)}
    finally {setReadingPhotos(false)}
  }
  async function removeProduct() {
    if(!selected || creating || saving || readingPhotos)return
    const product=selected
    if(!window.confirm(`Delete "${product.name}"? This permanently removes it from the catalogue and storefront. This cannot be undone.${dirty ? ' Unsaved changes will also be discarded.' : ''}`))return
    setSaving(true);setError('');setNotice('')
    try {
      await deleteProduct(product.id,revisions[product.id])
      setProducts(items=>items.filter(p=>p.id!==product.id))
      setRevisions(current=>{const next={...current};delete next[product.id];return next})
      setSelected(null);setDraft(null);setPhotos([]);setCreating(false)
      setNotice(`"${product.name}" was deleted from your collection.`)
    }catch(e){setError((e as Error).message)}finally{setSaving(false)}
  }
  async function save(event:React.FormEvent) {
    event.preventDefault()
    if (!draft || !selected || saving || readingPhotos) return
    if (creating && !photos.length) {setError('Add at least one product photo.');return}
    const specs:Record<string,string> = {}
    for (const [key,value] of draft.specs) {
      if (!key.trim() || !value.trim()) {setError('Each specification needs a name and value.');return}
      if (Object.hasOwn(specs,key.trim())) {setError('Specification names must be unique.');return}
      specs[key.trim()] = value.trim()
    }
    setSaving(true);setError('');setNotice('')
    try {
      const changes = {...draft,price:Number(draft.price),original:draft.original === '' ? null : Number(draft.original),stock:draft.stock === '' ? null : Number(draft.stock),specs}
      const result = await saveProduct(creating ? 'create' : 'update', creating ? {creationKey:selected.id,images:photos,changes} : {id:selected.id,revision:revisions[selected.id],images:photos,changes})
      setProducts(items => creating ? [...items,result.product] : items.map(p => p.id === selected.id ? result.product : p))
      setSelected(result.product);setDraft(draftOf(result.product))
      setRevisions(r => ({...r,[result.product.id]:result.revision}))
      setCreating(false);setPhotos([]);setSearch('');setCategory('')
      setNotice('Product saved. Your storefront now uses these details.')
    } catch(e) {setError((e as Error).message)}
    finally {setSaving(false)}
  }
  const filtered = products.filter(p => (!category || p.category === category) && [p.name,p.brand,p.id].join(' ').toLowerCase().includes(search.toLowerCase()))
  return <div className="admin-shell">
    <header className="admin-header"><Link to="/" onClick={e => {if (!discard()) e.preventDefault()}} aria-label="Back to storefront"><OptimizedImage src="/mge-brand-logo.png" alt="MGE" sizes="110px" /></Link><span>Catalogue manager</span><Link to="/" onClick={e => {if (!discard()) e.preventDefault()}}><ArrowLeft size={16}/> View store</Link></header>
    <main className="admin-main">
      <div className="admin-heading"><div><p className="admin-eyebrow">MGE / ADMIN</p><h1>Your products, refined.</h1><p>Add to your collection and keep every detail up to date.</p></div><div className="admin-heading-actions"><Button variant="outline" disabled={saving || readingPhotos} onClick={() => {if(discard())void lockAdmin().catch(e=>setError(e.message))}}>Lock admin</Button><Button variant="outline" disabled={saving || readingPhotos} onClick={() => {if(discard())void load()}}>Reload</Button><Button onClick={newProduct} disabled={loading || saving || readingPhotos}><Plus size={16}/> New product</Button></div></div>
      <p className="admin-explainer">Saved changes are published to your online collection. Photos can be up to 3 MB each.</p>
      {error && <div className="admin-alert" role="alert">{error}</div>}
      {notice && <div className="admin-success" role="status">{notice}</div>}
      {loading ? <p role="status">Loading catalogue…</p> : <div className="admin-layout">
        <aside className="admin-catalogue">
          <div className="admin-list-tools"><h2>Collection <span>{products.length}</span></h2><label className="admin-search"><Search size={17}/><input aria-label="Search products" placeholder="Search name or brand" value={search} onChange={e => setSearch(e.target.value)}/></label><select aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select><small>{filtered.length} products</small></div>
          <div className="admin-product-list">{filtered.map(p => <button key={p.id} className={selected?.id === p.id ? 'selected' : ''} onClick={() => select(p)} disabled={saving || readingPhotos} aria-pressed={selected?.id === p.id}><OptimizedImage src={p.image} alt="" sizes="48px" loading="lazy"/><span><strong>{p.name}</strong><small>{p.category} · {money(p.price)}</small></span></button>)}{!filtered.length && <p className="admin-no-results">No matching products. Try a different search.</p>}</div>
        </aside>
        {!selected || !draft ? <section className="admin-empty"><Package size={38}/><h2>A little detail makes a difference.</h2><p>Select a product to edit, or choose New product to grow your collection.</p></section> :
        <form className="admin-editor" onSubmit={save}>
          <div className="admin-editor-heading"><div><p className="admin-eyebrow">{creating ? 'NEW PRODUCT' : 'EDIT PRODUCT'}</p><h2>{creating ? 'Add something new.' : selected.name}</h2>{!creating && <small>{selected.id}</small>}</div>{!creating && <a href={'/product/'+selected.id} target="_blank" rel="noreferrer">Preview ↗</a>}</div>
          <fieldset disabled={saving || readingPhotos}>
          <div className="admin-upload"><label>{creating ? 'Product photos' : 'Replace product photos (optional)'}<input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e => {void addPhotos(e.target.files);e.target.value=''}}/><small>Up to 4 photos, 3 MB each. The first photo is the main product image.</small></label><div className="admin-photos">{photos.map((src,i) => <div key={i}><img src={src} alt={'New product photo '+(i+1)}/><button type="button" aria-label={'Remove photo '+(i+1)} onClick={() => setPhotos(p => p.filter((_,j) => j !== i))}><X size={14}/></button></div>)}</div>{readingPhotos && <p role="status">Reading photos…</p>}</div>{!creating && !photos.length && <div className="admin-photos">{selected.images.map(src => <OptimizedImage key={src} src={src} alt={selected.name} sizes="110px"/>)}</div>}
          <h3>Product details</h3>
          <label>Product name<input required maxLength={300} value={draft.name} onChange={e => field('name',e.target.value)}/></label>
          <div className="admin-fields"><label>Brand<input required maxLength={300} value={draft.brand} onChange={e => field('brand',e.target.value)}/></label><label>Category<select value={draft.category} onChange={e => field('category',e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div>
          <label>Description<textarea required maxLength={10000} rows={4} value={draft.description} onChange={e => field('description',e.target.value)}/></label>
          <h3>Pricing & availability</h3>
          <div className="admin-fields"><label>Price (₦)<input type="number" required min="0" max="10000000000" step="0.01" value={draft.price} onChange={e => field('price',e.target.value)}/></label><label>Original price (₦, optional)<input type="number" min="0" max="10000000000" step="0.01" value={draft.original} onChange={e => field('original',e.target.value)}/></label></div>
          <label className="admin-checkbox"><input type="checkbox" checked={draft.priceIsPlaceholder} onChange={e => field('priceIsPlaceholder',e.target.checked)}/> This is a placeholder price</label>
          <div className="admin-fields"><label>Stock quantity<input type="number" min="0" max="1000000" step="1" placeholder="Unknown / on request" value={draft.stock} onChange={e => field('stock',e.target.value)}/><small>Leave blank for availability on request. Zero means sold out.</small></label><label>Badge (optional)<input maxLength={80} placeholder="e.g. New arrival" value={draft.badge} onChange={e => field('badge',e.target.value)}/></label></div>
          <h3>Specifications</h3>
          {draft.specs.map(([key,value],i) => <div className="admin-spec" key={i}><input aria-label={'Specification name '+(i+1)} required placeholder="Name" value={key} onChange={e => field('specs',draft.specs.map((s,j) => j === i ? [e.target.value,s[1]] : s))}/><input aria-label={'Specification value '+(i+1)} required placeholder="Value" value={value} onChange={e => field('specs',draft.specs.map((s,j) => j === i ? [s[0],e.target.value] : s))}/><button type="button" aria-label={'Remove specification '+(i+1)} onClick={() => field('specs',draft.specs.filter((_,j) => j !== i))}><X size={16}/></button></div>)}
          <Button type="button" variant="outline" onClick={() => field('specs',[...draft.specs,['','']])}><Plus size={15}/> Add specification</Button>
          <label className="admin-note">Product notes<textarea rows={3} maxLength={5000} value={draft.detailsNote} onChange={e => field('detailsNote',e.target.value)}/></label>
          </fieldset>
          <div className="admin-savebar">{!creating && <Button type="button" variant="outline" className="admin-delete" disabled={saving || readingPhotos} onClick={() => void removeProduct()}>Delete product</Button>}<span>{dirty ? 'Unsaved changes' : 'Up to date'}</span><Button type="button" variant="outline" disabled={!dirty || saving || readingPhotos} onClick={() => {if(discard()){if(creating){setCreating(false);setSelected(null);setDraft(null);setPhotos([])}else {setDraft(draftOf(selected));setPhotos([])};setError('')}}}>Discard</Button><Button disabled={!dirty || saving || readingPhotos} type="submit"><Save size={16}/>{saving ? 'Saving…' : creating ? 'Create product' : 'Save changes'}</Button></div>
        </form>}
      </div>}
    </main>
  </div>
}
