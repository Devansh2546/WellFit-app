import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import '../assets/CSS/chatbot.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STARTER_PROMPTS = [
  {
    icon: '🥗',
    title: 'Daily Macros',
    text: 'How do I calculate my daily protein and calorie targets for lean muscle gain?',
  },
  {
    icon: '🏋️',
    title: 'Squat Form',
    text: 'What are the key technique cues for proper barbell back squat depth and knee tracking?',
  },
  {
    icon: '⚡',
    title: '4-Day Split',
    text: 'Create a structured 4-day upper/lower hypertrophy workout routine for intermediate lifters.',
  },
  {
    icon: '⏱️',
    title: 'Pre-Workout Fuel',
    text: 'What should I eat 45 to 60 minutes before a heavy strength training session?',
  },
]

// Break text into progressive line chunks so output streams line to line naturally
function breakIntoLineChunks(text: string): string[] {
  const lines = text.split('\n')
  const chunks: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isLast = i === lines.length - 1
    const lineSuffix = isLast ? '' : '\n'

    // If line is short (headings, bullet items, blank lines <= 50 chars), treat as single line chunk
    if (line.length <= 50) {
      chunks.push(line + lineSuffix)
    } else {
      // For longer paragraphs, break into natural word groups (~4-5 words)
      const words = line.split(' ')
      let current = ''
      for (let w = 0; w < words.length; w++) {
        const word = words[w]
        const isLastWord = w === words.length - 1
        current += (current ? ' ' : '') + word

        if ((w + 1) % 5 === 0 || isLastWord) {
          chunks.push(current + (isLastWord ? lineSuffix : ' '))
          current = ''
        }
      }
      if (current) {
        chunks.push(current + lineSuffix)
      }
    }
  }

  return chunks
}

function Chatbot() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fullReplyRef = useRef<string>('')

  // Focus input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(t)
    }
  }, [open])

  // Clean up streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
      }
    }
  }, [])

  // Auto-scroll to bottom whenever messages change or during generation
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, loading, isStreaming])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isStreaming) {
          skipStreaming()
        }
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isStreaming])

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    setIsStreaming(false)
  }

  const skipStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    setIsStreaming(false)
    if (fullReplyRef.current) {
      setMessages((prev) => {
        const updated = [...prev]
        const lastIdx = updated.length - 1
        if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
          updated[lastIdx] = { ...updated[lastIdx], content: fullReplyRef.current }
        }
        return updated
      })
    }
  }

  const startStreamingResponse = (fullReply: string) => {
    fullReplyRef.current = fullReply
    const chunks = breakIntoLineChunks(fullReply)

    if (chunks.length === 0) {
      setMessages((prev) => [...prev, { role: 'assistant', content: fullReply }])
      return
    }

    // Append initial empty assistant message
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    let chunkIndex = 0
    let accumulated = ''

    // Adaptive speed: comfortable reading pace (~25ms to 50ms per chunk)
    const delay = Math.max(25, Math.min(50, Math.floor(1600 / chunks.length)))

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)

    streamIntervalRef.current = setInterval(() => {
      if (chunkIndex < chunks.length) {
        accumulated += chunks[chunkIndex]
        chunkIndex++

        setMessages((prev) => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { ...updated[lastIdx], content: accumulated }
          }
          return updated
        })

        if (bodyRef.current) {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
      } else {
        // Complete streaming
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current)
          streamIntervalRef.current = null
        }
        setIsStreaming(false)
        setMessages((prev) => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { ...updated[lastIdx], content: fullReply }
          }
          return updated
        })
      }
    }, delay)
  }

  const sendMessage = async (textToSend?: string) => {
    const queryText = (typeof textToSend === 'string' ? textToSend : input).trim()
    if (!queryText || loading || isStreaming) return

    const newMessages: Message[] = [...messages, { role: 'user', content: queryText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { messages: newMessages },
      })

      setLoading(false)

      if (error || !data || data.error) {
        const errorMsg = data?.error ?? 'Your daily limit has been reached. Please try again tomorrow.'
        setMessages([...newMessages, { role: 'assistant', content: errorMsg }])
        return
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.'
      startStreamingResponse(reply)
    } catch {
      setLoading(false)
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  const handleClose = () => {
    if (isStreaming) {
      skipStreaming()
    }
    setOpen(false)
  }

  return (
    <>
      {!open && (
        <button className="chatbot-trigger" onClick={() => setOpen(true)} aria-label="Open WellFit AI">
          <span className="chatbot-trigger-dot" />
          Ask WellFit AI
        </button>
      )}

      {open && (
        <div className="chatbot-backdrop" onClick={handleClose}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar-wrap">
                  <span className="chatbot-avatar">W</span>
                </div>
                <div>
                  <div className="chatbot-title-row">
                    <span className="chatbot-title">WellFit AI</span>
                  </div>
                  <div className="chatbot-subtitle">
                    <span className="chatbot-online-dot" /> Fitness & Nutrition Intelligence
                  </div>
                </div>
              </div>

              <div className="chatbot-header-actions">
                {messages.length > 0 && (
                  <button
                    type="button"
                    className="chatbot-icon-btn"
                    onClick={() => {
                      if (isStreaming) stopStreaming()
                      setMessages([])
                    }}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="chatbot-icon-btn chatbot-close-btn"
                  onClick={handleClose}
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="chatbot-body" ref={bodyRef}>
              {!user ? (
                <div className="chatbot-welcome-state" style={{ textAlign: 'center', padding: 'var(--space-5) var(--space-4)' }}>
                  <div className="chatbot-welcome-icon" style={{ margin: '0 auto var(--space-3)' }}>
                    <span className="chatbot-welcome-letter">W</span>
                  </div>
                  <h3 className="chatbot-welcome-title">Log In to Use WellFit AI</h3>
                  <p className="chatbot-welcome-desc" style={{ maxWidth: '340px', margin: '0 auto var(--space-4)' }}>
                    Sign in to your account to get personalized workout form advice, nutrition breakdowns, and AI fitness coaching.
                  </p>
                  <Link
                    to="/login"
                    className="btn"
                    onClick={handleClose}
                    style={{ textDecoration: 'none', display: 'inline-flex' }}
                  >
                    Log In to Continue →
                  </Link>
                </div>
              ) : messages.length === 0 ? (
                <div className="chatbot-welcome-state">
                  <div className="chatbot-welcome-icon">
                    <span className="chatbot-welcome-letter">W</span>
                  </div>
                  <h3 className="chatbot-welcome-title">How can I help you train today?</h3>
                  <p className="chatbot-welcome-desc">
                    Ask anything about exercise form, workout splits, macro calculations, or recovery science.
                  </p>

                  <div className="chatbot-starter-grid">
                    {STARTER_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="chatbot-starter-chip"
                        onClick={() => sendMessage(prompt.text)}
                      >
                        <span className="chatbot-chip-icon">{prompt.icon}</span>
                        <div className="chatbot-chip-content">
                          <span className="chatbot-chip-title">{prompt.title}</span>
                          <span className="chatbot-chip-text">{prompt.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="chatbot-messages-list">
                  {messages.map((m, i) => {
                    const isLastAssistantMessage = m.role === 'assistant' && i === messages.length - 1
                    const isCurrentlyStreaming = isLastAssistantMessage && isStreaming

                    return (
                      <div key={i} className={`chatbot-row ${m.role === 'user' ? 'chatbot-row-user' : 'chatbot-row-assistant'}`}>
                        {m.role === 'assistant' && (
                          <div className="chatbot-msg-avatar" aria-hidden="true">
                            W
                          </div>
                        )}
                        <div className="chatbot-bubble-col">
                          <div className={`chatbot-bubble ${m.role === 'user' ? 'chatbot-bubble-user' : `chatbot-bubble-assistant ${isCurrentlyStreaming ? 'is-streaming' : ''}`}`}>
                            {m.role === 'assistant' ? (
                              <>
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                {isCurrentlyStreaming && (
                                  <span className="chatbot-cursor" aria-hidden="true" />
                                )}
                              </>
                            ) : (
                              m.content
                            )}
                          </div>
                          {m.role === 'assistant' && (
                            <div className="chatbot-msg-actions">
                              {isCurrentlyStreaming ? (
                                <div className="chatbot-streaming-actions">
                                  <span className="chatbot-generating-label">
                                    <span className="chatbot-generating-spinner" /> Generating line by line...
                                  </span>
                                  <button
                                    type="button"
                                    className="chatbot-action-text-btn chatbot-stop-btn"
                                    onClick={stopStreaming}
                                    title="Stop generating"
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="4" y="4" width="16" height="16" rx="2" />
                                    </svg>
                                    <span>Stop</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="chatbot-action-text-btn"
                                    onClick={skipStreaming}
                                    title="Show full response immediately"
                                  >
                                    <span>Skip →</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="chatbot-action-text-btn"
                                  onClick={() => handleCopy(m.content, i)}
                                  title="Copy response"
                                >
                                  {copiedIdx === i ? (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                      </svg>
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {loading && (
                    <div className="chatbot-row chatbot-row-assistant">
                      <div className="chatbot-msg-avatar" aria-hidden="true">
                        W
                      </div>
                      <div className="chatbot-bubble chatbot-bubble-assistant chatbot-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Composer */}
            {user && (
              <div className="chatbot-composer-wrap">
                <form
                  className="chatbot-composer-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about workouts, form, nutrition..."
                    disabled={loading}
                  />
                  {isStreaming ? (
                    <button
                      type="button"
                      className="chatbot-send-btn chatbot-stop-send-btn"
                      onClick={stopStreaming}
                      title="Stop generating"
                      aria-label="Stop generating"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="chatbot-send-btn"
                      disabled={loading || !input.trim()}
                      aria-label="Send message"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                  )}
                </form>
                <div className="chatbot-disclaimer">
                  WellFit AI is calibrated for training & nutrition queries. Consult a professional before intense regimens.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot