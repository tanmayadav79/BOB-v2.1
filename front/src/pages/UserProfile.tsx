import { useEffect, useState, useRef } from 'react'
import MoodTracker from '../components/MoodTracker'
import { X, Calendar, Clock, AlertCircle, FlaskConical } from 'lucide-react'

interface Profile { id: string; username: string; mobileNo: string; college: string; role: string; bio?: string; avatarUrl?: string; createdAt: string; appointmentCounts: { total: number; scheduled: number; completed: number; cancelled: number }; moodLogs: { mood: string; loggedAt: string }[] }
interface MoodStats { todayMood: string | null; currentStreak: number; averageScore: number | null; weeklyChange: number | null }
interface Appointment { id: string; name?: string; email?: string; date: string; time: string; status: string; details?: string; cancelNote?: string; resolvedAt?: string; createdAt: string }
interface DassResult { id: string; depressionScore: number; anxietyScore: number; stressScore: number; depressionSeverity: string; anxietySeverity: string; stressSeverity: string; takenAt: string }

const SEV_COLOR: Record<string, string> = { Normal: 'text-[#3b6cb7]', Mild: 'text-[#b05a00]', Moderate: 'text-[var(--rose-medium)]', Severe: 'text-red-500', 'Extremely Severe': 'text-red-600' }
const SEV_BG: Record<string, string> = { Normal: 'bg-[var(--blue-light)]', Mild: 'bg-[var(--rose-soft)]', Moderate: 'bg-[var(--rose-light)]', Severe: 'bg-red-50', 'Extremely Severe': 'bg-red-100' }

function ScheduledPopup({ appointments, onClose }: { appointments: Appointment[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [onClose])
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgba(44,44,44,0.45)] backdrop-blur-sm px-0 sm:px-4'>
      <div ref={ref} className='w-full sm:max-w-[480px] bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_24px_60px_rgba(44,44,44,0.18)] max-h-[80vh] flex flex-col'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-[rgba(44,44,44,0.07)] shrink-0'>
          <div><span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block'>Upcoming</span><h3 className='font-cormorant text-[1.3rem] font-light text-[var(--ink)] leading-tight'>Scheduled Appointments</h3></div>
          <button onClick={onClose} className='w-8 h-8 rounded-full bg-[rgba(44,44,44,0.07)] flex items-center justify-center border-none cursor-pointer hover:bg-[rgba(44,44,44,0.12)] transition-colors duration-200'><X size={15} /></button>
        </div>
        <div className='overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3'>
          {appointments.length === 0
            ? <p className='text-center text-[0.88rem] text-[var(--ink-muted)] py-8 font-light'>No upcoming appointments.</p>
            : appointments.map(a => (
              <div key={a.id} className='bg-[var(--rose-whisper)] rounded-[16px] p-4 border-[1.5px] border-[rgba(255,167,166,0.2)]'>
                <div className='flex items-center justify-between mb-2'><span className='text-[0.68rem] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[var(--blue-light)] text-blue-600'>Scheduled</span><span className='text-[0.72rem] text-[var(--ink-muted)]'>Booked {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
                <div className='flex flex-wrap gap-3 mt-2'><span className='flex items-center gap-1.5 text-[0.82rem] text-[var(--ink)]'><Calendar size={13} className='text-[var(--rose-medium)]' />{new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span><span className='flex items-center gap-1.5 text-[0.82rem] text-[var(--ink)]'><Clock size={13} className='text-[var(--rose-medium)]' />{a.time}</span></div>
                {a.details && <p className='mt-2 text-[0.78rem] text-[var(--ink-muted)] font-light leading-relaxed line-clamp-2'>{a.details}</p>}
              </div>
            ))
          }
        </div>
        <div className='px-5 py-4 border-t border-[rgba(44,44,44,0.07)] shrink-0'><a href='/appointment' className='block w-full text-center bg-[var(--ink)] text-white text-[0.85rem] font-medium py-3 rounded-full no-underline hover:-translate-y-0.5 transition-all duration-200'>Book Another Session</a></div>
      </div>
    </div>
  )
}

function CancelledSection({ appointments }: { appointments: Appointment[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  if (appointments.length === 0) return null
  return (
    <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 mb-6'>
      <div className='bg-white rounded-[20px] p-5 border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)]'>
        <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-4'>Cancelled Appointments</span>
        <div className='flex flex-col gap-2.5'>
          {appointments.map(a => (
            <div key={a.id} className='rounded-[14px] border-[1.5px] border-[rgba(255,167,166,0.2)] overflow-hidden'>
              <button onClick={() => setExpanded(expanded === a.id ? null : a.id)} className='w-full flex items-center justify-between px-4 py-3 bg-[var(--rose-whisper)] border-none cursor-pointer text-left hover:bg-[var(--rose-light)] transition-colors duration-200'>
                <div className='flex flex-wrap items-center gap-3'><span className='flex items-center gap-1.5 text-[0.82rem] text-[var(--ink)]'><Calendar size={12} className='text-[var(--rose-medium)]' />{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><span className='flex items-center gap-1.5 text-[0.82rem] text-[var(--ink-muted)]'><Clock size={12} />{a.time}</span></div>
                <span className={`text-[0.68rem] font-medium tracking-wide px-2.5 py-0.5 rounded-full bg-[var(--rose-light)] text-red-500 shrink-0 ml-2 transition-transform duration-200 ${expanded === a.id ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {expanded === a.id && (
                <div className='px-4 py-3 bg-white border-t border-[rgba(255,167,166,0.15)]'>
                  {a.cancelNote ? <div className='flex gap-2 items-start'><AlertCircle size={14} className='text-red-400 shrink-0 mt-0.5' /><div><p className='text-[0.7rem] font-medium uppercase tracking-wide text-[var(--ink-muted)] mb-0.5'>Reason for cancellation</p><p className='text-[0.84rem] text-[var(--ink)] leading-relaxed'>{a.cancelNote}</p></div></div> : <p className='text-[0.82rem] text-[var(--ink-muted)] font-light italic'>No reason provided.</p>}
                  {a.resolvedAt && <p className='text-[0.7rem] text-[var(--ink-muted)] mt-2'>Cancelled on {new Date(a.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DassHistory({ results }: { results: DassResult[] }) {
  if (results.length === 0) return (
    <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 mb-6'>
      <div className='bg-white rounded-[20px] p-5 border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)]'>
        <div className='flex items-center justify-between mb-3'><span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)]'>DASS-21 Assessment</span><FlaskConical size={15} className='text-[var(--ink-muted)]' /></div>
        <p className='text-[0.86rem] text-[var(--ink-muted)] font-light mb-4'>You have not taken the DASS-21 self-assessment yet. It takes about 5 minutes and gives you insights into your stress, anxiety, and depression levels.</p>
        <a href='/dass21' className='inline-block bg-[var(--ink)] text-white text-[0.82rem] font-medium px-5 py-2.5 rounded-full no-underline hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,44,44,0.18)] transition-all duration-200'>Take the Test</a>
      </div>
    </div>
  )

  const latest = results[0]
  return (
    <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 mb-6'>
      <div className='bg-white rounded-[20px] p-5 border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)]'>
        <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
          <div><span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-0.5'>DASS-21 Assessment</span><p className='text-[0.75rem] text-[var(--ink-muted)] font-light'>Latest: {new Date(latest.takenAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
          <a href='/dass21' className='text-[0.75rem] font-medium text-[var(--rose-medium)] border-[1.5px] border-[rgba(255,167,166,0.3)] px-3 py-1.5 rounded-full no-underline hover:bg-[var(--rose-whisper)] transition-colors duration-200'>Retake Test</a>
        </div>
        <div className='grid grid-cols-3 gap-3 mb-4'>
          {[{ label: 'Depression', score: latest.depressionScore, sev: latest.depressionSeverity }, { label: 'Anxiety', score: latest.anxietyScore, sev: latest.anxietySeverity }, { label: 'Stress', score: latest.stressScore, sev: latest.stressSeverity }].map(s => (
            <div key={s.label} className={`rounded-[14px] p-3 text-center ${SEV_BG[s.sev] || 'bg-[var(--rose-whisper)]'}`}>
              <div className='font-cormorant text-[1.8rem] font-light text-[var(--ink)] leading-none'>{s.score}<span className='text-[0.75rem] text-[var(--ink-muted)]'>/42</span></div>
              <div className={`text-[0.65rem] font-medium uppercase tracking-wide mt-0.5 ${SEV_COLOR[s.sev] || 'text-[var(--ink-muted)]'}`}>{s.sev}</div>
              <div className='text-[0.62rem] text-[var(--ink-muted)] mt-0.5'>{s.label}</div>
            </div>
          ))}
        </div>
        {results.length > 1 && (
          <details className='group'>
            <summary className='text-[0.75rem] text-[var(--ink-muted)] cursor-pointer list-none flex items-center gap-1 hover:text-[var(--rose-medium)] transition-colors duration-200 select-none'><span className='group-open:rotate-90 transition-transform duration-200 inline-block'>▶</span>View all {results.length} attempts</summary>
            <div className='mt-3 flex flex-col gap-2'>
              {results.slice(1).map(r => (
                <div key={r.id} className='flex items-center justify-between px-3 py-2 rounded-[10px] bg-[var(--rose-whisper)] border border-[rgba(255,167,166,0.15)]'>
                  <span className='text-[0.75rem] text-[var(--ink-muted)]'>{new Date(r.takenAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <div className='flex gap-3'>
                    {[{ label: 'D', score: r.depressionScore, sev: r.depressionSeverity }, { label: 'A', score: r.anxietyScore, sev: r.anxietySeverity }, { label: 'S', score: r.stressScore, sev: r.stressSeverity }].map(s => (
                      <span key={s.label} className='text-[0.72rem] text-[var(--ink-muted)]'>{s.label}: <span className={`font-medium ${SEV_COLOR[s.sev] || ''}`}>{s.score}</span></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null)
  const [scheduledAppts, setScheduledAppts] = useState<Appointment[]>([])
  const [cancelledAppts, setCancelledAppts] = useState<Appointment[]>([])
  const [dassResults, setDassResults] = useState<DassResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduled, setShowScheduled] = useState(false)
  const [editing, setEditing] = useState(false)
  const [bioInput, setBioInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, moodRes, schedRes, cancelRes, dassRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/mood/stats`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/book/my-appointments?status=scheduled`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/book/my-appointments?status=cancelled`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/dass/my-results`, { credentials: 'include' }),
        ])
        if (profRes.ok) { const d = await profRes.json(); setProfile(d.data); setBioInput(d.data.bio || '') }
        if (moodRes.ok) { const d = await moodRes.json(); setMoodStats(d.data) }
        if (schedRes.ok) { const d = await schedRes.json(); setScheduledAppts(d.data || []) }
        if (cancelRes.ok) { const d = await cancelRes.json(); setCancelledAppts(d.data || []) }
        if (dassRes.ok) { const d = await dassRes.json(); setDassResults(d.data || []) }
      } catch { /* not authenticated */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSaveBio = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ bio: bioInput }) })
      if (res.ok) { const d = await res.json(); setProfile(p => p ? { ...p, bio: d.data.bio } : p); setEditing(false) }
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const initials = profile?.username ? profile.username.slice(0, 2).toUpperCase() : '??'
  const statCards = [
    { label: 'Sessions Done', value: loading ? '—' : `${profile?.appointmentCounts.completed ?? '—'}` },
    { label: 'Mood Streak', value: loading ? '—' : moodStats?.currentStreak !== undefined ? `${moodStats.currentStreak}d` : '—' },
    { label: 'Tests Taken', value: loading ? '—' : `${dassResults.length}` },
  ]
  const rows = [
    { label: 'Username', value: profile?.username || '—' },
    { label: 'College', value: profile?.college || '—' },
    { label: 'Role', value: profile?.role || 'student' },
    { label: 'Mobile', value: profile?.mobileNo || '—' },
    { label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
  ]
  const actions = [
    { label: 'Take DASS-21 Test', href: '/dass21', bg: 'bg-[var(--rose-light)]' },
    { label: 'Book an Appointment', href: '/appointment', bg: 'bg-[var(--blue-light)]' },
    { label: 'Chat with BOB Bot', href: '/chat', bg: 'bg-[var(--rose-soft)]' },
  ]

  return (
    <div className='min-h-[calc(100vh-64px)] relative overflow-hidden'>
      <div className='bg-[var(--ink)] px-6 sm:px-10 lg:px-16 pt-10 pb-16 relative z-10'>
        <div className='max-w-3xl mx-auto flex items-start gap-5 flex-wrap'>
          <div className='w-[72px] h-[72px] rounded-full bg-[var(--rose-medium)] flex items-center justify-center font-cormorant text-[1.8rem] font-normal text-white shrink-0 border-[3px] border-[rgba(255,255,255,0.12)]'>{loading ? '...' : initials}</div>
          <div className='flex-1 min-w-0'>
            <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-1'>{loading ? '' : (profile?.role === 'counsellor' ? 'Counsellor' : 'Student')}</span>
            <h1 className='font-cormorant text-[clamp(1.8rem,3vw,2.4rem)] font-light text-white leading-tight'>{loading ? 'Loading...' : (profile?.username || 'Anonymous')}</h1>
            {profile?.college && <p className='text-[0.84rem] text-[rgba(255,255,255,0.45)] font-light mt-0.5 truncate'>{profile.college}</p>}
            {!loading && !editing && <p className='text-[0.84rem] text-[rgba(255,255,255,0.5)] font-light mt-2 max-w-[420px] leading-relaxed'>{profile?.bio || <span className='italic opacity-60'>No bio yet.</span>}<button onClick={() => setEditing(true)} className='ml-2 text-[0.72rem] text-[var(--rose-medium)] underline bg-transparent border-none cursor-pointer'>Edit</button></p>}
            {editing && (
              <div className='mt-3 flex gap-2 flex-wrap items-center'>
                <input value={bioInput} onChange={e => setBioInput(e.target.value)} maxLength={500} placeholder='Write a short bio...' className='flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.1)] text-white text-[0.84rem] border border-[rgba(255,255,255,0.2)] outline-none focus:border-[var(--rose-medium)] transition-colors duration-200 placeholder:text-[rgba(255,255,255,0.3)]' />
                <button onClick={handleSaveBio} disabled={saving} className='px-4 py-2 rounded-full bg-[var(--rose-medium)] text-white text-[0.78rem] font-medium border-none cursor-pointer disabled:opacity-60'>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditing(false); setBioInput(profile?.bio || '') }} className='px-4 py-2 rounded-full bg-[rgba(255,255,255,0.1)] text-white text-[0.78rem] border-none cursor-pointer hover:bg-[rgba(255,255,255,0.18)] transition-colors duration-200'>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='relative z-20 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 -mt-8 mb-6'>
        <div className='grid grid-cols-3 gap-3'>
          {statCards.map(s => (
            <div key={s.label} className='bg-white rounded-2xl px-4 py-4 shadow-[0_8px_30px_rgba(44,44,44,0.07)] border-[1.5px] border-[rgba(255,167,166,0.15)]'>
              <div className='font-cormorant text-[1.8rem] font-light text-[var(--ink)] leading-none'>{s.value}</div>
              <div className='text-[0.65rem] text-[var(--ink-muted)] uppercase tracking-wide mt-1 leading-tight'>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white rounded-[20px] p-6 shadow-[0_6px_24px_rgba(44,44,44,0.05)] border-[1.5px] border-[rgba(255,167,166,0.15)]'>
          <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-4'>Account Details</span>
          <div className='flex flex-col gap-3'>
            {rows.map(r => (
              <div key={r.label} className='flex justify-between items-center pb-3 border-b border-[rgba(44,44,44,0.06)] last:border-b-0 last:pb-0'>
                <span className='text-[0.75rem] text-[var(--ink-muted)] uppercase tracking-wide'>{r.label}</span>
                <span className='text-[0.86rem] text-[var(--ink)]'>{loading ? '...' : r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='bg-white rounded-[20px] p-6 shadow-[0_6px_24px_rgba(44,44,44,0.05)] border-[1.5px] border-[rgba(255,167,166,0.15)]'>
          <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-4'>Quick Actions</span>
          <div className='flex flex-col gap-2.5'>
            {actions.map(a => <a key={a.label} href={a.href} className={`${a.bg} no-underline px-4 py-3 rounded-xl text-[0.86rem] text-[var(--ink)] font-normal hover:translate-x-1 transition-transform duration-200 block`}>{a.label} →</a>)}
          </div>
          {moodStats && (
            <div className='mt-5 pt-4 border-t border-[rgba(44,44,44,0.06)] flex gap-5'>
              <div><div className='font-cormorant text-[1.5rem] font-light text-[var(--ink)] leading-none'>{moodStats.averageScore ?? '—'}<span className='text-[0.75rem] text-[var(--ink-muted)]'>{moodStats.averageScore ? '/5' : ''}</span></div><div className='text-[0.62rem] text-[var(--ink-muted)] uppercase tracking-wide mt-0.5'>Avg Mood</div></div>
              <div><div className='font-cormorant text-[1.5rem] font-light text-[var(--rose-medium)] leading-none'>{moodStats.currentStreak}</div><div className='text-[0.62rem] text-[var(--ink-muted)] uppercase tracking-wide mt-0.5'>Day Streak</div></div>
              {moodStats.weeklyChange !== null && <div><div className={`font-cormorant text-[1.5rem] font-light leading-none ${moodStats.weeklyChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>{moodStats.weeklyChange > 0 ? '+' : ''}{moodStats.weeklyChange}%</div><div className='text-[0.62rem] text-[var(--ink-muted)] uppercase tracking-wide mt-0.5'>vs Last Week</div></div>}
            </div>
          )}
        </div>
      </div>

      {profile && (
        <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 mb-6'>
          <div className='bg-white rounded-[20px] p-5 border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)]'>
            <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
              <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)]'>Appointment Summary</span>
              <button onClick={() => setShowScheduled(true)} className='flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--blue-light)] text-blue-600 text-[0.75rem] font-medium border-none cursor-pointer hover:bg-[var(--blue-medium)] transition-colors duration-200'>
                <Calendar size={12} />View Scheduled
                {scheduledAppts.length > 0 && <span className='w-4 h-4 rounded-full bg-blue-600 text-white text-[0.6rem] flex items-center justify-center font-bold'>{scheduledAppts.length}</span>}
              </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[{ label: 'Total', val: profile.appointmentCounts.total, cls: 'text-[var(--ink)]' }, { label: 'Scheduled', val: profile.appointmentCounts.scheduled, cls: 'text-blue-600' }, { label: 'Completed', val: profile.appointmentCounts.completed, cls: 'text-green-600' }, { label: 'Cancelled', val: profile.appointmentCounts.cancelled, cls: 'text-red-500' }].map(c => (
                <div key={c.label} className='text-center'><div className={`font-cormorant text-[2rem] font-light leading-none ${c.cls}`}>{c.val}</div><div className='text-[0.65rem] text-[var(--ink-muted)] uppercase tracking-wide mt-0.5'>{c.label}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <DassHistory results={dassResults} />

      <CancelledSection appointments={cancelledAppts} />

      <div className='relative z-10 max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 pb-16'>
        <div className='rounded-[20px] overflow-hidden'><MoodTracker /></div>
      </div>

      {showScheduled && <ScheduledPopup appointments={scheduledAppts} onClose={() => setShowScheduled(false)} />}
    </div>
  )
}
