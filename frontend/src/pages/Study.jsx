import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Sidebar from '../components/layout/Sidebar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ResumeUpload from '../components/features/ResumeUpload'
import ChatMessage from '../components/features/ChatMessage'
import api from '../utils/api'

export default function Study() {
    const [hasResume, setHasResume] = useState(false)
    const [resumeName, setResumeName] = useState('')
    const [uploading, setUploading] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)
    const containerRef = useRef(null)

    const suggestions = [
        'Explain a topic from my resume',
        'Quiz me on my skills',
        'Summarize my experience',
        'Give me interview prep questions',
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-element', {
                y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out'
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleUploadResume = async (file) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('resume', file)
            await api.post('/study/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setHasResume(true)
            setResumeName(file.name)
            setMessages([{
                text: `Resume "${file.name}" loaded successfully! I've analyzed your resume and I'm ready to help. Ask me anything about your skills, experience, or let me quiz you!`,
                isUser: false,
            }])
        } catch (err) {
            setMessages([{
                text: `Failed to load resume: ${err.response?.data?.message || 'Unknown error'}`,
                isUser: false,
            }])
        } finally {
            setUploading(false)
        }
    }

    const handleSend = async (text) => {
        const message = text || input.trim()
        if (!message || sending) return

        setInput('')
        setMessages(prev => [...prev, { text: message, isUser: true }])
        setSending(true)

        try {
            const res = await api.post('/study/chat', { message })
            setMessages(prev => [...prev, { text: res.data.response, isUser: false }])
        } catch (err) {
            setMessages(prev => [...prev, {
                text: err.response?.data?.message || 'Failed to get response. Please try again.',
                isUser: false,
                isError: true,
            }])
        } finally {
            setSending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-bg flex">
            <Sidebar />

            <main className="lg:ml-64 flex flex-col flex-1 pb-16 lg:pb-0">
                {/* Top Bar */}
                <div className="page-element flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-bg-secondary/50">
                    <div className="flex items-center gap-3">
                        <h1 className="font-heading text-lg font-semibold text-text-primary">Study Mode</h1>
                        <Badge color="green" shimmer>RAG Mode Active</Badge>
                    </div>
                    {hasResume && (
                        <div className="flex items-center gap-3">
                            <span className="text-text-muted text-xs font-body hidden sm:block">📄 {resumeName}</span>
                            <button
                                onClick={() => { setHasResume(false); setMessages([]); setResumeName('') }}
                                className="text-brand-cyan text-xs font-heading hover:underline"
                            >
                                Change Resume
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!hasResume ? (
                        <div className="page-element flex items-center justify-center h-full">
                            <div className="max-w-md w-full">
                                <div className="text-center mb-6">
                                    <span className="text-5xl block mb-4">🎓</span>
                                    <h2 className="font-heading text-xl font-semibold text-text-primary mb-2">Upload a Resume to Study</h2>
                                    <p className="text-text-secondary text-sm font-body">
                                        Upload your resume and chat with AI to prepare for interviews, get topic explanations, and more.
                                    </p>
                                </div>
                                <ResumeUpload onUpload={handleUploadResume} loading={uploading} />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-1">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className="animate-[fadeInUp_0.3s_ease-out]"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <ChatMessage
                                        message={msg.text}
                                        isUser={msg.isUser}
                                    />
                                </div>
                            ))}
                            {sending && <ChatMessage isLoading />}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                {hasResume && (
                    <div className="px-6 py-4 border-t border-brand-border bg-brand-bg-secondary/50">
                        {/* Suggestion Chips */}
                        {messages.length <= 1 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(suggestion)}
                                        className="px-3 py-1.5 text-xs font-heading text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 rounded-full hover:bg-brand-cyan/20 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3 max-w-3xl mx-auto">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything about your resume..."
                                disabled={sending}
                                className="flex-1 bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-text-primary text-sm font-body outline-none focus:border-brand-cyan transition-colors disabled:opacity-50"
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || sending}
                                className="px-5 py-3"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
