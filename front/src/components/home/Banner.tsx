export const Banner = () => {
  return (
    <section className='relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center px-6 sm:px-10 lg:px-16 py-16'>

      <div className='blob-primary absolute right-[-8%] top-[5%] w-[clamp(320px,50vw,660px)] h-[clamp(320px,50vw,660px)] rounded-full opacity-50 pointer-events-none' style={{background: 'radial-gradient(circle at 40% 40%, var(--blue-light) 0%, var(--blue-medium) 60%, transparent 80%)'}} />
      <div className='blob-secondary absolute left-[-4%] bottom-[8%] w-[clamp(160px,24vw,360px)] h-[clamp(160px,24vw,360px)] rounded-full opacity-55 pointer-events-none' style={{background: 'radial-gradient(circle, var(--rose-light) 0%, transparent 70%)'}} />

      <div className='relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto'>

        <div style={{animation: 'fadeUpAnim 0.8s ease both'}}>
          <div className='inline-flex items-center gap-2 bg-[var(--rose-light)] rounded-full px-4 py-1.5 mb-6 text-[0.72rem] font-medium tracking-[0.09em] uppercase text-red-400'>
            <span className='w-1.5 h-1.5 rounded-full bg-red-400 inline-block' />
            assess. understand. heal. thrive.
          </div>
          <h1 className='font-cormorant text-[clamp(2.8rem,5.5vw,5rem)] font-light leading-[1.05] tracking-tight text-[var(--ink)]'>
            Nurture your mind,<br />
            <em className='italic text-[var(--rose-medium)]'>embrace wellness</em>
          </h1>
          <p className='mt-5 text-[1rem] leading-[1.75] text-[var(--ink-muted)] font-light max-w-[440px]'>
            Explore mental health resources, connect with counsellors, and take a quiz to assess your well-being and resilience today.
          </p>
          <div className='mt-8 flex gap-3 flex-wrap'>
            <a href='/test'><button className='bg-[var(--ink)] text-white text-[0.88rem] font-medium px-7 py-3 rounded-full border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(44,44,44,0.2)] transition-all duration-200'>Take a Test</button></a>
            <a href='/resources'><button className='bg-transparent text-[var(--ink)] text-[0.88rem] font-normal px-7 py-3 rounded-full border-[1.5px] border-[rgba(44,44,44,0.2)] cursor-pointer hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)] transition-all duration-200'>Explore Resources</button></a>
          </div>
        </div>

        <div className='hidden lg:flex items-center justify-center'>
          <div className='relative w-[320px] h-[380px]'>

            <div className='absolute top-0 left-[18px] w-[268px] bg-white rounded-[22px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)]' style={{transform: 'rotate(-4deg)'}}>
              <p className='text-[0.65rem] font-medium tracking-[0.12em] uppercase text-[var(--ink-muted)] mb-3'>Today's Mood</p>
              <div className='flex gap-2 mb-3'>
                <span className='w-7 h-7 rounded-full bg-[var(--rose-medium)] inline-block' />
                <span className='w-7 h-7 rounded-full bg-[var(--rose-light)] inline-block' />
                <span className='w-7 h-7 rounded-full bg-[var(--blue-light)] inline-block' />
                <span className='w-7 h-7 rounded-full bg-[var(--blue-medium)] inline-block' />
              </div>
              <p className='font-cormorant text-[1.8rem] font-normal text-[var(--ink)] leading-none'>Calm</p>
              <p className='text-[0.75rem] text-[var(--ink-muted)] mt-1'>Feeling centred & grounded</p>
            </div>

            <div className='absolute top-[90px] left-0 w-[290px] bg-[var(--blue-light)] rounded-[22px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)]' style={{transform: 'rotate(2deg)'}}>
              <p className='text-[0.65rem] font-medium tracking-[0.12em] uppercase text-[var(--ink-muted)] mb-2'>Weekly Wellness</p>
              <p className='font-cormorant text-[2.2rem] font-light text-[var(--ink)] leading-none'>78%</p>
              <div className='h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full mt-3 overflow-hidden'><div className='h-full rounded-full bg-[var(--blue-medium)] w-[78%]' /></div>
              <p className='text-[0.75rem] text-[var(--ink-muted)] mt-2'>↑ 12% from last week</p>
            </div>

            <div className='absolute top-[200px] left-[30px] w-[252px] bg-[var(--rose-soft)] rounded-[22px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)]' style={{transform: 'rotate(-1deg)'}}>
              <p className='text-[0.65rem] font-medium tracking-[0.12em] uppercase text-[var(--ink-muted)] mb-2'>Next Session</p>
              <p className='font-cormorant text-[1.3rem] font-normal text-[var(--ink)] leading-tight'>Today, 4:00 PM</p>
              <p className='text-[0.75rem] text-[var(--ink-muted)] mt-1'>Dr. Priya Sharma · 45 min</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
