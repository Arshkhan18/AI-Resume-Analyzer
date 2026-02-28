import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Reusable hook for page entrance animations.
 * Animates all elements matching the selector with a staggered fade-up.
 */
export default function useGSAP(selector = '.page-element', deps = []) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, deps)

  return containerRef
}
