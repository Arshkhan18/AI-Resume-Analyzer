import { useState } from 'react'
import Input from '../ui/Input'
import TagInput from '../ui/TagInput'

function AccordionSection({ title, icon, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="glass-card overflow-hidden transition-all duration-300 hover:border-brand-cyan/20">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 transition-colors group"
            >
                <span className="flex items-center gap-3 font-heading text-sm font-semibold text-text-primary">
                    <span className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-base group-hover:bg-brand-cyan/20 transition-colors">
                        {icon}
                    </span>
                    {title}
                </span>
                <svg
                    className={`w-4 h-4 text-text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 pt-2 space-y-4 border-t border-white/5">
                    {children}
                </div>
            </div>
        </div>
    )
}

function SectionItemHeader({ label, index, onRemove }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-brand-cyan/70 text-xs font-heading font-medium tracking-wide uppercase">
                {label} #{index + 1}
            </span>
            <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 text-text-muted hover:text-brand-danger text-xs font-heading transition-colors px-2 py-1 rounded-md hover:bg-brand-danger/10"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
            </button>
        </div>
    )
}

function AddButton({ onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 text-brand-cyan text-sm font-heading hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-brand-cyan/10 border border-dashed border-brand-cyan/30 hover:border-brand-cyan/60 w-full justify-center"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {label}
        </button>
    )
}

export default function ResumeForm({ formData, setFormData }) {
    const update = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addItem = (field) => {
        const defaults = {
            education: { institution: '', degree: '', year: '', score: '' },
            projects: { title: '', description: '', techStack: [] },
            experience: { company: '', role: '', duration: '', description: '' },
        }
        update(field, [...(formData[field] || []), defaults[field]])
    }

    const updateItem = (field, idx, key, value) => {
        const items = [...(formData[field] || [])]
        items[idx] = { ...items[idx], [key]: value }
        update(field, items)
    }

    const removeItem = (field, idx) => {
        update(field, (formData[field] || []).filter((_, i) => i !== idx))
    }

    return (
        <div className="space-y-4">
            {/* Personal Info */}
            <AccordionSection title="Personal Info" icon="👤" defaultOpen>
                <Input label="Full Name" value={formData.name || ''} onChange={e => update('name', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Email" type="email" value={formData.email || ''} onChange={e => update('email', e.target.value)} icon="✉" />
                    <Input label="Phone" value={formData.phone || ''} onChange={e => update('phone', e.target.value)} icon="📱" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="LinkedIn URL" value={formData.linkedin || ''} onChange={e => update('linkedin', e.target.value)} />
                    <Input label="GitHub URL" value={formData.github || ''} onChange={e => update('github', e.target.value)} />
                </div>
            </AccordionSection>

            {/* Education */}
            <AccordionSection title="Education" icon="🎓">
                {(formData.education || []).map((edu, i) => (
                    <div key={i} className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <SectionItemHeader label="Education" index={i} onRemove={() => removeItem('education', i)} />
                        <Input label="Institution" value={edu.institution} onChange={e => updateItem('education', i, 'institution', e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Degree" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} />
                            <Input label="Year" value={edu.year} onChange={e => updateItem('education', i, 'year', e.target.value)} />
                            <Input label="CGPA / %" value={edu.score || ''} onChange={e => updateItem('education', i, 'score', e.target.value)} />
                        </div>
                    </div>
                ))}
                <AddButton onClick={() => addItem('education')} label="Add Education" />
            </AccordionSection>

            {/* Projects */}
            <AccordionSection title="Projects" icon="🚀">
                {(formData.projects || []).map((proj, i) => (
                    <div key={i} className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <SectionItemHeader label="Project" index={i} onRemove={() => removeItem('projects', i)} />
                        <Input label="Project Title" value={proj.title} onChange={e => updateItem('projects', i, 'title', e.target.value)} />
                        <Input label="Description" value={proj.description} onChange={e => updateItem('projects', i, 'description', e.target.value)} />
                        <div>
                            <label className="text-text-muted text-xs font-body mb-2 block">Tech Stack</label>
                            <TagInput tags={proj.techStack || []} onChange={tags => updateItem('projects', i, 'techStack', tags)} />
                        </div>
                    </div>
                ))}
                <AddButton onClick={() => addItem('projects')} label="Add Project" />
            </AccordionSection>

            {/* Technical Skills — Separate Fields */}
            <AccordionSection title="Technical Skills" icon="⚡">
                <p className="text-text-muted text-xs font-body -mt-1 mb-1">Fill in the categories relevant to you. Leave others blank.</p>
                <Input
                    label="Programming Languages"
                    value={formData.programmingSkills || ''}
                    onChange={e => update('programmingSkills', e.target.value)}
                />
                <Input
                    label="Web / Frameworks"
                    value={formData.webSkills || ''}
                    onChange={e => update('webSkills', e.target.value)}
                />
                <Input
                    label="Databases"
                    value={formData.databaseSkills || ''}
                    onChange={e => update('databaseSkills', e.target.value)}
                />
                <Input
                    label="Tools"
                    value={formData.tools || ''}
                    onChange={e => update('tools', e.target.value)}
                />
            </AccordionSection>

            {/* Positions of Responsibility */}
            <AccordionSection title="Positions of Responsibility" icon="🏅">
                <p className="text-text-muted text-xs font-body -mt-1 mb-1">One position per line</p>
                <textarea
                    value={formData.positions || ''}
                    onChange={e => update('positions', e.target.value)}
                    placeholder={"Web Development Lead - Coding Club (2024–Present)\nStudent Mentor - Placement Training Program"}
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-brand-cyan rounded-xl transition-colors py-3 px-4 text-text-primary text-sm font-body outline-none resize-none min-h-[100px] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                />
            </AccordionSection>

            {/* Achievements */}
            <AccordionSection title="Achievements" icon="🏆">
                <p className="text-text-muted text-xs font-body -mt-1 mb-1">One achievement per line</p>
                <textarea
                    value={formData.achievements || ''}
                    onChange={e => update('achievements', e.target.value)}
                    placeholder={"Solved 500+ DSA problems on LeetCode\n4-star rating on CodeChef\nTop 5 in Inter-College Hackathon"}
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-brand-cyan rounded-xl transition-colors py-3 px-4 text-text-primary text-sm font-body outline-none resize-none min-h-[120px] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                />
            </AccordionSection>

            {/* Experience (Optional) */}
            <AccordionSection title="Experience (Optional)" icon="💼">
                <p className="text-text-muted text-xs font-body -mt-1 mb-1">
                    Only add if you have work experience. Leaving this empty will use a fresher-friendly template.
                </p>
                {(formData.experience || []).map((exp, i) => (
                    <div key={i} className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <SectionItemHeader label="Experience" index={i} onRemove={() => removeItem('experience', i)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Company" value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} />
                            <Input label="Role" value={exp.role} onChange={e => updateItem('experience', i, 'role', e.target.value)} />
                        </div>
                        <Input label="Duration" value={exp.duration} onChange={e => updateItem('experience', i, 'duration', e.target.value)} />
                        <Input label="Description" value={exp.description} onChange={e => updateItem('experience', i, 'description', e.target.value)} />
                    </div>
                ))}
                <AddButton onClick={() => addItem('experience')} label="Add Experience" />
            </AccordionSection>
        </div>
    )
}
