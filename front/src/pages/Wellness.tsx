import { useEffect, useRef } from 'react'
import MoodSelector from '../components/wellness/MoodSelector'
import BreathingExercise from '../components/wellness/BreathingExercise'
import WindDown from '../components/wellness/WindDown'
import YouTubePlayer from '../components/wellness/YouTubePlayer'

export default function Wellness() {
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80) }) },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    )
    document.querySelectorAll('.wu-fade').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div className='min-h-[calc(100vh-64px)] relative overflow-x-hidden'>
      <div className='relative z-8 max-w-5xl mx-auto px-4 sm:px-8' ref={sectionsRef}>

        <div className='pt-10 pb-8'>
          <span className='text-[0.68rem] font-medium tracking-[0.12em] uppercase text-[var(--rose-medium)] block mb-2'>Self-Care Tools</span>
          <h1 className='font-cormorant text-[clamp(2.2rem,5vw,3.6rem)] font-light text-[var(--ink)] leading-[1.06] mb-3'>
            A quiet space<br /><em className='italic text-[var(--rose-medium)]'>just for you</em>
          </h1>
          <p className='text-[0.9rem] text-[var(--ink-muted)] font-light leading-relaxed max-w-[460px]'>Explore self-care tools for mental wellness.</p>
        </div>

        <div className='mb-8 rounded-[14px] px-4 py-3 flex items-center gap-3 flex-wrap bg-[rgba(176,199,227,0.2)] border border-[rgba(176,199,227,0.35)]'>
          <div className='w-1.5 h-1.5 rounded-full bg-[var(--blue-medium)] shrink-0' />
          <p className='text-[0.78rem] text-[var(--ink-muted)] font-light flex-1 leading-relaxed'>These are self-care tools, not a replacement for professional support. In distress? <strong className='font-medium text-[var(--ink)]'>Call: 8484026274</strong> (Mon–Sat, 8am–10pm)</p>
        </div>

        <div className='wu-fade fade-up mb-10'>
          <MoodSelector onScrollTo={scrollTo} />
        </div>

        <div className='h-px bg-[rgba(255,167,166,0.18)] mb-10' />

        <section id='breathe' className='mb-10'>
          <div className='wu-fade fade-up mb-5'>
            <div className='flex items-baseline gap-3 mb-1'>
              <span className='text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[rgba(44,44,44,0.3)]'>01</span>
              <h2 className='font-cormorant text-[clamp(1.6rem,3vw,2.2rem)] font-light text-[var(--ink)] leading-tight'>Breathe</h2>
            </div>
            <p className='text-[0.82rem] text-[var(--ink-muted)] font-light max-w-[380px]'>Guided breath patterns to calm your nervous system in two minutes.</p>
          </div>
          <div className='wu-fade fade-up'>
            <BreathingExercise />
          </div>
        </section>

        <div className='h-px bg-[rgba(255,167,166,0.18)] mb-10' />

        <section id='winddown' className='mb-10'>
          <div className='wu-fade fade-up mb-5'>
            <div className='flex items-baseline gap-3 mb-1'>
              <span className='text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[rgba(44,44,44,0.3)]'>02</span>
              <h2 className='font-cormorant text-[clamp(1.6rem,3vw,2.2rem)] font-light text-[var(--ink)] leading-tight'>Wind Down</h2>
            </div>
            <p className='text-[0.82rem] text-[var(--ink-muted)] font-light max-w-[420px]'>Step-by-step exercises to release tension and ease into rest.</p>
          </div>
          <div className='wu-fade fade-up'>
            <WindDown />
          </div>
        </section>

        <div className='h-px bg-[rgba(255,167,166,0.18)] mb-10' />

        <section id='videos' className='mb-10'>
          <div className='wu-fade fade-up mb-5'>
            <div className='flex items-baseline gap-3 mb-1'>
              <span className='text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[rgba(44,44,44,0.3)]'>03</span>
              <h2 className='font-cormorant text-[clamp(1.6rem,3vw,2.2rem)] font-light text-[var(--ink)] leading-tight'>Watch & Unwind</h2>
            </div>
            <p className='text-[0.82rem] text-[var(--ink-muted)] font-light max-w-[420px]'>Curated breathing, meditation, yoga, and relaxation videos — play them right here.</p>
          </div>
          <div className='wu-fade fade-up'>
            <YouTubePlayer />
          </div>
        </section>

        <div className='wu-fade fade-up mb-16 rounded-[22px] overflow-hidden relative flex flex-wrap items-center justify-between gap-5 p-7 sm:p-10' style={{ background: 'linear-gradient(135deg, var(--rose-medium) 0%, var(--blue-medium) 100%)' }}>
          <div className='absolute w-[300px] h-[300px] rounded-full bg-[rgba(255,255,255,0.07)] -top-20 -right-10 pointer-events-none' />
          <div className='relative z-10 max-w-[420px]'>
            <h3 className='font-cormorant text-[clamp(1.5rem,3vw,2rem)] font-light text-white leading-tight mb-1.5'>Need more support?</h3>
            <p className='text-[rgba(255,255,255,0.72)] text-[0.85rem] font-light leading-relaxed'>These tools are here for the in-between moments. When you need more, our counsellors are ready.</p>
          </div>
          <div className='relative z-10 flex gap-3 flex-wrap'>
            <a href='/appointment' className='bg-white text-[var(--ink)] text-[0.85rem] font-medium px-5 py-2.5 rounded-full no-underline hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] transition-all duration-200'>Book a Session</a>
            <a href='/chat' className='bg-black text-white text-[0.85rem] font-medium px-5 py-2.5 rounded-full border-[1.5px] border-[rgba(255,255,255,0.45)] no-underline  transition-all duration-200'>Talk to BOB</a>
          </div>
        </div>

      </div>
    </div>
  )
}
