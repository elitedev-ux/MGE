import {spawn} from 'node:child_process'
import {writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import assert from 'node:assert/strict'
const password=process.env.MGE_ADMIN_PASSWORD
if(!password)throw Error('Set MGE_ADMIN_PASSWORD for this test process.')
const port=9262
const origin=process.env.MGE_TEST_ORIGIN || 'http://127.0.0.1:5173'
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-cloud')}`],{windowsHide:true,stdio:'ignore'})
let socket;const pending=new Map();const wait=ms=>new Promise(r=>setTimeout(r,ms))
try {
  let tab
  for(let i=0;i<30;i++){try{tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();break}catch{await wait(500)}}
  assert.ok(tab)
  socket=new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true})})
  let id=0;const errors=[]
  socket.addEventListener('message',event=>{const reply=JSON.parse(event.data);if(reply.method==='Runtime.exceptionThrown')errors.push(reply.params.exceptionDetails.text);if(pending.has(reply.id)){const {resolve,reject,timer}=pending.get(reply.id);clearTimeout(timer);pending.delete(reply.id);reply.error?reject(reply.error):resolve(reply.result)}})
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(Error('Browser command timed out: '+method))},30000);pending.set(key,{resolve,reject,timer});socket.send(JSON.stringify({id:key,method,params}))})
  const evaluate=async expression=>{const reply=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(reply.exceptionDetails)throw Error(reply.exceptionDetails.text);return reply.result.value}
  const until=async expression=>{for(let i=0;i<120;i++){if(await evaluate(expression))return;await wait(500)}throw Error('Browser condition timed out: '+expression)}
  const fill=(selector,value)=>evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await send('Page.enable');await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
  await send('Page.navigate',{url:origin+'/mgeadmin'})
  await until("!!document.querySelector('#admin-password')")
  assert.equal(await evaluate("document.querySelectorAll('.admin-product-list button').length"),0)
  await fill('#admin-password',password)
  await evaluate("document.querySelector('.admin-login button[type=submit]').click()")
  await until("document.querySelectorAll('.admin-product-list>button').length===76")
  await evaluate("document.querySelector('.admin-product-list>button').click()")
  await until("!!document.querySelector('.admin-editor')")
  const nameSelector='.admin-editor input:not([type=file])'
  const name=await evaluate(`document.querySelector(${JSON.stringify(nameSelector)}).value`)
  await fill(nameSelector,name+' ')
  await evaluate("document.querySelector('.admin-savebar button[type=submit]').click()")
  await until("!!document.querySelector('.admin-success')")
  assert.equal(await evaluate(`document.querySelector(${JSON.stringify(nameSelector)}).value`),name,'Real save trims whitespace without changing product')
  for(const width of [1440,390]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<700})
    await wait(300)
    assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Admin has no horizontal overflow')
    const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`preview-cloud-admin-${width}.png`,Buffer.from(data,'base64'))
  }
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='New product').click()")
  await until("document.querySelector('.admin-editor h2')?.textContent==='Add something new.'")
  await evaluate("(()=>{const input=document.querySelector('input[type=file]');const dt=new DataTransfer();dt.items.add(new File([new Uint8Array(3*1024*1024+1)],'large.png',{type:'image/png'}));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()")
  await until("document.querySelector('.admin-alert')?.textContent.includes('3 MB')")
  await send('Page.handleJavaScriptDialog',{accept:true}).catch(()=>{})
  // Discard the unsaved new-product form before locking.
  socket.addEventListener('message',e=>{if(JSON.parse(e.data).method==='Page.javascriptDialogOpening')void send('Page.handleJavaScriptDialog',{accept:true})})
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent==='Lock admin').click()")
  await until("!!document.querySelector('#admin-password')")
  await send('Page.navigate',{url:origin+'/shop'})
  await until("document.querySelectorAll('.product-card').length===76")
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Mobile shop has no overflow')
  await send('Page.navigate',{url:origin+'/product/hp-elitebook-silver'})
  await until("!!document.querySelector('.detail-copy')")
  await evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Add to bag')).click()")
  await send('Page.navigate',{url:origin+'/cart'})
  await until("!!document.querySelector('.cart-row')")
  assert.ok(await evaluate("document.querySelector('a[href*=\"wa.me\"]')?.href.includes('2348145382171')"),'WhatsApp checkout is preserved')
  await send('Page.navigate',{url:origin+'/admin'})
  await until("document.body.innerText.includes('That page is out of range.')")
  assert.deepEqual(errors,[],'No browser runtime exceptions')
  console.log('Cloud browser checks passed: password gate, live catalogue, real admin save, desktop/mobile layout, 3MB validation, logout, shop, product, saved cart, WhatsApp checkout, retired /admin route.')
} finally {
  for(const {timer} of pending.values())clearTimeout(timer)
  socket?.close();browser.kill()
}
