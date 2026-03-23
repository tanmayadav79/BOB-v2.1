import type { ReactNode } from 'react'

interface Props { role: 'user' | 'assistant'; content: string; isTyping?: boolean }

const renderFormattedText = (value: string) => {
  const lines = value.split('\n')

  return lines.map((line, lineIndex) => {
    const parts: ReactNode[] = []
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    let boldIndex = 0

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) parts.push(line.slice(lastIndex, match.index))
      parts.push(<strong key={`b-${lineIndex}-${boldIndex++}`}>{match[1]}</strong>)
      lastIndex = boldRegex.lastIndex
    }

    if (lastIndex < line.length) parts.push(line.slice(lastIndex))
    if (parts.length === 0) parts.push('')

    return (
      <span key={`l-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    )
  })
}

const ChatMessage = ({ role, content, isTyping = false }: Props) => {
  const isUser = role === 'user'
  const normalizedContent = content.replace(/\\n/g, '\n').replace(/\/n/g, '\n')

  if (isTyping) {
    return (
      <div className='flex justify-start'>
        <div className='w-7 h-7 rounded-full bg-[var(--rose-light)] flex items-center justify-center text-[0.7rem] font-medium text-[var(--ink)] mr-2 mt-0.5 shrink-0'>B</div>
        <div className='max-w-[72%] px-4 py-2.5 text-[0.88rem] leading-relaxed bg-[var(--rose-whisper)] text-[var(--ink)] border border-[rgba(255,167,166,0.25)] rounded-[18px_18px_18px_4px]'>
          thinking...
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className='w-7 h-7 rounded-full bg-[var(--rose-light)] flex items-center justify-center text-[0.7rem] font-medium text-[var(--ink)] mr-2 mt-0.5 shrink-0'>B</div>}
      <div className={`max-w-[72%] px-4 py-2.5 text-[0.88rem] leading-relaxed break-words ${isUser ? 'bg-[var(--ink)] text-white rounded-[18px_18px_4px_18px]' : 'bg-[var(--rose-whisper)] text-[var(--ink)] border border-[rgba(255,167,166,0.25)] rounded-[18px_18px_18px_4px]'}`}>{renderFormattedText(normalizedContent)}</div>
    </div>
  )
}
export default ChatMessage
