import ChatLayout from '../components/chatbot/ChatLayout'

const Chatbot = () => {
  return (
    <div className='min-h-[calc(100vh-64px)] flex items-start justify-center px-4 py-10 relative overflow-hidden'>
      <div className='blob-primary fixed right-[-8%] top-[5%] w-[440px] h-[440px] rounded-full opacity-30 pointer-events-none' style={{background: 'radial-gradient(circle at 40% 40%, var(--blue-light) 0%, var(--blue-medium) 60%, transparent 80%)'}} />
      <div className='blob-secondary fixed left-[-5%] bottom-[5%] w-[280px] h-[280px] rounded-full opacity-40 pointer-events-none' style={{background: 'radial-gradient(circle, var(--rose-light) 0%, transparent 70%)'}} />
      <div className='relative z-10 w-full max-w-[700px] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-3xl shadow-[0_24px_60px_rgba(44,44,44,0.07)] border border-[rgba(255,167,166,0.2)] overflow-hidden flex flex-col' style={{height: 'min(75vh, calc(100vh - 140px))', minHeight: '480px'}}>
        <div className='px-6 py-5 border-b border-[rgba(44,44,44,0.07)] bg-white'>
          <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-1'>AI Companion</span>
          <h1 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight'>Chat with BOB Bot</h1>
          <p className='text-[0.82rem] text-[var(--ink-muted)] font-light mt-0.5'>A safe space to express how you are feeling. Start a conversation.</p>
        </div>
        <div className='flex-1 overflow-hidden'><ChatLayout /></div>
      </div>
    </div>
  )
}
export default Chatbot
