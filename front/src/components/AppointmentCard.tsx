import { useState } from 'react'
import { toast } from 'react-toastify'
import { FlaskConical } from 'lucide-react'

interface LatestDass { depressionScore: number; anxietyScore: number; stressScore: number; depressionSeverity: string; anxietySeverity: string; stressSeverity: string; takenAt: string }
interface Appointment { id: string; name?: string; phoneNumber: string; email?: string; date: string; time: string; status: string; details?: string; cancelNote?: string; resolvedBy?: string; user?: { id: string; username: string; college: string; mobileNo: string; latestDass: LatestDass | null } }
interface Props { appointment: Appointment; onUpdate?: () => void }

const SEV_COLOR: Record<string, string> = { Normal: 'text-[#3b6cb7]', Mild: 'text-[#b05a00]', Moderate: 'text-[var(--rose-medium)]', Severe: 'text-red-500', 'Extremely Severe': 'text-red-600' }

export default function AppointmentCard({ appointment, onUpdate }: Props) {
  const [acting, setActing] = useState<'complete' | 'cancel' | null>(null)
  const [showCancelInput, setShowCancelInput] = useState(false)
  const [cancelNote, setCancelNote] = useState('')
  const [showDass, setShowDass] = useState(false)

  const statusCls = appointment.status === 'scheduled' ? 'bg-[var(--blue-light)] text-blue-600' : appointment.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-[var(--rose-light)] text-red-600'
  const isSettled = appointment.status !== 'scheduled'
  const dass = appointment.user?.latestDass ?? null

  const handleComplete = async () => {
    setActing('complete')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/counsellor/appointments/${appointment.id}/complete`, { method: 'PATCH', credentials: 'include' })
      const data = await res.json()
      if (res.ok) { toast.success('Appointment marked as completed'); onUpdate?.() }
      else toast.error(data.message || 'Could not complete appointment')
    } catch { toast.error('Could not connect to server') }
    finally { setActing(null) }
  }

  const handleCancelSubmit = async () => {
    setActing('cancel')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/counsellor/appointments/${appointment.id}/cancel`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ cancelNote: cancelNote.trim() || undefined }) })
      const data = await res.json()
      if (res.ok) { toast.success('Appointment cancelled'); setShowCancelInput(false); setCancelNote(''); onUpdate?.() }
      else toast.error(data.message || 'Could not cancel appointment')
    } catch { toast.error('Could not connect to server') }
    finally { setActing(null) }
  }

  return (
    <div className='bg-white rounded-2xl p-5 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_4px_20px_rgba(44,44,44,0.05)] hover:shadow-[0_12px_32px_rgba(44,44,44,0.1)] hover:-translate-y-0.5 transition-all duration-200'>
      <div className='flex justify-between items-start mb-3'>
        <div className='font-cormorant text-[1.2rem] font-normal text-[var(--ink)] leading-tight'>{appointment.name || appointment.user?.username || 'Anonymous Student'}</div>
        <span className={`text-[0.68rem] font-medium px-3 py-1 rounded-full tracking-wide shrink-0 ml-2 ${statusCls}`}>{appointment.status}</span>
      </div>

      <div className='flex flex-col gap-1 text-[0.82rem] text-[var(--ink-muted)] mb-3'>
        <p>Phone: {appointment.phoneNumber}</p>
        {appointment.email && <p className='truncate'>Email: {appointment.email}</p>}
        {appointment.user?.college && <p>College: {appointment.user.college}</p>}
        <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: {appointment.time}</p>
        {appointment.resolvedBy && <p>Resolved by: {appointment.resolvedBy}</p>}
      </div>

      {appointment.details && <p className='mb-3 text-[0.82rem] text-[var(--ink-muted)] leading-relaxed line-clamp-2'>{appointment.details}</p>}
      {appointment.cancelNote && <p className='mb-3 text-[0.78rem] text-red-500 italic'>Cancel note: {appointment.cancelNote}</p>}

      <div className='mb-3'>
        {dass ? (
          <div>
            <button onClick={() => setShowDass(!showDass)} className='flex items-center gap-1.5 text-[0.72rem] font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full border-none cursor-pointer hover:bg-green-100 transition-colors duration-200'>
              <FlaskConical size={11} />DASS-21 taken · {new Date(dass.takenAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} {showDass ? '▲' : '▼'}
            </button>
            {showDass && (
              <div className='mt-2 grid grid-cols-3 gap-1.5'>
                {[{ label: 'Depression', score: dass.depressionScore, sev: dass.depressionSeverity }, { label: 'Anxiety', score: dass.anxietyScore, sev: dass.anxietySeverity }, { label: 'Stress', score: dass.stressScore, sev: dass.stressSeverity }].map(s => (
                  <div key={s.label} className='bg-[var(--rose-whisper)] rounded-[10px] p-2 text-center border border-[rgba(255,167,166,0.15)]'>
                    <div className='font-cormorant text-[1.1rem] font-light text-[var(--ink)] leading-none'>{s.score}<span className='text-[0.6rem] text-[var(--ink-muted)]'>/42</span></div>
                    <div className={`text-[0.6rem] font-medium uppercase tracking-wide mt-0.5 ${SEV_COLOR[s.sev] || 'text-[var(--ink-muted)]'}`}>{s.sev}</div>
                    <div className='text-[0.58rem] text-[var(--ink-muted)]'>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className='flex items-center gap-1.5 text-[0.72rem] font-medium text-[var(--ink-muted)] bg-[rgba(44,44,44,0.06)] px-3 py-1.5 rounded-full w-fit'><FlaskConical size={11} />DASS-21 not taken</span>
        )}
      </div>

      {showCancelInput && (
        <div className='mt-3 flex flex-col gap-2'>
          <input value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder='Reason for cancellation (optional)' className='w-full px-3 py-2 text-[0.82rem] rounded-xl border-[1.5px] border-[rgba(44,44,44,0.14)] outline-none focus:border-[var(--rose-medium)] transition-colors duration-200' />
          <div className='flex gap-2'>
            <button onClick={handleCancelSubmit} disabled={acting === 'cancel'} className='flex-1 text-[0.78rem] font-medium py-2 rounded-full bg-[var(--rose-medium)] text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-60 transition-opacity duration-200'>{acting === 'cancel' ? 'Cancelling...' : 'Confirm Cancel'}</button>
            <button onClick={() => { setShowCancelInput(false); setCancelNote('') }} className='flex-1 text-[0.78rem] font-medium py-2 rounded-full bg-[rgba(44,44,44,0.07)] text-[var(--ink-muted)] border-none cursor-pointer hover:bg-[rgba(44,44,44,0.12)] transition-colors duration-200'>Go Back</button>
          </div>
        </div>
      )}

      {!isSettled && !showCancelInput && (
        <div className='flex gap-2'>
          <button onClick={handleComplete} disabled={acting === 'complete'} className='flex-1 text-[0.78rem] font-medium py-2 rounded-full bg-green-50 text-green-700 border-none cursor-pointer hover:bg-green-100 transition-colors duration-200 disabled:opacity-60'>{acting === 'complete' ? 'Saving...' : 'Mark Completed'}</button>
          <button onClick={() => setShowCancelInput(true)} className='flex-1 text-[0.78rem] font-medium py-2 rounded-full bg-[var(--rose-light)] text-red-600 border-none cursor-pointer hover:bg-[var(--rose-medium)] hover:text-white transition-all duration-200'>Cancel</button>
        </div>
      )}
    </div>
  )
}
