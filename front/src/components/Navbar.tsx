import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [counsellor, setCounsellor] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const currentPath = window.location.pathname

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/session`, { credentials: 'include' })
        if (!res.ok) { setAuthenticated(false); return }
        const data = await res.json()
        setAuthenticated(data.authenticated)
        setCounsellor(data.user?.role === 'counsellor')
      } catch { setAuthenticated(false) }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const logout = async () => {
    if (!confirm('Are you sure you want to logout?')) return
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, { credentials: 'include', method: 'POST' })
      const data = await res.json()
      if (res.ok) { toast.success(data.message || 'Logged out'); setAuthenticated(false); window.location.href = '/login' }
      else toast.error('Failed to logout')
    } catch { toast.error('Error during logout') }
  }

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
    { label: 'Self-Test', href: '/dass21' },
    { label: 'Appointment', href: '/appointment' },
    { label: 'Chat', href: '/chat' },
    ...(counsellor ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(authenticated ? [{ label: 'Profile', href: '/profile' }] : []),
  ]

  const isActive = (href: string) => currentPath === href

  return (
    <nav ref={menuRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[rgba(255,242,241,0.95)] shadow-sm' : 'bg-[rgba(255,242,241,0.80)]'} backdrop-blur-md border-b border-[rgba(255,167,166,0.18)]`}>
      <div className='flex items-center justify-between px-6 sm:px-10 h-16'>

        <a href='/' className='font-cormorant text-[1.35rem] font-normal tracking-wide text-[var(--ink)] no-underline shrink-0'>
          Balance Over <span className='text-[var(--rose-medium)]'>Breakdown</span>
        </a>

        <ul className='hidden md:flex items-center gap-7 list-none m-0 p-0'>
          {links.map(l => (
            <li key={l.label}>
              <a href={l.href} className={`text-[0.8rem] font-normal tracking-[0.07em] uppercase no-underline pb-[2px] border-b-[1.5px] transition-colors duration-200 ${isActive(l.href) ? 'text-[var(--ink)] border-[var(--rose-medium)]' : 'text-[var(--ink-muted)] border-transparent hover:text-[var(--rose-medium)]'}`}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className='hidden md:flex items-center gap-3'>
          {authenticated
            ? <button onClick={logout} className='bg-[var(--ink)] text-white text-[0.8rem] font-medium tracking-wide px-5 py-2 rounded-full border-none cursor-pointer hover:-translate-y-0.5 transition-transform duration-200'>Logout</button>
            : <a href='/login'><button className='bg-[var(--rose-medium)] text-white text-[0.8rem] font-medium tracking-wide px-5 py-2 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,167,166,0.4)] transition-all duration-200'>Get Started</button></a>
          }
        </div>

        <button onClick={() => setOpen(o => !o)} className='md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 bg-transparent border-none cursor-pointer p-0' aria-label='Toggle menu'>
          <span className={`block w-5 h-[1.5px] bg-[var(--ink)] rounded-full transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[var(--ink)] rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[var(--ink)] rounded-full transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'} bg-[rgba(255,242,241,0.98)] backdrop-blur-md border-t border-[rgba(255,167,166,0.15)]`}>
        <div className='flex flex-col px-6 py-4 gap-1'>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className={`text-[0.88rem] tracking-[0.06em] uppercase no-underline py-3 border-b border-[rgba(44,44,44,0.06)] last:border-b-0 transition-colors duration-200 ${isActive(l.href) ? 'text-[var(--rose-medium)] font-medium' : 'text-[var(--ink-muted)] font-normal hover:text-[var(--rose-medium)]'}`}>{l.label}</a>
          ))}
          <div className='pt-3 pb-1'>
            {authenticated
              ? <button onClick={() => { setOpen(false); logout() }} className='w-full bg-[var(--ink)] text-white text-[0.85rem] font-medium py-2.5 rounded-full border-none cursor-pointer'>Logout</button>
              : <a href='/login' onClick={() => setOpen(false)}><button className='w-full bg-[var(--rose-medium)] text-white text-[0.85rem] font-medium py-2.5 rounded-full border-none cursor-pointer'>Get Started</button></a>
            }
          </div>
        </div>
      </div>
    </nav>
  )
}
