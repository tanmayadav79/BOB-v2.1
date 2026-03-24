import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, Timer, X } from 'lucide-react'

type Category = 'tension' | 'sleep'

interface Step { text: string; duration?: number; instruction?: string }
interface Exercise { id: string; title: string; subtitle: string; category: Category; totalMin: number; steps: Step[] }

const EXERCISES: Exercise[] = [
  {
    id: 'pmr', title: 'Progressive Muscle Relaxation', subtitle: 'Release tension from head to toe', category: 'tension', totalMin: 3,
    steps: [
      { text: 'Lie down or sit comfortably. Close your eyes and take three slow breaths.', duration: 20 },
      { text: 'Tense your feet — curl your toes as tight as you can. Hold for 5 seconds, then release slowly.', duration: 15, instruction: 'Tense → Hold 5s → Release' },
      { text: 'Tense your calves and thighs. Squeeze them firmly. Hold 5 seconds, then let go completely.', duration: 15, instruction: 'Tense → Hold 5s → Release' },
      { text: 'Clench your fists and tighten your arms. Feel the tension travel up to your shoulders. Release.', duration: 15, instruction: 'Tense → Hold 5s → Release' },
      { text: 'Scrunch your face — forehead, eyes, jaw. Hold 5 seconds. Then let every muscle go soft.', duration: 15, instruction: 'Tense → Hold 5s → Release' },
      { text: 'Take a full breath in, tense your entire body at once. Hold. Exhale and release everything.', duration: 15, instruction: 'One final full-body release' },
      { text: 'Rest in the stillness. Notice how different relaxation feels from tension.', duration: 20 },
    ],
  },
  {
    id: 'neck', title: 'Neck & Shoulder Stretches', subtitle: 'Ease physical tension held in your upper body', category: 'tension', totalMin: 2,
    steps: [
      { text: 'Sit tall. Roll your shoulders back three times, then forward three times. Breathe slowly.', duration: 20 },
      { text: 'Gently drop your right ear toward your right shoulder. Feel the stretch along the left side of your neck. Hold.', duration: 20, instruction: 'Hold 15–20 seconds each side' },
      { text: 'Switch — drop your left ear toward your left shoulder. Breathe into the stretch.', duration: 20, instruction: 'Hold 15–20 seconds' },
      { text: 'Drop your chin slowly toward your chest. Let the weight of your head stretch the back of your neck. Breathe.', duration: 20, instruction: 'Hold 20 seconds' },
      { text: 'Bring your right hand across to your left shoulder and press gently. Look right. Hold the stretch.', duration: 15 },
      { text: 'Repeat on the other side — left hand on right shoulder, look left.', duration: 15 },
      { text: 'Sit tall again. Roll your shoulders back once more and take a deep breath. Well done.', duration: 10 },
    ],
  },
  {
    id: 'fold', title: 'Forward Fold & Breathing', subtitle: 'Decompress your spine and slow your nervous system', category: 'sleep', totalMin: 2,
    steps: [
      { text: 'Stand with feet hip-width apart. Take a slow breath in and lengthen your spine.', duration: 10 },
      { text: 'Exhale slowly as you hinge at your hips and let your upper body fall forward. Let your arms dangle heavy.', duration: 15, instruction: 'Move slowly, no bouncing' },
      { text: 'Bend your knees slightly if needed. Let your head drop completely. Stay here and breathe naturally.', duration: 30, instruction: 'Hold for at least 30 seconds' },
      { text: 'With each exhale, imagine your back widening and any tension melting downward through your fingertips.', duration: 20 },
      { text: 'Slowly bend your knees more and begin to roll up — one vertebra at a time — head coming up last.', duration: 15, instruction: 'Roll up slowly' },
      { text: 'Stand tall. Take three full breaths. Notice any shift in how your body feels.', duration: 20 },
    ],
  },
  {
    id: 'write', title: 'Write & Release', subtitle: 'Let thoughts leave your mind and onto the page', category: 'tension', totalMin: 3,
    steps: [
      { text: 'Grab any pen and paper — or use your phone notes. This is for your eyes only.' },
      { text: 'Set a 2-minute timer. Write whatever is on your mind without stopping. Do not edit. Do not judge. Just write.' },
      { text: 'When the timer ends, read what you wrote once — or do not. Both are fine.' },
      { text: 'Decide: you can tear up or delete what you wrote as a deliberate act of letting go. Or keep it. Your choice.' },
      { text: 'Take a slow breath. What you wrote is out of your head now. The weight is lighter.' },
    ],
  },
]

const CAT_LABEL: Record<Category, string> = { tension: 'Release tension', sleep: 'Prepare for sleep' }
const CAT_BG:    Record<Category, string> = { tension: 'bg-[var(--rose-light)]', sleep: 'bg-[var(--rose-soft)]' }
const CAT_TEXT:  Record<Category, string> = { tension: 'text-[var(--rose-medium)]', sleep: 'text-[#b05a00]' }

export default function WindDown() {
  const [filter, setFilter]     = useState<Category | 'all'>('all')
  const [active, setActive]     = useState<Exercise | null>(null)
  const [step, setStep]         = useState(0)
  const [timerOn, setTimerOn]   = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [complete, setComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const filtered = filter === 'all' ? EXERCISES : EXERCISES.filter(e => e.category === filter)

  const startExercise = (ex: Exercise) => { setActive(ex); setStep(0); setComplete(false); setTimerOn(false); setTimeLeft(0) }
  const closeExercise = () => { setActive(null); clearTimer() }
  const clearTimer = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; setTimerOn(false) }

  const startTimer = () => {
    if (!active) return
    const dur = active.steps[step].duration
    if (!dur) return
    setTimeLeft(dur); setTimerOn(true)
    intervalRef.current = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearTimer(); return 0 } return t - 1 }) }, 1000)
  }

  useEffect(() => () => clearTimer(), [])

  const goNext = () => { clearTimer(); if (!active) return; if (step < active.steps.length - 1) { setStep(s => s + 1); setTimeLeft(0) } else { setComplete(true) } }
  const goPrev = () => { clearTimer(); if (step > 0) { setStep(s => s - 1); setTimeLeft(0) } }

  const filters: { val: Category | 'all'; label: string }[] = [
    { val: 'all', label: 'All' },
    { val: 'tension', label: 'Release Tension' },
    { val: 'sleep', label: 'Sleep Prep' },
  ]

  if (active) {
    const cur = active.steps[step]
    const pct = ((step + 1) / active.steps.length) * 100

    return (
      <div className='bg-white rounded-[24px] p-6 sm:p-8 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_30px_rgba(44,44,44,0.05)]'>
        <div className='flex items-start justify-between mb-5'>
          <div>
            <span className={`text-[0.62rem] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full ${CAT_BG[active.category]} ${CAT_TEXT[active.category]}`}>{CAT_LABEL[active.category]}</span>
            <h3 className='font-cormorant text-[1.5rem] font-light text-[var(--ink)] leading-tight mt-2'>{active.title}</h3>
          </div>
          <button onClick={closeExercise} className='w-8 h-8 rounded-full bg-[rgba(44,44,44,0.07)] flex items-center justify-center border-none cursor-pointer hover:bg-[rgba(44,44,44,0.12)] transition-colors duration-200 shrink-0 ml-3'><X size={14} /></button>
        </div>

        <div className='flex items-center gap-2 mb-5'>
          <div className='flex-1 h-1.5 bg-[rgba(44,44,44,0.07)] rounded-full overflow-hidden'>
            <div className='h-full rounded-full bg-[var(--rose-medium)] transition-all duration-300' style={{ width: `${pct}%` }} />
          </div>
          <span className='text-[0.7rem] text-[var(--ink-muted)] tabular-nums shrink-0'>{step + 1}/{active.steps.length}</span>
        </div>

        {complete ? (
          <div className='text-center py-6'>
            <div className='w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-[1.6rem]'>✓</div>
            <p className='font-cormorant text-[1.4rem] font-light text-[var(--ink)] mb-2'>Well done.</p>
            <p className='text-[0.84rem] text-[var(--ink-muted)] font-light leading-relaxed mb-5'>You completed <strong className='font-medium text-[var(--ink)]'>{active.title}</strong>. Take a moment to notice how you feel.</p>
            <div className='flex gap-3 justify-center flex-wrap'>
              <button onClick={() => { setStep(0); setComplete(false); clearTimer() }} className='px-5 py-2.5 rounded-full bg-[var(--rose-whisper)] text-[var(--ink)] text-[0.85rem] font-medium border-none cursor-pointer hover:bg-[var(--rose-light)] transition-colors duration-200'>Do it again</button>
              <button onClick={closeExercise} className='px-5 py-2.5 rounded-full bg-[var(--ink)] text-white text-[0.85rem] font-medium border-none cursor-pointer hover:-translate-y-0.5 transition-all duration-200'>Choose another</button>
            </div>
          </div>
        ) : (
          <>
            <div className='bg-[var(--rose-whisper)] rounded-[18px] p-5 sm:p-6 mb-4 min-h-[130px] flex flex-col justify-between'>
              <p className='text-[0.95rem] text-[var(--ink)] leading-relaxed flex-1'>{cur.text}</p>
              {cur.instruction && <p className='mt-3 text-[0.72rem] font-medium tracking-wide uppercase text-[var(--rose-medium)] border-t border-[rgba(255,167,166,0.25)] pt-2'>{cur.instruction}</p>}
            </div>

            {cur.duration && (
              <div className='flex items-center gap-3 mb-5'>
                <div className='flex items-center gap-2 bg-[var(--rose-whisper)] rounded-full px-4 py-2 border border-[rgba(255,167,166,0.2)]'>
                  <Timer size={13} className='text-[var(--rose-medium)]' />
                  <span className='text-[0.82rem] font-medium text-[var(--ink)] tabular-nums'>{timerOn ? timeLeft : cur.duration}s</span>
                </div>
                {!timerOn
                  ? <button onClick={startTimer} className='text-[0.78rem] font-medium text-[var(--rose-medium)] underline bg-transparent border-none cursor-pointer'>Start timer</button>
                  : <button onClick={clearTimer} className='text-[0.78rem] font-medium text-[var(--ink-muted)] underline bg-transparent border-none cursor-pointer'>Pause</button>
                }
              </div>
            )}

            <div className='flex gap-3'>
              <button onClick={goPrev} disabled={step === 0} className='w-11 h-11 rounded-full bg-[rgba(44,44,44,0.07)] flex items-center justify-center border-none cursor-pointer disabled:opacity-30 hover:bg-[rgba(44,44,44,0.12)] transition-colors duration-200 shrink-0'><ChevronLeft size={18} /></button>
              <button onClick={goNext} className='flex-1 bg-[var(--ink)] text-white text-[0.9rem] font-medium py-3 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,44,44,0.18)] transition-all duration-200 flex items-center justify-center gap-1.5'>
                {step < active.steps.length - 1 ? <><span>Next</span><ChevronRight size={16} /></> : 'Complete'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className='bg-white rounded-[24px] p-6 sm:p-8 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_30px_rgba(44,44,44,0.05)]'>
      <span className='text-[0.68rem] font-medium tracking-[0.12em] uppercase text-[var(--rose-medium)] block mb-1'>Step-by-Step Guides</span>
      <h3 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight mb-5'>Wind-Down Exercises</h3>

      <div className='flex gap-2 flex-wrap mb-5'>
        {filters.map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)} className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium border-[1.5px] cursor-pointer transition-all duration-200 ${filter === f.val ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-[var(--rose-whisper)] text-[var(--ink-muted)] border-transparent hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)]'}`}>{f.label}</button>
        ))}
      </div>

      <div className='flex flex-col gap-3'>
        {filtered.map(ex => (
          <button key={ex.id} onClick={() => startExercise(ex)} className='w-full flex items-center gap-4 p-4 rounded-[16px] bg-[var(--rose-whisper)] border-[1.5px] border-transparent hover:border-[rgba(255,167,166,0.35)] hover:bg-white hover:shadow-[0_4px_16px_rgba(44,44,44,0.06)] transition-all duration-200 text-left cursor-pointer'>
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${CAT_BG[ex.category]}`}>
              <span className={`text-[0.65rem] font-bold ${CAT_TEXT[ex.category]}`}>{ex.steps.length}</span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-[0.9rem] font-medium text-[var(--ink)] truncate'>{ex.title}</p>
              <p className='text-[0.76rem] text-[var(--ink-muted)] font-light mt-0.5 truncate'>{ex.subtitle}</p>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              <span className={`text-[0.62rem] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full hidden sm:block ${CAT_BG[ex.category]} ${CAT_TEXT[ex.category]}`}>{ex.totalMin} min</span>
              <ChevronRight size={16} className='text-[var(--ink-muted)]' />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
