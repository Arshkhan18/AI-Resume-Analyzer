import { useEffect, useRef } from 'react'
import ScoreMeter from '../ui/ScoreMeter'
import Badge from '../ui/Badge'

export default function AnalysisResult({ data }) {
    const containerRef = useRef(null)

    if (!data) return null

    // Robustly extract the feedback object from any nesting shape
    const { score, feedback } = data
    let fb = feedback || data

    // Unwrap if feedback itself contains a nested feedback object
    if (fb && fb.feedback && typeof fb.feedback === 'object') {
        fb = fb.feedback
    }

    // Debug: log what we extracted so you can verify in console
    console.log('[AnalysisResult] score:', score, 'fb:', fb)

    const resolvedScore = score || fb?.score || 0

    const sections = [
        {
            title: '✅ Strengths',
            items: fb?.strengths || [],
            color: 'border-l-green-400',
            textColor: 'text-green-400',
        },
        {
            title: '⚠️ Weaknesses',
            items: fb?.weaknesses || [],
            color: 'border-l-yellow-400',
            textColor: 'text-yellow-400',
        },
        {
            title: '🔍 Missing Keywords',
            items: fb?.missingKeywords || fb?.missing_keywords || [],
            color: 'border-l-blue-400',
            textColor: 'text-blue-400',
            isTags: true,
        },
        {
            title: '💡 Improvements',
            items: fb?.improvements || fb?.suggestions || [],
            color: 'border-l-purple-400',
            textColor: 'text-purple-400',
        },
    ]

    // Section-wise feedback (education, skills, experience, projects)
    const sectionFeedback = fb?.section_feedback || fb?.sectionFeedback || null
    const sectionIcons = {
        education: '🎓',
        skills: '🛠️',
        experience: '💼',
        projects: '🚀',
    }

    return (
        <div ref={containerRef} className="space-y-6" style={{ opacity: 1 }}>
            {/* Score */}
            <div className="flex flex-col items-center py-8" style={{ opacity: 1 }}>
                <h3 className="font-heading text-lg text-text-secondary mb-4">Resume Score</h3>
                <ScoreMeter score={resolvedScore} />
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ opacity: 1 }}>
                {sections.map((section, idx) => (
                    <div
                        key={idx}
                        className={`glass-card p-5 border-l-4 ${section.color}`}
                        style={{ opacity: 1 }}
                    >
                        <h4 className={`font-heading text-sm font-semibold mb-3 ${section.textColor}`}>
                            {section.title}
                            <span className="ml-2 text-text-muted font-normal text-xs">
                                ({section.items.length})
                            </span>
                        </h4>
                        {section.isTags ? (
                            <div className="flex flex-wrap gap-2">
                                {section.items.map((item, i) => (
                                    <Badge key={i} color="blue">{item}</Badge>
                                ))}
                                {section.items.length === 0 && (
                                    <p className="text-text-muted text-sm">None identified</p>
                                )}
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {section.items.map((item, i) => (
                                    <li key={i} className="text-text-secondary text-sm font-body flex items-start gap-2">
                                        <span className="text-text-muted mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                                {section.items.length === 0 && (
                                    <p className="text-text-muted text-sm">None identified</p>
                                )}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Section-wise Feedback */}
            {sectionFeedback && Object.keys(sectionFeedback).length > 0 && (
                <div className="glass-card p-5 border-l-4 border-l-cyan-400" style={{ opacity: 1 }}>
                    <h4 className="font-heading text-sm font-semibold mb-4 text-cyan-400">
                        📋 Section-wise Feedback
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(sectionFeedback).map(([key, value]) => (
                            value && (
                                <div key={key} className="rounded-lg p-4" style={{ background: 'rgba(15, 31, 61, 0.5)' }}>
                                    <h5 className="font-heading text-xs font-semibold text-text-primary mb-2 capitalize flex items-center gap-2">
                                        <span>{sectionIcons[key] || '📌'}</span>
                                        {key}
                                    </h5>
                                    <p className="text-text-secondary text-sm font-body leading-relaxed">
                                        {value}
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
