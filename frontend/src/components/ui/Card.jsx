export default function Card({
    children,
    className = '',
    glowColor = 'cyan',
    hover = true,
    ...props
}) {
    const glowClass = {
        cyan: 'glow-hover',
        blue: 'glow-blue',
        purple: 'glow-purple',
        green: 'glow-green',
    }[glowColor] || 'glow-hover'

    return (
        <div
            className={`glass-card p-6 ${hover ? `${glowClass} hover:-translate-y-1.5 cursor-pointer` : ''} transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
