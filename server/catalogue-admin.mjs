import { readFile, writeFile, rename, mkdir, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { z } from 'zod'

const categories = ['Laptops','Audio','Charging','Wearables','Gaming','Lighting','Office','Accessories']
const text = z.string().trim().min(1).max(300)
const edits = z.object({
  name: text, brand: text, category: z.enum(categories),
  price: z.number().finite().min(0).max(1e10),
  priceIsPlaceholder: z.boolean(),
  original: z.number().finite().min(0).max(1e10).nullable(),
  description: z.string().trim().min(1).max(10000),
  stock: z.number().int().min(0).max(1000000).nullable(),
  badge: z.string().trim().max(80),
  detailsNote: z.string().trim().max(5000),
  specs: z.record(text, z.string().trim().max(2000)),
}).strict().refine(p => p.original === null || p.original > p.price, { message: 'Original price must be greater than the selling price.' })
const revision = p => createHash('sha256').update(JSON.stringify(p)).digest('hex')

export function catalogueAdmin(file = new URL('../client/src/data.ts', import.meta.url), imageDirectory = new URL('../client/public/products/', import.meta.url)) {
  let queue = Promise.resolve()
  async function readCatalogue() {
    const source = await readFile(file, 'utf8')
    const start = source.indexOf('export const products: Product[] = ') + 'export const products: Product[] = '.length
    const end = source.indexOf('\nexport const money', start)
    if (start < 35 || end < 0) throw new Error('Catalogue format not recognized')
    return { source, start, end, products: JSON.parse(source.slice(start, end).trim()) }
  }
  return {
    name: 'mge-local-catalogue-admin', apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/admin/products', async (req, res) => {
        const send = (status, body) => { res.statusCode = status; res.setHeader('Content-Type','application/json'); res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify(body)) }
        const local = ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)
        const host = req.headers.host || ''
        if (!local || !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) || (req.headers.origin && req.headers.origin !== `http://${host}`) || req.headers['x-mge-admin'] !== 'catalogue') return send(403, { error: 'This editor is available only on the local development server.' })
        if (req.method === 'GET') {
          try { const { products } = await readCatalogue(); send(200, { products, revisions: Object.fromEntries(products.map(p => [p.id, revision(p)])) }) }
          catch { send(500,{error:'Could not read the catalogue.'}) }
          return
        }
        const creating = req.method === 'POST'
        if (!creating && req.method !== 'PATCH') return send(405, { error:'Method not allowed.' })
        try {
          let body = ''
          for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > (creating ? 29000000 : 100000)) return send(413,{error:'Product details or images are too large.'}) }
          let input
          try { input = JSON.parse(body) } catch { return send(400,{error:'Invalid product request.'}) }
          if (!input || typeof input !== 'object') return send(400,{error:'Invalid product request.'})
          const parsed = edits.safeParse(input.changes)
          if (!parsed.success) return send(400, { error: parsed.error.issues[0].message })
          const uploads = []
          if (creating) {
            if (!z.string().uuid().safeParse(input.creationKey).success) return send(400,{error:'Invalid creation identifier.'})
            if (!Array.isArray(input.images) || input.images.length < 1 || input.images.length > 4) return send(400,{error:'Add between one and four product photos.'})
            for (const image of input.images) {
              const match = typeof image === 'string' && image.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/)
              if (!match) return send(400,{error:'Photos must be PNG, JPEG, or WebP.'})
              const buffer = Buffer.from(match[2],'base64')
              const valid = match[1] === 'png' ? buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : match[1] === 'jpeg' ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 : buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP'
              if (!valid || buffer.length > 3 * 1024 * 1024) return send(400,{error:'Each photo must be a valid PNG, JPEG, or WebP of 3 MB or less.'})
              uploads.push({buffer,extension:match[1] === 'jpeg' ? 'jpg' : match[1]})
            }
          }
          const save = async () => {
            const { source, start, end, products } = await readCatalogue()
            const id = creating ? 'product-' + input.creationKey : input.id
            const index = products.findIndex(p => p.id === id)
            if (creating && index >= 0) return send(409,{error:'This product has already been created. Reload the catalogue to find it.'})
            if (!creating && index < 0) return send(404,{error:'Product not found.'})
            if (!creating && revision(products[index]) !== input.revision) return send(409,{error:'This product changed in another editor. Reload the catalogue before saving.'})
            const imageNames = uploads.map((u,i) => id + '-' + (i+1) + '.' + u.extension)
            const images = imageNames.map(name => '/products/' + name)
            const product = { ...(creating ? { id, image:images[0], images, identification:'owner-supplied', sources:[] } : products[index]), ...parsed.data }
            if (product.original === null) delete product.original
            if (!product.badge) delete product.badge
            if (creating) products.push(product)
            else products[index] = product
            const next = source.slice(0,start) + JSON.stringify(products,null,2) + '\n\n' + source.slice(end + 1)
            await writeFile(new URL('./data.ts.admin-backup',file),source)
            const temp = new URL('./data.ts.admin-tmp',file)
            const written = []
            try {
              if (creating) await mkdir(imageDirectory,{recursive:true})
              for (let i=0;i<uploads.length;i++) {
                const path = new URL(imageNames[i],imageDirectory)
                await writeFile(path,uploads[i].buffer,{flag:'wx'})
                written.push(path)
              }
              await writeFile(temp,next)
              await rename(temp,file)
            } catch(error) {
              for (const path of written) await unlink(path).catch(()=>{})
              throw error
            }
            send(creating ? 201 : 200,{product,revision:revision(product)})
          }
          queue = queue.then(save, save)
          await queue
        } catch { if (!res.writableEnded) send(500,{error:'Could not save this product. Your changes have not been confirmed; please retry.'}) }
      })
    },
  }
}
