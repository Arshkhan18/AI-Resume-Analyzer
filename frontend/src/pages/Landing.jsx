import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
    const heroRef = useRef(null)

    useEffect(() => {
        // Enable smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault()
                const target = document.querySelector(a.getAttribute('href'))
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
        })

        const ctx = gsap.context(() => {
            // ── Hero entrance sequence ──
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
            tl.from('.hero-badge', { scale: 0, opacity: 0, duration: 0.5, delay: 0.3 })
                .from('.hero-word', { y: 60, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.2')
                .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
                .from('.hero-cta', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.2')
                .from('.hero-visual', { x: 80, opacity: 0, duration: 0.8 }, '-=0.4')
                .from('.scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2')

            // Floating animation on hero visual
            gsap.to('.hero-float', {
                y: -8, duration: 3, ease: 'power1.inOut', yoyo: true, repeat: -1,
            })

            // ── Features section — staggered card entrance ──
            gsap.fromTo('.feature-card',
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.features-section',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                }
            )

            // ── Features section header ──
            gsap.fromTo('.features-heading',
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.features-section',
                        start: 'top 85%',
                    },
                    y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
                }
            )

            // ── How It Works steps — slide in from bottom ──
            gsap.fromTo('.step-item',
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.steps-section',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out',
                }
            )

            // Steps section header
            gsap.fromTo('.steps-heading',
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.steps-section',
                        start: 'top 85%',
                    },
                    y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
                }
            )

            // ── Stats counter animation ──
            gsap.fromTo('.stat-card',
                { scale: 0.8, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.stats-section',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)',
                }
            )

            // ── CTA section entrance ──
            gsap.fromTo('.cta-content',
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.cta-section',
                        start: 'top 80%',
                    },
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                }
            )

            // ── Connecting line draw animation ──
            gsap.fromTo('.connecting-line',
                { scaleX: 0 },
                {
                    scrollTrigger: {
                        trigger: '.steps-section',
                        start: 'top 70%',
                    },
                    scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power2.out',
                }
            )

        }, heroRef)

        return () => ctx.revert()
    }, [])

    const features = [
        {
            icon: '🔍', title: 'AI Resume Analyzer', color: 'cyan',
            desc: 'Get a detailed score, strengths, weaknesses, and keyword analysis powered by Gemini AI.',
            link: '/analyze',
        },
        {
            icon: '📝', title: 'Resume Generator', color: 'purple',
            desc: 'Generate professional LaTeX-powered PDFs with clean, ATS-friendly formatting.',
            link: '/generate',
        },
        {
            icon: '🎓', title: 'Study Mode', color: 'green',
            desc: 'Chat with your resume using RAG + Gemini. Get topic explanations, quizzes, and interview prep.',
            link: '/study',
        },
    ]

    const colorMap = {
        cyan: { bg: 'bg-brand-cyan/15', text: 'text-brand-cyan' },
        purple: { bg: 'bg-brand-purple/15', text: 'text-brand-purple' },
        green: { bg: 'bg-brand-success/15', text: 'text-brand-success' },
    }

    const steps = [
        { num: '01', icon: '📤', title: 'Upload Your Resume', desc: 'Drop your PDF resume and our AI will instantly parse and analyze it.' },
        { num: '02', icon: '🤖', title: 'Get AI Insights', desc: 'Receive a detailed score, feedback, missing keywords, and actionable suggestions.' },
        { num: '03', icon: '🚀', title: 'Level Up', desc: 'Generate optimized resumes, study your content, and prepare for interviews.' },
    ]

    return (
        <div ref={heroRef} className="min-h-screen">
            <Navbar />

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* ── Animated background layers ── */}
                <div className="absolute inset-0 mesh-animated" />
                <div className="absolute inset-0 dot-grid opacity-30" />

                {/* Gradient glow orbs */}
                <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-10 right-[5%] w-[600px] h-[600px] bg-brand-purple/15 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-cyan/8 rounded-full blur-[160px]" />
                <div className="absolute bottom-1/4 left-[20%] w-[300px] h-[300px] bg-brand-success/8 rounded-full blur-[140px]" />

                {/* Decorative floating particles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-brand-cyan/40 rounded-full animate-float particle-glow"
                        style={{
                            top: `${15 + i * 14}%`,
                            left: `${8 + i * 16}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${3 + i * 0.5}s`,
                        }}
                    />
                ))}

                {/* Grid line decorations */}
                <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent" />
                <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-brand-purple/5 to-transparent" />
                <div className="absolute top-0 left-[75%] w-px h-full bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left — Text Content */}
                    <div>
                        <Badge color="purple" shimmer className="hero-badge badge-glow mb-6">
                            ⚡ Powered by LLM Intelligence
                        </Badge>

                        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] mb-7 tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}>
                            <span className="hero-word inline-block text-text-primary hero-glow-white">Analyze.</span>{' '}
                            <br className="hidden md:block" />
                            <span className="hero-word inline-block hero-gradient-glow">Generate.</span>{' '}
                            <br className="hidden md:block" />
                            <span className="hero-word inline-block text-brand-cyan hero-glow-cyan">Prepare.</span>
                        </h1>

                        {/* Glowing separator */}
                        <div className="hero-subtitle w-28 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-transparent mb-5 rounded-full" />

                        <p className="hero-subtitle text-text-secondary text-base md:text-[1.1rem] max-w-lg mb-10 leading-[1.75] tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Your <span className="text-text-primary font-semibold">AI-powered</span> resume intelligence platform.
                            Get instant analysis, generate professional LaTeX resumes, and prepare for interviews
                            with <span className="text-brand-cyan font-medium hero-underline">RAG-powered study mode</span>.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <Link to="/register" className="hero-cta btn-primary text-base px-8 py-3.5 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Free
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                            <a href="#features" className="hero-cta btn-ghost text-base px-8 py-3.5 group">
                                <span className="flex items-center gap-2">
                                    Explore Features
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </a>
                        </div>

                        {/* Trust indicators */}
                        <div className="hero-subtitle flex items-center gap-6 text-text-muted text-xs font-body">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                                <span>Free to use</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>⚡</span>
                                <span>Instant analysis</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>🔒</span>
                                <span>Secure & private</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Visual Dashboard Mock */}
                    <div className="hero-visual hero-float hidden lg:block">
                        <div className="relative" style={{ perspective: '1000px' }}>
                            {/* Main dashboard card */}
                            <div
                                className="glass-card p-6 max-w-[420px] ml-auto border border-white/10 hover:border-brand-cyan/20 transition-all duration-700"
                                style={{ transform: 'rotateY(-5deg) rotateX(2deg)' }}
                            >
                                {/* Window chrome */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                    </div>
                                    <span className="text-text-muted text-[10px] font-mono">resume-analysis.ai</span>
                                </div>

                                {/* Resume score section */}
                                <div className="flex items-center gap-4 mb-5 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                    <div className="relative w-14 h-14">
                                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                            <circle cx="28" cy="28" r="24" fill="none" stroke="url(#scoreGrad)" strokeWidth="4" strokeDasharray="150.8" strokeDashoffset="12" strokeLinecap="round" />
                                            <defs>
                                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#00d4ff" />
                                                    <stop offset="100%" stopColor="#7c3aed" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-brand-cyan font-mono font-bold text-sm">92</span>
                                    </div>
                                    <div>
                                        <p className="text-text-primary text-sm font-heading font-semibold">Resume Score</p>
                                        <p className="text-brand-success text-xs font-body">Excellent — Top 8%</p>
                                    </div>
                                </div>

                                {/* Feedback items */}
                                <div className="space-y-2.5 mb-4">
                                    {[
                                        { icon: '✅', text: 'Strong technical skills section', color: 'text-green-400' },
                                        { icon: '⚠️', text: 'Add more quantified achievements', color: 'text-yellow-400' },
                                        { icon: '🔍', text: 'Missing: Docker, CI/CD, AWS', color: 'text-blue-400' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-white/[0.02] animate-pulse" style={{ animationDelay: `${i * 0.3}s`, animationDuration: '3s' }}>
                                            <span className="text-xs mt-0.5">{item.icon}</span>
                                            <span className={`text-xs font-body ${item.color}`}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge color="green">ATS Ready</Badge>
                                    <Badge color="cyan">Keyword Optimized</Badge>
                                    <Badge color="purple">AI Reviewed</Badge>
                                </div>
                            </div>

                            {/* Floating card — top left */}
                            <div className="glass-card px-4 py-3 absolute -top-4 -left-8 transform rotate-[-4deg] animate-float border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                                        <span className="text-sm">📄</span>
                                    </div>
                                    <div>
                                        <p className="text-text-primary text-xs font-heading font-semibold">PDF Generated</p>
                                        <p className="text-text-muted text-[10px] font-body">LaTeX • 2 pages</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating card — bottom left */}
                            <div className="glass-card px-4 py-3 absolute -bottom-6 -left-12 transform rotate-[3deg] animate-float border border-white/10" style={{ animationDelay: '1.5s' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-brand-success text-lg">🎯</span>
                                    <span className="text-text-primary text-xs font-heading">Analysis Complete</span>
                                    <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                                </div>
                            </div>

                            {/* Floating code snippet — right */}
                            <div className="glass-card px-3 py-2 absolute top-1/2 -right-6 transform rotate-[2deg] -translate-y-1/2 animate-float border border-white/10" style={{ animationDelay: '0.8s' }}>
                                <pre className="text-[10px] font-mono text-brand-cyan leading-relaxed">
                                    <span className="text-text-muted">{'{'}</span>{'\n'}
                                    <span className="text-brand-purple">  "score"</span><span className="text-text-muted">:</span> <span className="text-brand-success">92</span>{'\n'}
                                    <span className="text-brand-purple">  "status"</span><span className="text-text-muted">:</span> <span className="text-brand-cyan">"✓"</span>{'\n'}
                                    <span className="text-text-muted">{'}'}</span>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-text-muted text-xs font-body">Scroll to explore</span>
                    <div className="w-5 h-8 border-2 border-text-muted/30 rounded-full flex justify-center pt-1">
                        <div className="w-1 h-2 bg-brand-cyan rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ============ FEATURES SECTION ============ */}
            <section id="features" className="features-section py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="features-heading text-center mb-16">
                        <Badge color="cyan" className="mb-4">WHAT WE OFFER</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Everything you need to <span className="gradient-text">stand out</span>
                        </h2>
                        <p className="text-text-secondary text-base font-body max-w-2xl mx-auto">
                            Three powerful tools to analyze, build, and prepare — all powered by AI.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <Card key={i} glowColor={f.color} className="feature-card p-8 group">
                                <div className={`w-12 h-12 rounded-xl ${colorMap[f.color].bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                                    <span className="text-2xl">{f.icon}</span>
                                </div>
                                <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">{f.title}</h3>
                                <p className="text-text-secondary text-sm font-body mb-5 leading-relaxed">{f.desc}</p>
                                <Link to={f.link} className={`${colorMap[f.color].text} text-sm font-heading hover:underline inline-flex items-center gap-1 group/link`}>
                                    Explore <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ STATS SECTION ============ */}
            <section className="stats-section py-16 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '10K+', label: 'Resumes Analyzed', icon: '📊' },
                            { value: '95%', label: 'User Satisfaction', icon: '⭐' },
                            { value: '50+', label: 'LaTeX Templates', icon: '📄' },
                            { value: '24/7', label: 'AI Availability', icon: '🤖' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card text-center p-5 glass-card hover:border-brand-cyan/20 transition-colors duration-300">
                                <span className="text-2xl block mb-2">{stat.icon}</span>
                                <p className="font-mono text-2xl font-bold text-brand-cyan mb-1">{stat.value}</p>
                                <p className="text-text-muted text-xs font-body">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section id="how-it-works" className="steps-section py-24 bg-brand-bg-secondary/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="steps-heading text-center mb-16">
                        <Badge color="blue" className="mb-4">HOW IT WORKS</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Three simple <span className="gradient-text-cyan">steps</span>
                        </h2>
                        <p className="text-text-secondary text-base font-body max-w-xl mx-auto">
                            From upload to interview-ready in minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line (desktop) */}
                        <div className="connecting-line hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px border-t-2 border-dashed border-brand-cyan/30" />

                        {steps.map((step, i) => (
                            <div key={i} className="step-item text-center relative group">
                                <div className="w-16 h-16 rounded-full border-2 border-brand-cyan bg-brand-bg flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:bg-brand-cyan/10 group-hover:scale-110 transition-all duration-300">
                                    <span className="font-mono text-brand-cyan text-lg font-bold">{step.num}</span>
                                </div>
                                <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">{step.icon}</div>
                                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                                <p className="text-text-secondary text-sm font-body max-w-xs mx-auto leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA BANNER ============ */}
            <section className="cta-section py-24 relative overflow-hidden">
                <div className="absolute inset-0 mesh-animated opacity-50" />
                {/* Extra glow orbs */}
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-brand-purple/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-brand-cyan/15 rounded-full blur-[120px]" />

                <div className="cta-content max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-6">
                        Ready to <span className="shimmer-text">supercharge</span> your resume?
                    </h2>
                    <p className="text-text-secondary text-lg font-body mb-10 max-w-2xl mx-auto">
                        Join thousands of users who are already using AI to build better resumes and ace their interviews.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-block group">
                            Get Started Free
                            <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                        <Link to="/login" className="btn-ghost text-lg px-10 py-4 inline-block">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
