import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { adminRequest, hasAdminSession, forgetAdminSession } from './catalogue-api'
import { Button } from './components/ui/button'

export function AdminAccess({children}:{children:ReactNode}) {
  const [allowed,setAllowed]=useState(false)
  const [checking,setChecking]=useState(hasAdminSession)
  const [password,setPassword]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  useEffect(()=>{
    let active=true
    const expired=()=>{setAllowed(false);setPassword('')}
    window.addEventListener('mge-admin-expired',expired)
    if(hasAdminSession())void adminRequest('session').then(()=>{if(active)setAllowed(true)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setChecking(false)})
    return()=>{active=false;window.removeEventListener('mge-admin-expired',expired)}
  },[])
  async function unlock(event:React.FormEvent) {
    event.preventDefault();if(busy)return
    setBusy(true);setError('')
    try {await adminRequest('login',{password});setPassword('');setAllowed(true)}
    catch(e){setError((e as Error).message)}finally{setBusy(false)}
  }
  if(checking)return <div className="admin-shell"><main className="admin-main" role="status">Checking admin access…</main></div>
  if(allowed)return <>{children}</>
  return <div className="admin-shell admin-access"><form onSubmit={unlock} className="admin-login">
    <Link to="/" aria-label="MGE home"><img src="/mge-brand-logo.png" alt="MGE" width="124"/></Link>
    <div className="admin-login-icon"><LockKeyhole size={22}/></div><p className="admin-eyebrow">MGE / ADMIN</p>
    <h1>Your collection starts here.</h1><p>Enter your password to manage products.</p>
    <label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} disabled={busy} autoFocus/>
    {error&&<p className="admin-alert" role="alert">{error}</p>}
    <Button type="submit" disabled={busy}>{busy?'Checking…':'Open product manager'}</Button><Link className="admin-return" to="/">Back to the store</Link>
  </form></div>
}
export async function lockAdmin() {
  await adminRequest('logout')
  forgetAdminSession()
}
