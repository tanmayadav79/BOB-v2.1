// ChatLayout.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface Message { id: string; role: 'user' | 'assistant'; content: string }

const WELCOME: Message = { id: 'welcome', role: 'assistant', content: "Hi there. I'm BOB, your mental wellness companion. How are you feeling today?" }

const ChatLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [typing, setTyping] = useState(false)
  const [ollamaContext, setOllamaContext] = useState<number[]>([]) 
  const prevMessageCount = useRef(0)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    scrollToBottom('instant')
    prevMessageCount.current = messages.length
  }, [])

  useEffect(() => {
    const hasNewMessage = messages.length > prevMessageCount.current
    prevMessageCount.current = messages.length
    if (hasNewMessage || typing) scrollToBottom('smooth')
  }, [messages, typing, scrollToBottom])

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: text, context: ollamaContext }), 
      })
      const data = await res.json()
      if (res.ok) {
        setOllamaContext(data.context ?? []) 
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'assistant', content: data.message || "I'm having trouble responding right now. Please try again." }])
      }
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'assistant', content: "I couldn't reach the server. Please check your connection and try again." }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div ref={containerRef} className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4'>
        {messages.map(m => <ChatMessage key={m.id} role={m.role} content={m.content} />)}
        {typing && <ChatMessage key='typing' role='assistant' content='' isTyping />}
      </div>
      <ChatInput onSend={handleSend} disabled={typing} />
    </div>
  )
}

export default ChatLayout
