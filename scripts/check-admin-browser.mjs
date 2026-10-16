import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const port=9254
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-admin')}`],{windowsHide:true,stdio:'ignore'})
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
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
  await send('Page.navigate',{url:'http://localhost:5173/admin'})
  await wait(2000)
  for(let attempt=0;attempt<20 && !(await evaluate("document.querySelector('.admin-product-list>button') !== null"));attempt++) await wait(500)
  console.log(await evaluate("({text:document.body.innerText.slice(0,800),title:document.title})"))
  assert.ok(await evaluate("document.querySelectorAll('.admin-product-list>button').length > 0"))
  await evaluate("document.querySelector('.admin-product-list>button').click()")
  await wait(200)
  assert.ok(await evaluate("document.querySelector('.admin-editor') !== null"))
  const originalName=await evaluate("document.querySelector('.admin-editor input').value")
  await evaluate(`(()=>{const input=document.querySelector('.admin-editor input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,input.value+' ');input.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await wait(200)
  assert.equal(await evaluate("document.querySelector('.admin-savebar button[type=submit]').disabled"),false)
  await evaluate("document.querySelector('.admin-savebar button[type=submit]').click()")
  await wait(2500)
  assert.equal(await evaluate("!!document.querySelector('.admin-alert')"),false)
  // A whitespace-only edit exercises real save without changing catalogue content.
  const savedName=await evaluate("fetch('/api/admin/products',{headers:{'X-MGE-Admin':'catalogue'}}).then(r=>r.json()).then(r=>r.products[0].name)")
  assert.equal(savedName,originalName)
  await send('Page.navigate',{url:'http://localhost:5173/admin'})
  await wait(1500)
  await evaluate("document.querySelector('.admin-product-list>button').click()")
  await wait(200)
  assert.equal(await evaluate("document.querySelector('.admin-editor input').value"),originalName)
  for(const [name,width,height] of [['admin-desktop',1440,1000],['admin-mobile',390,844]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700})
    await wait(300)
    const state=await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length})")
    assert.ok(state.scroll<=state.width,'No horizontal overflow')
    assert.equal(state.broken,0)
    const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
    await writeFile('preview-'+name+'.png',Buffer.from(data,'base64'))
    console.log(name,JSON.stringify(state))
  }
  await evaluate(`(()=>{const input=document.querySelector('.admin-search input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'not-a-real-product-xyz');input.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await wait(200)
  assert.equal(await evaluate("document.querySelectorAll('.admin-product-list>button').length"),0)
  assert.ok(await evaluate("document.querySelector('.admin-no-results')?.textContent"))
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('New product')).click()")
  await wait(200)
  assert.equal(await evaluate("document.querySelector('.admin-editor-heading h2').textContent"),'Add something new.')
  assert.equal(await evaluate("document.querySelector('.admin-savebar button[type=submit]').textContent"),'Create product')
  await evaluate(`(()=>{
    const bytes=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='),c=>c.charCodeAt(0));
    const files=new DataTransfer();files.items.add(new File([bytes],'test.png',{type:'image/png'}));
    const input=document.querySelector('input[type=file]');input.files=files.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  })()`)
  await wait(300)
  assert.equal(await evaluate("document.querySelectorAll('.admin-upload .admin-photos img').length"),1)
  assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth"))
  const createdPreview=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})
  await writeFile('preview-admin-new-product.png',Buffer.from(createdPreview.data,'base64'))
  await evaluate("document.querySelector('[aria-label=\"Remove photo 1\"]').click()")
  await wait(100)
  assert.equal(await evaluate("document.querySelectorAll('.admin-upload .admin-photos img').length"),0)
  assert.deepEqual(errors,[])
  console.log('Admin browser checks passed: catalogue, editor, save and reload, desktop/mobile, empty search, new-product form, photo upload/removal, no runtime errors.')
  await send('Browser.close').catch(()=>{})
} finally {for(const p of pending.values())clearTimeout(p.timer);socket?.close();browser.kill()}
