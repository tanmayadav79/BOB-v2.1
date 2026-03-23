import { useState } from 'react'

interface Props { onSend: (text: string) => void; disabled?: boolean }

const ChatInput = ({ onSend, disabled = false }: Props) => {
  const [text, setText] = useState('')
  const handleSend = () => { if (disabled || !text.trim()) return; onSend(text); setText('') }

  return (
    <div className='border-t border-[rgba(44,44,44,0.07)] px-4 py-3 bg-white'>
      <div className='flex items-center gap-2'>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type how you're feeling..." disabled={disabled} className='flex-1 rounded-full px-4 py-2.5 text-[0.88rem] bg-[var(--rose-whisper)] border-[1.5px] border-[rgba(255,167,166,0.25)] text-[var(--ink)] outline-none transition-colors duration-200 focus:border-[var(--rose-medium)] font-[DM_Sans] disabled:opacity-70 disabled:cursor-not-allowed' />
        <button onClick={handleSend} disabled={disabled} className='bg-[var(--rose-medium)] text-white text-[0.85rem] font-medium px-5 py-2.5 rounded-full border-none cursor-pointer hover:-translate-y-px transition-transform duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0'>Send</button>
      </div>
    </div>
  )
}
export default ChatInput
