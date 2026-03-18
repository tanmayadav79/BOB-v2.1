import { useEffect } from 'react'
import { AppointmentBooking } from '../components/home/AppointmentButton'
import { Banner } from '../components/home/Banner'
import { OnlineCommunity } from '../components/home/Community'
import MoodTracker from '../components/MoodTracker'

export const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80) }) }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <Banner />
      <MoodTracker />

      <section className='px-6 sm:px-10 lg:px-16 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='fade-up bg-white rounded-[20px] p-8 border-[1.5px] border-[rgba(255,167,166,0.18)]'><AppointmentBooking /></div>
          <div className='fade-up bg-white rounded-[20px] p-8 border-[1.5px] border-[rgba(255,167,166,0.18)]'><OnlineCommunity /></div>
        </div>
      </section>

      <div className='fade-up mx-6 sm:mx-10 lg:mx-16 mb-16 rounded-[24px] overflow-hidden relative flex flex-wrap items-center justify-between gap-6 p-10 sm:p-12' style={{background: 'linear-gradient(135deg, var(--rose-medium) 0%, var(--blue-medium) 100%)'}}>
        <div className='absolute w-[380px] h-[380px] rounded-full bg-[rgba(255,255,255,0.08)] -top-28 -right-16 pointer-events-none' />
        <div className='relative z-10 max-w-[480px]'>
          <h2 className='font-cormorant text-[clamp(1.8rem,3vw,2.5rem)] font-light text-white leading-tight mb-2'>Your journey to wellness starts today</h2>
          <p className='text-[rgba(255,255,255,0.78)] text-[0.92rem] font-light leading-relaxed'>Take the first step. Our counsellors are here to support you — no judgement, no pressure.</p>
        </div>
        <div className='relative z-10 flex gap-3 flex-wrap'>
          <a href='/appointment'><button className='bg-white text-[var(--ink)] text-[0.88rem] font-medium px-6 py-3 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.15)] transition-all duration-200'>Book a Session</button></a>
          <a href='/chat'><button className='bg-transparent text-white text-[0.88rem] font-normal px-6 py-3 rounded-full border-[1.5px] border-[rgba(255,255,255,0.5)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-all duration-200'>Chat with BOB</button></a>
        </div>
      </div>
    </div>
  )
}
