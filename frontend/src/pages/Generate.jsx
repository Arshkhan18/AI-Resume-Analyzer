import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Sidebar from '../components/layout/Sidebar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ResumeForm from '../components/features/ResumeForm'
import api from '../utils/api'

export default function Generate() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', linkedin: '', github: '',
        education: [],
        projects: [],
        programmingSkills: '',
        webSkills: '',
        databaseSkills: '',
        tools: '',
        achievements: '',
        positions: '',
        experience: [],
    })
    const [loading, setLoading] = useState(false)
    const [pdfUrl, setPdfUrl] = useState(null)
    const [error, setError] = useState('')
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-element', {
                y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out'
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    const handleGenerate = async () => {
        setError('')
        setPdfUrl(null)
        setLoading(true)
        try {
            // Only include experience entries that have at least some content
            const filledExperience = (formData.experience || []).filter(
                e => e.role || e.company || e.description
            )

            // Transform frontend formData to the UPPERCASE keys the backend/LaTeX templates expect
            // IMPORTANT: Do NOT add LaTeX commands here — the backend's escapeLatex()
            // will escape them into literal text. Send plain text only.
            const payload = {
                NAME: formData.name || '',
                EMAIL: formData.email || '',
                PHONE: formData.phone || '',
                LINKEDIN: formData.linkedin || '',
                GITHUB: formData.github || '',
                EDUCATION: (formData.education || []).map(e => ({
                    year: e.year || '',
                    degree: [e.degree, e.institution].filter(Boolean).join(' - '),
                    score: e.score || '',
                })),
                PROJECTS: (formData.projects || []).map(p => ({
                    title: p.title || '',
                    description: p.description || '',
                    techStack: (p.techStack || []).join(', '),
                })),
                PROGRAMMING_SKILLS: formData.programmingSkills || '',
                WEB_SKILLS: formData.webSkills || '',
                DATABASE_SKILLS: formData.databaseSkills || '',
                TOOLS: formData.tools || '',
                ACHIEVEMENTS_SECTION: (formData.achievements || '')
                    .split('\n')
                    .map(l => l.trim())
                    .filter(Boolean),
                POSITIONS_SECTION: (formData.positions || '')
                    .split('\n')
                    .map(l => l.trim())
                    .filter(Boolean),
                EXPERIENCE_SECTION: filledExperience.map(e => {
                    let line = e.role || ''
                    if (e.company) line += ` at ${e.company}`
                    if (e.duration) line += ` (${e.duration})`
                    if (e.description) line += `: ${e.description}`
                    return line
                }),
            }

            const res = await api.post('/generator/generate', payload, {
                responseType: 'blob'
            })

            // Check if we got an error response (JSON) instead of a PDF
            if (res.data.type === 'application/json') {
                const text = await res.data.text()
                const parsed = JSON.parse(text)
                throw new Error(parsed.message || 'Generation failed')
            }

            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
            setPdfUrl(url)

            // Bounce animation on success
            gsap.set('.download-section', { opacity: 1 })
            gsap.from('.download-section', {
                scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.7)'
            })
        } catch (err) {
            // When responseType is 'blob', error responses come as blobs too
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text()
                    const parsed = JSON.parse(text)
                    setError(parsed.message || 'Resume generation failed.')
                } catch {
                    setError('Resume generation failed. Please fill in the required fields and try again.')
                }
            } else {
                setError(err.message || 'Resume generation failed. Please fill in the required fields and try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Live preview skeleton
    const PreviewPanel = () => {
        const hasSkills = formData.programmingSkills || formData.webSkills || formData.databaseSkills || formData.tools
        return (
            <div className="glass-card p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-sm font-semibold text-text-primary">Live Preview</h3>
                    <Badge color="cyan">Preview</Badge>
                </div>

                {/* Mock resume skeleton */}
                <div className="bg-white rounded-lg p-6 text-gray-800 min-h-[500px]">
                    {/* Name */}
                    <div className={`h-6 rounded mb-1 transition-all duration-300 ${formData.name ? 'bg-gray-800' : 'bg-gray-200'}`}
                        style={{ width: formData.name ? `${Math.min(formData.name.length * 12, 250)}px` : '180px' }}>
                        {formData.name && <p className="text-white text-sm font-bold px-2 py-0.5 truncate">{formData.name}</p>}
                    </div>

                    {/* Contact line */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {formData.email && <span className="text-[10px] text-gray-500">{formData.email}</span>}
                        {formData.phone && <span className="text-[10px] text-gray-500">| {formData.phone}</span>}
                    </div>

                    {/* Section: Education */}
                    {(formData.education || []).length > 0 && (
                        <div className="mb-3">
                            <div className="h-4 bg-gray-800 rounded w-20 mb-2">
                                <p className="text-white text-[10px] px-1 py-0.5">Education</p>
                            </div>
                            {formData.education.map((edu, i) => (
                                <div key={i} className="mb-1">
                                    <div className="h-2.5 bg-gray-300 rounded" style={{ width: `${Math.min((edu.institution?.length || 8) * 6, 200)}px` }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section: Skills */}
                    {hasSkills && (
                        <div className="mb-3">
                            <div className="h-4 bg-gray-800 rounded w-24 mb-2">
                                <p className="text-white text-[10px] px-1 py-0.5">Technical Skills</p>
                            </div>
                            {formData.programmingSkills && (
                                <p className="text-[9px] text-gray-600 mb-0.5">Programming: {formData.programmingSkills}</p>
                            )}
                            {formData.webSkills && (
                                <p className="text-[9px] text-gray-600 mb-0.5">Web: {formData.webSkills}</p>
                            )}
                            {formData.databaseSkills && (
                                <p className="text-[9px] text-gray-600 mb-0.5">Databases: {formData.databaseSkills}</p>
                            )}
                            {formData.tools && (
                                <p className="text-[9px] text-gray-600 mb-0.5">Tools: {formData.tools}</p>
                            )}
                        </div>
                    )}

                    {/* Section: Projects */}
                    {(formData.projects || []).length > 0 && (
                        <div className="mb-3">
                            <div className="h-4 bg-gray-800 rounded w-20 mb-2">
                                <p className="text-white text-[10px] px-1 py-0.5">Projects</p>
                            </div>
                            {formData.projects.map((proj, i) => (
                                <div key={i} className="mb-1">
                                    <div className="h-2.5 bg-gray-300 rounded" style={{ width: `${Math.min((proj.title?.length || 8) * 6, 180)}px` }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section: Positions */}
                    {formData.positions && (
                        <div className="mb-3">
                            <div className="h-4 bg-gray-800 rounded w-32 mb-2">
                                <p className="text-white text-[10px] px-1 py-0.5">Positions</p>
                            </div>
                            <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                        </div>
                    )}

                    {/* Section: Achievements */}
                    {formData.achievements && (
                        <div className="mb-3">
                            <div className="h-4 bg-gray-800 rounded w-24 mb-2">
                                <p className="text-white text-[10px] px-1 py-0.5">Achievements</p>
                            </div>
                            <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                        </div>
                    )}

                    {/* Empty state */}
                    {!formData.name && (formData.education || []).length === 0 && !hasSkills && (
                        <div className="flex flex-col items-center justify-center h-60 text-gray-300">
                            <span className="text-4xl mb-3">📄</span>
                            <p className="text-sm">Fill the form to see a preview</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-bg">
            <Sidebar />

            <main className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
                <div className="page-element mb-8">
                    <h1 className="font-heading text-2xl font-semibold text-text-primary mb-2">Resume Generator</h1>
                    <p className="text-text-secondary text-sm font-body">Fill in your details and generate a professional LaTeX resume.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Form — Left */}
                    <div className="lg:col-span-3 page-element">
                        <ResumeForm formData={formData} setFormData={setFormData} />

                        {error && (
                            <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-sm px-4 py-3 rounded-xl mt-4 font-body">
                                {error}
                            </div>
                        )}

                        <div className="mt-6">
                            <Button onClick={handleGenerate} loading={loading} className="w-full py-3.5 text-base">
                                {loading ? 'Compiling LaTeX...' : 'Generate Resume'}
                            </Button>
                        </div>

                        {/* Download section */}
                        {pdfUrl && (
                            <div className="download-section mt-6 glass-card p-6 text-center">
                                <span className="text-4xl mb-3 block">🎉</span>
                                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">Resume Generated!</h3>
                                <p className="text-text-secondary text-sm font-body mb-4">Your LaTeX resume is ready for download.</p>
                                <a
                                    href={pdfUrl}
                                    download="resume.pdf"
                                    className="btn-primary inline-block text-sm"
                                >
                                    ⬇ Download PDF
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Preview — Right */}
                    <div className="lg:col-span-2 page-element hidden lg:block">
                        <PreviewPanel />
                    </div>
                </div>
            </main>
        </div>
    )
}
