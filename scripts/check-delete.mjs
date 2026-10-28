import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import ts from 'typescript'

const validationFile=new URL('../.delete-validation-check.mjs',import.meta.url)
const handlerFile=new URL('../.delete-handler-check.mjs',import.meta.url)
const originalFetch=globalThis.fetch
let handler,authorized=true,rows=[{id:'qa-product'}],fail=false
const calls=[]
globalThis.Deno={env:{get:key=>key==='SUPABASE_URL'?'https://test.invalid':'test-key'},serve:fn=>{handler=fn}}
globalThis.fetch=async(url,options)=>{
  calls.push({url,options})
  if(url.includes('/rpc/mge_admin_authorize'))return Response.json(authorized)
  assert.equal(options.method,'DELETE')
  assert.equal(url,'https://test.invalid/rest/v1/products?id=eq.qa-product&revision=eq.7')
  assert.equal(options.headers.Prefer,'return=representation')
  if(fail)throw Error('Connection lost')
  return Response.json(rows)
}
const compile=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText
const request=(input,token='a'.repeat(64))=>handler(new Request('https://test.invalid/functions/v1/mge-admin',{method:'POST',headers:{'Content-Type':'application/json','X-MGE-Session':token},body:JSON.stringify(input)}))
try {
  const validation=await fs.readFile(new URL('../supabase/functions/mge-admin/validation.ts',import.meta.url),'utf8')
  await fs.writeFile(validationFile,compile(validation.replace('npm:zod@3.25.76','zod')))
  const source=await fs.readFile(new URL('../supabase/functions/mge-admin/index.ts',import.meta.url),'utf8')
  await fs.writeFile(handlerFile,compile(source).replace('./validation.ts','./.delete-validation-check.mjs'))
  await import(handlerFile.href)
  const input={action:'delete',id:'qa-product',revision:'7'}
  assert.equal((await request(input,'')).status,401)
  assert.equal(calls.length,0,'Missing session never reaches database')
  authorized=false
  assert.equal((await request(input)).status,401)
  assert.equal(calls.filter(c=>c.options.method==='DELETE').length,0,'Invalid session never deletes')
  authorized=true
  for(const invalid of [{...input,id:'qa-product&other=all'},{...input,revision:0},{...input,revision:'bad'}])assert.equal((await request(invalid)).status,400)
  assert.equal(calls.filter(c=>c.options.method==='DELETE').length,0)
  rows=[]
  assert.equal((await request(input)).status,409,'Stale or deleted row produces a conflict')
  rows=[{id:'qa-product'}]
  const response=await request(input)
  assert.equal(response.status,200)
  assert.deepEqual(await response.json(),{deletedId:'qa-product'})
  fail=true
  assert.equal((await request(input)).status,503,'Uncertain network result is not reported as successful deletion')
  console.log('Delete checks passed: session enforcement, ID/revision validation, scoped atomic deletion, stale conflict, success, and network failure. No live products touched.')
}finally{
  globalThis.fetch=originalFetch;delete globalThis.Deno
  await fs.unlink(validationFile).catch(()=>{});await fs.unlink(handlerFile).catch(()=>{})
}
