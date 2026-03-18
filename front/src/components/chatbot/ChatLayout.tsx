import { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface Message { id: number; role: 'user' | 'assistant'; content: string }

const ChatLayout = () => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([{ id: 1, role: 'assistant', content: 'Hi there. How are you feeling today?' }])

  const handleSend = (text: string) => setMessages(p => [...p, { id: Date.now(), role: 'user', content: text }, { id: Date.now() + 1, role: 'assistant', content: 'I am here to listen. Tell me more.' }])

 
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4'>{messages.map(m => <ChatMessage key={m.id} role={m.role} content={m.content} />)}<div ref={bottomRef} /></div>
      <ChatInput onSend={handleSend} />
    </div>
  )
}
export default ChatLayout
