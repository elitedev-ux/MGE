import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const port=9252
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-autoplay')}`],{windowsHide:true,stdio:'ignore'})
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

  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
  await send('Page.navigate',{url:'http://localhost:5173/'})
  for(let attempt=0;attempt<40;attempt++) {
    if(await evaluate(`!!document.querySelector('.showcase-tabs button.active')`))break
    await new Promise(r=>setTimeout(r,500))
  }
  assert.ok(await evaluate(`!!document.querySelector('.showcase-tabs button.active')`),'hero loaded before timing checks')
  const active=()=>evaluate(`document.querySelector('.showcase-tabs button.active').textContent.trim()`)
  const click=async label=>{await evaluate(`document.querySelector('[aria-label="${label}"]').click()`);await new Promise(r=>setTimeout(r,100))}
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:700,y:300})
  await evaluate(`document.querySelector('.showcase-tabs button').focus()`)
  assert.equal(await active(),'Phone')
  for(const expected of ['Laptop','Smart glasses','Phone']){
    await new Promise(r=>setTimeout(r,5100))
    assert.equal(await active(),expected,'autoplay advances with pointer over hero and keyboard focus')
    console.log('Automatic slide:',expected)
  }
  await click('Pause automatic slides')
  const paused=await active()
  await new Promise(r=>setTimeout(r,5500))
  assert.equal(await active(),paused,'explicit pause holds the slide')
  await click('Resume automatic slides')
  await new Promise(r=>setTimeout(r,5200))
  assert.notEqual(await active(),paused,'resume restarts autoplay')
  await click('Pause automatic slides')
  await click('Show Phone')
  await click('Next featured product')
  assert.equal(await active(),'Laptop','manual next works while paused')
  assert.deepEqual(errors,[])
  console.log('Autoplay checks passed: 5-second cycling, wraparound, hover/focus, reduced motion, pause/resume, and manual navigation.')
  await send('Browser.close').catch(()=>{})
} finally {for(const p of pending.values())clearTimeout(p.timer);socket?.close();browser.kill()}
