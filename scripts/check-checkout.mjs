import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../client/src/checkout.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { whatsappCheckoutUrl } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const items = [{ name: 'MacBook Pro 16-inch', quantity: 2 }, { name: 'Charger & cable + case #1', quantity: 3 }]
const url = new URL(whatsappCheckoutUrl(items))
assert.equal(url.origin, 'https://wa.me')
assert.equal(url.pathname, '/2348145382171')
assert.equal(url.searchParams.size, 1)
assert.equal(url.hash, '')
const message = url.searchParams.get('text')
for (const item of items) assert.ok(message.includes(`${item.name} — Quantity: ${item.quantity}`))
assert.ok(message.includes('\n2. Charger'))
assert.ok(message.includes('confirm the final prices'))
const updated = new URL(whatsappCheckoutUrl([{ ...items[0], quantity: 1 }])).searchParams.get('text')
assert.ok(updated.includes('Quantity: 1'))
assert.ok(!updated.includes(items[1].name))
console.log('Checkout checks passed: destination, product names, quantities, special characters, and updated cart contents.')
