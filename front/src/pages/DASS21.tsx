import { useState } from 'react'
import { ChevronRight, RotateCcw, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

type Category = 's' | 'a' | 'd'

const QUESTIONS: { id: number; cat: Category; text: string }[] = [
  { id: 1,  cat: 's', text: 'I found it hard to wind down' },
  { id: 2,  cat: 'a', text: 'I was aware of dryness of my mouth' },
  { id: 3,  cat: 'd', text: "I couldn't seem to experience any positive feeling at all" },
  { id: 4,  cat: 'a', text: 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)' },
  { id: 5,  cat: 'd', text: 'I found it difficult to work up the initiative to do things' },
  { id: 6,  cat: 's', text: 'I tended to over-react to situations' },
  { id: 7,  cat: 'a', text: 'I experienced trembling (e.g. in the hands)' },
  { id: 8,  cat: 's', text: 'I felt that I was using a lot of nervous energy' },
  { id: 9,  cat: 'a', text: 'I was worried about situations in which I might panic and make a fool of myself' },
  { id: 10, cat: 'd', text: 'I felt that I had nothing to look forward to' },
  { id: 11, cat: 's', text: 'I found myself getting agitated' },
  { id: 12, cat: 's', text: 'I found it difficult to relax' },
  { id: 13, cat: 'd', text: 'I felt down-hearted and blue' },
  { id: 14, cat: 's', text: 'I was intolerant of anything that kept me from getting on with what I was doing' },
  { id: 15, cat: 'a', text: 'I felt I was close to panic' },
  { id: 16, cat: 'd', text: 'I was unable to become enthusiastic about anything' },
  { id: 17, cat: 'd', text: "I felt I wasn't worth much as a person" },
  { id: 18, cat: 's', text: 'I felt that I was rather touchy' },
  { id: 19, cat: 'a', text: 'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)' },
  { id: 20, cat: 'a', text: 'I felt scared without any good reason' },
  { id: 21, cat: 'd', text: 'I felt that life was meaningless' },
]

const SCALE = [
  { value: 0, short: 'Never',     long: 'Did not apply to me at all' },
  { value: 1, short: 'Sometimes', long: 'Applied to me to some degree, or some of the time' },
  { value: 2, short: 'Often',     long: 'Applied to me to a considerable degree or a good part of time' },
  { value: 3, short: 'Always',    long: 'Applied to me very much or most of the time' },
]

const SEVERITY: Record<'d'|'a'|'s', { ranges: [number, string][] }> = {
  d: { ranges: [[0,'Normal'],[10,'Mild'],[14,'Moderate'],[21,'Severe'],[28,'Extremely Severe']] },
  a: { ranges: [[0,'Normal'],[8,'Mild'],[10,'Moderate'],[15,'Severe'],[20,'Extremely Severe']] },
  s: { ranges: [[0,'Normal'],[15,'Mild'],[19,'Moderate'],[26,'Severe'],[34,'Extremely Severe']] },
}

const CAT_LABEL: Record<Category, string> = { d: 'Depression', a: 'Anxiety', s: 'Stress' }
const CAT_BADGE: Record<Category, string> = {
  d: 'bg-[var(--blue-light)] text-[#3b6cb7]',
  a: 'bg-[var(--rose-light)] text-[var(--red-medium)]',
  s: 'bg-[var(--rose-soft)] text-[#b05a00]',
}

function getSeverity(cat: Category, rawScore: number) {
  const scaled = rawScore * 2
  let severity = 'Normal'
  for (const [min, label] of SEVERITY[cat].ranges) { if (scaled >= min) severity = label }
  return { severity, scaled }
}

function QuestionCard({ q, value, onChange, index }: { q: typeof QUESTIONS[0]; value: number | null; onChange: (v: number) => void; index: number }) {
  return (
    <div className={`bg-white rounded-[18px] p-5 sm:p-6 border-[1.5px] transition-all duration-200 ${value !== null ? 'border-[var(--rose-medium)] shadow-[0_6px_24px_rgba(255,167,166,0.2)]' : 'border-[rgba(44,44,44,0.1)] shadow-[0_4px_16px_rgba(44,44,44,0.04)]'}`}>
      <div className='flex items-start gap-3 mb-5'>
        <span className='shrink-0 w-8 h-8 rounded-full bg-[var(--rose-whisper)] flex items-center justify-center text-[0.78rem] font-medium text-[var(--rose-medium)]'>{index + 1}</span>
        <div className='flex-1 min-w-0'>
          
          <p className='text-[0.95rem] text-[var(--ink)] leading-relaxed mt-2.5 font-normal'>{q.text}</p>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-2.5'>
        {SCALE.map(s => (
          <button key={s.value} onClick={() => onChange(s.value)} className={`flex flex-col items-center gap-2 px-2 py-4 rounded-[14px] border-[2px] cursor-pointer transition-all duration-200 ${value === s.value ? 'bg-[var(--ink)] border-[var(--ink)] text-white shadow-[0_6px_20px_rgba(44,44,44,0.25)]' : 'bg-[var(--rose-whisper)] border-[rgba(44,44,44,0.12)] text-[var(--ink)] hover:border-[var(--rose-medium)] hover:bg-white hover:shadow-[0_4px_12px_rgba(255,167,166,0.2)]'}`}>
            <span className={`text-[2rem] font-cormorant font-light leading-none ${value === s.value ? 'text-white' : 'text-[var(--rose-medium)]'}`}>{s.value}</span>
            <span className={`text-[0.75rem] font-medium text-center leading-tight hidden sm:block ${value === s.value ? 'text-white opacity-90' : 'text-[var(--ink-muted)]'}`}>{s.short}</span>
            <span className={`text-[0.75rem] font-medium text-center leading-tight sm:hidden ${value === s.value ? 'text-white opacity-90' : 'text-[var(--ink-muted)]'}`}>{s.short}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultCard({ cat, rawScore }: { cat: Category; rawScore: number }) {
  const { severity, scaled } = getSeverity(cat, rawScore)
  const max = 42
  const pct = Math.round((scaled / max) * 100)
  const severityColor = severity === 'Normal' ? 'text-[#3b6cb7]' : severity === 'Mild' ? 'text-[#b05a00]' : severity === 'Moderate' ? 'text-[var(--rose-medium)]' : 'text-red-500'
  const barColor = severity === 'Normal' ? 'var(--blue-medium)' : severity === 'Mild' ? '#e8a87c' : 'var(--rose-medium)'
  const advice: Record<string, string> = {
    Normal: 'Your score is within the normal range. Keep up your self-care habits.',
    Mild: 'You may be experiencing mild symptoms. Consider speaking to someone you trust.',
    Moderate: 'Moderate symptoms detected. Reaching out to a counsellor can help.',
    Severe: 'Your symptoms appear severe. We strongly encourage booking a session.',
    'Extremely Severe': 'Please consider speaking to a mental health professional as soon as possible.',
  }
  return (
    <div className='bg-white rounded-[20px] p-5 sm:p-6 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_24px_rgba(44,44,44,0.05)]'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <span className={`text-[0.65rem] font-medium tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-full ${CAT_BADGE[cat]}`}>{CAT_LABEL[cat]}</span>
          <div className='font-cormorant text-[2.4rem] font-light text-[var(--ink)] leading-none mt-2'>{scaled}<span className='text-[1rem] text-[var(--ink-muted)]'>/{max}</span></div>
        </div>
        <div className={`text-right ${severityColor}`}>
          <div className='text-[0.68rem] font-medium tracking-[0.08em] uppercase text-[var(--ink-muted)] mb-1'>Severity</div>
          <div className='font-cormorant text-[1.5rem] font-light'>{severity}</div>
        </div>
      </div>
      <div className='h-2.5 bg-[rgba(44,44,44,0.07)] rounded-full overflow-hidden mb-3'>
        <div className='h-full rounded-full transition-all duration-700' style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <p className='text-[0.84rem] text-[var(--ink-muted)] font-light leading-relaxed'>{advice[severity]}</p>
    </div>
  )
}

type Screen = 'intro' | 'test' | 'results'

export default function DASS21() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [attempted, setAttempted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const answered = Object.keys(answers).length
  const total = QUESTIONS.length
  const progress = Math.round((answered / total) * 100)
  const allAnswered = answered === total

  const setAnswer = (id: number, val: number) => setAnswers(p => ({ ...p, [id]: val }))

  const scores = { d: 0, a: 0, s: 0 } as Record<Category, number>
  QUESTIONS.forEach(q => { if (answers[q.id] !== undefined) scores[q.cat] += answers[q.id] })

  const unansweredIds = QUESTIONS.filter(q => answers[q.id] === undefined).map(q => q.id)

  const handleSubmit = () => {
    if (!allAnswered) { setAttempted(true); return }
    setScreen('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    saveToBackend()
  }

  const saveToBackend = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dass/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ depressionRaw: scores.d, anxietyRaw: scores.a, stressRaw: scores.s }),
      })
      if (res.ok) setSaved(true)
      else { const d = await res.json(); if (d.message !== 'Not authenticated') toast.error('Could not save result to your profile') }
    } catch { /* silent — test still works offline */ }
    finally { setSaving(false) }
  }

  const handleRetake = () => { setAnswers({}); setAttempted(false); setSaved(false); setScreen('intro'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const overall = (['d', 'a', 's'] as Category[]).map(c => getSeverity(c, scores[c]))
  const worstSeverity = overall.reduce((w, o) => {
    const order = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe']
    return order.indexOf(o.severity) > order.indexOf(w.severity) ? o : w
  }, overall[0])
  const showBooking = ['Moderate', 'Severe', 'Extremely Severe'].includes(worstSeverity.severity)

  if (screen === 'intro') return (
    <div className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      <div className='blob-primary fixed right-[-8%] top-[5%] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none' style={{ background: 'radial-gradient(circle at 40% 40%, var(--blue-light) 0%, var(--blue-medium) 60%, transparent 80%)' }} />
      <div className='blob-secondary fixed left-[-6%] bottom-[5%] w-[320px] h-[320px] rounded-full opacity-40 pointer-events-none' style={{ background: 'radial-gradient(circle, var(--rose-light) 0%, transparent 70%)' }} />
      <div className='relative z-10 w-full max-w-[540px] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_24px_60px_rgba(44,44,44,0.08)] border border-[rgba(255,167,166,0.2)]'>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Mental Wellness Assessment</span>
        <h1 className='font-cormorant text-[clamp(2rem,4vw,2.8rem)] font-light text-[var(--ink)] leading-tight mb-3'>DASS-21 Self-Report Test</h1>
        <p className='text-[0.9rem] text-[var(--ink-muted)] font-light leading-relaxed mb-6'>This 21-question assessment measures symptoms of <strong className='font-medium text-[var(--ink)]'>Depression</strong>, <strong className='font-medium text-[var(--ink)]'>Anxiety</strong>, and <strong className='font-medium text-[var(--ink)]'>Stress</strong> over the past week. It takes about 3–5 minutes.</p>
        <div className='flex flex-col gap-2.5 mb-7'>
          {[{ cat: 'd' as Category, n: 7, desc: 'Low mood, hopelessness, lack of motivation' }, { cat: 'a' as Category, n: 7, desc: 'Physical anxiety symptoms, panic, fear' }, { cat: 's' as Category, n: 7, desc: 'Tension, agitation, difficulty relaxing' }].map(c => (
            <div key={c.cat} className='flex items-center gap-3 p-3.5 rounded-[12px] bg-[var(--rose-whisper)] border border-[rgba(255,167,166,0.12)]'>
              <span className='text-[0.84rem] text-[var(--ink-muted)] font-light flex-1'>{c.desc}</span>
              <span className='text-[0.72rem] text-[var(--ink-muted)] shrink-0'>{c.n} Qs</span>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen('test')} className='w-full bg-[var(--ink)] text-white text-[0.9rem] font-medium py-4 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,44,44,0.2)] transition-all duration-200 flex items-center justify-center gap-2'>Start Assessment <ChevronRight size={16} /></button>
      </div>
    </div>
  )

  if (screen === 'test') return (
    <div className='min-h-[calc(100vh-64px)] relative'>
      <div className='sticky top-[64px] z-30 bg-[rgba(255,242,241,0.96)] backdrop-blur-md border-b border-[rgba(255,167,166,0.2)] px-4 py-3'>
        <div className='max-w-2xl mx-auto flex items-center gap-3'>
          <div className='flex-1 h-2 bg-[rgba(44,44,44,0.08)] rounded-full overflow-hidden'>
            <div className='h-full bg-[var(--rose-medium)] rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
          </div>
          <span className='text-[0.78rem] font-medium text-[var(--ink-muted)] shrink-0 tabular-nums'>{answered}/{total} answered</span>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8'>
        <div className='mb-6'>
          <h2 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight'>How often over the past week?</h2>
          <p className='text-[0.84rem] text-[var(--ink-muted)] font-light mt-1'>Select the option that best describes your experience for each statement.</p>
        </div>

        <div className='grid grid-cols-4 gap-2 mb-7 p-4 bg-white rounded-[16px] border-[1.5px] border-[rgba(255,167,166,0.18)] shadow-[0_2px_12px_rgba(44,44,44,0.04)]'>
          {SCALE.map(s => (
            <div key={s.value} className='text-center'>
              <div className='font-cormorant text-[2rem] font-light text-[var(--rose-medium)]'>{s.value}</div>
              <div className='text-[0.75rem] text-[var(--ink-muted)] font-light leading-tight mt-0.5 hidden sm:block'>{s.long}</div>
              <div className='text-[0.75rem] font-medium text-[var(--ink-muted)] leading-tight mt-0.5 sm:hidden'>{s.short}</div>
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-4'>
          {QUESTIONS.map((q, i) => <div key={q.id} id={`q-${q.id}`}><QuestionCard q={q} value={answers[q.id] ?? null} onChange={v => setAnswer(q.id, v)} index={i} /></div>)}
        </div>

        {attempted && !allAnswered && (
          <div className='mt-5 p-4 rounded-[14px] bg-[var(--rose-light)] border border-[rgba(255,167,166,0.4)] text-[0.84rem] text-[var(--ink)]'>
            Please answer all {total} questions. <strong>{total - answered} remaining.</strong>
            <button onClick={() => { document.getElementById(`q-${unansweredIds[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className='ml-2 underline text-[var(--rose-medium)] bg-transparent border-none cursor-pointer text-[0.84rem]'>Go to first unanswered</button>
          </div>
        )}

        <button onClick={handleSubmit} className={`w-full mt-6 py-4 rounded-full text-[0.92rem] font-medium border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${allAnswered ? 'bg-[var(--ink)] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,44,44,0.2)]' : 'bg-[rgba(44,44,44,0.1)] text-[var(--ink-muted)]'}`}>
          View My Results <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
  return (
    <div className='min-h-[calc(100vh-64px)] relative overflow-hidden'>
      <div className='blob-primary fixed right-[-8%] top-[5%] w-[440px] h-[440px] rounded-full opacity-25 pointer-events-none' style={{ background: 'radial-gradient(circle at 40% 40%, var(--blue-light) 0%, var(--blue-medium) 60%, transparent 80%)' }} />
      <div className='blob-secondary fixed left-[-5%] bottom-[8%] w-[300px] h-[300px] rounded-full opacity-35 pointer-events-none' style={{ background: 'radial-gradient(circle, var(--rose-light) 0%, transparent 70%)' }} />

      <div className='bg-[var(--ink)] px-6 sm:px-10 py-12 relative z-10'>
        <div className='max-w-2xl mx-auto'>
          <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Assessment Complete</span>
          <h1 className='font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-white leading-tight mb-2'>Your DASS-21 Results</h1>
          <p className='text-[0.88rem] text-[rgba(255,255,255,0.45)] font-light max-w-[480px] leading-relaxed'>These scores reflect your self-reported experiences over the past week.</p>
          <div className='mt-4'>
            {saving && <span className='text-[0.78rem] text-[rgba(255,255,255,0.4)] flex items-center gap-2'><div className='w-3 h-3 rounded-full border border-[rgba(255,255,255,0.4)] border-t-transparent animate-spin' />Saving to your profile...</span>}
            {saved  && <span className='text-[0.78rem] text-green-400 flex items-center gap-2'><CheckCircle size={13} />Saved to your profile</span>}
          </div>
        </div>
      </div>

      <div className='relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4'>
        {(['d', 'a', 's'] as Category[]).map(c => <ResultCard key={c} cat={c} rawScore={scores[c]} />)}

        {showBooking && (
          <div className='bg-[var(--ink)] rounded-[20px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between'>
            <div className='flex-1'>
              <h3 className='font-cormorant text-[1.5rem] font-light text-white leading-tight mb-1'>Consider speaking to someone</h3>
              <p className='text-[0.84rem] text-[rgba(255,255,255,0.5)] font-light leading-relaxed'>Your results suggest you may benefit from a conversation with one of our counsellors.</p>
            </div>
            <a href='/appointment' className='shrink-0 bg-[var(--rose-medium)] text-white text-[0.85rem] font-medium px-6 py-3 rounded-full no-underline hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,167,166,0.4)] transition-all duration-200'>Book a Session</a>
          </div>
        )}

        <div className='bg-white rounded-[20px] p-5 sm:p-6 border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)]'>
          <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-4'>Severity Scale Reference</span>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
            {(['d', 'a', 's'] as Category[]).map(c => (
              <div key={c}>
                <div className={`text-[0.65rem] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full inline-block mb-2.5 ${CAT_BADGE[c]}`}>{CAT_LABEL[c]}</div>
                <ul className='flex flex-col gap-1.5'>
                  {SEVERITY[c].ranges.map(([min, label]) => (
                    <li key={label} className='flex justify-between text-[0.78rem]'>
                      <span className='text-[var(--ink-muted)] font-light'>{label}</span>
                      <span className='text-[var(--ink-muted)] tabular-nums'>≥{min}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className='mt-4 text-[0.72rem] text-[var(--ink-muted)] font-light leading-relaxed border-t border-[rgba(44,44,44,0.07)] pt-3'>Scores are raw subscale totals ×2, aligning DASS-21 with DASS-42 norms.</p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <button onClick={handleRetake} className='flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-[var(--ink)] text-[0.88rem] font-medium border-[1.5px] border-[rgba(44,44,44,0.14)] cursor-pointer hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)] transition-all duration-200'><RotateCcw size={14} />Retake Test</button>
          <a href='/resources' className='flex-1 text-center py-3.5 rounded-full bg-[var(--blue-light)] text-[var(--ink)] text-[0.88rem] font-medium no-underline hover:bg-[var(--blue-medium)] transition-colors duration-200'>Browse Resources</a>
          <a href='/chat' className='flex-1 text-center py-3.5 rounded-full bg-[var(--ink)] text-white text-[0.88rem] font-medium no-underline hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(44,44,44,0.18)] transition-all duration-200'>Talk to BOB Bot</a>
        </div>

        <p className='text-center text-[0.72rem] text-[var(--ink-muted)] font-light leading-relaxed px-4'>DASS-21 is based on the work of Lovibond & Lovibond (1995). For educational purposes only — not a clinical diagnosis.</p>
      </div>
    </div>
  )
}
