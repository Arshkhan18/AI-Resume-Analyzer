import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function Input({
    label,
    icon,
    error,
    type = 'text',
    className = '',
    ...props
}) {
    const inputRef = useRef(null)

    useEffect(() => {
        if (error && inputRef.current) {
            gsap.to(inputRef.current, {
                x: [-8, 8, -5, 5, 0],
                duration: 0.4,
                ease: 'power2.out'
            })
        }
    }, [error])

    return (
        <div className={`${className}`} ref={inputRef}>
            {/* Static label above input — no overlap, no truncation */}
            {label && (
                <label className={`block text-xs font-body mb-1.5 ${error ? 'text-red-400' : 'text-text-muted'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 text-text-primary font-body text-sm outline-none transition-all duration-200 ${icon ? 'pl-9 pr-3' : 'px-3'
                        } ${error
                            ? 'border-red-400 focus:border-red-400'
                            : 'focus:border-brand-cyan focus:shadow-[0_0_12px_rgba(0,212,255,0.15)]'
                        }`}
                    placeholder={label || ''}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-red-400 text-xs mt-1 font-body">{error}</p>
            )}
        </div>
    )
}
