import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicRoot = new URL('../client/public/',import.meta.url)
const output = new URL('optimized/',publicRoot)
await mkdir(output,{recursive:true})
const paths = (await readdir(new URL('products/',publicRoot),{recursive:true})).filter(name=>/\.(png|jpe?g|webp)$/i.test(name)).map(name=>'products/'+name.replaceAll('\\','/'))
paths.push('mge-phone-podium.png','mge-macbook-podium.png','mge-glasses-hero.png','mge-brand-logo.png')
const manifest={}
let originalBytes=0,optimizedBytes=0
for(const path of paths) {
  const data=await readFile(new URL(path,publicRoot))
  const metadata=await sharp(data).metadata()
  const hash=createHash('sha256').update(data).update('webp-v1-q82').digest('hex').slice(0,12)
  const name=basename(path,extname(path))
  const widths=[...new Set((path.includes('brand-logo') ? [160,320] : [320,640,1280]).map(w=>Math.min(w,metadata.width)))]
  const variants=[]
  for(const width of widths) {
    const filename=name+'-'+hash+'-'+width+'.webp'
    const target=new URL(filename,output)
    try { await stat(target) } catch {
      await sharp(data).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,alphaQuality:100,effort:5}).toFile(fileURLToPath(target))
    }
    variants.push({width,src:'/optimized/'+filename})
  }
  manifest['/'+path]={width:metadata.width,height:metadata.height,variants}
  originalBytes+=data.length
  optimizedBytes+=(await stat(new URL(variants.at(-1).src.slice(1),publicRoot))).size
}
const serialized=JSON.stringify(manifest,null,2)+'\n'
const manifestPath=new URL('../client/src/image-manifest.json',import.meta.url)
let previous=''
try { previous=await readFile(manifestPath,'utf8') } catch {}
if(previous!==serialized) await writeFile(manifestPath,serialized)
console.log(JSON.stringify({images:paths.length,originalBytes,optimizedLargestVariantBytes:optimizedBytes,reduction:Math.round((1-optimizedBytes/originalBytes)*100)+'%'},null,2))
