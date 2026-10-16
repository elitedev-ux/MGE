import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const browser = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=9237', `--user-data-dir=${resolve('.preview-browser-check')}`,
], { windowsHide: true, stdio: 'ignore' })
let socket
try {
  let tab
  for (let i=0;i<60;i++) {
    try {tab=await (await fetch('http://127.0.0.1:9237/json/new?about:blank',{method:'PUT'})).json();break}
    catch {await new Promise(r=>setTimeout(r,500))}
  }
  if(!tab)throw new Error('Preview browser did not start')
  socket=new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true})})
  let id=0
  const pending=new Map()
  socket.addEventListener('message',event=>{const reply=JSON.parse(event.data);if(pending.has(reply.id)){const {resolve,reject}=pending.get(reply.id);pending.delete(reply.id);reply.error?reject(reply.error):resolve(reply.result)}})
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}))})
  await send('Page.enable')
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:name==='mobile'})
    await send('Page.navigate',{url:'http://localhost:5173/'})
    await new Promise(r=>setTimeout(r,3000))
    await send('Runtime.evaluate',{expression:'document.fonts.ready',awaitPromise:true})
    const dimensions=await send('Runtime.evaluate',{expression:'JSON.stringify({width:innerWidth,body:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})',returnByValue:true})
    console.log(name,dimensions.result.value)
    const {contentSize}=await send('Page.getLayoutMetrics')
    const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.min(contentSize.height,4200),scale:1}})
    await writeFile(`preview-${name}-full.png`,Buffer.from(data,'base64'))
  }
  await send('Browser.close').catch(()=>{})
} finally {socket?.close();browser.kill()}
