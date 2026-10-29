import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './design.css'

class StorefrontErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state:{failed:boolean}={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('Storefront render failed',error,info)}
  render(){
    if(this.state.failed)return <main className="startup-fallback"><h1>Let’s get you back to MGE.</h1><p>Your browser could not load this page correctly.</p><button onClick={()=>window.location.reload()}>Reload website</button></main>
    return this.props.children
  }
}
createRoot(document.getElementById('root')!).render(<StrictMode><StorefrontErrorBoundary><BrowserRouter><App/></BrowserRouter></StorefrontErrorBoundary></StrictMode>)
