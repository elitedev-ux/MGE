import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const port=9257
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${resolve('.preview-browser-performance')}`],{windowsHide:true,stdio:'ignore'})
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

  await send('Network.enable')
  await send('Network.setCacheDisabled',{cacheDisabled:true})
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});"})
  const results=[]
  for(const [route,width,height] of [['/',1440,1000],['/shop',390,844]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700})
    await send('Page.navigate',{url:'http://127.0.0.1:5174'+route})
    for(let i=0;i<40;i++){if(await evaluate("document.readyState==='complete' && !!document.querySelector('h1')"))break;await new Promise(r=>setTimeout(r,250))}
    await evaluate("document.querySelector('[aria-label=\"Pause automatic slides\"]')?.click()")
    await evaluate("document.fonts.ready.then(()=>true)")
    await evaluate("Promise.all([...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}).map(i=>i.decode().catch(()=>null))).then(()=>true)")
    await new Promise(r=>setTimeout(r,300))
    const state=await evaluate(`({route:location.pathname,width:innerWidth,scroll:document.documentElement.scrollWidth,lcpMs:Math.round(window.__lcp),cls:window.__cls,resources:performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).map(r=>({url:new URL(r.name).pathname,bytes:r.encodedBodySize,type:r.initiatorType})),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})`)
    assert.ok(state.scroll<=state.width)
    assert.deepEqual(state.broken,[])
    state.totalBytes=state.resources.reduce((sum,r)=>sum+r.bytes,0)
    results.push(state)
    console.log(route,JSON.stringify({totalBytes:state.totalBytes,lcpMs:state.lcpMs,cls:state.cls,requests:state.resources.length}))
  }
  assert.deepEqual(errors,[])
  await writeFile('docs/performance-'+(process.argv[2]||'current')+'.json',JSON.stringify(results,null,2))
  await send('Browser.close').catch(()=>{})
} finally {for(const p of pending.values())clearTimeout(p.timer);socket?.close();browser.kill()}
