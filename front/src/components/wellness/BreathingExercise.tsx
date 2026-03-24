import { useState, useEffect, useRef, useCallback } from 'react'

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdout'
type Preset = '4-4-6' | '4-7-8' | 'box'

const PRESETS: Record<Preset, { label: string; desc: string; inhale: number; hold: number; exhale: number; holdout: number }> = {
  '4-4-6': { label: '4-4-6', desc: 'Calm & centre', inhale: 4, hold: 4, exhale: 6, holdout: 0 },
  '4-7-8': { label: '4-7-8', desc: 'Sleep & rest',  inhale: 4, hold: 7, exhale: 8, holdout: 0 },
  'box':   { label: 'Box',   desc: 'Focus & balance', inhale: 4, hold: 4, exhale: 4, holdout: 4 },
}

const PHASE_ORDER: Phase[] = ['inhale', 'hold', 'exhale', 'holdout']
const PHASE_LABEL: Record<Phase, string> = { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale', holdout: 'Hold' }
const SESSION_SECONDS = 120

export default function BreathingExercise() {
  const [preset, setPreset]           = useState<Preset>('4-4-6')
  const [running, setRunning]         = useState(false)
  const [phase, setPhase]             = useState<Phase>('inhale')
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [sessionLeft, setSessionLeft] = useState(SESSION_SECONDS)
  const [done, setDone]               = useState(false)
  const [feedback, setFeedback]       = useState<'yes' | 'no' | null>(null)

  const cfg = PRESETS[preset]
  const phaseDuration = useCallback((p: Phase) => {
    if (p === 'inhale')  return cfg.inhale
    if (p === 'hold')    return cfg.hold
    if (p === 'exhale')  return cfg.exhale
    return cfg.holdout
  }, [cfg])

  const frameRef   = useRef<number | null>(null)
  const phaseRef   = useRef<Phase>('inhale')
  const sessionRef = useRef(SESSION_SECONDS)

  const stop = useCallback(() => { if (frameRef.current) cancelAnimationFrame(frameRef.current); frameRef.current = null }, [])

  const startLoop = useCallback((startPhase: Phase, phaseStart: number, sessionRemaining: number) => {
    phaseRef.current  = startPhase
    sessionRef.current = sessionRemaining
    const dur = phaseDuration(startPhase)

    const tick = (now: number) => {
      const elapsed  = (now - phaseStart) / 1000
      const progress = Math.min(elapsed / dur, 1)
      setPhaseProgress(progress)
      const newSession = Math.max(0, sessionRemaining - elapsed)
      setSessionLeft(Math.ceil(newSession))

      if (newSession <= 0) { stop(); setRunning(false); setDone(true); return }

      if (progress >= 1) {
        const idx  = PHASE_ORDER.indexOf(phaseRef.current)
        let next   = PHASE_ORDER[(idx + 1) % PHASE_ORDER.length] as Phase
        if (next === 'holdout' && cfg.holdout === 0) next = 'inhale'
        phaseRef.current = next
        setPhase(next)
        frameRef.current = requestAnimationFrame(t => startLoop(next, t, newSession))
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [cfg, phaseDuration, stop])

  const handleStart = () => {
    setDone(false); setFeedback(null)
    setPhase('inhale'); setPhaseProgress(0); setSessionLeft(SESSION_SECONDS)
    setRunning(true)
    frameRef.current = requestAnimationFrame(t => startLoop('inhale', t, SESSION_SECONDS))
  }
  const handleStop = () => { stop(); setRunning(false) }
  useEffect(() => () => stop(), [stop])

  const getScale = () => {
    if (phase === 'inhale')  return 0.55 + phaseProgress * 0.45
    if (phase === 'hold')    return 1
    if (phase === 'exhale')  return 1 - phaseProgress * 0.45
    return 0.55
  }
  const scale = running ? getScale() : 0.7
  const mins  = Math.floor(sessionLeft / 60)
  const secs  = sessionLeft % 60

  return (
    <div className='bg-white rounded-[24px] p-6 sm:p-8 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_30px_rgba(44,44,44,0.05)]'>
      <span className='text-[0.68rem] font-medium tracking-[0.12em] uppercase text-[var(--rose-medium)] block mb-1'>Guided Practice</span>
      <h3 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight mb-5'>Breathing Exercise</h3>

      {!running && !done && (
        <div className='flex gap-2 flex-wrap mb-6'>
          {(Object.keys(PRESETS) as Preset[]).map(p => (
            <button key={p} onClick={() => setPreset(p)} className={`flex-1 min-w-[90px] px-3 py-3 rounded-[14px] border-[1.5px] cursor-pointer transition-all duration-200 text-left ${preset === p ? 'bg-[var(--ink)] border-[var(--ink)] text-white' : 'bg-[var(--rose-whisper)] border-[rgba(44,44,44,0.1)] text-[var(--ink)] hover:border-[var(--rose-medium)]'}`}>
              <span className='text-[0.88rem] font-medium block'>{PRESETS[p].label}</span>
              <span className={`text-[0.68rem] font-light block mt-0.5 ${preset === p ? 'text-[rgba(255,255,255,0.65)]' : 'text-[var(--ink-muted)]'}`}>{PRESETS[p].desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Animated circle */}
      <div className='flex flex-col items-center mb-6'>
        <div className='relative flex items-center justify-center w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]'>
          <div className='absolute inset-0 rounded-full bg-[var(--rose-light)] opacity-15' style={{ transform: `scale(${Math.min(scale + 0.1, 1.1)})`, transition: 'transform 0.08s linear' }} />
          <div className='absolute inset-0 rounded-full bg-[var(--rose-light)] opacity-25' style={{ transform: `scale(${Math.min(scale + 0.05, 1.05)})`, transition: 'transform 0.08s linear' }} />
          <div className='absolute inset-0 rounded-full' style={{ background: 'linear-gradient(135deg, var(--rose-medium) 0%, var(--blue-medium) 100%)', transform: `scale(${scale})`, transition: 'transform 0.08s linear', opacity: running ? 0.9 : 0.45 }} />
          <div className='relative z-10 text-center select-none'>
            <p className='font-cormorant text-[1.5rem] font-light text-white leading-none'>{done ? 'Done' : running ? PHASE_LABEL[phase] : 'Ready'}</p>
            {running && !done && <p className='text-[0.68rem] text-[rgba(255,255,255,0.8)] mt-1'>{phaseDuration(phase)}s</p>}
          </div>
        </div>
        {running && !done && <p className='text-[0.78rem] text-[var(--ink-muted)] mt-3 tabular-nums'>{mins}:{secs.toString().padStart(2,'0')} left</p>}
      </div>

      {/* Phase progress */}
      {running && (
        <div className='mb-5'>
          <div className='flex justify-between mb-1.5'>
            {PHASE_ORDER.filter(p => !(p === 'holdout' && cfg.holdout === 0)).map(p => (
              <span key={p} className={`text-[0.65rem] font-medium transition-colors duration-200 ${phase === p ? 'text-[var(--rose-medium)]' : 'text-[rgba(44,44,44,0.3)]'}`}>{PHASE_LABEL[p]}</span>
            ))}
          </div>
          <div className='h-1.5 bg-[rgba(44,44,44,0.07)] rounded-full overflow-hidden'>
            <div className='h-full rounded-full' style={{ width: `${phaseProgress * 100}%`, background: 'linear-gradient(90deg, var(--rose-medium), var(--blue-medium))', transition: 'none' }} />
          </div>
        </div>
      )}

      {!done && (
        !running
          ? <button onClick={handleStart} className='w-full bg-[var(--ink)] text-white text-[0.9rem] font-medium py-3.5 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(44,44,44,0.18)] transition-all duration-200'>Begin 2-Minute Session</button>
          : <button onClick={handleStop} className='w-full bg-[rgba(44,44,44,0.07)] text-[var(--ink-muted)] text-[0.9rem] font-medium py-3.5 rounded-full border-none cursor-pointer hover:bg-[rgba(44,44,44,0.12)] transition-colors duration-200'>Stop</button>
      )}

      {done && !feedback && (
        <div className='text-center mt-2'>
          <p className='font-cormorant text-[1.2rem] font-light text-[var(--ink)] mb-4'>Did this help?</p>
          <div className='flex gap-3 justify-center'>
            <button onClick={() => setFeedback('yes')} className='px-6 py-2.5 rounded-full bg-green-50 text-green-700 text-[0.85rem] font-medium border-none cursor-pointer hover:bg-green-100 transition-colors duration-200'>Yes, it helped</button>
            <button onClick={() => setFeedback('no')}  className='px-6 py-2.5 rounded-full bg-[var(--rose-whisper)] text-[var(--ink-muted)] text-[0.85rem] font-medium border-none cursor-pointer hover:bg-[var(--rose-light)] transition-colors duration-200'>Not really</button>
          </div>
        </div>
      )}

      {feedback === 'yes' && (
        <div className='p-4 rounded-[16px] bg-green-50 border border-green-100 text-center'>
          <p className='text-green-700 font-medium text-[0.95rem] mb-1'>That is wonderful.</p>
          <p className='text-green-600 text-[0.82rem] font-light'>Pausing to breathe is always the right move.</p>
          <button onClick={() => { setDone(false); setFeedback(null) }} className='mt-3 text-[0.78rem] text-green-600 underline bg-transparent border-none cursor-pointer'>Go again</button>
        </div>
      )}

      {feedback === 'no' && (
        <div className='p-4 rounded-[16px] bg-[var(--blue-light)] border border-[rgba(176,199,227,0.35)]'>
          <p className='text-[var(--ink)] text-[0.88rem] font-medium mb-1'>Try something different</p>
          <p className='text-[var(--ink-muted)] text-[0.82rem] font-light leading-relaxed'>A body-based exercise like 5-4-3-2-1 grounding or progressive muscle relaxation can work better when breathing alone does not settle things.</p>
          <button onClick={() => { setDone(false); setFeedback(null) }} className='mt-3 text-[0.78rem] text-[#3b6cb7] underline bg-transparent border-none cursor-pointer'>Try a different preset</button>
        </div>
      )}
    </div>
  )
}
