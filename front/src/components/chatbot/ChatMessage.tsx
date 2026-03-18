interface Props { role: 'user' | 'assistant'; content: string }

const ChatMessage = ({ role, content }: Props) => {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className='w-7 h-7 rounded-full bg-[var(--rose-light)] flex items-center justify-center text-[0.7rem] font-medium text-[var(--ink)] mr-2 mt-0.5 shrink-0'>B</div>}
      <div className={`max-w-[72%] px-4 py-2.5 text-[0.88rem] leading-relaxed ${isUser ? 'bg-[var(--ink)] text-white rounded-[18px_18px_4px_18px]' : 'bg-[var(--rose-whisper)] text-[var(--ink)] border border-[rgba(255,167,166,0.25)] rounded-[18px_18px_18px_4px]'}`}>{content}</div>
    </div>
  )
}
export default ChatMessage
