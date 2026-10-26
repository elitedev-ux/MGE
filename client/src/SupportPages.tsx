import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { Button } from './components/ui/button'
import { useShop } from './store'
import './support.css'

const phone = '+234 814 538 2171'
const chat = (message:string) => 'https://wa.me/2348145382171?text='+encodeURIComponent(message)
const pages = [
  {path:'/contact',label:'Contact & support',title:'A little help. A better experience.',description:'Questions about a product, your order, or what comes next? Talk to Miztashogofunmi Global Enterprise.'},
  {path:'/delivery',label:'Delivery information',title:'From our collection to your doorstep.',description:'Confirm delivery arrangements with MGE before completing your purchase.'},
  {path:'/returns',label:'Returns & warranty',title:'Support beyond your purchase.',description:'Find out how to raise a product issue and check the cover available for your item.'},
  {path:'/privacy',label:'Privacy',title:'Your information, explained.',description:'How this storefront works, what is saved on your device, and what happens when you contact us.'},
  {path:'/terms',label:'Terms of purchase',title:'Clear details. Confident decisions.',description:'Understand the catalogue and WhatsApp ordering process before you buy.'},
]

function Contact() {
  const [topic,setTopic] = useState('Product enquiry')
  const [reference,setReference] = useState('')
  const [message,setMessage] = useState('')
  const [ready,setReady] = useState(false)
  const text = ['Hello MGE!', 'Topic: '+topic, reference.trim() ? 'Order / product reference: '+reference.trim() : '', '', message.trim()].filter((line,i)=>line || i===3).join('\n')
  return <>
    <div className="support-contact-cards">
      <a href={chat('Hello MGE! I would like some help.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={23}/><h2>Message on WhatsApp</h2><p>{phone}</p><span>Start a conversation <ArrowRight size={15}/></span></a>
      <a href="tel:+2348145382171"><Phone size={23}/><h2>Give us a call</h2><p>{phone}</p><span>Call MGE <ArrowRight size={15}/></span></a>
    </div>
    <section className="support-section"><h2>How can we help?</h2><p>Choose a topic and describe what you need. Your message opens in WhatsApp for you to review and send.</p>
      <form className="support-form" onSubmit={e=>{e.preventDefault();setReady(true)}}>
        <div className="support-form-row"><label>What is this about?<select value={topic} onChange={e=>{setTopic(e.target.value);setReady(false)}}>{['Product enquiry','Order update','Delivery question','Return or faulty item','Warranty question','Privacy request'].map(t=><option key={t}>{t}</option>)}</select></label><label>Order or product reference (optional)<input value={reference} maxLength={150} onChange={e=>{setReference(e.target.value);setReady(false)}} placeholder="Product name or order reference"/></label></div>
        <label>Your message<textarea required minLength={5} maxLength={2000} rows={5} value={message} onChange={e=>{setMessage(e.target.value);setReady(false)}} placeholder="Tell us how we can help."/></label>
        <p className="support-small">Please do not include card numbers, PINs, passwords, or one-time codes.</p>
        {!ready ? <Button type="submit">Prepare WhatsApp message <ArrowRight size={16}/></Button> : <div className="support-message-ready" role="status"><p>Your message is ready. Open WhatsApp to review it and tap Send.</p><Button asChild><a href={chat(text)} target="_blank" rel="noopener noreferrer">Continue to WhatsApp <ArrowRight size={16}/></a></Button></div>}
      </form>
    </section>
    <section className="support-section"><h2>Before you get in touch</h2><p>For product questions, include the product name and the specification you want to confirm. For an existing purchase, include your order reference or the date of your conversation with MGE. Photos of the item or packaging can help when reporting a problem.</p><p>For a visit or collection, ask us to confirm the location and arrangements first.</p></section>
    <section className="support-section"><h2>Quick answers</h2><details><summary>How do I place an order?</summary><p>Add products to your bag and choose Checkout on WhatsApp. Your product names and quantities are filled into the chat; review the message and send it to MGE.</p></details><details><summary>Is the price on the website final?</summary><p>Some products still have a labelled placeholder price. Confirm the current price, availability, product condition, and delivery charge in your conversation before paying.</p></details><details><summary>Do I need an account?</summary><p>No. You can browse, save favourites, and use the bag without an account. Your bag and wishlist are saved in this browser.</p></details></section>
  </>
}

function Delivery() {
  return <>
    <section className="support-section"><h2>Check delivery for your location</h2><p>Send MGE the product names, quantities, and your city or delivery area. Ask for confirmation that your address can be served and whether delivery or collection is available for your order.</p><p>Delivery coverage, fees, and estimated dates are confirmed for each order. The website does not calculate a delivery charge or reserve a delivery slot.</p></section>
    <section className="support-section"><h2>Before you pay</h2><ol><li>Confirm the exact item, model, condition, and quantity.</li><li>Request the product total, delivery fee, and any other applicable charges.</li><li>Confirm the recipient name, contact number, and delivery address privately with MGE.</li><li>Ask for the expected dispatch and delivery dates, and keep the confirmation.</li></ol></section>
    <section className="support-section"><h2>Track or change an order</h2><p>Use the same WhatsApp conversation to request a dispatch update or tracking details, where available. If your address or plans change, contact MGE as soon as possible so the available options can be checked.</p><Button asChild><a href={chat('Hello MGE! Please help me check the delivery status of my order.')} target="_blank" rel="noopener noreferrer">Ask about my delivery <ArrowRight size={16}/></a></Button></section>
    <section className="support-section"><h2>When your order arrives</h2><p>Check that the item and quantity match your order. Keep your proof of purchase and report missing items, damage, or a delivery problem to MGE, with photos where possible. See <Link to="/returns">returns and warranty support</Link> for the next steps.</p></section>
  </>
}

function Returns() {
  return <>
    <section className="support-section"><h2>Tell us what happened</h2><p>If an item is faulty, damaged, incorrect, or incomplete, contact MGE and explain the issue. Include your product name, purchase date, order reference or proof of purchase, and photos or a short video where useful.</p><Button asChild><a href={chat('Hello MGE! I need help with a return or a product issue.\nProduct:\nPurchase date / order reference:\nIssue:')} target="_blank" rel="noopener noreferrer">Get help with a product <ArrowRight size={16}/></a></Button></section>
    <section className="support-section"><h2>Return arrangements</h2><p>Ask MGE for the return address and handling instructions before sending an item. Keep the item and any available accessories or packaging while the issue is being reviewed.</p><p>For a change-of-mind return, ask about eligibility and the applicable time window before purchasing. No additional store-wide change-of-mind window is stated on this website. Any assessment, collection arrangements, costs, and proposed remedy should be confirmed for your case.</p></section>
    <section className="support-section"><h2>Warranty information</h2><p>Confirm the warranty provider, duration, included cover, and claims process for the exact product before purchase. A brand logo or product photograph alone does not establish manufacturer warranty coverage.</p><p>Keep the receipt or payment confirmation and any warranty documentation supplied with the item. For troubleshooting, share the model, serial number where appropriate, and a description of the fault with MGE.</p></section>
    <section className="support-section"><h2>Your consumer rights</h2><p>Store or manufacturer policies do not remove rights available under applicable consumer law. For information on product quality and remedies, see the <a href="https://fccpc.gov.ng/consumers/" target="_blank" rel="noopener noreferrer">Federal Competition and Consumer Protection Commission</a>. If an issue remains unresolved, you can contact the FCCPC for guidance.</p></section>
  </>
}

function Privacy() {
  const [cleared,setCleared] = useState(false)
  const [error,setError] = useState('')
  function clearSaved() {
    if (!window.confirm('Clear your shopping bag and wishlist from this browser?')) return
    try {useShop.setState({cart:{},wishlist:[]});useShop.persist.clearStorage();setCleared(true);setError('')}
    catch {setError('Your browser could not clear saved shopping data. You can remove this site’s stored data in your browser settings.')}
  }
  return <>
    <section className="support-section"><h2>Who this notice covers</h2><p>This notice describes the MGE storefront operated for Miztashogofunmi Global Enterprise. For a question about your information, contact MGE on WhatsApp at {phone}.</p></section>
    <section className="support-section"><h2>Your bag and wishlist</h2><p>The storefront saves product references, quantities, and wishlist selections in your browser’s local storage so they are available when you return. No customer account is required. These saved selections are specific to this browser and device.</p><p>You can remove individual items in your bag or wishlist, clear this site’s data through your browser settings, or use the button below.</p><Button type="button" variant="outline" onClick={clearSaved}>Clear saved bag & wishlist</Button>{cleared && <p role="status">Your saved bag and wishlist have been cleared from this browser.</p>}{error && <p role="alert">{error}</p>}</section>
    <section className="support-section"><h2>Messages and ordering</h2><p>Checkout prepares a WhatsApp message containing your selected product names and quantities. Contact forms prepare the topic, reference, and message you enter. Opening these links passes that text to WhatsApp; you choose whether to send it.</p><p>When you send a message, MGE receives it through WhatsApp together with the information WhatsApp makes available about your contact. If you supply your name, delivery address, phone number, or order details during the conversation, those details may be needed to answer your request and arrange your purchase.</p><p>The storefront does not collect card details or process payments directly. Ask MGE about payment arrangements and any payment provider’s privacy information before proceeding.</p></section>
    <section className="support-section"><h2>External services</h2><p>Supabase serves our product catalogue and uploaded product photos. Requests include technical network information needed to deliver that content. For administrators, a temporary session is stored in the browser tab; the backend keeps session records and short-lived failed-access records to protect the product manager.</p><p>The site loads its typeface from Google Fonts, which receives the network information needed to serve the font, including your IP address. WhatsApp handles chats under its own privacy policy. These providers may process information outside Nigeria.</p><p><a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WhatsApp privacy policy</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy policy</a></p><p>No advertising or analytics tracking is currently integrated into the storefront. The service hosting the website may keep technical request logs; contact MGE with questions about hosting or records associated with your visit.</p></section>
    <section className="support-section"><h2>Questions and privacy requests</h2><p>Contact MGE to ask about information held in an order or support conversation, its use or retention, or to request access, correction, or deletion where applicable. Clearing this browser’s shopping data does not delete WhatsApp messages or business records.</p><Button asChild><a href={chat('Hello MGE! I have a privacy request concerning my information.')} target="_blank" rel="noopener noreferrer">Contact MGE about privacy <ArrowRight size={16}/></a></Button><p>You can also seek guidance or raise a complaint with the <a href="https://ndpc.gov.ng/" target="_blank" rel="noopener noreferrer">Nigeria Data Protection Commission</a>. See the <a href="https://ndpc.gov.ng/download/nigeria-data-protection-act-2023" target="_blank" rel="noopener noreferrer">Nigeria Data Protection Act</a> for the applicable framework.</p></section>
  </>
}

function Terms() {
  return <>
    <section className="support-section"><h2>About MGE</h2><p>This storefront presents the product collection of Miztashogofunmi Global Enterprise. Contact MGE at {phone} for product information, order enquiries, or support.</p></section>
    <section className="support-section"><h2>Product information and prices</h2><p>Prices are displayed in Nigerian naira. Products with a placeholder-price label require confirmation of their selling price. Availability, model variants, specifications, condition, included accessories, and warranty details should be confirmed for the exact item you intend to purchase.</p><p>Hero images labelled as concepts or mockups illustrate collections. They are not a specification of an item in your bag. Review the product page and ask MGE about any detail that is unclear.</p></section>
    <section className="support-section"><h2>Placing an order</h2><p>Adding products to your bag or opening WhatsApp does not complete a purchase or confirm payment. Send the prepared message and confirm the items, total price, delivery arrangements, payment instructions, and applicable product terms directly with MGE.</p><p>Keep the order confirmation and proof of payment. The website does not take online payments or automatically issue an order number.</p></section>
    <section className="support-section"><h2>Delivery, changes, and product issues</h2><p>Review <Link to="/delivery">delivery information</Link> before placing an order. Contact MGE promptly if you need to change or cancel an order so the current status and available options can be checked.</p><p>For incorrect, damaged, or faulty items, follow the <Link to="/returns">returns and warranty support process</Link>. Nothing on these pages is intended to exclude rights or remedies that apply under Nigerian consumer law.</p></section>
    <section className="support-section"><h2>Using this website</h2><p>Use the storefront for legitimate enquiries and purchases. Do not attempt to disrupt the service or access systems without permission. Product and brand names identify their respective owners; listing a product does not itself establish an authorised dealership.</p></section>
    <section className="support-section"><h2>Privacy and questions</h2><p>See our <Link to="/privacy">privacy notice</Link> for browser storage and third-party services. For a question about these terms or a particular purchase, <Link to="/contact">contact MGE</Link>. Keep a copy of the information and terms confirmed for your order.</p></section>
  </>
}

export default function SupportPages() {
  const {pathname} = useLocation()
  const page = pages.find(p=>p.path===pathname) || pages[0]
  useEffect(()=>{document.title=page.label+' | Miztashogofunmi Global Enterprise'},[page.label])
  return <div className="container support-page"><div className="support-heading"><p className="support-eyebrow">MGE / CUSTOMER CARE</p><h1>{page.title}</h1><p>{page.description}</p></div><div className="support-layout"><aside className="support-sidebar"><nav aria-label="Customer care">{pages.map(p=><Link key={p.path} to={p.path} className={page.path===p.path?'active':''} aria-current={page.path===p.path?'page':undefined}>{p.label}<ArrowRight size={14}/></Link>)}</nav><p>One conversation.<br/>The help you need.</p><a href={chat('Hello MGE! I would like some help.')} target="_blank" rel="noopener noreferrer">{phone}</a></aside><article className="support-content" key={page.path}>{page.path==='/contact'?<Contact/>:page.path==='/delivery'?<Delivery/>:page.path==='/returns'?<Returns/>:page.path==='/privacy'?<Privacy/>:<Terms/>}<div className="support-next"><span>Still have a question?</span><Link to={page.path==='/contact'?'/shop':'/contact'}>{page.path==='/contact'?'Explore the collection':'Talk to MGE'} <ArrowRight size={16}/></Link></div></article></div></div>
}
