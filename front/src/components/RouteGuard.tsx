import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface RouteGuardProps {
  children: ReactNode
  requireDass?: boolean
}

interface GuardState {
  loading: boolean
  authenticated: boolean
  hasDassResult: boolean
}

function GuardFallback({ message }: { message: string }) {
  return (
    <div className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
      <div className='flex items-center gap-3 text-[var(--ink-muted)] text-[0.9rem] py-12'>
        <div className='w-4 h-4 rounded-full border-2 border-[var(--rose-medium)] border-t-transparent animate-spin' />
        {message}
      </div>
    </div>
  )
}

export default function RouteGuard({ children, requireDass = false }: RouteGuardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [state, setState] = useState<GuardState>({ loading: true, authenticated: false, hasDassResult: false })
  const redirectTo = `${location.pathname}${location.search}${location.hash}`
  const loginRedirectedRef = useRef(false)
  const dassRedirectedRef = useRef(false)

  useEffect(() => {
    let active = true

    const verifyAccess = async () => {
      try {
        const sessionRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/session`, { credentials: 'include' })
        if (!sessionRes.ok) {
          if (active) setState({ loading: false, authenticated: false, hasDassResult: false })
          return
        }

        let hasDassResult = false
        if (requireDass) {
          const dassRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dass/my-results`, { credentials: 'include' })
          if (dassRes.ok) {
            const data = await dassRes.json()
            hasDassResult = Array.isArray(data.data) && data.data.length > 0
          }
        }

        if (active) setState({ loading: false, authenticated: true, hasDassResult })
      } catch {
        if (active) setState({ loading: false, authenticated: false, hasDassResult: false })
      }
    }

    setState(prev => ({ ...prev, loading: true }))
    verifyAccess()

    return () => { active = false }
  }, [requireDass, redirectTo])

  useEffect(() => {
    if (!state.loading && !state.authenticated && !loginRedirectedRef.current) {
      loginRedirectedRef.current = true
      toast.info('Please log in to continue.')
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, { replace: true })
    }
  }, [navigate, redirectTo, state.authenticated, state.loading])

  useEffect(() => {
    if (!state.loading && state.authenticated && requireDass && !state.hasDassResult && !dassRedirectedRef.current) {
      dassRedirectedRef.current = true
      navigate(`/dass21?redirect=${encodeURIComponent(redirectTo)}&required=1`, { replace: true })
    }
  }, [navigate, redirectTo, requireDass, state.authenticated, state.hasDassResult, state.loading])

  useEffect(() => {
    if (state.authenticated) loginRedirectedRef.current = false
    if (state.hasDassResult) dassRedirectedRef.current = false
  }, [state.authenticated, state.hasDassResult])

  if (state.loading) {
    return <GuardFallback message={requireDass ? 'Checking your account and assessment status...' : 'Checking your session...'} />
  }

  if (!state.authenticated) return null

  if (requireDass && !state.hasDassResult) {
    return null
  }

  return <>{children}</>
}
