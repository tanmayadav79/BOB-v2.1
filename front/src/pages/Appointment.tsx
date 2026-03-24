import { useState } from 'react'
import { CheckCircle, FlaskConical } from 'lucide-react'
import { toast } from 'react-toastify'

export const Appointment = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', details: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/book/appointment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(formData) })
      const data = await res.json()
      if (res.ok) { setSubmitted(true); toast.success(data.message || 'Appointment booked successfully') }
      else toast.error(data.message || 'Failed to book appointment')
      setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', date: '', time: '', details: '' }) }, 2500)
    } catch (err) { console.error(err) }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border-[1.5px] border-[rgba(44,44,44,0.14)] bg-white text-[0.88rem] text-[var(--ink)] outline-none transition-colors duration-200 focus:border-[var(--rose-medium)]'
  const labelCls = 'block text-[0.72rem] font-medium tracking-[0.06em] uppercase text-[var(--ink-muted)] mb-1.5'

  return (
    <div className='min-h-[calc(100vh-64px)] flex items-start justify-center px-4 py-12 relative overflow-hidden'>
      <div className='relative z-10 w-full max-w-[520px] flex flex-col gap-4'>
        <a href='/dass21?redirect=%2Fappointment' className='group flex items-center justify-between gap-4 rounded-[22px] border border-[rgba(255,167,166,0.24)] bg-[rgba(255,248,247,0.95)] px-5 py-4 no-underline shadow-[0_10px_30px_rgba(44,44,44,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,167,166,0.18)]'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 shrink-0 rounded-full bg-[var(--rose-whisper)] flex items-center justify-center text-[var(--rose-medium)]'>
              <FlaskConical size={16} />
            </div>
            <div className='min-w-0'>
              <span className='text-[0.64rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-0.5'>DASS-21</span>
              <p className='text-[0.84rem] text-[var(--ink)] leading-relaxed'>Take the self-test before booking.</p>
            </div>
          </div>
          <span className='shrink-0 rounded-full bg-[var(--ink)] px-3.5 py-2 text-[0.72rem] font-medium text-white transition-transform duration-200 group-hover:translate-x-0.5'>Start Test</span>
        </a>

        <div className='bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-3xl p-8 shadow-[0_24px_60px_rgba(44,44,44,0.07)] border border-[rgba(255,167,166,0.2)]'>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Private Session</span>
        <h1 className='font-cormorant text-[2.1rem] font-light text-[var(--ink)] leading-tight mb-2'>Schedule Your Appointment</h1>
        <p className='text-[0.88rem] text-[var(--ink-muted)] font-light leading-relaxed mb-6'>Book a safe, private, and supportive session with one of our licensed counsellors.</p>
        {submitted && (
          <div className='flex items-center gap-3 p-4 mb-5 rounded-xl bg-green-50 text-green-700 border border-green-200'>
            <CheckCircle className='w-5 h-5 shrink-0' />
            <p className='text-[0.85rem]'>Your appointment has been booked. We will reach out soon.</p>
          </div>
        )}
        <form onSubmit={onSubmit} className='flex flex-col gap-5'>
          <div><label className={labelCls}>Your Name (optional)</label><input type='text' name='name' placeholder='Full name / Anonymous' value={formData.name} onChange={handleChange} className={inputCls} /></div>
          <div><label className={labelCls}>Email Address (optional)</label><input type='email' name='email' placeholder='Email for confirmation' value={formData.email} onChange={handleChange} className={inputCls} /></div>
          <div className='grid grid-cols-2 gap-4'>
            <div><label className={labelCls}>Date</label><input type='date' name='date' required value={formData.date} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>Time</label><input type='time' name='time' required value={formData.time} onChange={handleChange} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Additional Details (optional)</label><textarea name='details' placeholder='Anything you would like us to know...' value={formData.details} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} /></div>
          <button type='submit' className='bg-[var(--ink)] text-white text-[0.9rem] font-medium py-3 rounded-full border-none cursor-pointer mt-1 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(44,44,44,0.2)] transition-all duration-200'>Confirm Booking</button>
        </form>
        </div>
      </div>
    </div>
  )
}
