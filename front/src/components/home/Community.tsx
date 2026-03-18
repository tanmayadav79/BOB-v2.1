import { FaDiscord } from 'react-icons/fa'

export const OnlineCommunity = () => (
  <div className='text-center p-2'>
    <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Peer Community</span>
    <h2 className='font-cormorant text-[1.7rem] font-normal text-[var(--ink)] mb-3 leading-tight'>Join Our Discord</h2>
    <p className='text-[var(--ink-muted)] text-[0.88rem] leading-relaxed font-light mb-5'>Connect with peers, share experiences, and find support in a safe, moderated space.</p>
    <a href='https://discord.gg/KRZH2vssdB' target='_blank' rel='noopener noreferrer'>
      <button className='bg-[#5865F2] text-white text-[0.85rem] font-medium px-6 py-3 rounded-full border-none cursor-pointer inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200'><FaDiscord size={17} />Join on Discord</button>
    </a>
  </div>
)
