export function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    }

    return (
        <svg className={`animate-spin ${sizes[size]} text-brand-cyan ${className}`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}

export function ThinkingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
        </div>
    )
}

export default function Loader({ text = 'Loading...', className = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 py-12 ${className}`}>
            <Spinner size="lg" />
            <p className="text-text-secondary font-body text-sm animate-pulse">{text}</p>
        </div>
    )
}
