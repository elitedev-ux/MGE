import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, CreditCard, Headphones, Laptop, Mouse, Pause, Play, RotateCcw, ShieldCheck, Smartphone, Truck, Watch } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { OptimizedImage } from './components/OptimizedImage'

import { products } from './data'
import { Button } from './components/ui/button'


import { ProductCard } from './components/ProductCard'

const categoryCards = [
  { name: 'Charging', note: 'Power for every day', icon: Smartphone },
  { name: 'Audio', note: 'Premium sound', icon: Headphones },
  { name: 'Wearables', note: 'Stay connected', icon: Watch },
  { name: 'Accessories', note: 'Everyday essentials', icon: Mouse },
  { name: 'Laptops', note: 'Work without limits', icon: Laptop },
]

const heroLaptop = products.find(p => p.id === 'hp-elitebook-silver')!
const heroGlasses = products.find(p => p.id === 'aimb-g2-pro-glasses')!
const heroAudio = products.find(p => p.id === 'bose-quietcomfort-ultra')!
const heroSlides = [
  { tone: 'phone', label: 'Phone', kicker: 'A considered collection. An everyday upgrade.', title: <>Good tech.<br /><span>Great possibilities.</span></>, description: 'The accessories you reach for. The details that make a difference. Find your everyday upgrade at MGE.', image: '/mge-phone-podium.png', alt: 'Two graphite smartphones on a silver display stand', href: '/shop?category=Charging', category: 'Accessories', cta: 'Explore accessories', note: 'Phone concept shown' },
  { tone: 'laptop', label: 'Laptop', kicker: 'For the ideas that deserve to go further.', title: <>Big ideas.<br /><span>Beautifully in motion.</span></>, description: 'For your next project, your next workspace, your next chapter. Find a laptop that fits the way you work.', image: '/mge-macbook-podium.png', alt: 'MacBook Pro mockup on a silver display stand', href: '/shop?category=Laptops', category: 'Laptops', cta: 'Explore laptops', note: 'MacBook mockup shown' },
  { tone: 'glasses', label: 'Smart glasses', kicker: 'A fresh perspective on the everyday.', title: <>See the world.<br /><span>A little differently.</span></>, description: 'Discover smart glasses and explore a new way to capture moments, listen, and stay connected.', image: '/mge-glasses-hero.png', alt: 'Illustrative black smart glasses', href: '/product/' + heroGlasses.id, category: 'Wearables', cta: 'Explore smart glasses', note: 'Smart-glasses concept shown' },
]

export default function Home() {
  const reduced = useReducedMotion()
  const [activeSlide, setActiveSlide] = useState(0)
  const [rotationPaused, setRotationPaused] = useState(false)
  const slide = heroSlides[activeSlide]
  const changeSlide = (next: number) => setActiveSlide((next + heroSlides.length) % heroSlides.length)
  useEffect(() => {
    if (rotationPaused) return
    const timer = window.setTimeout(() => setActiveSlide(current => (current + 1) % heroSlides.length), 5000)
    return () => window.clearTimeout(timer)
  }, [rotationPaused, activeSlide])
  return <>
    <section className="showcase" aria-roledescription="carousel" aria-label="Featured MGE technology">
      <div className="showcase-frame">
        <div className="showcase-stage" aria-live={rotationPaused ? 'polite' : 'off'}>
          <AnimatePresence initial={false} mode="sync">
            <motion.div className={`showcase-slide showcase-${slide.tone}`} key={activeSlide} initial={reduced ? false : { x: '100%' }} animate={{ x: 0 }} exit={reduced ? undefined : { x: '-100%' }} transition={{ duration: reduced ? 0 : .3, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="showcase-copy">
                <h1>{slide.title}</h1>
                <p className="showcase-description">{slide.description}</p>
                <div className="showcase-actions">
                  <Button asChild><Link to={`/shop?category=${slide.category}`}>{slide.cta}<ArrowRight size={16}/></Link></Button>
                  <Link className="showcase-secondary" to="/shop">Shop the collection <ChevronRight size={15}/></Link>
                </div>
              </div>
              <div className="showcase-visual">
                <span className="showcase-side-note" aria-hidden="true">DESIGNED FOR YOUR EVERYDAY</span>
                <Link className="showcase-image-link" to={slide.href} aria-label={slide.tone === 'glasses' ? 'Explore smart glasses' : `Explore ${slide.category.toLowerCase()}`}>
                  <OptimizedImage src={slide.image} alt={slide.alt} sizes="(max-width: 700px) 100vw, 740px" fetchPriority={activeSlide === 0 ? "high" : "auto"} draggable={false}/>
                </Link>
                <span className="showcase-edition" aria-hidden="true">THE MGE EDIT<br/><b>0{activeSlide + 1} — 03</b></span>
              </div>
              <p className="showcase-image-note">{slide.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="showcase-controls">
          <span className="showcase-index">0{activeSlide + 1}<span> / 03</span></span>
          <div className="showcase-tabs" aria-label="Choose featured collection">{heroSlides.map((item,index) => <button key={item.tone} className={index === activeSlide ? 'active' : ''} onClick={() => changeSlide(index)} aria-label={`Show ${item.label}`} aria-pressed={index === activeSlide}><span aria-hidden="true"/>{item.label}</button>)}</div>
          <div className="showcase-arrows">
            <button className="showcase-control" aria-label={rotationPaused ? 'Resume automatic slides' : 'Pause automatic slides'} onClick={() => setRotationPaused(!rotationPaused)}>{rotationPaused ? <Play size={13}/> : <Pause size={13}/>}</button>
            <button className="showcase-control" onClick={() => changeSlide(activeSlide - 1)} aria-label="Previous featured product"><ChevronLeft size={16}/></button>
            <button className="showcase-control" onClick={() => changeSlide(activeSlide + 1)} aria-label="Next featured product"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </section>

    <div className="brand-rail"><div className="container"><span>Great technology.<br/>Good company.</span><div><b>HP</b><b>BOSE</b><b className="dell-word">DELL</b><b>Beats</b><b>ZEALOT</b><b>oraimo</b></div></div></div>

    <section className="container home-section"><div className="section-title-line"><div><p>FIND YOUR EVERYDAY</p><h2>A world of possibilities.</h2></div><Link to="/shop">All categories <ArrowRight size={16}/></Link></div><div className="reference-categories">{categoryCards.map(({ name, note, icon:Icon }) => <Link to={`/shop?category=${name}`} className="reference-category" key={name}><div className="category-symbol"><Icon size={34} strokeWidth={1.3}/></div><div><h3>{name}</h3><p>{note}</p></div><ArrowRight size={17}/></Link>)}</div></section>

    <section className="featured-section"><div className="container home-section"><div className="section-title-line"><div><p>THE MGE EDIT</p><h2>Good tech. Great choices.</h2><span>Thoughtfully selected for work, play, and everything in between.</span></div><Link to="/shop">Explore all products <ArrowRight size={16} /></Link></div><div className="product-grid featured-grid">{products.slice(0,4).map((p) => <ProductCard key={p.id} product={p} />)}</div><p className="sample-note">MGE collection · Placeholder prices are labelled. Confirm availability before ordering.</p></div></section>

    <section className="container promo-grid"><Link to="/shop?category=Laptops" className="promo promo-work"><div><p>WORK, BEAUTIFULLY.</p><h2>Big ideas.<br/>Meet your match.</h2><span>Find your laptop <ArrowRight size={17}/></span></div><OptimizedImage sizes="(max-width: 700px) 70vw, 400px" src={heroLaptop.image} alt={heroLaptop.name} loading="lazy"/></Link><Link to="/shop?category=Audio" className="promo promo-audio"><div><p>YOUR MOMENT OF FOCUS</p><h2>Less noise.<br/>More you.</h2><span>Explore audio <ArrowRight size={17}/></span></div><OptimizedImage sizes="(max-width: 700px) 70vw, 400px" src={heroAudio.image} alt={heroAudio.name} loading="lazy"/></Link></section>

    <section className="service-row container">{[[ShieldCheck, 'Product details', 'Explore specifications'], [CreditCard, 'Secure payments', 'Flexible ways to pay'], [Truck, 'Nationwide delivery', 'Reliable delivery options'], [RotateCcw, 'Easy support', 'Clear returns process'], [Headphones, 'Customer care', 'Real help when needed']].map(([Icon, title, copy]) => { const I = Icon as typeof ShieldCheck; return <div key={String(title)}><I size={21} /><span><b>{String(title)}</b><small>{String(copy)}</small></span></div> })}</section>
  </>
}
