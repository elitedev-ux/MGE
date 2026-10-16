import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const port=9249
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-catalogue')}`],{windowsHide:true,stdio:'ignore'})
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
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  for(const [name,width,height,route] of [['catalogue-home',1440,1000,'/'],['catalogue-shop',1440,1000,'/shop'],['catalogue-product',1440,1000,'/product/live-85nc-headphones'],['catalogue-mobile',390,844,'/product/oraimo-powernova-b31']]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700})
    await send('Page.navigate',{url:'http://localhost:5173'+route})
    await new Promise(r=>setTimeout(r,1800))
    for(let attempt=0;attempt<40 && !(await evaluate("!!document.querySelector('h1')"));attempt++) await new Promise(r=>setTimeout(r,250))
    await evaluate(`Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]).then(()=>true)`)
    await evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>null)})).then(()=>true)`)
    const state=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.querySelector('h1')?.textContent,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),cards:document.querySelectorAll('.product-card').length})`)
    assert.ok(state.title,`${route} renders`);assert.ok(state.scroll<=state.width,`${route} has no horizontal overflow`);assert.deepEqual(state.broken,[],`${route} images load`)
    if(route==='/shop')assert.equal(state.cards,76)
    if(route.includes('live-85nc')){
      assert.equal(await evaluate(`document.querySelectorAll('.gallery-thumbnails button').length`),2)
      await evaluate(`document.querySelectorAll('.gallery-thumbnails button')[1].click()`)
      await new Promise(r=>setTimeout(r,100))
      assert.ok((await evaluate(`document.querySelector('.detail-image img').src`)).includes('live-85nc-headphones-2'))
    }
    const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
    await writeFile(`preview-${name}.png`,Buffer.from(data,'base64'))
    console.log(name,JSON.stringify(state))
  }
  await evaluate(`document.querySelector('.detail-copy .button-primary').click()`)
  await new Promise(r=>setTimeout(r,100))
  assert.ok(await evaluate(`JSON.parse(localStorage.getItem('mge-shopping-v1')).state.cart['oraimo-powernova-b31']>0`),'adding product persists in bag')
  assert.deepEqual(errors,[],'no runtime exceptions')
  console.log('Browser checks passed: catalogue, galleries, images, mobile width, cart, and runtime errors.')
  await send('Browser.close').catch(()=>{})
} finally {for(const p of pending.values())clearTimeout(p.timer);socket?.close();browser.kill()}
