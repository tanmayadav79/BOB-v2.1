import { FaDiscord } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className='bg-[var(--ink)] px-6 sm:px-10 lg:px-16 pt-12 pb-6'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8'>
        <div>
          <div className='font-cormorant text-[1.35rem] font-normal text-white tracking-wide mb-3'>Balance Over <span className='text-[var(--rose-medium)]'>Blues</span></div>
          <p className='text-[0.84rem] leading-relaxed text-[rgba(255,255,255,0.45)] max-w-[280px] mb-4'>Mental wellness support for college students — compassionate, evidence-based, and always here.</p>
          <a href='https://discord.gg/X7dcGHh2ez' target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 text-[0.82rem] text-[rgba(255,255,255,0.45)] no-underline hover:text-[var(--rose-medium)] transition-colors duration-200'><FaDiscord size={17} />Join our Discord</a>
        </div>
        <div>
          <h4 className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-white mb-4'>Platform</h4>
          <ul className='list-none p-0 m-0 flex flex-col gap-2.5'>
            {['Home', 'Resources', 'Appointment', 'Chat'].map(item => (
              <li key={item}><a href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className='text-[0.84rem] text-[rgba(255,255,255,0.45)] no-underline hover:text-[var(--rose-medium)] transition-colors duration-200'>{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-white mb-4'>Crisis Help</h4>
          <ul className='list-none p-0 m-0 flex flex-col gap-2.5'>
            <li className='text-[0.84rem] text-[rgba(255,255,255,0.45)]'>Call us: <span className='text-[var(--rose-medium)]'>8484026274</span></li>
            <li className='text-[0.84rem] text-[rgba(255,255,255,0.45)]'>Available 24/7</li>
            <li className='text-[0.84rem] text-[rgba(255,255,255,0.45)]'>Or chat with BOB for immediate support</li>
          </ul>
        </div>
      </div>
      <div className='border-t border-[rgba(255,255,255,0.08)] pt-5 flex flex-wrap justify-between items-center gap-3'>
        <span className='text-[0.76rem] text-[rgba(255,255,255,0.3)]'>© 2025 Balance Over Blues. All rights reserved.</span>
        <span className='text-[0.76rem] text-[var(--rose-medium)]'>Made with care for your wellbeing</span>
      </div>
    </footer>
  )
}
