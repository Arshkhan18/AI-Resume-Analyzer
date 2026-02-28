export default function Badge({
    children,
    color = 'cyan',
    shimmer = false,
    className = ''
}) {
    const colorMap = {
        cyan: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30',
        blue: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
        purple: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
        green: 'bg-brand-success/15 text-brand-success border-brand-success/30',
        warning: 'bg-brand-warning/15 text-brand-warning border-brand-warning/30',
        danger: 'bg-brand-danger/15 text-brand-danger border-brand-danger/30',
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-full border ${colorMap[color] || colorMap.cyan} ${shimmer ? 'shimmer-badge' : ''} ${className}`}>
            {children}
        </span>
    )
}
