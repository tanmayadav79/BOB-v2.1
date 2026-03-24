import { useState } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'

type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10'

interface Question {
  id: QuestionId
  text: string
  options: { value: number; label: string }[]
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'How many days did you get 7+ hours of sleep this week?', options: [{ value: 0, label: '0-1 days' }, { value: 1, label: '2-3 days' }, { value: 2, label: '4-5 days' }, { value: 3, label: '6-7 days' }] },
  { id: 'q2', text: 'How consistent is your sleep schedule?', options: [{ value: 0, label: 'Very inconsistent' }, { value: 1, label: 'Somewhat inconsistent' }, { value: 2, label: 'Mostly consistent' }, { value: 3, label: 'Very consistent' }] },
  { id: 'q3', text: 'Days with 20+ min movement:', options: [{ value: 0, label: '0 days' }, { value: 1, label: '1-2 days' }, { value: 2, label: '3-4 days' }, { value: 3, label: '5+ days' }] },
  { id: 'q4', text: 'Device use within 30 mins before sleep:', options: [{ value: 0, label: 'Always' }, { value: 1, label: 'Often' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Rarely' }] },
  { id: 'q5', text: 'How overwhelmed do you feel?', options: [{ value: 0, label: 'Extremely' }, { value: 1, label: 'Moderately' }, { value: 2, label: 'Slightly' }, { value: 3, label: 'Not at all' }] },
  { id: 'q6', text: 'Meaningful conversations per week:', options: [{ value: 0, label: '0 conversations' }, { value: 1, label: '1-2 conversations' }, { value: 2, label: '3-4 conversations' }, { value: 3, label: '5+ conversations' }] },
  { id: 'q7', text: 'Days with 15+ min sunlight:', options: [{ value: 0, label: '0 days' }, { value: 1, label: '1-2 days' }, { value: 2, label: '3-4 days' }, { value: 3, label: '5+ days' }] },
  { id: 'q8', text: 'Meal consistency:', options: [{ value: 0, label: 'Very irregular' }, { value: 1, label: 'Somewhat irregular' }, { value: 2, label: 'Mostly regular' }, { value: 3, label: 'Very regular' }] },
  { id: 'q9', text: 'Intentional breaks during work:', options: [{ value: 0, label: 'Never' }, { value: 1, label: 'Rarely' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }] },
  { id: 'q10', text: 'Frequency of repetitive thoughts:', options: [{ value: 0, label: 'Almost always' }, { value: 1, label: 'Often' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Rarely or never' }] },
]

const CATEGORY_SCORES = [
  { label: 'Sleep', score: (answers: Record<QuestionId, number>) => answers.q1 + answers.q2, recommendation: 'Fix sleep timing and create a wind-down routine.' },
  { label: 'Movement', score: (answers: Record<QuestionId, number>) => answers.q3, recommendation: 'Start with 10-15 minutes of walking daily.' },
  { label: 'Screen Use', score: (answers: Record<QuestionId, number>) => answers.q4, recommendation: 'Avoid screens before bed and switch to calming activities.' },
  { label: 'Stress', score: (answers: Record<QuestionId, number>) => answers.q5, recommendation: 'Use breathing techniques and break tasks into smaller steps.' },
  { label: 'Social Connection', score: (answers: Record<QuestionId, number>) => answers.q6, recommendation: 'Reach out to at least one person each day.' },
  { label: 'Sunlight', score: (answers: Record<QuestionId, number>) => answers.q7, recommendation: 'Get 10-15 minutes of sunlight daily.' },
  { label: 'Eating Habits', score: (answers: Record<QuestionId, number>) => answers.q8, recommendation: 'Try to keep your meal timing consistent.' },
  { label: 'Work Breaks', score: (answers: Record<QuestionId, number>) => answers.q9, recommendation: 'Use simple 25/5 work-break cycles during study or work.' },
  { label: 'Overthinking', score: (answers: Record<QuestionId, number>) => answers.q10, recommendation: 'Use grounding techniques and write repetitive thoughts down.' },
]

type Screen = 'intro' | 'test' | 'results'

function QuestionCard({
  question,
  value,
  onChange,
  index,
}: {
  question: Question
  value: number | null
  onChange: (value: number) => void
  index: number
}) {
  return (
    <div className={`bg-white rounded-[18px] p-5 sm:p-6 border-[1.5px] transition-all duration-200 ${value !== null ? 'border-[var(--rose-medium)] shadow-[0_6px_24px_rgba(255,167,166,0.2)]' : 'border-[rgba(44,44,44,0.1)] shadow-[0_4px_16px_rgba(44,44,44,0.04)]'}`}>
      <div className='flex items-start gap-3 mb-5'>
        <span className='shrink-0 w-8 h-8 rounded-full bg-[var(--rose-whisper)] flex items-center justify-center text-[0.78rem] font-medium text-[var(--rose-medium)]'>{index + 1}</span>
        <p className='text-[0.95rem] text-[var(--ink)] leading-relaxed mt-1'>{question.text}</p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5'>
        {question.options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center gap-2 px-3 py-4 rounded-[14px] border-[2px] cursor-pointer transition-all duration-200 ${
              value === option.value
                ? 'bg-[var(--ink)] border-[var(--ink)] text-white shadow-[0_6px_20px_rgba(44,44,44,0.25)]'
                : 'bg-[var(--rose-whisper)] border-[rgba(44,44,44,0.12)] text-[var(--ink)] hover:border-[var(--rose-medium)] hover:bg-white hover:shadow-[0_4px_12px_rgba(255,167,166,0.2)]'
            }`}
          >
            <span className={`text-[0.78rem] font-medium text-center leading-tight ${value === option.value ? 'text-white' : 'text-[var(--ink)]'}`}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Test() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, number>>>({})
  const [attempted, setAttempted] = useState(false)

  const answered = Object.keys(answers).length
  const totalQuestions = QUESTIONS.length
  const progress = Math.round((answered / totalQuestions) * 100)
  const allAnswered = answered === totalQuestions
  const unansweredIds = QUESTIONS.filter(question => answers[question.id] === undefined).map(question => question.id)

  const setAnswer = (id: QuestionId, value: number) => setAnswers(prev => ({ ...prev, [id]: value }))

  const handleSubmit = () => {
    if (!allAnswered) {
      setAttempted(true)
      return
    }
    setScreen('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetake = () => {
    setAnswers({})
    setAttempted(false)
    setScreen('intro')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const finalAnswers = answers as Record<QuestionId, number>
  const totalScore = allAnswered ? Object.values(finalAnswers).reduce((sum, value) => sum + value, 0) : 0

  const positiveNote =
    totalScore <= 10
      ? "You're taking an important first step by reflecting on yourself. Small changes can make a big difference."
      : totalScore <= 20
        ? "You're doing okay, and there's room to improve a few areas for better balance."
        : "You're maintaining healthy habits overall. Keep it up and stay consistent."

  const lowestAreas = allAnswered
    ? CATEGORY_SCORES
        .map(category => ({
          label: category.label,
          score: category.score(finalAnswers),
          recommendation: category.recommendation,
        }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 2)
    : []

  if (screen === 'intro') {
    return (
      <div className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden'>
        <div className='relative z-10 w-full max-w-[560px] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-[0_24px_60px_rgba(44,44,44,0.08)] border border-[rgba(255,167,166,0.2)]'>
          <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Lifestyle Check-In</span>
          <h1 className='font-cormorant text-[clamp(2rem,4vw,2.8rem)] font-light text-[var(--ink)] leading-tight mb-3'>Self-Assessment</h1>
          <p className='text-[0.9rem] text-[var(--ink-muted)] font-light leading-relaxed mb-3'>A quick self-check on your daily habits.</p>
          <p className='text-[0.84rem] text-[var(--ink-muted)] font-light leading-relaxed mb-6'>Your answers won't be shared with anyone else. Your privacy is more important to us.</p>
          <button onClick={() => setScreen('test')} className='w-full bg-[var(--ink)] text-white text-[0.9rem] font-medium py-4 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,44,44,0.2)] transition-all duration-200 flex items-center justify-center gap-2'>
            Start Test <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'test') {
    return (
      <div className='min-h-[calc(100vh-64px)] relative'>
        <div className='sticky top-[64px] z-30 bg-[rgba(255,242,241,0.96)] backdrop-blur-md border-b border-[rgba(255,167,166,0.2)] px-4 py-3'>
          <div className='max-w-3xl mx-auto flex items-center gap-3'>
            <div className='flex-1 h-2 bg-[rgba(44,44,44,0.08)] rounded-full overflow-hidden'>
              <div className='h-full bg-[var(--rose-medium)] rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
            </div>
            <span className='text-[0.78rem] font-medium text-[var(--ink-muted)] shrink-0 tabular-nums'>{answered}/{totalQuestions} answered</span>
          </div>
        </div>

        <div className='max-w-3xl mx-auto px-4 sm:px-6 py-8'>
          <div className='mb-6'>
            <h2 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight'>How have your habits been lately?</h2>
            <p className='text-[0.84rem] text-[var(--ink-muted)] font-light mt-1'>Choose the option that best reflects your recent week.</p>
          </div>

          <div className='flex flex-col gap-4'>
            {QUESTIONS.map((question, index) => (
              <div key={question.id} id={question.id}>
                <QuestionCard question={question} value={answers[question.id] ?? null} onChange={value => setAnswer(question.id, value)} index={index} />
              </div>
            ))}
          </div>

          {attempted && !allAnswered && (
            <div className='mt-5 p-4 rounded-[14px] bg-[var(--rose-light)] border border-[rgba(255,167,166,0.4)] text-[0.84rem] text-[var(--ink)]'>
              Please answer all {totalQuestions} questions. <strong>{totalQuestions - answered} remaining.</strong>
              <button onClick={() => document.getElementById(unansweredIds[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className='ml-2 underline text-[var(--rose-medium)] bg-transparent border-none cursor-pointer text-[0.84rem]'>
                Go to first unanswered
              </button>
            </div>
          )}

          <button onClick={handleSubmit} className={`w-full mt-6 py-4 rounded-full text-[0.92rem] font-medium border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${allAnswered ? 'bg-[var(--ink)] text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,44,44,0.2)]' : 'bg-[rgba(44,44,44,0.1)] text-[var(--ink-muted)]'}`}>
            View My Results <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-64px)] relative overflow-hidden'>
      <div className='bg-[var(--ink)] px-6 sm:px-10 py-12 relative z-10'>
        <div className='max-w-3xl mx-auto'>
          <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Check-In Complete</span>
          <h1 className='font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-white leading-tight mb-2'>Your Mental Health Test Results</h1>
          <p className='text-[0.88rem] text-[rgba(255,255,255,0.45)] font-light max-w-[520px] leading-relaxed'>This is a reflection tool for your current habits, not a diagnosis.</p>
        </div>
      </div>

      <div className='relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4'>
        <div className='bg-white rounded-[20px] p-6 sm:p-7 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_24px_rgba(44,44,44,0.05)]'>
          <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Total Score</span>
          <div className='font-cormorant text-[3rem] font-light text-[var(--ink)] leading-none'>{totalScore}<span className='text-[1.1rem] text-[var(--ink-muted)]'>/30</span></div>
          <p className='text-[0.88rem] text-[var(--ink-muted)] font-light leading-relaxed mt-3'>{positiveNote}</p>
        </div>

        <div className='bg-white rounded-[20px] p-6 sm:p-7 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_24px_rgba(44,44,44,0.05)]'>
          <span className='text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-4'>Focus Areas</span>
          <p className='text-[0.84rem] text-[var(--ink-muted)] font-light leading-relaxed mb-4'>These areas may be affecting how you feel most right now.</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {lowestAreas.map(area => (
              <div key={area.label} className='rounded-[18px] bg-[var(--rose-whisper)] border border-[rgba(255,167,166,0.2)] p-5'>
                <div className='flex items-center justify-between gap-3 mb-2'>
                  <h3 className='font-cormorant text-[1.35rem] font-light text-[var(--ink)] leading-tight'>{area.label}</h3>
                  <span className='text-[0.72rem] font-medium px-2.5 py-1 rounded-full bg-white text-[var(--rose-medium)] border border-[rgba(255,167,166,0.2)]'>Score {area.score}</span>
                </div>
                <p className='text-[0.84rem] text-[var(--ink-muted)] font-light leading-relaxed'>{area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <button onClick={handleRetake} className='flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-[var(--ink)] text-[0.88rem] font-medium border-[1.5px] border-[rgba(44,44,44,0.14)] cursor-pointer hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)] transition-all duration-200'>
            <RotateCcw size={14} />Retake Test
          </button>
          <a href='/wellness' className='flex-1 text-center py-3.5 rounded-full bg-[var(--blue-light)] text-[var(--ink)] text-[0.88rem] font-medium no-underline hover:bg-[var(--blue-medium)] transition-colors duration-200'>
            Go to Wellness Tools
          </a>
          <a href='/appointment' className='flex-1 text-center py-3.5 rounded-full bg-[var(--ink)] text-white text-[0.88rem] font-medium no-underline hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(44,44,44,0.18)] transition-all duration-200'>
            Book a Session
          </a>
        </div>
      </div>
    </div>
  )
}
