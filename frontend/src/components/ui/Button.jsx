export default function Button({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    icon,
    ...props
}) {
    const base = variant === 'ghost' ? 'btn-ghost' : 'btn-primary'

    return (
        <button
            className={`${base} font-heading text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    )
}
