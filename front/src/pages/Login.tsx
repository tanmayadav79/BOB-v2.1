import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Login')
  const colleges = ['Ajeenkya DY Patil University']
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: '', mobile: '', college: '', password: '', confirmPassword: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'Sign Up' && user.password !== user.confirmPassword) { toast.error('Passwords do not match'); return }
    try {
      if (state === 'Sign Up') {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user.username, mobileNo: user.mobile, college: user.college, password: user.password }) })
        if (res.ok) { toast.success('User registered, please log in.'); navigate('/login') }
        else { const { message } = await res.json(); toast.error(message) }
      }
      if (state === 'Login') {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ username: user.username, password: user.password }) })
        if (res.ok) { toast.success('Logged in successfully.'); navigate('/'); setTimeout(() => window.location.reload(), 600) }
        else { const { message } = await res.json(); toast.error(message) }
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : 'An error occurred') }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border-[1.5px] border-[rgba(44,44,44,0.14)] bg-white font-[DM_Sans] text-[0.88rem] text-[var(--ink)] outline-none transition-colors duration-200 focus:border-[var(--rose-medium)]'

  return (
    <div className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 relative overflow-hidden'>
      <form onSubmit={handleSubmit} className='relative z-10 w-full max-w-[400px] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-3xl p-8 shadow-[0_24px_60px_rgba(44,44,44,0.08)] border border-[rgba(255,167,166,0.2)] flex flex-col gap-4'>
        <div className='text-center mb-1'>
          <h2 className='font-cormorant text-[1.9rem] font-normal text-[var(--ink)] leading-tight'>{state === 'Login' ? 'Welcome back' : 'Create account'}</h2>
          <p className='text-[0.82rem] text-[var(--ink-muted)] font-light mt-1'>{state === 'Login' ? 'Log in to your wellness space' : 'Begin your wellness journey today'}</p>
        </div>
        <input value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} type='text' className={inputCls} placeholder='Username / Anonymous Name' required />
        {state !== 'Login' && <input value={user.mobile} onChange={e => setUser({ ...user, mobile: e.target.value })} type='number' className={inputCls} placeholder='Mobile Number' required />}
        {state !== 'Login' && (
          <select value={user.college} onChange={e => setUser({ ...user, college: e.target.value })} className={inputCls} required>
            <option value='' disabled>Select Your College</option>
            {colleges.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        )}
        <input value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} type='password' className={inputCls} placeholder='Password' required />
        {state !== 'Login' && <input value={user.confirmPassword} onChange={e => setUser({ ...user, confirmPassword: e.target.value })} type='password' className={inputCls} placeholder='Confirm Password' required />}
        {state === 'Login' && <div className='flex justify-end -mt-1'><span className='text-[0.78rem] text-[var(--ink-muted)] cursor-pointer'>Forgot your password?</span></div>}
        <button type='submit' className='bg-[var(--ink)] text-white text-[0.9rem] font-medium py-3 rounded-full border-none cursor-pointer mt-1 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(44,44,44,0.2)] transition-all duration-200'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        <div className='flex items-center w-full my-1'>
          <div className='flex-1 border-t border-[rgba(44,44,44,0.1)]' />
          <span className='px-3 text-[var(--ink-muted)] text-[0.78rem]'>or</span>
          <div className='flex-1 border-t border-[rgba(44,44,44,0.1)]' />
        </div>
        <div className='flex justify-center'><button type='button' className='bg-transparent border-none cursor-pointer flex items-center'><FcGoogle size={26} /></button></div>
        <p className='text-center text-[0.82rem] text-[var(--ink-muted)] mt-1'>
          {state === 'Sign Up' ? 'Already have an account? ' : "Don't have an account? "}
          <button type='button' onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} className='bg-none border-none text-[var(--rose-medium)] font-medium cursor-pointer text-[0.82rem] p-0'>{state === 'Sign Up' ? 'Login' : 'Sign Up'}</button>
        </p>
      </form>
    </div>
  )
}
export default Login