import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const MOODS = [{ label: 'Calm', value: 'calm' }, { label: 'Happy', value: 'happy' }, { label: 'Anxious', value: 'anxious' }, { label: 'Sad', value: 'sad' }, { label: 'Frustrated', value: 'frustrated' }, { label: 'Numb', value: 'numb' }]

const MOOD_SCORE: Record<string, number> = { happy: 5, calm: 4, numb: 3, anxious: 2, sad: 2, frustrated: 1 }
const MOOD_COLOR: Record<string, string> = { happy: 'var(--rose-medium)', calm: 'var(--blue-medium)', numb: 'rgba(255,255,255,0.2)', anxious: 'var(--rose-medium)', sad: 'var(--blue-medium)', frustrated: 'rgba(255,255,255,0.2)' }

const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), dateStr: d.toISOString().slice(0, 10) })
  }
  return days
}

interface MoodLog { mood: string; loggedAt: string }
interface Stats { todayMood: string | null; currentStreak: number; averageScore: number | null; weeklyChange: number | null }

export default function MoodTracker() {
  const [activeMood, setActiveMood] = useState('happy')
  const [logging, setLogging] = useState(false)
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [stats, setStats] = useState<Stats>({ todayMood: null, currentStreak: 0, averageScore: null, weeklyChange: null })
  const [loadingStats, setLoadingStats] = useState(true)

  const days7 = getLast7Days()

  useEffect(() => {
    const load = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/mood/history?days=7`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/mood/stats`, { credentials: 'include' }),
        ])
        if (histRes.ok) { const d = await histRes.json(); setLogs(d.data || []) }
        if (statsRes.ok) {
          const d = await statsRes.json()
          setStats(d.data)
          if (d.data.todayMood) setActiveMood(d.data.todayMood)
        }
      } catch {  }
      finally { setLoadingStats(false) }
    }
    load()
  }, [])

  const barData = days7.map(day => {
    const log = logs.find(l => l.loggedAt.slice(0, 10) === day.dateStr)
    if (!log) return { height: 14, color: 'rgba(255,255,255,0.08)', label: day.label }
    const score = MOOD_SCORE[log.mood] ?? 3
    return { height: Math.round((score / 5) * 110) + 10, color: MOOD_COLOR[log.mood] ?? 'var(--rose-medium)', label: day.label }
  })

  const handleLog = async () => {
    setLogging(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mood/log`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ mood: activeMood }) })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Mood logged')
        setStats(s => ({ ...s, todayMood: activeMood }))
        const h = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mood/history?days=7`, { credentials: 'include' })
        if (h.ok) { const d = await h.json(); setLogs(d.data || []) }
      } else {
        toast.error(data.message || 'Could not log mood')
      }
    } catch { toast.error('Could not connect to server') }
    finally { setLogging(false) }
  }

  const avgDisplay = loadingStats ? '—' : stats.averageScore !== null ? `${stats.averageScore}` : '—'
  const streakDisplay = loadingStats ? '—' : `${stats.currentStreak}`
  const changeDisplay = loadingStats ? '—' : stats.weeklyChange !== null ? `${stats.weeklyChange > 0 ? '+' : ''}${stats.weeklyChange}%` : '—'
  const changeColor = !loadingStats && stats.weeklyChange !== null && stats.weeklyChange < 0 ? 'var(--rose-medium)' : 'var(--blue-medium)'

  return (
    <section className='bg-[var(--ink)] px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center'>
      <div>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-3'>Daily Check-in</span>
        <h2 className='font-cormorant text-[clamp(2rem,3.5vw,2.8rem)] font-light leading-tight text-white mb-3'>
          How are you <em className='italic text-[var(--rose-medium)]'>feeling</em> today?
        </h2>
        <p className='text-[0.88rem] leading-relaxed font-light text-[rgba(255,255,255,0.45)] mb-6 max-w-[400px]'>Tracking your mood daily builds self-awareness and helps your counsellor understand your patterns.</p>
        <div className='flex flex-wrap gap-2 mb-6'>
          {MOODS.map(m => (
            <button key={m.value} onClick={() => setActiveMood(m.value)} className={`px-4 py-2 rounded-full text-[0.82rem] border-[1.5px] cursor-pointer transition-all duration-200 ${activeMood === m.value ? 'bg-[var(--rose-medium)] border-[var(--rose-medium)] text-white' : 'bg-transparent border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.55)] hover:border-[var(--rose-medium)] hover:text-white'}`}>{m.label}</button>
          ))}
        </div>
        <button onClick={handleLog} disabled={logging} className='bg-white text-[var(--ink)] text-[0.85rem] font-medium px-6 py-3 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'>
          {logging ? 'Logging...' : stats.todayMood ? 'Update Today\'s Mood' : 'Log Today\'s Mood'}
        </button>
      </div>
      <div>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[rgba(255,255,255,0.35)] block mb-4'>This Week</span>
        <div className='flex items-end gap-2 h-[130px] mb-6'>
          {barData.map((bar, i) => (
            <div key={i} className='flex-1 flex flex-col items-center gap-1.5'>
              <div className='w-full rounded-t-md transition-all duration-500' style={{ height: `${bar.height}px`, background: bar.color }} />
              <span className='text-[0.65rem] text-[rgba(255,255,255,0.35)]'>{bar.label}</span>
            </div>
          ))}
        </div>
        <div className='flex gap-8 flex-wrap'>
          <div><div className='font-cormorant text-[2rem] font-light text-white leading-none'>{avgDisplay}<span className='text-[0.9rem] text-[rgba(255,255,255,0.35)]'>{!loadingStats && stats.averageScore !== null ? '/5' : ''}</span></div><div className='text-[0.68rem] text-[rgba(255,255,255,0.35)] uppercase tracking-wider mt-0.5'>Avg Mood</div></div>
          <div><div className='font-cormorant text-[2rem] font-light text-[var(--rose-medium)] leading-none'>{streakDisplay}</div><div className='text-[0.68rem] text-[rgba(255,255,255,0.35)] uppercase tracking-wider mt-0.5'>Day Streak</div></div>
          <div><div className='font-cormorant text-[2rem] font-light leading-none' style={{ color: changeColor }}>{changeDisplay}</div><div className='text-[0.68rem] text-[rgba(255,255,255,0.35)] uppercase tracking-wider mt-0.5'>vs Last Week</div></div>
        </div>
      </div>
    </section>
  )
}
