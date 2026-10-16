import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const port=9258
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-support')}`],{windowsHide:true,stdio:'ignore'})
let socket
const pending=new Map()
try {
  let tab
  for(let i=0;i<30;i++){
    try{tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();break}catch{await new Promise(r=>setTimeout(r,500))}
  }
  assert.ok(tab,'Chrome debug tab available')
  socket=new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true})})
  let id=0
  const errors=[]
  socket.addEventListener('message',event=>{const reply=JSON.parse(event.data);if(reply.method==='Runtime.exceptionThrown')errors.push(reply.params.exceptionDetails.text);if(pending.has(reply.id)){const {resolve,reject,timer}=pending.get(reply.id);clearTimeout(timer);pending.delete(reply.id);reply.error?reject(reply.error):resolve(reply.result)}})
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(new Error(`Timed out: ${method}`))},15000);pending.set(key,{resolve,reject,timer});socket.send(JSON.stringify({id:key,method,params}))})
  const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value
  await send('Page.enable');await send('Runtime.enable')

  const wait=ms=>new Promise(r=>setTimeout(r,ms))
  async function open(route,width=1440){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700})
    await send('Page.navigate',{url:'http://localhost:5173'+route})
    for(let i=0;i<60;i++){
      if(await evaluate("!!document.querySelector('.support-content')"))break
      await wait(250)
    }
    await evaluate("document.fonts.ready.then(()=>true)")
    assert.ok(await evaluate("!!document.querySelector('.support-content')"),route+' renders')
    assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth"),route+' no overflow')
    assert.equal(await evaluate("document.querySelectorAll('.support-sidebar nav a').length"),5)
    assert.ok(await evaluate("!!document.querySelector('.support-sidebar a[aria-current=page]')"))
  }
  for(const width of [1440,390]){
    for(const route of ['/contact','/delivery','/returns','/privacy','/terms']){
      await open(route,width)
      console.log(route,width,await evaluate("document.querySelector('h1').textContent"))
      if(route==='/contact'||route==='/privacy'){
        const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
        await writeFile('preview-support-'+route.slice(1)+'-'+width+'.png',Buffer.from(data,'base64'))
      }
    }
  }
  await open('/contact')
  await evaluate(`(()=>{
    const input=document.querySelector('.support-form textarea');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'Please confirm delivery & warranty for my laptop.');
    input.dispatchEvent(new Event('input',{bubbles:true}));
  })()`)
  await wait(100)
  await evaluate("document.querySelector('.support-form button[type=submit]').click()")
  await wait(100)
  const href=await evaluate("document.querySelector('.support-message-ready a').href")
  const url=new URL(href)
  assert.equal(url.pathname,'/2348145382171')
  assert.ok(url.searchParams.get('text').includes('delivery & warranty'))
  assert.equal(await evaluate("document.querySelector('a[href^=tel]').getAttribute('href')"),'tel:+2348145382171')
  const footerLinks=await evaluate("[...document.querySelectorAll('footer a')].map(a=>({text:a.textContent,href:a.getAttribute('href')}))")
  for(const [label,path] of [['Contact & support','/contact'],['Delivery information','/delivery'],['Returns & warranty','/returns'],['Privacy & terms','/privacy']]){
    assert.equal(footerLinks.find(l=>l.text===label)?.href,path)
  }
  await evaluate("localStorage.setItem('mge-shopping-v1',JSON.stringify({state:{cart:{'hp-elitebook-silver':1},wishlist:['hp-elitebook-silver']},version:2}))")
  await open('/privacy')
  await evaluate("window.confirm=()=>true;document.querySelector('.support-section button').click()")
  await wait(100)
  assert.equal(await evaluate("localStorage.getItem('mge-shopping-v1')"),null)
  assert.ok(await evaluate("document.querySelector('[role=status]')?.textContent.includes('cleared')"))
  assert.deepEqual(errors,[])
  console.log('Support checks passed: all five pages on desktop/mobile, separate footer destinations, WhatsApp message encoding, phone link, privacy storage controls, and no runtime errors.')
  await send('Browser.close').catch(()=>{})
} finally {for(const p of pending.values())clearTimeout(p.timer);socket?.close();browser.kill()}
