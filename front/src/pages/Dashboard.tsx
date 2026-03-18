import { useEffect, useState, useCallback } from 'react'
import AppointmentCard from '../components/AppointmentCard'
import { toast } from 'react-toastify'

interface Stats { total: number; scheduled: number; completed: number; cancelled: number; todayScheduled: number }

export default function CounselorDashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  const fetchAll = useCallback(async () => {
    try {
      const url = filter
        ? `${import.meta.env.VITE_BACKEND_URL}/counsellor/dashboard?status=${filter}`
        : `${import.meta.env.VITE_BACKEND_URL}/counsellor/dashboard`

      const [apptRes, statsRes] = await Promise.all([
        fetch(url, { credentials: 'include' }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/counsellor/stats`, { credentials: 'include' }),
      ])

      if (apptRes.ok) { const d = await apptRes.json(); setAppointments(d.data || []) }
      else { const d = await apptRes.json(); toast.error(d.message || 'Failed to load appointments') }

      if (statsRes.ok) { const d = await statsRes.json(); setStats(d.data) }
    } catch { toast.error('Could not connect to server') }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { setLoading(true); fetchAll() }, [fetchAll])

  const statCards = stats ? [
    { label: 'Total', value: stats.total, color: 'text-[var(--ink)]' },
    { label: 'Scheduled', value: stats.scheduled, color: 'text-blue-600' },
    { label: 'Completed', value: stats.completed, color: 'text-green-600' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-500' },
    { label: 'Today', value: stats.todayScheduled, color: 'text-[var(--rose-medium)]' },
  ] : []

  const filters = [{ label: 'All', value: '' }, { label: 'Scheduled', value: 'scheduled' }, { label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' }]

  return (
    <div className='min-h-[calc(100vh-64px)] px-6 sm:px-10 py-10 relative overflow-hidden'>
      <div className='blob-primary fixed right-[-8%] top-[5%] w-[440px] h-[440px] rounded-full opacity-25 pointer-events-none' style={{ background: 'radial-gradient(circle at 40% 40%, var(--blue-light) 0%, var(--blue-medium) 60%, transparent 80%)' }} />
      <div className='relative z-10 max-w-5xl mx-auto'>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-1'>Counsellor View</span>
        <h1 className='font-cormorant text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[var(--ink)] leading-tight mb-6'>Appointments Dashboard</h1>

        {stats && (
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8'>
            {statCards.map(s => (
              <div key={s.label} className='bg-white rounded-2xl px-4 py-3 border-[1.5px] border-[rgba(255,167,166,0.18)] shadow-[0_4px_16px_rgba(44,44,44,0.04)]'>
                <div className={`font-cormorant text-[1.9rem] font-light leading-none ${s.color}`}>{s.value}</div>
                <div className='text-[0.65rem] text-[var(--ink-muted)] uppercase tracking-wide mt-0.5'>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className='flex gap-2 flex-wrap mb-6'>
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 rounded-full text-[0.78rem] font-medium border-[1.5px] cursor-pointer transition-all duration-200 ${filter === f.value ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink-muted)] border-[rgba(44,44,44,0.14)] hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)]'}`}>{f.label}</button>
          ))}
        </div>

        {loading
          ? <div className='flex items-center gap-3 text-[var(--ink-muted)] text-[0.9rem] py-12'><div className='w-4 h-4 rounded-full border-2 border-[var(--rose-medium)] border-t-transparent animate-spin' />Loading appointments...</div>
          : appointments.length === 0
            ? <div className='bg-white rounded-2xl p-10 text-center border-[1.5px] border-[rgba(255,167,166,0.2)]'><p className='font-cormorant text-[1.4rem] font-light text-[var(--ink-muted)]'>No {filter || ''} appointments found.</p></div>
            : <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>{appointments.map(a => <AppointmentCard key={a.id} appointment={a} onUpdate={fetchAll} />)}</div>
        }
      </div>
    </div>
  )
}
