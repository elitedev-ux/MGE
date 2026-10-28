import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const source=process.argv[2]
if(!source)throw Error('Usage: node scripts/prepare-new-phones.mjs <image-directory>')
const files=JSON.parse(await fs.readFile('docs/catalogue/phone-source-files.json','utf8'))
// Image positions refer to the reviewed contact sheet. Two purple views form one listing.
const entries=[
 ['iphone-xr-red','Apple iPhone XR - Red',[0],190000,'Apple','Red',null,false],
 ['iphone-xr-black','Apple iPhone XR - Black',[1],190000,'Apple','Black',null,false],
 ['iphone-11-purple-64gb','Apple iPhone 11 - Purple - 64GB',[5,2],240000,'Apple','Purple','64GB',true],
 ['iphone-12-blue','Apple iPhone 12 series - Blue',[3],310000,'Apple','Blue',null,false],
 ['galaxy-s21-dark','Samsung Galaxy S21 series - Dark Gray',[4],290000,'Samsung','Dark Gray',null,false],
 ['iphone-11-black','Apple iPhone 11 - Black',[6],240000,'Apple','Black',null,false],
 ['iphone-xr-white-64gb','Apple iPhone XR - White - 64GB',[7],190000,'Apple','White','64GB',false],
 ['iphone-13-dark','Apple iPhone 13 series - Dark Blue',[8],420000,'Apple','Dark Blue',null,false],
 ['iphone-12-red-64gb','Apple iPhone 12 - Red - 64GB',[9],310000,'Apple','Red','64GB',true],
 ['iphone-11-pro-64gb','Apple iPhone 11 Pro - 64GB',[10],330000,'Apple','Dark finish','64GB',true],
 ['iphone-12-pro-256gb','Apple iPhone 12 Pro - 256GB',[11],440000,'Apple','Graphite','256GB',true],
 ['iphone-13-red-128gb','Apple iPhone 13 - Red - 128GB',[12],420000,'Apple','Red','128GB',true],
 ['galaxy-s21-violet','Samsung Galaxy S21 series - Violet',[13],290000,'Samsung','Violet',null,false],
 ['iphone-xr-yellow','Apple iPhone XR - Yellow',[14],190000,'Apple','Yellow',null,false],
]
await fs.mkdir('client/public/products/new-phones',{recursive:true})
const rows=[]
for(const [slug,name,indexes,price,brand,color,storage,labelModel] of entries){
 const images=[]
 for(let i=0;i<indexes.length;i++){
  const file=files[indexes[i]],bytes=await fs.readFile(path.join(source,file))
  assert.ok(bytes.length<=3*1024*1024 && bytes[0]===255 && bytes[1]===216,'Valid JPEG under 3MB')
  const url=`/products/new-phones/${slug}-${i+1}.jpg`
  await fs.writeFile('client/public'+url,bytes);images.push(url)
 }
 const note=(labelModel?'Model and storage transcribed from the supplied photo label. ':'Model family inferred from the supplied image; confirm the exact model and size with MGE. ')+(storage?'Storage is shown on the photo label. ':'Storage is not shown; confirm with MGE. ')+'Condition, battery health, network lock, warranty and availability require confirmation. Label claims are not independent inspection results. Price is an editable placeholder.'
 rows.push({id:'new-'+slug,name,brand,category:'Smartphones',price,price_is_placeholder:true,original:null,image:images[0],images,badge:null,
  specs:{Color:color,Storage:storage||'Confirm with MGE',Condition:'Confirm with MGE','Battery health':'Confirm with MGE','Network lock':'Confirm with MGE'},
  description:`${name} in the supplied product photos. ${storage?'The label lists '+storage+' storage. ':''}Contact MGE to confirm the exact configuration and availability before ordering.`,stock:null,identification:labelModel?'photo-label':'visual-match',details_note:note,sources:[]})
}
assert.equal(rows.length,14);assert.equal(rows.reduce((n,p)=>n+p.images.length,0),15)
await fs.mkdir('docs/catalogue',{recursive:true})
await fs.writeFile('docs/catalogue/new-phones-2026-10-28.json',JSON.stringify(rows,null,2)+'\n')
console.log('Prepared 14 listings from 15 images; all photos under 3MB; prices marked as placeholders.')
