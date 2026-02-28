import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ScoreMeter({ score = 0, size = 160, strokeWidth = 10 }) {
    const circleRef = useRef(null)
    const numberRef = useRef(null)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const scoreNum = typeof score === 'number' ? score : parseInt(score) || 0

    const getColor = () => {
        if (scoreNum >= 75) return '#00FFB3'
        if (scoreNum >= 50) return '#FFB800'
        return '#FF4C6A'
    }

    useEffect(() => {
        const offset = circumference - (scoreNum / 100) * circumference

        gsap.fromTo(circleRef.current,
            { strokeDashoffset: circumference },
            { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out', delay: 0.3 }
        )

        gsap.fromTo(numberRef.current,
            { innerText: 0 },
            {
                innerText: scoreNum,
                duration: 1.5,
                snap: { innerText: 1 },
                ease: 'power2.out',
                delay: 0.3,
            }
        )
    }, [scoreNum])

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#1A3050"
                    strokeWidth={strokeWidth}
                />
                {/* Score arc */}
                <circle
                    ref={circleRef}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    style={{ filter: `drop-shadow(0 0 8px ${getColor()}66)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    ref={numberRef}
                    className="font-mono text-4xl font-bold"
                    style={{ color: getColor() }}
                >
                    0
                </span>
                <span className="text-text-muted text-xs font-body mt-1">/ 100</span>
            </div>
        </div>
    )
}
