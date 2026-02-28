import { useState, useRef } from 'react'
import { Spinner } from '../ui/Loader'

export default function ResumeUpload({ onUpload, loading = false, accept = '.pdf' }) {
    const [dragOver, setDragOver] = useState(false)
    const [file, setFile] = useState(null)
    const inputRef = useRef(null)

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const dropped = e.dataTransfer.files[0]
        if (dropped) {
            setFile(dropped)
            onUpload?.(dropped)
        }
    }

    const handleChange = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFile(selected)
            onUpload?.(selected)
        }
    }

    const removeFile = () => {
        setFile(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div>
            <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !file && inputRef.current?.click()}
            >
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" />
                        <p className="text-text-secondary font-body text-sm">Analyzing your resume...</p>
                        <div className="w-48 h-1.5 bg-brand-border rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : file ? (
                    <div className="flex items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-text-primary font-heading text-sm">{file.name}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeFile() }}
                            className="text-text-muted hover:text-brand-danger transition-colors ml-2"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-text-secondary font-body text-sm">
                            <span className="text-brand-cyan font-semibold">Click to upload</span> or drag & drop your PDF here
                        </p>
                        <p className="text-text-muted text-xs font-body">PDF files only, max 10MB</p>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />
        </div>
    )
}
