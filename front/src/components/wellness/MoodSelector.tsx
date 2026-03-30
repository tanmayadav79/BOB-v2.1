import { useState } from 'react'

type MoodKey = 'anxious' | 'sad' | 'stressed' | 'neutral' | 'calm' | 'tired'

interface Mood {
  key: MoodKey
  emoji: string
  label: string
  color: string
  border: string
  activeBg: string
}

interface Rec {
  primary: { label: string; desc: string; action: string; href?: string; scrollTo?: string }
  secondary: { label: string; scrollTo?: string; href?: string }[]
}

const MOODS: Mood[] = [
  { key: 'anxious', emoji: '😟', label: 'Anxious', color: 'text-[var(--rose-medium)]', border: 'border-[rgba(255,167,166,0.4)]', activeBg: 'bg-[var(--rose-light)]' },
  { key: 'sad', emoji: '😔', label: 'Low / Sad', color: 'text-[#3b6cb7]', border: 'border-[rgba(176,199,227,0.5)]', activeBg: 'bg-[var(--blue-light)]' },
  { key: 'stressed', emoji: '😠', label: 'Stressed', color: 'text-[#b05a00]', border: 'border-[rgba(255,220,180,0.6)]', activeBg: 'bg-[var(--rose-soft)]' },
  { key: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-[var(--ink-muted)]', border: 'border-[rgba(44,44,44,0.14)]', activeBg: 'bg-[rgba(44,44,44,0.06)]' },
  { key: 'calm', emoji: '🙂', label: 'Calm', color: 'text-green-600', border: 'border-green-200', activeBg: 'bg-green-50' },
  { key: 'tired', emoji: '😵', label: 'Tired', color: 'text-[#6b5b9e]', border: 'border-[rgba(176,162,210,0.4)]', activeBg: 'bg-[rgba(176,162,210,0.12)]' },
]

const RECS: Record<MoodKey, Rec> = {
  anxious: {
    primary: { label: 'Try 4-7-8 Breathing', desc: 'This breathing pattern is clinically shown to reduce acute anxiety within minutes.', action: 'Start Breathing', scrollTo: 'breathe' },
    secondary: [{ label: 'Progressive Muscle Relaxation', scrollTo: 'winddown' }, { label: 'Watch a calm meditation', scrollTo: 'videos' }],
  },
  sad: {
    primary: { label: 'Write & Release', desc: 'Getting thoughts out of your head and onto the page creates distance from difficult feelings.', action: 'Go to Wind-Down', scrollTo: 'winddown' },
    secondary: [{ label: 'Try a breathing session', scrollTo: 'breathe' }, { label: 'Talk to BOB Bot', href: '/chat' }],
  },
  stressed: {
    primary: { label: 'Neck & Shoulder Stretches', desc: 'Stress lives in the body. Releasing physical tension first makes everything else easier.', action: 'Start Exercise', scrollTo: 'winddown' },
    secondary: [{ label: '4-4-6 Breathing (calm)', scrollTo: 'breathe' }, { label: 'Forward Fold', scrollTo: 'winddown' }],
  },
  neutral: {
    primary: { label: 'Box Breathing - Stay centred', desc: 'Use this moment of stability to build a small positive habit. Even 2 minutes has an effect.', action: 'Start Box Breathing', scrollTo: 'breathe' },
    secondary: [{ label: 'Browse calming videos', scrollTo: 'videos' }, { label: 'Try a wind-down exercise', scrollTo: 'winddown' }],
  },
  calm: {
    primary: { label: 'Deepen with a Meditation Video', desc: 'You are already in a great state. Use it to build mindfulness that lasts.', action: 'Watch a Video', scrollTo: 'videos' },
    secondary: [{ label: 'Forward Fold & Breathing', scrollTo: 'winddown' }, { label: 'Log your mood', href: '/profile' }],
  },
  tired: {
    primary: { label: '4-7-8 Breathing for Sleep', desc: 'Slow the nervous system down. This pattern was designed specifically for winding down before rest.', action: 'Begin Breathing', scrollTo: 'breathe' },
    secondary: [{ label: 'Sleep Prep exercises', scrollTo: 'winddown' }, { label: 'Watch a body-scan video', scrollTo: 'videos' }],
  },
}

export default function MoodSelector({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  const [selected, setSelected] = useState<MoodKey | null>(null)

  const rec = selected ? RECS[selected] : null
  const moodObj = selected ? MOODS.find(m => m.key === selected)! : null

  return (
    <div className='bg-white rounded-[24px] p-6 sm:p-8 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_30px_rgba(44,44,44,0.05)]'>
      <span className='text-[0.68rem] font-medium tracking-[0.12em] uppercase text-[var(--rose-medium)] block mb-1'>Check In</span>
      <h3 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight mb-1'>How are you feeling right now?</h3>
      <p className='text-[0.82rem] text-[var(--ink-muted)] font-light mb-6'>Select your mood and we will suggest the right tool for this moment.</p>

      <div className='grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-6'>
        {MOODS.map(m => (
          <button key={m.key} onClick={() => setSelected(m.key)} className={`flex flex-col items-center gap-2 py-4 px-2 rounded-[16px] border-[1.5px] cursor-pointer transition-all duration-200 ${selected === m.key ? `${m.activeBg} ${m.border} shadow-[0_4px_16px_rgba(44,44,44,0.08)]` : 'bg-[var(--rose-whisper)] border-transparent hover:border-[rgba(255,167,166,0.3)] hover:bg-white hover:shadow-[0_2px_8px_rgba(44,44,44,0.06)]'}`}>
            <span className='text-[1.8rem] leading-none'>{m.emoji}</span>
            <span className={`text-[0.68rem] font-medium text-center leading-tight ${selected === m.key ? m.color : 'text-[var(--ink-muted)]'}`}>{m.label}</span>
          </button>
        ))}
      </div>

      {rec && moodObj && (
        <div className='flex flex-col gap-3 animate-[fadeIn_0.3s_ease]' style={{ animation: 'fadeIn 0.25s ease both' }}>
          <div className={`${moodObj.activeBg} rounded-[18px] p-5 border-[1.5px] ${moodObj.border}`}>
            <div className='flex items-start justify-between gap-3 mb-1'>
              <p className='text-[0.72rem] font-medium tracking-[0.08em] uppercase text-[var(--ink-muted)]'>Recommended for you</p>
            </div>
            <p className={`font-cormorant text-[1.3rem] font-light leading-tight mb-2 ${moodObj.color}`}>{rec.primary.label}</p>
            <p className='text-[0.82rem] text-[var(--ink-muted)] font-light leading-relaxed mb-4'>{rec.primary.desc}</p>
            {rec.primary.scrollTo
              ? <button onClick={() => onScrollTo(rec.primary.scrollTo!)} className='bg-[var(--ink)] text-white text-[0.82rem] font-medium px-5 py-2.5 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,44,44,0.18)] transition-all duration-200'>{rec.primary.action}</button>
              : <a href={rec.primary.href} className='inline-block bg-[var(--ink)] text-white text-[0.82rem] font-medium px-5 py-2.5 rounded-full no-underline hover:-translate-y-0.5 transition-all duration-200'>{rec.primary.action}</a>
            }
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
            {rec.secondary.map((s, i) => (
              <button key={i} onClick={() => s.scrollTo ? onScrollTo(s.scrollTo) : (window.location.href = s.href!)} className='flex items-center justify-between gap-3 px-4 py-3.5 rounded-[14px] bg-[var(--rose-whisper)] border-[1.5px] border-transparent hover:border-[rgba(255,167,166,0.3)] hover:bg-white hover:shadow-[0_2px_10px_rgba(44,44,44,0.06)] transition-all duration-200 text-left cursor-pointer'>
                <span className='text-[0.84rem] font-medium text-[var(--ink)]'>{s.label}</span>
                <span className='text-[var(--ink-muted)] text-[0.8rem] shrink-0'>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  )
}
