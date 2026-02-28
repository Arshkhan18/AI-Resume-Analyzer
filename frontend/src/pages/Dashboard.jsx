import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import useAuth from '../hooks/useAuth'
import Sidebar from '../components/layout/Sidebar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import api from '../utils/api'

export default function Dashboard() {
    const { user } = useAuth()
    const containerRef = useRef(null)
    const [resumes, setResumes] = useState([])
    const [stats, setStats] = useState({ analyzed: 0, bestScore: 0, sessions: 0 })

    useEffect(() => {
        fetchResumes()
    }, [])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-element', {
                y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out'
            })

            // Animate stat numbers
            document.querySelectorAll('.stat-number').forEach(el => {
                const target = parseInt(el.dataset.target) || 0
                gsap.fromTo(el,
                    { innerText: 0 },
                    { innerText: target, duration: 1.5, snap: { innerText: 1 }, ease: 'power2.out', delay: 0.5 }
                )
            })
        }, containerRef)
        return () => ctx.revert()
    }, [stats])

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resume/all')
            const data = res.data || []
            setResumes(data)

            const scores = data.map(r => r.score || 0)
            setStats({
                analyzed: data.length,
                bestScore: scores.length ? Math.max(...scores) : 0,
                sessions: 0,
            })
        } catch (err) {
            console.error('Failed to fetch resumes:', err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/resume/${id}`)
            fetchResumes()
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const statCards = [
        { label: 'Best Score', value: stats.bestScore, icon: '🏆', color: 'text-brand-success' },
        { label: 'Resumes Analyzed', value: stats.analyzed, icon: '📄', color: 'text-brand-cyan' },
        { label: 'Study Sessions', value: stats.sessions, icon: '📚', color: 'text-brand-purple' },
        { label: 'Last Active', value: 'Today', icon: '⚡', color: 'text-brand-warning', isText: true },
    ]

    const quickActions = [
        { title: 'Upload & Analyze', desc: 'Get AI-powered feedback on your resume', icon: '🔍', path: '/analyze', color: 'cyan' },
        { title: 'Generate Resume', desc: 'Create a professional LaTeX PDF', icon: '📝', path: '/generate', color: 'purple' },
        { title: 'Start Study Mode', desc: 'Chat with AI about your resume', icon: '🎓', path: '/study', color: 'green' },
    ]

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-bg">
            <Sidebar />

            <main className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
                {/* Welcome Header */}
                <div className="page-element mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-semibold text-text-primary">
                        Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'User'}</span> 👋
                    </h1>
                    <p className="text-text-muted text-sm font-body mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="page-element grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, i) => (
                        <Card key={i} hover={false} className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-lg">
                                    {stat.icon}
                                </div>
                                <div>
                                    {stat.isText ? (
                                        <p className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                    ) : (
                                        <p
                                            className={`stat-number font-mono text-xl font-bold ${stat.color}`}
                                            data-target={stat.value}
                                        >
                                            0
                                        </p>
                                    )}
                                    <p className="text-text-muted text-xs font-body mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="page-element mb-8">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.path}>
                                <Card glowColor={action.color} className="p-6 h-full">
                                    <span className="text-3xl mb-4 block">{action.icon}</span>
                                    <h3 className="font-heading text-base font-semibold text-text-primary mb-2">{action.title}</h3>
                                    <p className="text-text-secondary text-sm font-body mb-3">{action.desc}</p>
                                    <span className="text-brand-cyan text-sm font-heading">Go →</span>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="page-element">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
                    {resumes.length === 0 ? (
                        <Card hover={false} className="p-8 text-center">
                            <p className="text-text-muted font-body text-sm">No resumes analyzed yet. Upload your first resume to get started!</p>
                            <Link to="/analyze" className="btn-primary text-sm mt-4 inline-block">Upload Resume</Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {resumes.slice(0, 5).map((resume, i) => (
                                <Card key={resume._id || i} hover={false} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">📄</span>
                                        <div>
                                            <p className="text-text-primary text-sm font-heading">{resume.fileName || 'Resume'}</p>
                                            <p className="text-text-muted text-xs font-body">
                                                {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Unknown date'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge color={resume.score >= 75 ? 'green' : resume.score >= 50 ? 'warning' : 'danger'}>
                                            Score: {resume.score || 'N/A'}
                                        </Badge>
                                        <button
                                            onClick={() => handleDelete(resume._id)}
                                            className="text-text-muted hover:text-brand-danger text-xs transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
