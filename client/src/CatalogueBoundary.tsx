import { useEffect, type ReactNode } from 'react'
import { useCatalogue } from './catalogue-state'
import { refreshCatalogue } from './catalogue-api'
import { Button } from './components/ui/button'

export function useCatalogueRefresh(path:string) {
  useEffect(()=>{
    void refreshCatalogue()
    const refresh=()=>{if(document.visibilityState==='visible')void refreshCatalogue()}
    window.addEventListener('focus',refresh)
    const timer=window.setInterval(refresh,60000)
    return()=>{window.removeEventListener('focus',refresh);window.clearInterval(timer)}
  },[])
  useEffect(()=>{void refreshCatalogue()},[path])
}
export function CatalogueBoundary({children}:{children:ReactNode}) {
  const {ready,error}=useCatalogue()
  if(error)return <section className="container page empty" role="alert"><h1>The collection is taking a moment.</h1><p>{error}</p><Button onClick={()=>void refreshCatalogue()}>Try again</Button></section>
  if(!ready)return <section className="route-loading container page" role="status">Loading collection…</section>
  return <>{children}</>
}
