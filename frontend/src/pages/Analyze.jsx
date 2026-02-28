import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Sidebar from '../components/layout/Sidebar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ResumeUpload from '../components/features/ResumeUpload'
import AnalysisResult from '../components/features/AnalysisResult'
import api from '../utils/api'

export default function Analyze() {
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState(null)
    const [resumes, setResumes] = useState([])
    const [error, setError] = useState('')
    const containerRef = useRef(null)

    useEffect(() => {
        fetchResumes()
        const ctx = gsap.context(() => {
            gsap.from('.page-element', {
                y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out'
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resume/all')
            setResumes(res.data || [])
        } catch (err) {
            console.error('Failed to fetch resumes:', err)
        }
    }

    const handleUpload = async (file) => {
        setError('')
        setResult(null)
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('resume', file)
            const res = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            // Fetch full resume data to show analysis
            const latest = await api.get('/resume/latest')
            setResult(latest.data)
            fetchResumes()
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/resume/${id}`)
            fetchResumes()
            if (result?._id === id) setResult(null)
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const viewResult = (resume) => {
        setResult(resume)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-bg">
            <Sidebar />

            <main className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
                <div className="page-element mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-text-primary mb-2">Resume Analyzer</h1>
                    <p className="text-text-secondary text-sm font-body">Upload your resume and get AI-powered analysis instantly.</p>
                </div>

                {/* Upload Area */}
                <div className="page-element mb-8">
                    <ResumeUpload onUpload={handleUpload} loading={uploading} />
                </div>

                {error && (
                    <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-sm px-4 py-3 rounded-xl mb-6 font-body">
                        {error}
                    </div>
                )}

                {/* Analysis Results */}
                {result && (
                    <div className="mb-8" style={{ opacity: 1 }}>
                        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Analysis Results</h2>
                        <AnalysisResult data={result} />
                    </div>
                )}

                {/* Resume History */}
                <div className="page-element">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Resume History</h2>
                    {resumes.length === 0 ? (
                        <Card hover={false} className="p-8 text-center">
                            <p className="text-text-muted font-body text-sm">No resumes uploaded yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {resumes.map((resume, i) => (
                                <Card key={resume._id || i} hover={false} className="p-4 flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-lg">📄</span>
                                        <div className="min-w-0">
                                            <p className="text-text-primary text-sm font-heading truncate">{resume.fileName || 'Resume'}</p>
                                            <p className="text-text-muted text-xs font-body">
                                                {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge color={resume.score >= 75 ? 'green' : resume.score >= 50 ? 'warning' : 'danger'}>
                                            {resume.score ?? 'N/A'}
                                        </Badge>
                                        <button
                                            onClick={() => viewResult(resume)}
                                            className="text-brand-cyan text-xs font-heading hover:underline"
                                        >
                                            View
                                        </button>
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
