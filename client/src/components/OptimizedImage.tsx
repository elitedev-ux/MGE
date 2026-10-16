import type { ImgHTMLAttributes } from 'react'
import images from '../image-manifest.json'

type ImageEntry = { width:number; height:number; variants:{width:number;src:string}[] }
const manifest:Record<string,ImageEntry> = images
export function OptimizedImage({src='',sizes='100vw',width,height,...props}:ImgHTMLAttributes<HTMLImageElement>) {
  const entry=manifest[src]
  return <img {...props} src={entry?.variants.at(-1)?.src || src}
    srcSet={entry?.variants.map(v=>v.src+' '+v.width+'w').join(', ')}
    sizes={entry ? sizes : undefined} width={width || entry?.width} height={height || entry?.height}
    decoding={props.decoding || 'async'} />
}
